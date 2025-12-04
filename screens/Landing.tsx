import React, { useState } from 'react';
import { Button, Logo, Badge, Card } from '../components/UI';
import { AppView } from '../types';
import { 
  ArrowRight, ChevronDown, Globe, Lock, Brain, FileText, 
  Mic, Cpu, Activity, CheckCircle2, ShieldCheck, Key, 
  FileClock, AudioWaveform, GitCompare, BookOpen, Gift, Play
} from 'lucide-react';

interface LandingProps {
  onNavigate: (view: AppView) => void;
}

type Lang = 'en' | 'pt' | 'es';

const content = {
  en: {
    hero: {
      badge: "AI-Powered Clinical Intelligence",
      headline: "Advanced Clinical Intelligence",
      headlineHighlight: "for Modern Therapy",
      subhead: "Transcribe and analyze therapy sessions with AI trained exclusively for mental health professionals. Generate structured clinical notes, track neuropsychological markers in real-time, and ensure full HIPAA compliance.",
      ctaPrimary: "Start Free Trial",
      ctaSecondary: "Watch Demo",
      features: ["Luria Framework", "Prosodic & Confrontational AI", "PubMed Integration", "AES-256 + HIPAA Compliant"]
    },
    why: {
      title: "Why Therapists Choose Luria Mind",
      c1_title: "HIPAA Compliant",
      c1_desc: "Enterprise-grade encryption and BAA available for all clinical accounts. Your patient data is yours alone.",
      c2_title: "Neuropsychology",
      c2_desc: "Automated extraction of themes, emotional valence, and cognitive risk markers focused on CBT, DBT, and ACT.",
      c3_title: "Smart Documentation",
      c3_desc: "Turn 50 minutes of audio into structured clinical SOAP/DAP notes in seconds. Spend time on care, not paperwork."
    },
    how: {
      title: "From Session to Clinical Note in Minutes",
      s1: { title: "Record Session", desc: "Dual-channel recording (patient + therapist) with prosodic analysis" },
      s2: { title: "AI Analysis", desc: "Gemini 2.0 processes audio with neuropsychological framework (Luria)" },
      s3: { title: "Clinical Markers", desc: "Automatic identification of cognitive patterns, defenses, and therapeutic progress" },
      s4: { title: "SOAP/DAP Notes", desc: "Structured clinical note with PubMed references, ready to review and sign" }
    },
    approaches: {
      title: "Built for Evidence-Based Therapy",
      subtitle: "Luria Mind supports multiple therapeutic frameworks with specialized AI training"
    },
    security: {
      title: "Enterprise-Grade Security",
      f1_title: "AES-256 Encryption",
      f1_desc: "All data encrypted at rest and in transit (TLS 1.3)",
      f2_title: "HIPAA & LGPD Compliant",
      f2_desc: "Full compliance with US and Brazil health data regulations",
      f3_title: "Multi-Factor Auth",
      f3_desc: "Mandatory MFA for all clinical accounts",
      f4_title: "Audit Logs",
      f4_desc: "7-year retention of all access logs for compliance"
    },
    ai: {
      title: "AI Designed for Clinical Excellence",
      f1: {
        title: "Prosodic Analysis",
        desc: "Captures tone, pauses, hesitations, and speech pace"
      },
      f2: {
        title: "Confrontational AI",
        desc: "Analyzes convergence & divergence between patient and therapist"
      },
      f3: {
        title: "PubMed Integration",
        desc: "Automatic citation of relevant research for evidence-based notes"
      }
    },
    pricing: {
      title: "Start Your Free Trial Today",
      cardTitle: "Beta Access Program",
      cardSub: "50 Free Transcriptions • No credit card required",
      features: ["Full HIPAA compliance", "Dual-channel recording", "AI analysis + PubMed integration", "SOAP/DAP note generation", "30-day trial period"],
      footer: "Have a beta access code? You'll enter it during registration."
    }
  },
  pt: {
    hero: {
      badge: "Inteligência Clínica com IA",
      headline: "Inteligência Clínica Avançada",
      headlineHighlight: "para Terapia Moderna",
      subhead: "Transcreva e analise sessões terapêuticas com IA treinada exclusivamente para profissionais de saúde mental. Gere notas clínicas estruturadas, acompanhe marcadores neuropsicológicos em tempo real e garanta conformidade total com HIPAA.",
      ctaPrimary: "Começar Teste Grátis",
      ctaSecondary: "Ver Demonstração",
      features: ["Framework Luria", "IA Prosódica e Confrontativa", "Integração PubMed", "AES-256 + HIPAA"]
    },
    why: {
      title: "Por que Terapeutas Escolhem Luria Mind",
      c1_title: "Conformidade HIPAA",
      c1_desc: "Criptografia de nível empresarial e BAA disponível. Seus dados de pacientes são apenas seus.",
      c2_title: "Neuropsicologia",
      c2_desc: "Extração automatizada de temas, valência emocional e marcadores cognitivos focados em TCC, DBT e ACT.",
      c3_title: "Documentação Inteligente",
      c3_desc: "Transforme 50 minutos de áudio em notas clínicas SOAP/DAP estruturadas em segundos."
    },
    how: {
      title: "Da Sessão à Nota Clínica em Minutos",
      s1: { title: "Gravar Sessão", desc: "Gravação de canal duplo (paciente + terapeuta) com análise prosódica" },
      s2: { title: "Análise IA", desc: "Gemini 2.0 processa áudio com framework neuropsicológico (Luria)" },
      s3: { title: "Marcadores Clínicos", desc: "Identificação automática de padrões cognitivos, defesas e progresso" },
      s4: { title: "Notas SOAP/DAP", desc: "Nota clínica estruturada com referências PubMed, pronta para revisar" }
    },
    approaches: {
      title: "Construído para Terapia Baseada em Evidências",
      subtitle: "Luria Mind suporta múltiplos frameworks terapêuticos com treinamento especializado de IA"
    },
    security: {
      title: "Segurança de Nível Empresarial",
      f1_title: "Criptografia AES-256",
      f1_desc: "Todos os dados criptografados em repouso e trânsito (TLS 1.3)",
      f2_title: "Conformidade HIPAA & LGPD",
      f2_desc: "Conformidade total com regulações dos EUA e Brasil",
      f3_title: "Autenticação Multifator",
      f3_desc: "MFA obrigatório para todas as contas clínicas",
      f4_title: "Logs de Auditoria",
      f4_desc: "Retenção de 7 anos de todos os logs de acesso"
    },
    ai: {
      title: "IA Projetada para Excelência Clínica",
      f1: {
        title: "Análise Prosódica",
        desc: "Captura tom, pausas, hesitações e ritmo de fala"
      },
      f2: {
        title: "IA Confrontativa",
        desc: "Analisa convergência e divergência entre paciente e terapeuta"
      },
      f3: {
        title: "Integração PubMed",
        desc: "Citação automática de pesquisas relevantes para notas baseadas em evidências"
      }
    },
    pricing: {
      title: "Comece Seu Teste Gratuito Hoje",
      cardTitle: "Programa de Acesso Beta",
      cardSub: "50 Transcrições Gratuitas • Sem cartão de crédito",
      features: ["Conformidade total HIPAA", "Gravação de canal duplo", "Análise IA + Integração PubMed", "Geração de notas SOAP/DAP", "Período de teste de 30 dias"],
      footer: "Tem um código de acesso beta? Você o inserirá durante o cadastro."
    }
  },
  es: {
    hero: {
      badge: "Inteligencia Clínica con IA",
      headline: "Inteligencia Clínica Avanzada",
      headlineHighlight: "para Terapia Moderna",
      subhead: "Transcriba y analice sesiones terapéuticas con IA entrenada exclusivamente para profesionales de salud mental. Genere notas clínicas estructuradas y garantice cumplimiento total con HIPAA.",
      ctaPrimary: "Empezar Prueba Gratis",
      ctaSecondary: "Ver Demostración",
      features: ["Marco Luria", "IA Prosódica", "Integración PubMed", "AES-256 + HIPAA"]
    },
    why: {
      title: "Por qué los Terapeutas Eligen Luria Mind",
      c1_title: "Cumplimiento HIPAA",
      c1_desc: "Cifrado de nivel empresarial y BAA disponible. Sus datos de pacientes son solo suyos.",
      c2_title: "Neuropsicología",
      c2_desc: "Extracción automatizada de temas, valencia emocional y marcadores cognitivos.",
      c3_title: "Documentación Inteligente",
      c3_desc: "Convierta 50 minutos de audio en notas clínicas SOAP/DAP estructuradas en segundos."
    },
    how: {
      title: "De la Sesión a la Nota Clínica en Minutos",
      s1: { title: "Grabar Sesión", desc: "Grabación de doble canal con análisis prosódico" },
      s2: { title: "Análisis IA", desc: "Gemini 2.0 procesa audio con marco neuropsicológico" },
      s3: { title: "Marcadores Clínicos", desc: "Identificación automática de patrones cognitivos" },
      s4: { title: "Notas SOAP/DAP", desc: "Nota clínica estructurada lista para revisar y firmar" }
    },
    approaches: {
      title: "Construido para Terapia Basada en Evidencia",
      subtitle: "Soporta múltiples marcos terapéuticos con entrenamiento especializado"
    },
    security: {
      title: "Seguridad de Nivel Empresarial",
      f1_title: "Cifrado AES-256",
      f1_desc: "Datos cifrados en reposo y tránsito (TLS 1.3)",
      f2_title: "Cumplimiento HIPAA & LGPD",
      f2_desc: "Cumplimiento total con regulaciones de EEUU y Brasil",
      f3_title: "Autenticación Multifator",
      f3_desc: "MFA obligatorio para todas las cuentas",
      f4_title: "Registros de Auditoría",
      f4_desc: "Retención de 7 años de registros de acceso"
    },
    ai: {
      title: "IA Diseñada para Excelencia Clínica",
      f1: {
        title: "Análisis Prosódico",
        desc: "Captura tono, pausas y ritmo del habla"
      },
      f2: {
        title: "IA Confrontativa",
        desc: "Analiza convergencia y divergencia"
      },
      f3: {
        title: "Integración PubMed",
        desc: "Citas automáticas de investigación relevante"
      }
    },
    pricing: {
      title: "Comience Su Prueba Gratuita Hoy",
      cardTitle: "Programa de Acceso Beta",
      cardSub: "50 Transcripciones Gratis • Sin tarjeta de crédito",
      features: ["Cumplimiento total HIPAA", "Grabación de doble canal", "Análisis IA + PubMed", "Generación de notas SOAP/DAP", "Periodo de prueba de 30 días"],
      footer: "¿Tiene un código beta? Lo ingresará durante el registro."
    }
  }
};

