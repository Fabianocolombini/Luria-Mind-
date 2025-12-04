import React, { useState } from 'react';
import { Button, Input, Select, Card, Checkbox, Logo } from '../components/UI';
import { OnboardingData } from '../types';
import { CheckCircle2, ChevronRight, ShieldCheck, UserCircle, Briefcase, Settings } from 'lucide-react';

interface Props {
  onComplete: (data: OnboardingData) => void;
}

const steps = [
  { id: 1, title: 'Welcome', icon: CheckCircle2 },
  { id: 2, title: 'Privacy & HIPAA', icon: ShieldCheck },
  { id: 3, title: 'Profile', icon: UserCircle },
  { id: 4, title: 'Approaches', icon: Briefcase },
  { id: 5, title: 'Preferences', icon: Settings },
];

const APPROACHES_LIST = [
    'CBT (Cognitive Behavioral)',
    'DBT (Dialectical Behavior)',
    'ACT (Acceptance and Commitment)',
    'Psychodynamic / Psychoanalysis',
    'Neuropsychology (Luria framework)',
    'Systemic / Family Therapy',
    'Gestalt Therapy',
    'Humanistic / Person-Centered',
    'Interpersonal Therapy (IPT)',
    'EMDR',
    'Schema Therapy',
    'MBCT (Mindfulness-Based)',
    'Integrative'
];

