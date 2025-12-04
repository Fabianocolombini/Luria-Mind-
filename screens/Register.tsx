import React, { useState } from 'react';
import { Button, Input, Select, Card, Checkbox, Logo, RadioCard, Modal } from '../components/UI';
import { AppView, AccountType } from '../types';
import { ArrowLeft, AlertCircle, Building2, User, FileText, ChevronRight } from 'lucide-react';

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

By accessing or using Luria Mind ("the Platform"), you ("Therapist," "User," "you") agree to be bound by these Privacy & Data Security terms. Luria Mind is a clinical intelligence platform designed exclusively for licensed mental health professionals.

**If you do not agree with these terms, you must not use the Platform.**


2. DATA OWNERSHIP AND CONTROL

 2.1 You Are the Data Controller
- **You retain full ownership** of all clinical data, patient information, session recordings, and therapeutic notes entered into the Platform.
- Luria Mind acts solely as a **Data Processor** under your instruction and control.
- You are responsible for obtaining appropriate patient consent before using the Platform to record or analyze therapy sessions.

2.2 Patient Rights
- Your patients retain all rights to their personal health information (PHI).
- You must inform patients that their session data will be processed by AI technology.
- You must provide patients with the ability to request access, correction, or deletion of their data.


 3. HIPAA COMPLIANCE

 3.1 Business Associate Agreement (BAA)
- Luria Mind has executed a **Business Associate Agreement (BAA)** with Google Cloud, our infrastructure provider, ensuring full HIPAA compliance.
- Upon request, we will provide you with a signed BAA for your records.

3.2 Protected Health Information (PHI)
- All PHI is handled in accordance with the **Health Insurance Portability and Accountability Act (HIPAA)** and its implementing regulations (45 CFR Parts 160 and 164).
- We implement administrative, physical, and technical safeguards to protect PHI from unauthorized access, use, or disclosure.

.3 Breach Notification
- In the event of a data breach affecting PHI, we will notify you within **72 hours** as required by HIPAA.
- You remain responsible for notifying affected patients as required by law.



4. DATA ENCRYPTION AND SECURITY

4.1 Encryption Standards
- **At Rest:** All data is encrypted using **AES-256** encryption.
- **In Transit:** All data transmission uses **TLS 1.3** encryption.
- **Encryption Keys:** Managed securely through Google Cloud Key Management Service (KMS) with role-based access control.

4.2 Authentication and Access Control
- **Multi-Factor Authentication (MFA)** is mandatory for all user accounts.
- Session tokens expire after **30 minutes** of inactivity.
- All access to PHI is logged and auditable.

4.3 Infrastructure Security
- **Cloud Provider:** Google Cloud Platform (HIPAA-compliant data centers).
- **Geographic Location:** Data is stored in HIPAA-compliant regions (US or EU, based on your account settings).
- **Redundancy:** Automated backups every 24 hours, retained for **30 days**.

---

5. AI MODEL TRAINING AND DATA USE

5.1 Exclusive Therapeutic Use
- **The AI model powering Luria Mind is trained exclusively for therapeutic and clinical analysis.**
- Your clinical data is **NEVER** used to train third-party AI models or shared with external AI providers.

5.2 Opt-In Data Contribution
- You may **optionally** contribute **anonymized, de-identified** session data to improve Luria Mind's AI model.
- This is **entirely voluntary** and can be enabled or disabled at any time in your account settings.
- De-identification follows HIPAA Safe Harbor standards (removal of 18 identifiers).

5.3 No Third-Party Sharing
- We do **not** sell, rent, or share your data with third parties for marketing or commercial purposes.
- We do **not** share PHI with any third party except:
  - As required by law (e.g., court order, subpoena).
  - With your explicit written consent.
  - With our HIPAA-compliant service providers under BAA (e.g., Google Cloud).



6. DATA RETENTION AND DELETION

