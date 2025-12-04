import React from 'react';
import { Button, Logo } from '../components/UI';
import { AppView } from '../types';
import { ArrowRight, ChevronDown, Check, Globe } from 'lucide-react';

interface LandingProps {
  onNavigate: (view: AppView) => void;
}

const Landing: React.FC<LandingProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-[#0D1117] flex flex-col relative overflow-hidden font-sans">
      
      {/* Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-[#0ABAB5]/5 rounded-full blur-[128px] pointer-events-none opacity-40" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30rem] h-[30rem] bg-[#0ABAB5]/5 rounded-full blur-[128px] pointer-events-none opacity-30" />

      {/* Header */}
      <header className="w-full py-6 px-6 md:px-12 flex justify-between items-center border-b border-[#30363D] backdrop-blur-sm z-10 bg-[#0D1117]/80">
        <Logo className="h-12 w-auto" /> 
        
        <div className="flex items-center gap-6">
          {/* Language Selector */}
          <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-md border border-[#30363D] bg-[#161B22] text-slate-300 text-sm hover:border-[#0ABAB5] cursor-pointer transition-colors">
            <Globe className="h-4 w-4" />
            <span className="font-medium">EN</span>
            <ChevronDown className="h-3 w-3 opacity-50" />
          </div>

          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => onNavigate(AppView.Login)}>
              Sign In
            </Button>
            <Button variant="primary" onClick={() => onNavigate(AppView.Register)}>
              Start Free Trial
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20 max-w-6xl mx-auto z-10">
        
        <div className="inline-flex items-center rounded-full border border-[#0ABAB5]/30 bg-[#0ABAB5]/5 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#0ABAB5] mb-8 shadow-[0_0_20px_rgba(10,186,181,0.1)]">
          Luria Mind
        </div>
        
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-8 leading-[1.1]">
          Advanced Clinical Intelligence <br /> for <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0ABAB5] to-[#26A69A]">Modern Therapy</span>
        </h1>
        
        <div className="max-w-3xl mx-auto space-y-6 text-lg md:text-xl text-slate-400 mb-12 leading-relaxed font-light">
          <p>
            Transcribe and analyze therapy sessions with AI trained exclusively for mental health professionals. 
            Generate structured clinical notes, track neuropsychological markers in real-time, and ensure full HIPAA compliance.
          </p>
        </div>

        {/* Feature List (Compact) */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-12 text-sm font-medium text-slate-400">
           <div className="flex items-center gap-2">
             <div className="w-1.5 h-1.5 rounded-full bg-[#0ABAB5]" />
             <span>Luria Framework</span>
           </div>
           <div className="flex items-center gap-2">
             <div className="w-1.5 h-1.5 rounded-full bg-[#0ABAB5]" />
             <span>Prosodic & Confrontational AI</span>
           </div>
           <div className="flex items-center gap-2">
             <div className="w-1.5 h-1.5 rounded-full bg-[#0ABAB5]" />
             <span>PubMed Integration</span>
           </div>
           <div className="flex items-center gap-2">
             <div className="w-1.5 h-1.5 rounded-full bg-[#0ABAB5]" />
             <span>AES-256 + HIPAA Compliant</span>
           </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto items-center">
          <Button size="lg" className="h-14 px-10 text-lg shadow-[0_0_30px_rgba(10,186,181,0.25)] hover:shadow-[0_0_40px_rgba(10,186,181,0.4)]" onClick={() => onNavigate(AppView.Register)}>
            Start Free Trial
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button variant="outline" className="h-14 px-10 text-lg border-slate-600 text-white" onClick={() => onNavigate(AppView.Login)}>
            Sign In
          </Button>
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="py-8 text-center text-slate-600 text-xs border-t border-[#30363D] bg-[#0D1117]">
        <p>© 2025 Luria Mind. Professional use only. HIPAA Compliant.</p>
      </footer>
    </div>
  );
};

export default Landing;