const Onboarding: React.FC<Props> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    acceptedTerms: false,
    yearsExperience: '',
    workContexts: [],
    ageGroups: [],
    approaches: [],
    language: 'English',
    sessionType: 'Online',
    reportStyle: 'Summary',
    notifications: ['Email']
  });

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(c => c + 1);
    } else {
      onComplete(data);
    }
  };

  const updateData = (key: keyof OnboardingData, value: any) => {
    setData(prev => ({ ...prev, [key]: value }));
  };

  const toggleArrayItem = (key: keyof OnboardingData, item: string) => {
      const currentList = data[key] as string[];
      if (currentList.includes(item)) {
          updateData(key, currentList.filter(i => i !== item));
      } else {
          updateData(key, [...currentList, item]);
      }
  };

  // --- Step Components ---

  const Step1Welcome = () => (
    <div className="text-center py-8">
      <h2 className="text-3xl font-bold text-white mb-4">Welcome to Luria Mind! 🧠</h2>
      <p className="text-slate-400 mb-8 max-w-lg mx-auto leading-relaxed">
        Let's configure your clinical workspace. <br/>
        Luria Mind was developed specifically for mental health professionals seeking advanced clinical analysis with AI.
      </p>
      <div className="flex justify-center">
        <Button size="lg" onClick={handleNext} className="px-12">
           Start Configuration <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  const Step2HIPAA = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-white">Privacy & Data Security (HIPAA)</h3>
      
      <div className="space-y-4">
          <div className="bg-slate-900 p-4 rounded-lg border border-slate-800">
            <h4 className="font-bold text-[#0ABAB5] mb-2 text-sm">EXECUTIVE SUMMARY</h4>
            <ul className="text-sm text-slate-300 space-y-2">
                <li className="flex items-center"><CheckCircle2 className="h-4 w-4 mr-2 text-green-500" /> AES-256 Encryption (At Rest & In Transit)</li>
                <li className="flex items-center"><CheckCircle2 className="h-4 w-4 mr-2 text-green-500" /> Full HIPAA Compliance & BAA</li>
                <li className="flex items-center"><CheckCircle2 className="h-4 w-4 mr-2 text-green-500" /> You are the Data Controller</li>
                <li className="flex items-center"><CheckCircle2 className="h-4 w-4 mr-2 text-green-500" /> AI trained exclusively for therapeutic use</li>
                <li className="flex items-center"><CheckCircle2 className="h-4 w-4 mr-2 text-green-500" /> No data sharing with third parties</li>
            </ul>
          </div>

          <Checkbox 
            label="I confirm that I have read and understand the security policies."
            checked={data.acceptedTerms}
            onChange={(e) => updateData('acceptedTerms', e.target.checked)}
          />
      </div>

      <div className="flex justify-end pt-4">
        <Button onClick={handleNext} disabled={!data.acceptedTerms}>Continue</Button>
      </div>
    </div>
  );

  const Step3Profile = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-white">Tell us about your practice</h3>

      <div className="grid grid-cols-1 gap-6">
         <Select 
            label="Years of Clinical Experience"
            options={[
                { value: '0-2', label: '0-2 years (Early Career)' },
                { value: '3-5', label: '3-5 years' },
                { value: '6-10', label: '6-10 years' },
                { value: '11-20', label: '11-20 years' },
                { value: '20+', label: '20+ years (Senior)' },
            ]}
            value={data.yearsExperience}
            onChange={(e) => updateData('yearsExperience', e.target.value)}
         />

         <div>
            <label className="text-sm font-medium text-slate-300 mb-2 block">Work Contexts</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {['Private Practice', 'Hospital/Clinic', 'Online Therapy', 'Academic'].map(ctx => (
                    <label key={ctx} className={`flex items-center p-3 rounded border cursor-pointer transition-all ${data.workContexts.includes(ctx) ? 'border-[#0ABAB5] bg-[#0ABAB5]/10' : 'border-slate-700 hover:bg-slate-800'}`}>
                        <input 
                            type="checkbox" 
                            className="mr-3 h-4 w-4 text-[#0ABAB5] bg-slate-900 border-slate-600 rounded"
                            checked={data.workContexts.includes(ctx)}
                            onChange={() => toggleArrayItem('workContexts', ctx)}
                        />
                        <span className="text-sm text-slate-200">{ctx}</span>
                    </label>
                ))}
            </div>
         </div>

         <div>
            <label className="text-sm font-medium text-slate-300 mb-2 block">Patient Age Groups</label>
            <div className="grid grid-cols-2 gap-3">
                {['Children (0-12)', 'Adolescents (13-17)', 'Adults (18-59)', 'Seniors (60+)'].map(group => (
                     <label key={group} className={`flex items-center p-3 rounded border cursor-pointer transition-all ${data.ageGroups.includes(group) ? 'border-[#0ABAB5] bg-[#0ABAB5]/10' : 'border-slate-700 hover:bg-slate-800'}`}>
                        <input 
                            type="checkbox" 
                            className="mr-3 h-4 w-4 text-[#0ABAB5] bg-slate-900 border-slate-600 rounded"
                            checked={data.ageGroups.includes(group)}
                            onChange={() => toggleArrayItem('ageGroups', group)}
                        />
                        <span className="text-sm text-slate-200">{group}</span>
                    </label>
                ))}
            </div>
         </div>
      </div>
       <div className="flex justify-end pt-4">
        <Button onClick={handleNext} disabled={!data.yearsExperience || data.ageGroups.length === 0}>Continue</Button>
      </div>
    </div>
  );

  const Step4Approach = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-white">Therapeutic Approaches</h3>
      <p className="text-slate-400 text-sm">Select all that apply. This adjusts the AI's terminology.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 h-96 overflow-y-auto pr-2 custom-scrollbar">
          {APPROACHES_LIST.map(approach => (
               <label key={approach} className={`flex items-center p-4 rounded-lg border cursor-pointer transition-all ${data.approaches.includes(approach) ? 'border-[#0ABAB5] bg-[#0ABAB5]/10 shadow-sm' : 'border-slate-700 bg-slate-800/50 hover:border-[#0ABAB5]/50'}`}>
                    <input 
                        type="checkbox" 
                        className="mr-3 h-5 w-5 text-[#0ABAB5] bg-slate-900 border-slate-600 rounded focus:ring-[#0ABAB5]"
                        checked={data.approaches.includes(approach)}
                        onChange={() => toggleArrayItem('approaches', approach)}
                    />
                    <span className="font-medium text-slate-200 text-sm">{approach}</span>
                </label>
          ))}
      </div>

       <div className="flex justify-end pt-4">
        <Button onClick={handleNext} disabled={data.approaches.length === 0}>Continue</Button>
      </div>
    </div>
  );

  const Step5Preferences = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-white">Initial Preferences</h3>
      
      <div className="grid grid-cols-1 gap-6">
        <Select 
            label="Interface Language"
            options={[
                { value: 'English', label: '🇺🇸 English' },
                { value: 'Portuguese', label: '🇧🇷 Português (BR)' },
                { value: 'Spanish', label: '🇪🇸 Español' },
            ]}
            value={data.language}
            onChange={(e) => updateData('language', e.target.value)}
         />
         
         <div className="space-y-2">
             <label className="text-sm font-medium text-slate-300">Predominant Session Type</label>
             <div className="flex space-x-4">
                 {['Online', 'In-Person', 'Hybrid'].map(type => (
                     <label key={type} className="flex items-center cursor-pointer">
                         <input 
                            type="radio" 
                            name="sessionType"
                            className="mr-2 text-[#0ABAB5] focus:ring-[#0ABAB5]"
                            checked={data.sessionType === type}
                            onChange={() => updateData('sessionType', type)}
                         />
                         <span className="text-slate-300 text-sm">{type}</span>
                     </label>
                 ))}
             </div>
         </div>

         <div className="space-y-2">
             <label className="text-sm font-medium text-slate-300">Preferred Report Style</label>
             <div className="grid grid-cols-1 gap-2">
                 {[
                     {val: 'Summary', desc: 'Summary (Key insights focus)'},
                     {val: 'Detailed', desc: 'Detailed (Full analysis + Literature)'},
                     {val: 'Custom', desc: 'Custom (I will configure later)'}
                 ].map(opt => (
                     <label key={opt.val} className={`p-3 border rounded cursor-pointer ${data.reportStyle === opt.val ? 'border-[#0ABAB5] bg-[#0ABAB5]/10' : 'border-slate-700'}`}>
                         <div className="flex items-center">
                            <input 
                                type="radio" 
                                name="reportStyle"
                                className="mr-3 text-[#0ABAB5] focus:ring-[#0ABAB5]"
                                checked={data.reportStyle === opt.val}
                                onChange={() => updateData('reportStyle', opt.val)}
                            />
                            <span className="text-slate-200 text-sm">{opt.desc}</span>
                         </div>
                     </label>
                 ))}
             </div>
         </div>
      </div>

       <div className="flex justify-end pt-4">
        <Button onClick={handleNext}>Finish & Go to Dashboard</Button>
      </div>
    </div>
  );

  // --- Main Render ---
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <Card className="max-w-4xl w-full min-h-[600px] flex flex-col shadow-2xl overflow-hidden border-slate-800">
        {/* Header */}
        <div className="bg-slate-900 border-b border-slate-800 p-6 flex justify-between items-center">
            <Logo size="sm" />
            <div className="text-sm font-medium text-slate-500">Step {currentStep} of 5</div>
        </div>

        <div className="flex flex-1 flex-col md:flex-row">
            {/* Sidebar (Desktop) */}
            <div className="hidden md:flex flex-col w-64 bg-slate-900/50 border-r border-slate-800 p-6 space-y-6">
                {steps.map((s) => {
                    const Icon = s.icon;
                    const isActive = s.id === currentStep;
                    const isCompleted = s.id < currentStep;

                    return (
                        <div key={s.id} className={`flex items-center space-x-3 ${isActive ? 'text-[#0ABAB5]' : isCompleted ? 'text-slate-500' : 'text-slate-600'}`}>
                            <div className={`
                                w-8 h-8 rounded-full flex items-center justify-center border transition-colors
                                ${isActive ? 'bg-[#0ABAB5]/20 text-[#0ABAB5] border-[#0ABAB5]' : isCompleted ? 'bg-green-900/20 text-green-500 border-green-800' : 'bg-transparent border-slate-700'}
                            `}>
                                {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
                            </div>
                            <span className={`text-sm font-medium ${isActive ? 'font-bold text-white' : ''}`}>{s.title}</span>
                        </div>
                    )
                })}
            </div>

            {/* Content Area */}
            <div className="flex-1 p-8 md:p-12 bg-slate-950">
                {currentStep === 1 && <Step1Welcome />}
                {currentStep === 2 && <Step2HIPAA />}
                {currentStep === 3 && <Step3Profile />}
                {currentStep === 4 && <Step4Approach />}
                {currentStep === 5 && <Step5Preferences />}
            </div>
        </div>
      </Card>
    </div>
  );
};

export default Onboarding;