6.1 Retention Period
- Clinical session data is retained **indefinitely** or as long as you maintain an active account.
- You may configure automatic deletion schedules.
`;

const Register: React.FC<RegisterProps> = ({ onNavigate, onRegisterSuccess }) => {
  // Navigation Steps: TYPE -> (CLINIC_DETAILS) -> FORM
  const [step, setStep] = useState<'TYPE' | 'CLINIC_DETAILS' | 'FORM'>('TYPE');
  
  // Modal State
  const [isHipaaModalOpen, setIsHipaaModalOpen] = useState(false);
  const [hasReadHipaa, setHasReadHipaa] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    // Type
    accountType: AccountType.Independent,
    
    // Clinic Info
    clinicName: '',
    clinicCnpj: '',
    clinicLocation: '',
    clinicTherapistCount: '',
    clinicDirector: '',

    // Personal Info
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    country: '',

    // Professional Info
    role: '',
    crpCrm: '',
    patientVolume: '',
    
    // Beta
    betaToken: '',

    // Agreements
    hipaaAccepted: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Helpers ---
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

  // --- Step Logic ---
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
    
    // Password Rules
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setTimeout(() => {
       // Simulate Backend
       setIsSubmitting(false);
       onRegisterSuccess(formData.email);
    }, 2000);
  };

  // --- Renders ---

  // 1. Account Type
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

  // 2. Clinic Details (Conditional)
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
                 <Input 
                   label="Clinic Name" 
                   value={formData.clinicName} 
                   onChange={(e) => updateData('clinicName', e.target.value)} 
                   error={errors.clinicName}
                 />
               </div>
               <Input 
                 label="Business Registration (CNPJ/EIN)" 
                 value={formData.clinicCnpj} 
                 onChange={(e) => updateData('clinicCnpj', e.target.value)} 
                 error={errors.clinicCnpj}
               />
               <Input 
                 label="Location (City/State)" 
                 value={formData.clinicLocation} 
                 onChange={(e) => updateData('clinicLocation', e.target.value)} 
                 error={errors.clinicLocation}
               />
             </div>

             <div>
               <label className="block text-sm font-semibold text-slate-300 mb-2">Number of therapists</label>
               <div className="grid grid-cols-2 gap-4">
                 {['2-5', '6-10', '11-20', '21+'].map(opt => (
                    <label key={opt} className={`flex items-center p-3 rounded border cursor-pointer ${formData.clinicTherapistCount === opt ? 'border-[#0ABAB5] bg-[#0ABAB5]/10' : 'border-[#30363D] hover:border-slate-500'}`}>
                      <input 
                        type="radio" 
                        name="tCount"
                        className="mr-2 text-[#0ABAB5] focus:ring-[#0ABAB5]"
                        checked={formData.clinicTherapistCount === opt}
                        onChange={() => updateData('clinicTherapistCount', opt)}
                      />
                      <span className="text-slate-300 text-sm">{opt}</span>
                    </label>
                 ))}
               </div>
               {errors.clinicTherapistCount && <p className="text-xs text-red-400 mt-1">{errors.clinicTherapistCount}</p>}
             </div>

             <Input 
               label="Technical Director Name" 
               helperText="Person responsible for creating this account"
               value={formData.clinicDirector} 
               onChange={(e) => updateData('clinicDirector', e.target.value)} 
               error={errors.clinicDirector}
             />
           </div>

           <div className="flex justify-between items-center mt-10">
             <Button variant="ghost" onClick={() => setStep('TYPE')}>Back</Button>
             <Button size="lg" onClick={handleClinicNext}>Next <ChevronRight className="ml-2 h-4 w-4" /></Button>
          </div>
        </Card>
      </div>
    );
  }

  // 3. Final Form
  return (
    <div className="min-h-screen bg-[#0D1117] py-12 px-4 flex justify-center">
      <div className="w-full max-w-3xl">
        
        {/* Nav */}
        <div className="flex items-center justify-between mb-8">
           <Button variant="ghost" onClick={() => setStep(formData.accountType === AccountType.Clinic ? 'CLINIC_DETAILS' : 'TYPE')}>
             <ArrowLeft className="h-4 w-4 mr-2" /> Back
           </Button>
           <Logo size="md" />
           <div className="w-20" />
        </div>

        <Card className="p-8 md:p-10 border-t-4 border-t-[#0ABAB5]">
          <h2 className="text-3xl font-bold text-white mb-2">Create your account</h2>
          <p className="text-slate-400 mb-8 border-b border-[#30363D] pb-6">
            Complete your profile to access the clinical dashboard.
          </p>

          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Personal */}
            <div className="space-y-4">
               <h3 className="text-sm font-bold text-[#0ABAB5] uppercase tracking-wider flex items-center">
                 <User className="h-4 w-4 mr-2" /> Personal Information
               </h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <Input 
                      label="Full Name" 
                      value={formData.name} 
                      onChange={(e) => updateData('name', e.target.value)}
                      error={errors.name}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Input 
                      label="Professional Email" 
                      type="email"
                      value={formData.email} 
                      onChange={(e) => updateData('email', e.target.value)}
                      error={errors.email}
                    />
                  </div>
                  <Input 
                    label="Password" 
                    type="password" 
                    canToggleVisibility 
                    helperText="8+ chars, 1 uppercase, 1 lowercase, 1 number"
                    value={formData.password} 
                    onChange={(e) => updateData('password', e.target.value)}
                    error={errors.password}
                  />
                  <Input 
                    label="Confirm Password" 
                    type="password" 
                    canToggleVisibility 
                    value={formData.confirmPassword} 
                    onChange={(e) => updateData('confirmPassword', e.target.value)}
                    error={errors.confirmPassword}
                  />
                  <div className="md:col-span-2">
                    <Select 
                      label="Country"
                      options={[
                        { value: 'USA', label: 'United States' },
                        { value: 'Brazil', label: 'Brazil' },
                        { value: 'Canada', label: 'Canada' },
                        { value: 'UK', label: 'United Kingdom' },
                        { value: 'Spain', label: 'Spain' },
                      ]}
                      value={formData.country}
                      onChange={(e) => updateData('country', e.target.value)}
                      error={errors.country}
                    />
                  </div>
               </div>
            </div>

            {/* Professional */}
            <div className="space-y-4">
               <h3 className="text-sm font-bold text-[#0ABAB5] uppercase tracking-wider flex items-center">
                 <FileText className="h-4 w-4 mr-2" /> Professional Information
               </h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Select 
                    label="Profession"
                    options={[
                      { value: 'Psychologist', label: 'Psychologist' },
                      { value: 'Psychiatrist', label: 'Psychiatrist' },
                      { value: 'Neuropsychologist', label: 'Neuropsychologist' },
                      { value: 'OccupationalTherapist', label: 'Occupational Therapist' },
                      { value: 'Other', label: 'Other' },
                    ]}
                    value={formData.role}
                    onChange={(e) => updateData('role', e.target.value)}
                    error={errors.role}
                  />
                  <Input 
                    label="Registration Number" 
                    placeholder="e.g. CRP 06/12345"
                    value={formData.crpCrm}
                    onChange={(e) => updateData('crpCrm', e.target.value)}
                    error={errors.crpCrm}
                  />
                  <div className="md:col-span-2">
                     <Select 
                       label="Approximate active patients"
                       options={[
                         { value: '1-10', label: '1-10 patients' },
                         { value: '11-25', label: '11-25 patients' },
                         { value: '26-50', label: '26-50 patients' },
                         { value: '51-100', label: '51-100 patients' },
                         { value: '100+', label: '100+ patients' },
                       ]}
                       value={formData.patientVolume}
                       onChange={(e) => updateData('patientVolume', e.target.value)}
                       error={errors.patientVolume}
                     />
                  </div>
               </div>
            </div>

            {/* Beta */}
            <div className="p-4 bg-[#0ABAB5]/5 border border-[#0ABAB5]/20 rounded-lg">
               <Input 
                 label="Beta Access Code (Optional)"
                 placeholder="LURIA-BETA-XXXX"
                 helperText="Leave blank if you don't have one"
                 value={formData.betaToken}
                 onChange={(e) => updateData('betaToken', e.target.value)}
                 className="bg-[#0D1117] border-[#0ABAB5]/30 focus:border-[#0ABAB5]"
               />
            </div>

            {/* Privacy & HIPAA */}
            <div className="pt-6 border-t border-[#30363D]">
               <h3 className="text-lg font-bold text-white mb-2">Privacy & Data Security (HIPAA Compliance)</h3>
               <p className="text-sm text-slate-400 mb-4">
                 By using Luria Mind, you agree to our comprehensive Privacy & Data Security terms, including HIPAA compliance requirements for handling protected health information (PHI).
               </p>

               <button 
                 type="button"
                 onClick={() => setIsHipaaModalOpen(true)}
                 className="text-[#0ABAB5] text-sm font-semibold hover:underline flex items-center mb-6"
               >
                 <FileText className="h-4 w-4 mr-2" />
                 Read full Privacy & Data Security Agreement (HIPAA)
               </button>

               <div className={!hasReadHipaa ? "opacity-50 pointer-events-none" : ""}>
                 <Checkbox 
                   label="I have read and agree to the Privacy & Data Security Agreement (HIPAA Compliance)"
                   disabled={!hasReadHipaa}
                   checked={formData.hipaaAccepted}
                   onChange={(e) => updateData('hipaaAccepted', e.target.checked)}
                   error={errors.hipaaAccepted}
                 />
                 {!hasReadHipaa && (
                   <p className="text-xs text-slate-500 mt-2 ml-8">
                     * You must read the agreement (scroll to bottom) to enable this checkbox.
                   </p>
                 )}
               </div>
            </div>
            
            {/* Form Errors */}
            {Object.keys(errors).length > 0 && (
              <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-md flex items-center text-red-400 text-sm">
                 <AlertCircle className="h-5 w-5 mr-2" />
                 Please correct the errors above.
              </div>
            )}

            <Button type="submit" fullWidth size="lg" isLoading={isSubmitting} disabled={!formData.hipaaAccepted}>
              Create Account
            </Button>
          </form>
        </Card>
      </div>

      {/* HIPAA Modal */}
      <Modal 
        isOpen={isHipaaModalOpen} 
        onClose={() => setIsHipaaModalOpen(false)}
        title="Privacy & Data Security Agreement"
        onScrollToBottom={() => setHasReadHipaa(true)}
      >
        <div className="prose prose-invert prose-sm max-w-none">
          <pre className="whitespace-pre-wrap font-sans text-sm text-slate-300">
            {HIPAA_TEXT}
          </pre>
        </div>
      </Modal>

    </div>
  );
};

export default Register;