const Landing: React.FC<LandingProps> = ({ onNavigate }) => {
  const [lang, setLang] = useState<Lang>('en');
  const t = content[lang];

  return (
    <div className="min-h-screen bg-[#0D1117] flex flex-col relative font-sans text-slate-50 overflow-x-hidden">
      
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[#1DE9B6]/5 rounded-full blur-[120px] pointer-events-none" />
      
      {/* Header */}
      <header className="fixed top-0 w-full z-50 border-b border-slate-800 bg-[#0D1117]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <Logo size="md" />
          
          <div className="flex items-center gap-4 md:gap-6">
            <div className="relative group">
               <button className="flex items-center gap-2 px-3 py-2 rounded text-sm text-slate-300 hover:text-white transition-colors">
                 <Globe className="h-4 w-4" />
                 <span className="uppercase font-medium">{lang}</span>
                 <ChevronDown className="h-3 w-3 opacity-50" />
               </button>
               {/* Language Dropdown */}
               <div className="absolute top-full right-0 mt-2 w-32 bg-[#161B22] border border-[#30363D] rounded-lg shadow-xl py-2 hidden group-hover:block animate-in fade-in slide-in-from-top-2">
                 {(['en', 'pt', 'es'] as Lang[]).map((l) => (
                   <button 
                     key={l}
                     onClick={() => setLang(l)}
                     className={`w-full text-left px-4 py-2 text-sm hover:bg-[#0D1117] hover:text-[#1DE9B6] uppercase ${lang === l ? 'text-[#1DE9B6] font-bold' : 'text-slate-400'}`}
                   >
                     {l}
                   </button>
                 ))}
               </div>
            </div>

            <div className="hidden md:flex gap-4">
               <Button variant="outline" onClick={() => onNavigate(AppView.Login)}>Sign In</Button>
               <Button variant="primary" onClick={() => onNavigate(AppView.Register)}>{t.hero.ctaPrimary}</Button>
            </div>
            {/* Mobile Menu Icon could go here */}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative z-10">
        <div className="max-w-5xl mx-auto text-center flex flex-col items-center">
          <Badge className="mb-8">{t.hero.badge}</Badge>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6 leading-tight">
            {t.hero.headline} <br />
            <span className="text-[#1DE9B6]">{t.hero.headlineHighlight}</span>
          </h1>
          
          <p className="max-w-3xl text-lg md:text-xl text-slate-400 mb-10 leading-relaxed font-light">
            {t.hero.subhead}
          </p>

          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 mb-12 text-sm text-slate-400 font-medium">
            {t.hero.features.map((feat, i) => (
              <div key={i} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#1DE9B6]" />
                <span>{feat}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Button size="lg" className="h-14 px-8 text-lg" onClick={() => onNavigate(AppView.Register)}>
              {t.hero.ctaPrimary} <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg" className="h-14 px-8 text-lg" onClick={() => onNavigate(AppView.Login)}>
              <Play className="mr-2 h-4 w-4" /> {t.hero.ctaSecondary}
            </Button>
          </div>
        </div>
      </section>

      {/* Why Therapists Choose */}
      <section className="py-20 px-6 bg-[#0D1117]">
        <div className="max-w-7xl mx-auto">
           <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-16">{t.why.title}</h2>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             <Card hoverEffect className="p-8 border-[#30363D] bg-[#161B22]">
                <Lock className="h-16 w-16 text-[#1DE9B6] mb-6" />
                <h3 className="text-xl font-bold text-white mb-3">{t.why.c1_title}</h3>
                <p className="text-slate-400 leading-relaxed">{t.why.c1_desc}</p>
             </Card>
             <Card hoverEffect className="p-8 border-[#30363D] bg-[#161B22]">
                <Brain className="h-16 w-16 text-[#1DE9B6] mb-6" />
                <h3 className="text-xl font-bold text-white mb-3">{t.why.c2_title}</h3>
                <p className="text-slate-400 leading-relaxed">{t.why.c2_desc}</p>
             </Card>
             <Card hoverEffect className="p-8 border-[#30363D] bg-[#161B22]">
                <FileText className="h-16 w-16 text-[#1DE9B6] mb-6" />
                <h3 className="text-xl font-bold text-white mb-3">{t.why.c3_title}</h3>
                <p className="text-slate-400 leading-relaxed">{t.why.c3_desc}</p>
             </Card>
           </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#161B22]/50 -skew-y-3 transform origin-left scale-110 z-0" />
        <div className="max-w-7xl mx-auto relative z-10">
           <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-20">{t.how.title}</h2>
           
           <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
             {/* Connector Line (Desktop) */}
             <div className="hidden md:block absolute top-14 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-[#1DE9B6]/10 via-[#1DE9B6] to-[#1DE9B6]/10" />
             
             {[
               { icon: Mic, ...t.how.s1 },
               { icon: Cpu, ...t.how.s2 },
               { icon: Activity, ...t.how.s3 },
               { icon: CheckCircle2, ...t.how.s4 }
             ].map((step, i) => (
               <div key={i} className="flex flex-col items-center text-center relative">
                 <div className="w-28 h-28 rounded-full bg-[#1A1A1A] border-2 border-[#1DE9B6] flex items-center justify-center mb-6 relative z-10 shadow-[0_0_20px_rgba(29,233,182,0.15)] group hover:scale-105 transition-transform duration-300">
                    <span className="absolute -top-3 bg-[#1DE9B6] text-[#0D1117] text-xs font-bold px-2 py-0.5 rounded-full">Step {i+1}</span>
                    <step.icon className="h-12 w-12 text-[#1DE9B6]" />
                 </div>
                 <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                 <p className="text-sm text-slate-400">{step.desc}</p>
               </div>
             ))}
           </div>
        </div>
      </section>

      {/* Clinical Approaches */}
      <section className="py-20 px-6 bg-[#0D1117]">
        <div className="max-w-5xl mx-auto text-center">
           <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{t.approaches.title}</h2>
           <p className="text-slate-400 mb-12">{t.approaches.subtitle}</p>

           <div className="flex flex-wrap justify-center gap-3">
             {['CBT', 'DBT', 'ACT', 'Psychodynamic', 'Neuropsychology', 'Systemic', 'Gestalt', 'EMDR', 'Interpersonal', 'Schema Therapy', 'Humanistic', 'MBCT', 'Brief Therapy', 'Integrative'].map(tag => (
               <span key={tag} className="px-6 py-3 rounded-full border border-[#1DE9B6] text-white text-sm font-medium hover:bg-[#1DE9B6] hover:text-[#0D1117] transition-colors cursor-default">
                 {tag}
               </span>
             ))}
           </div>
        </div>
      </section>

      {/* Security */}
      <section className="py-20 px-6 bg-[#161B22] border-y border-[#30363D]">
        <div className="max-w-7xl mx-auto">
           <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-16">{t.security.title}</h2>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
             <div className="flex gap-6 items-start">
                <div className="p-4 rounded-xl bg-[#0D1117] border border-[#30363D] shrink-0">
                  <Lock className="h-8 w-8 text-[#1DE9B6]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">{t.security.f1_title}</h3>
                  <p className="text-slate-400">{t.security.f1_desc}</p>
                </div>
             </div>
             <div className="flex gap-6 items-start">
                <div className="p-4 rounded-xl bg-[#0D1117] border border-[#30363D] shrink-0">
                  <ShieldCheck className="h-8 w-8 text-[#1DE9B6]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">{t.security.f2_title}</h3>
                  <p className="text-slate-400">{t.security.f2_desc}</p>
                </div>
             </div>
             <div className="flex gap-6 items-start">
                <div className="p-4 rounded-xl bg-[#0D1117] border border-[#30363D] shrink-0">
                  <Key className="h-8 w-8 text-[#1DE9B6]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">{t.security.f3_title}</h3>
                  <p className="text-slate-400">{t.security.f3_desc}</p>
                </div>
             </div>
             <div className="flex gap-6 items-start">
                <div className="p-4 rounded-xl bg-[#0D1117] border border-[#30363D] shrink-0">
                  <FileClock className="h-8 w-8 text-[#1DE9B6]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">{t.security.f4_title}</h3>
                  <p className="text-slate-400">{t.security.f4_desc}</p>
                </div>
             </div>
           </div>
        </div>
      </section>

      {/* AI Features */}
      <section className="py-20 px-6 bg-[#0D1117]">
         <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-16">{t.ai.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {[
                 { icon: AudioWaveform, ...t.ai.f1 },
                 { icon: GitCompare, ...t.ai.f2 },
                 { icon: BookOpen, ...t.ai.f3 }
               ].map((feat, i) => (
                 <div key={i} className="flex items-start gap-4 p-6 rounded-lg bg-[#161B22]/50 border border-[#30363D] hover:border-[#1DE9B6]/30 transition-colors">
                    <feat.icon className="h-8 w-8 text-[#1DE9B6] shrink-0" />
                    <div>
                       <h3 className="font-bold text-white mb-1">{feat.title}</h3>
                       <p className="text-sm text-slate-400">{feat.desc}</p>
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* Pricing / CTA */}
      <section className="py-24 px-6 relative">
         <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-12">{t.pricing.title}</h2>
            
            <div className="relative rounded-2xl p-1 bg-gradient-to-b from-[#1DE9B6] to-[#1DE9B6]/10 shadow-[0_0_50px_rgba(29,233,182,0.15)]">
               <div className="bg-[#0D1117] rounded-xl p-8 md:p-12 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12">
                     <Gift className="h-40 w-40 text-[#1DE9B6]" />
                  </div>
                  
                  <div className="relative z-10">
                    <h3 className="text-3xl font-bold text-white mb-2">{t.pricing.cardTitle}</h3>
                    <p className="text-xl text-[#1DE9B6] font-medium mb-8">{t.pricing.cardSub}</p>
                    
                    <ul className="max-w-lg mx-auto space-y-3 mb-10 text-left">
                       {t.pricing.features.map((item, i) => (
                         <li key={i} className="flex items-center text-slate-300">
                           <CheckCircle2 className="h-5 w-5 text-[#1DE9B6] mr-3 shrink-0" />
                           {item}
                         </li>
                       ))}
                    </ul>

                    <Button size="lg" className="w-full md:w-auto px-12 h-14 text-lg" onClick={() => onNavigate(AppView.Register)}>
                      {t.hero.ctaPrimary} <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                    <p className="mt-6 text-sm text-slate-500">{t.pricing.footer}</p>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#05070a] border-t border-[#30363D] pt-16 pb-8 px-6 text-slate-500 text-sm">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-12 mb-12">
            <div>
               <Logo size="sm" className="mb-4" />
               <p className="max-w-xs">
                 Advanced clinical intelligence for modern therapy. HIPAA compliant and secure.
               </p>
            </div>
            <div className="flex gap-12">
               <div className="space-y-3">
                 <h4 className="text-white font-bold uppercase tracking-wider text-xs">Product</h4>
                 <a href="#" className="block hover:text-[#1DE9B6]">Features</a>
                 <a href="#" className="block hover:text-[#1DE9B6]">Pricing</a>
                 <a href="#" className="block hover:text-[#1DE9B6]">Security</a>
               </div>
               <div className="space-y-3">
                 <h4 className="text-white font-bold uppercase tracking-wider text-xs">Legal</h4>
                 <a href="#" className="block hover:text-[#1DE9B6]">Privacy Policy</a>
                 <a href="#" className="block hover:text-[#1DE9B6]">Terms of Service</a>
                 <a href="#" className="block hover:text-[#1DE9B6]">HIPAA BAA</a>
               </div>
               <div className="space-y-3">
                 <h4 className="text-white font-bold uppercase tracking-wider text-xs">Contact</h4>
                 <a href="#" className="block hover:text-[#1DE9B6]">Support</a>
                 <a href="#" className="block hover:text-[#1DE9B6]">Sales</a>
                 <a href="#" className="block hover:text-[#1DE9B6]">Demo</a>
               </div>
            </div>
         </div>
         <div className="max-w-7xl mx-auto pt-8 border-t border-[#161B22] flex flex-col md:flex-row justify-between items-center gap-4">
            <p>Luria Mind © 2025. All rights reserved.</p>
            <p>Made with care for mental health professionals.</p>
         </div>
      </footer>
    </div>
  );
};

export default Landing;