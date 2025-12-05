import React, { useState } from 'react';
import { Button, Input, Select, Card, Checkbox, Logo, RadioCard, Modal } from '../components/UI';
import { AppView, AccountType } from '../types';
import { ArrowLeft, AlertCircle, Building2, User, FileText, ChevronRight } from 'lucide-react';
import { authService } from '../services/authService';
import { firestoreService } from '../services/firestoreService';
import { FirestoreTherapist } from '../config/firestoreSchema';
import { Timestamp } from 'firebase/firestore/lite';

interface RegisterProps {
  onNavigate: (view: AppView) => void;
  onRegisterSuccess: (email: string) => void;
}

// Full Markdown Text for HIPAA Agreement
const HIPAA_TEXT = `
PRIVACY & DATA SECURITY (HIPAA COMPLIANCE)
Luria Mind - Terms of Service and Data Protection Agreement

**Effective Date:** December 3, 2025  
**Last Updated:** December 3, 2025

1. INTRODUCTION AND ACCEPTANCE
By accessing or using Luria Mind ("the Platform"), you ("Therapist," "User," "you") agree to be bound by these Privacy & Data Security terms...
(Full text abridged for brevity in code, keep full text in production)
`;

const Register: React.FC<RegisterProps> = ({ onNavigate, onRegisterSuccess }) => {
  const [step, setStep] = useState<'TYPE' | 'CLINIC_DETAILS' | 'FORM'>('TYPE');
  const [isHipaaModalOpen, setIsHipaaModalOpen] = useState(false);
  const [hasReadHipaa, setHasReadHipaa] = useState(false);

  const [formData, setFormData] = useState({
    accountType: AccountType.Independent,
    clinicName: '',
    clinicCnpj: '',
    clinicLocation: '',
    clinicTherapistCount: '',
    clinicDirector: '',
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    country: '',
    role: '',
    crpCrm: '',
    patientVolume: '',
    betaToken: '',
    hipaaAccepted: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const updateData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErr = { ...prev };
        delete newErr[field];
        return newErr;
      });
    }
  };

  const handleTypeNext = () => {
    if (formData.accountType === AccountType.Clinic) {
      setStep('CLINIC_DETAILS');
    } else {
      setStep('FORM');
    }
  };

  const handleClinicNext = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.clinicName) newErrors.clinicName = "Clinic name required";
    if (!formData.clinicCnpj) newErrors.clinicCnpj = "Registration number required";
    if (!formData.clinicLocation) newErrors.clinicLocation = "Location required";
    if (!formData.clinicTherapistCount) newErrors.clinicTherapistCount = "Selection required";
    if (!formData.clinicDirector) newErrors.clinicDirector = "Director name required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setStep('FORM');
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = "Full name required";
    if (!formData.email) newErrors.email = "Email required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Invalid email";
    if (!formData.password) newErrors.password = "Password required";
    else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(formData.password)) {
      newErrors.password = "Weak password";
    }
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    if (!formData.country) newErrors.country = "Country required";
    if (!formData.role) newErrors.role = "Profession required";
    if (!formData.crpCrm) newErrors.crpCrm = "Registration number required";
    if (!formData.patientVolume) newErrors.patientVolume = "Selection required";
    if (!formData.hipaaAccepted) newErrors.hipaaAccepted = "You must agree to the HIPAA terms";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("[Register] Submit initiated");
    
    if (!validateForm()) {
        console.warn("[Register] Validation failed", errors);
        return;
    }

    setIsSubmitting(true);
    setApiError(null);

    try {
      // 1. Check Beta Token if provided
      let credits = 0;
      let planType: 'free' | 'beta_test' = 'free';
      
      if (formData.betaToken) {
          console.log("[Register] Validating Beta Token:", formData.betaToken);
          const isValid = await firestoreService.validateBetaCode(formData.betaToken);
          if (!isValid) {
              setErrors(prev => ({ ...prev, betaToken: "Invalid or expired beta code" }));
              setIsSubmitting(false);
              return;
          }
          credits = 50;
          planType = 'beta_test';
          console.log("[Register] Beta Token valid. Credits set to 50.");
      }

      // 2. Create Auth User
      console.log("[Register] Creating Auth User...");
      const user = await authService.signUp(formData.email, formData.password);
      console.log("[Register] Auth User created:", user.uid);
      
      // 3. Prepare Firestore Data
      const therapistData: Omit<FirestoreTherapist, 'id'> = {
        email: formData.email,
        name: formData.name,
        profession: formData.role as any,
        registrationNumber: formData.crpCrm,
        country: formData.country,
        accountType: formData.accountType as any,
        patientVolume: formData.patientVolume,
        // Onboarding empty initially
        approaches: [],
        preferences: {
            language: 'English', 
            sessionType: '',
            reportStyle: '',
            notifications: []
        },
        transcriptionCredits: credits,
        planType: planType,
        betaAccessCode: formData.betaToken,
        accountStatus: 'pending_email_verification',
        mfaEnabled: false,
        createdAt: Timestamp.now(),
        lastLogin: Timestamp.now()
      };

      if (formData.accountType === AccountType.Clinic) {
          therapistData.clinicData = {
              clinicName: formData.clinicName,
              clinicCNPJ: formData.clinicCnpj,
              clinicLocation: formData.clinicLocation,
              therapistCount: formData.clinicTherapistCount,
              technicalDirector: formData.clinicDirector
          };
      }

      // 4. Save to Firestore
      console.log("[Register] Saving to Firestore...");
      await firestoreService.createTherapist(user.uid, therapistData);
      console.log("[Register] Saved to Firestore.");

      // 5. Claim Beta Code if used
      if (formData.betaToken) {
          await firestoreService.claimBetaCode(formData.betaToken, user.uid);
      }

      // 6. Send Verification Email
      await authService.sendVerificationEmail(user);

      // Success
      console.log("[Register] Registration process complete.");
      onRegisterSuccess(formData.email);

    } catch (err: any) {
      console.error("[Register] Fatal Error during registration:", err);
      let errorMessage = "Failed to create account. Please try again.";
      
      if (err.code === 'auth/email-already-in-use') {
          errorMessage = "This email is already registered. Please login.";
      } else if (err.code === 'permission-denied') {
          errorMessage = "System error: Database permission denied. Please contact support.";
      } else if (err.message) {
          errorMessage = err.message;
      }
      
      setApiError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (step === 'TYPE') {
    return (
      <div className="min-h-screen bg-[#0D1117] flex flex-col items-center justify-center p-6">
        <div className="mb-8"><Logo size="lg" /></div>
        <Card className="max-w-2xl w-full p-8 md:p-12">
          <h2 className="text-3xl font-bold text-white mb-2">Tell us about your practice</h2>
          <p className="text-slate-400 mb-8">Are you an independent practitioner or do you represent a clinic?</p>
          <div className="space-y-6 mb-10">
            <RadioCard 
              selected={formData.accountType === AccountType.Independent}
              title="Independent Practitioner"
              description="Psychologist/Psychiatrist working independently."
              onClick={() => updateData('accountType', AccountType.Independent)}
            />
            <RadioCard 
              selected={formData.accountType === AccountType.Clinic}
              title="Clinic or Practice"
              description="Multiple mental health professionals."
              onClick={() => updateData('accountType', AccountType.Clinic)}
            />
          </div>
          <div className="flex justify-between items-center">
             <Button variant="ghost" onClick={() => onNavigate(AppView.Landing)}>Back</Button>
             <Button size="lg" onClick={handleTypeNext}>Next <ChevronRight className="ml-2 h-4 w-4" /></Button>
          </div>
        </Card>
      </div>
    );
  }

  if (step === 'CLINIC_DETAILS') {
    return (
      <div className="min-h-screen bg-[#0D1117] flex flex-col items-center justify-center p-6">
        <div className="mb-8"><Logo size="lg" /></div>
        <Card className="max-w-2xl w-full p-8 md:p-12">
           <h2 className="text-2xl font-bold text-white mb-2 flex items-center">
             <Building2 className="mr-3 h-6 w-6 text-[#0ABAB5]" /> Clinic Information
           </h2>
           <p className="text-slate-400 mb-8">Please provide details about your organization.</p>
           <div className="space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="md:col-span-2">
                 <Input label="Clinic Name" value={formData.clinicName} onChange={(e) => updateData('clinicName', e.target.value)} error={errors.clinicName} />
               </div>
               <Input label="Business Registration (CNPJ/EIN)" value={formData.clinicCnpj} onChange={(e) => updateData('clinicCnpj', e.target.value)} error={errors.clinicCnpj} />
               <Input label="Location (City/State)" value={formData.clinicLocation} onChange={(e) => updateData('clinicLocation', e.target.value)} error={errors.clinicLocation} />
             </div>
             <div>
               <label className="block text-sm font-semibold text-slate-300 mb-2">Number of therapists</label>
               <div className="grid grid-cols-2 gap-4">
                 {['2-5', '6-10', '11-20', '21+'].map(opt => (
                    <label key={opt} className={`flex items-center p-3 rounded border cursor-pointer ${formData.clinicTherapistCount === opt ? 'border-[#0ABAB5] bg-[#0ABAB5]/10' : 'border-[#30363D] hover:border-slate-500'}`}>
                      <input type="radio" name="tCount" className="mr-2 text-[#0ABAB5] focus:ring-[#0ABAB5]" checked={formData.clinicTherapistCount === opt} onChange={() => updateData('clinicTherapistCount', opt)} />
                      <span className="text-slate-300 text-sm">{opt}</span>
                    </label>
                 ))}
               </div>
               {errors.clinicTherapistCount && <p className="text-xs text-red-400 mt-1">{errors.clinicTherapistCount}</p>}
             </div>
             <Input label="Technical Director Name" helperText="Person responsible for creating this account" value={formData.clinicDirector} onChange={(e) => updateData('clinicDirector', e.target.value)} error={errors.clinicDirector} />
           </div>
           <div className="flex justify-between items-center mt-10">
             <Button variant="ghost" onClick={() => setStep('TYPE')}>Back</Button>
             <Button size="lg" onClick={handleClinicNext}>Next <ChevronRight className="ml-2 h-4 w-4" /></Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D1117] py-12 px-4 flex justify-center">
      <div className="w-full max-w-3xl">
        <div className="flex items-center justify-between mb-8">
           <Button variant="ghost" onClick={() => setStep(formData.accountType === AccountType.Clinic ? 'CLINIC_DETAILS' : 'TYPE')}>
             <ArrowLeft className="h-4 w-4 mr-2" /> Back
           </Button>
           <Logo size="md" />
           <div className="w-20" />
        </div>
        <Card className="p-8 md:p-10 border-t-4 border-t-[#0ABAB5]">
          <h2 className="text-3xl font-bold text-white mb-2">Create your account</h2>
          <p className="text-slate-400 mb-8 border-b border-[#30363D] pb-6">Complete your profile to access the clinical dashboard.</p>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4">
               <h3 className="text-sm font-bold text-[#0ABAB5] uppercase tracking-wider flex items-center">
                 <User className="h-4 w-4 mr-2" /> Personal Information
               </h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <Input label="Full Name" value={formData.name} onChange={(e) => updateData('name', e.target.value)} error={errors.name} />
                  </div>
                  <div className="md:col-span-2">
                    <Input label="Professional Email" type="email" value={formData.email} onChange={(e) => updateData('email', e.target.value)} error={errors.email} />
                  </div>
                  <Input label="Password" type="password" canToggleVisibility helperText="8+ chars, 1 uppercase, 1 lowercase, 1 number" value={formData.password} onChange={(e) => updateData('password', e.target.value)} error={errors.password} />
                  <Input label="Confirm Password" type="password" canToggleVisibility value={formData.confirmPassword} onChange={(e) => updateData('confirmPassword', e.target.value)} error={errors.confirmPassword} />
                  <div className="md:col-span-2">
                    <Select label="Country" options={[{ value: 'USA', label: 'United States' }, { value: 'Brazil', label: 'Brazil' }]} value={formData.country} onChange={(e) => updateData('country', e.target.value)} error={errors.country} />
                  </div>
               </div>
            </div>

            <div className="space-y-4">
               <h3 className="text-sm font-bold text-[#0ABAB5] uppercase tracking-wider flex items-center">
                 <FileText className="h-4 w-4 mr-2" /> Professional Information
               </h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Select label="Profession" options={[{ value: 'Psychologist', label: 'Psychologist' }, { value: 'Psychiatrist', label: 'Psychiatrist' }]} value={formData.role} onChange={(e) => updateData('role', e.target.value)} error={errors.role} />
                  <Input label="Registration Number" placeholder="e.g. CRP 06/12345" value={formData.crpCrm} onChange={(e) => updateData('crpCrm', e.target.value)} error={errors.crpCrm} />
                  <div className="md:col-span-2">
                     <Select label="Approximate active patients" options={[{ value: '1-10', label: '1-10 patients' }, { value: '11-25', label: '11-25 patients' }]} value={formData.patientVolume} onChange={(e) => updateData('patientVolume', e.target.value)} error={errors.patientVolume} />
                  </div>
               </div>
            </div>

            <div className="p-4 bg-[#0ABAB5]/5 border border-[#0ABAB5]/20 rounded-lg">
               <Input label="Beta Access Code (Optional)" placeholder="LURIA-BETA-XXXX" value={formData.betaToken} onChange={(e) => updateData('betaToken', e.target.value)} error={errors.betaToken} className="bg-[#0D1117] border-[#0ABAB5]/30 focus:border-[#0ABAB5]" />
            </div>

            <div className="pt-6 border-t border-[#30363D]">
               <h3 className="text-lg font-bold text-white mb-2">Privacy & Data Security (HIPAA Compliance)</h3>
               <p className="text-sm text-slate-400 mb-4">By using Luria Mind, you agree to our comprehensive Privacy & Data Security terms, including HIPAA compliance requirements.</p>
               <button type="button" onClick={() => setIsHipaaModalOpen(true)} className="text-[#0ABAB5] text-sm font-semibold hover:underline flex items-center mb-6">
                 <FileText className="h-4 w-4 mr-2" /> Read full Privacy & Data Security Agreement (HIPAA)
               </button>
               <div className={!hasReadHipaa ? "opacity-50 pointer-events-none" : ""}>
                 <Checkbox label="I have read and agree to the Privacy & Data Security Agreement (HIPAA Compliance)" disabled={!hasReadHipaa} checked={formData.hipaaAccepted} onChange={(e) => updateData('hipaaAccepted', e.target.checked)} error={errors.hipaaAccepted} />
                 {!hasReadHipaa && <p className="text-xs text-slate-500 mt-2 ml-8">* You must read the agreement (scroll to bottom) to enable this checkbox.</p>}
               </div>
            </div>
            
            {(Object.keys(errors).length > 0 || apiError) && (
              <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-md flex items-center text-red-400 text-sm">
                 <AlertCircle className="h-5 w-5 mr-2" />
                 {apiError || "Please correct the errors above."}
              </div>
            )}

            <Button type="submit" fullWidth size="lg" isLoading={isSubmitting} disabled={!formData.hipaaAccepted}>Create Account</Button>
          </form>
        </Card>
      </div>
      <Modal isOpen={isHipaaModalOpen} onClose={() => setIsHipaaModalOpen(false)} title="Privacy & Data Security Agreement" onScrollToBottom={() => setHasReadHipaa(true)}>
        <div className="prose prose-invert prose-sm max-w-none"><pre className="whitespace-pre-wrap font-sans text-sm text-slate-300">{HIPAA_TEXT}</pre></div>
      </Modal>
    </div>
  );
};

export default Register;