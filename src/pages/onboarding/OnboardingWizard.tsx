import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Shield, Check, Briefcase, FileText, Zap, CreditCard, Wallet, 
  Building2, CircleDollarSign, FolderPlus, ArrowRight, Loader2, CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { ROUTES } from '../../constants';
import { cn } from '../../components/common/Button';
import axiosInstance from '../../lib/axios';
import { Input } from '../../components/common/Input';
import { FormField } from '../../components/common/FormField';

interface OnboardingData {
  displayName: string;
  orgType: string;
  regulatoryFramework: string;
  complianceTeamSize: string;
  createFirstCase: boolean;
  inviteEmail: string;
  caseType?: string;
  caseCustomerName?: string;
  caseRiskLevel?: string;
}

const step2Schema = z.object({
  displayName: z.string().min(2, "Please enter your organisation name"),
  orgType: z.string().min(1, "Please select an organisation type"),
  regulatoryFramework: z.string().min(1, "Please select a framework"),
  complianceTeamSize: z.string().min(1, "Please select a team size"),
});

type Step2Values = z.infer<typeof step2Schema>;

export default function OnboardingWizard() {
  const navigate = useNavigate();
  const { user, organisation, setUser } = useAuthStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<OnboardingData>({
    displayName: organisation?.name || '',
    orgType: '',
    regulatoryFramework: '',
    complianceTeamSize: '',
    createFirstCase: false,
    inviteEmail: '',
    caseType: 'ONBOARDING',
    caseCustomerName: '',
    caseRiskLevel: 'LOW',
  });

  useEffect(() => {
    document.title = 'Set Up Your Workspace — RegShield AI';
  }, []);

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, 4));
  const handleBack = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4 font-sans">
      <div className="max-w-2xl w-full mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12">
          
          {/* Header */}
          <div className="flex items-center gap-2 mb-8">
            <Shield className="w-8 h-8 text-[#1B4FD8]" />
            <span className="text-[#0F2557] text-2xl font-bold">RegShield</span>
            <span className="text-[#0EA5E9] text-2xl font-bold">AI</span>
          </div>

          {/* Progress Bar */}
          {currentStep < 4 && (
            <div className="mb-10">
              <div className="flex justify-between items-center relative">
                <div className="absolute top-4 left-0 w-full h-0.5 bg-slate-200 -z-10"></div>
                <div 
                  className="absolute top-4 left-0 h-0.5 bg-[#1B4FD8] transition-all duration-300 -z-10"
                  style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
                ></div>

                {[1, 2, 3, 4].map((step) => {
                  const isActive = step === currentStep;
                  const isCompleted = step < currentStep;
                  return (
                    <div key={step} className="flex flex-col items-center gap-2 bg-white px-2">
                       <div className={cn(
                         "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2 transition-colors",
                         isActive ? "bg-[#1B4FD8] border-[#1B4FD8] text-white" : 
                         isCompleted ? "bg-[#1B4FD8] border-[#1B4FD8] text-white" : 
                         "bg-white border-slate-300 text-slate-400"
                       )}>
                         {isCompleted ? <Check className="w-4 h-4" /> : step}
                       </div>
                       <span className="text-xs text-slate-500 hidden sm:block font-medium">Step {step}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Steps Content */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {currentStep === 1 && <Step1 handleNext={handleNext} user={user} planName={organisation?.subscriptionPlan || 'Standard'} />}
            {currentStep === 2 && <Step2 formData={formData} setFormData={setFormData} handleNext={handleNext} handleBack={handleBack} />}
            {currentStep === 3 && <Step3 formData={formData} setFormData={setFormData} handleNext={handleNext} handleBack={handleBack} />}
            {currentStep === 4 && <Step4 formData={formData} setFormData={setFormData} /> }
          </div>

        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// STEP 1: WELCOME
// ──────────────────────────────────────────────────────────
function Step1({ handleNext, user, planName }: any) {
  return (
    <div className="flex flex-col items-center text-center">
      {/* Animated Shield Shield SVG */}
      <div className="relative w-24 h-24 mb-6 mt-4">
        <svg viewBox="0 0 100 100" className="w-full h-full fill-none animate-[pulse_2s_infinite]">
          <defs>
            <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0F2557" />
              <stop offset="100%" stopColor="#1B4FD8" />
            </linearGradient>
          </defs>
          <path d="M50 5 L90 20 V45 C90 70 50 95 50 95 C50 95 10 70 10 45 V20 L50 5 Z" fill="url(#shieldGrad)" />
          <path d="M40 50 L48 58 L65 38" stroke="white" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <h1 className="text-3xl font-bold text-[#0F2557]">Welcome to RegShield AI</h1>
      <p className="text-slate-600 text-lg mt-2">
        Hello, {user?.firstName?.split(' ')[0] || user?.fullName?.split(' ')[0] || 'there'} — your compliance workspace is ready.
      </p>

      <div className="rounded-full bg-blue-50 text-[#1B4FD8] border border-blue-200 text-sm font-medium px-4 py-1 mt-4">
        You're on the {planName.charAt(0).toUpperCase() + planName.slice(1).toLowerCase()} plan — 14-day free trial
      </div>

      <p className="text-slate-600 text-base mt-6 leading-relaxed max-w-lg mx-auto">
        We'll walk you through a quick setup in 4 steps. It takes less than 2 minutes and ensures your workspace is configured for your compliance team.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 w-full max-w-lg">
        {[
          { icon: <Briefcase className="w-5 h-5 text-[#1B4FD8]" />, title: "Case Management", desc: "Investigations, structured" },
          { icon: <Shield className="w-5 h-5 text-[#1B4FD8]" />, title: "Risk Scoring", desc: "Transparent, explainable" },
          { icon: <FileText className="w-5 h-5 text-[#1B4FD8]" />, title: "Audit Trail", desc: "Every action logged" }
        ].map((item, i) => (
          <div key={i} className="bg-slate-50 rounded-xl p-4 text-center flex flex-col items-center gap-2">
            <div className="bg-white p-2 rounded-full shadow-sm">{item.icon}</div>
            <div className="font-semibold text-slate-800 text-sm mt-1">{item.title}</div>
            <div className="text-xs text-slate-500">{item.desc}</div>
          </div>
        ))}
      </div>

      <button
        onClick={handleNext}
        className="bg-[#1B4FD8] hover:bg-[#0F2557] transition-colors text-white text-lg font-semibold px-10 py-3 rounded-xl mt-10"
      >
        Get Started &rarr;
      </button>
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// STEP 2: ORG SETTINGS
// ──────────────────────────────────────────────────────────
function Step2({ formData, setFormData, handleNext, handleBack }: any) {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<Step2Values>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      displayName: formData.displayName,
      orgType: formData.orgType,
      regulatoryFramework: formData.regulatoryFramework,
      complianceTeamSize: formData.complianceTeamSize,
    }
  });

  const orgTypeValue = watch('orgType');
  const teamSizeValue = watch('complianceTeamSize');

  const orgTypes = [
    { id: 'fintech', label: 'Fintech Startup', icon: <Zap className="w-5 h-5" /> },
    { id: 'pi', label: 'Payment Institution', icon: <CreditCard className="w-5 h-5" /> },
    { id: 'emi', label: 'E-Money Institution', icon: <Wallet className="w-5 h-5" /> },
    { id: 'neobank', label: 'Neobank', icon: <Building2 className="w-5 h-5" /> },
    { id: 'crypto', label: 'Crypto / Virtual Asset', icon: <CircleDollarSign className="w-5 h-5" /> },
    { id: 'other', label: 'Other Regulated Firm', icon: <Shield className="w-5 h-5" /> },
  ];

  const onSubmit = (data: Step2Values) => {
    setFormData((prev: any) => ({ ...prev, ...data }));
    handleNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#0F2557]">Tell us about your organisation</h2>
        <p className="text-slate-600 mt-1">This helps us configure your workspace for your regulatory environment.</p>
      </div>

      <FormField label="Organisation display name" error={errors.displayName?.message} hint="This is how your organisation appears throughout the platform" required>
        <Input 
          {...register('displayName')} 
          placeholder="Acme Ltd"
          error={!!errors.displayName} 
        />
      </FormField>

      <div className="space-y-2 pb-1">
        <label className="text-sm font-medium text-slate-700">Organisation type <span className="text-red-500">*</span></label>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {orgTypes.map(type => (
            <div
              key={type.id}
              onClick={() => setValue('orgType', type.id, { shouldValidate: true })}
              className={cn(
                "border-2 rounded-xl p-4 cursor-pointer text-center flex flex-col items-center gap-2 transition-all",
                orgTypeValue === type.id ? "border-[#1B4FD8] bg-blue-50 text-[#1B4FD8]" : "border-slate-200 bg-white hover:border-slate-300 text-slate-700"
              )}
            >
              {type.icon}
              <span className="font-semibold text-sm">{type.label}</span>
            </div>
          ))}
        </div>
        {errors.orgType && <p className="text-red-600 text-sm mt-1 flex items-center gap-1.5"><AlertCircle className="w-4 h-4"/>{errors.orgType.message}</p>}
      </div>

      <FormField label="Primary regulatory framework" error={errors.regulatoryFramework?.message} required>
        <div className="relative">
          <select
            {...register('regulatoryFramework')}
            className={cn(
              "appearance-none w-full px-3 py-2.5 border rounded-lg text-sm bg-white outline-none cursor-pointer",
              errors.regulatoryFramework ? "border-red-400 ring-2 ring-red-400/10" : "border-slate-300 focus:border-[#1B4FD8] focus:ring-2 focus:ring-[#1B4FD8]/10"
            )}
          >
            <option value="" disabled>Select a framework</option>
            <option value="fca_aml">FCA — Anti-Money Laundering</option>
            <option value="fca_psr">FCA — Payment Services Regulations</option>
            <option value="fca_emr">FCA — Electronic Money Regulations</option>
            <option value="fca_crypto">FCA — Cryptoasset Registration</option>
            <option value="fca_cc">FCA — Consumer Credit</option>
            <option value="fca_multi">FCA — Multiple frameworks</option>
            <option value="other">Other UK regulatory framework</option>
          </select>
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>
      </FormField>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Compliance team size <span className="text-red-500">*</span></label>
        <div className="flex flex-wrap gap-3">
          {['Just me', '2–5', '6–10', '10+'].map(size => (
            <button
              key={size}
              type="button"
              onClick={() => setValue('complianceTeamSize', size, { shouldValidate: true })}
              className={cn(
                "px-5 py-2.5 rounded-lg border font-medium text-sm transition-colors",
                teamSizeValue === size ? "bg-[#1B4FD8] border-[#1B4FD8] text-white" : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
              )}
            >
              {size}
            </button>
          ))}
        </div>
        {errors.complianceTeamSize && <p className="text-red-600 text-sm mt-1 flex items-center gap-1.5"><AlertCircle className="w-4 h-4"/>{errors.complianceTeamSize.message}</p>}
      </div>

      <div className="flex items-center gap-4 pt-6 border-t border-slate-100">
        <button type="button" onClick={handleBack} className="text-slate-600 font-medium hover:text-slate-900 px-4 py-2">&larr; Back</button>
        <button type="submit" className="bg-[#1B4FD8] hover:bg-[#0F2557] text-white font-semibold px-8 py-2.5 rounded-lg ml-auto transition-colors">
          Continue &rarr;
        </button>
      </div>
    </form>
  );
}

// ──────────────────────────────────────────────────────────
// STEP 3: CREATE FIRST CASE
// ──────────────────────────────────────────────────────────
function Step3({ formData, setFormData, handleNext, handleBack }: any) {
  const [mode, setMode] = useState<'create' | 'skip'>(formData.createFirstCase ? 'create' : 'skip');

  const onContinue = () => {
    setFormData((prev: any) => ({ ...prev, createFirstCase: mode === 'create' }));
    handleNext();
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-[#0F2557]">Would you like to create your first case?</h2>
        <p className="text-slate-600 mt-1">You can skip this and create cases from your dashboard at any time.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Card A */}
        <div 
          onClick={() => setMode('create')}
          className={cn(
            "relative border-2 rounded-xl p-6 cursor-pointer transition-colors flex flex-col gap-3",
            mode === 'create' ? "border-[#1B4FD8] bg-blue-50" : "border-slate-200 bg-white hover:border-slate-300"
          )}
        >
          <div className="absolute -top-3 right-4 bg-teal-100 text-teal-800 text-[10px] uppercase font-bold px-3 py-1 rounded-full border border-teal-200">
            Recommended
          </div>
          <FolderPlus className={cn("w-8 h-8", mode === 'create' ? "text-[#1B4FD8]" : "text-slate-400")} />
          <div>
            <h3 className="font-bold text-slate-800">Set up your first case</h3>
            <p className="text-sm text-slate-500 mt-1">Create a sample compliance case to explore the platform. Takes 30 seconds.</p>
          </div>
        </div>

        {/* Card B */}
        <div 
          onClick={() => setMode('skip')}
          className={cn(
            "border-2 rounded-xl p-6 cursor-pointer transition-colors flex flex-col gap-3",
            mode === 'skip' ? "border-slate-400 bg-slate-50" : "border-slate-200 bg-white hover:border-slate-300"
          )}
        >
          <ArrowRight className={cn("w-8 h-8", mode === 'skip' ? "text-slate-700" : "text-slate-400")} />
          <div>
            <h3 className="font-bold text-slate-800">I'll do this later</h3>
            <p className="text-sm text-slate-500 mt-1">Go straight to your dashboard and create cases when you're ready.</p>
          </div>
        </div>
      </div>

      {mode === 'create' && (
        <div className="bg-white border rounded-xl p-6 space-y-4 animate-in fade-in slide-in-from-top-4">
          <h4 className="font-semibold text-slate-800 border-b pb-2">Case Details (Optional)</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Case Type">
              <select 
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:border-[#1B4FD8] focus:ring-1 focus:ring-[#1B4FD8]"
                value={formData.caseType}
                onChange={(e) => setFormData((p: any) => ({ ...p, caseType: e.target.value }))}
              >
                <option value="ONBOARDING">Onboarding Review</option>
                <option value="KYB_REVIEW">KYB Review</option>
                <option value="TRANSACTION_MONITORING">TM Alert</option>
                <option value="ENHANCED_DUE_DILIGENCE">EDD</option>
              </select>
            </FormField>
            <FormField label="Customer Name">
              <Input 
                placeholder="e.g. John Smith or Acme Ltd" 
                value={formData.caseCustomerName}
                onChange={(e) => setFormData((p: any) => ({ ...p, caseCustomerName: e.target.value }))}
              />
            </FormField>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Internal Risk Level</label>
            <div className="flex flex-wrap gap-2">
              {['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].map(level => {
                const colors: Record<string, string> = {
                  LOW: 'bg-green-100 text-green-800 border-green-200',
                  MEDIUM: 'bg-amber-100 text-amber-800 border-amber-200',
                  HIGH: 'bg-orange-100 text-orange-800 border-orange-200',
                  CRITICAL: 'bg-red-100 text-red-800 border-red-200',
                };
                return (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setFormData((p: any) => ({ ...p, caseRiskLevel: level }))}
                    className={cn(
                      "px-4 py-1.5 rounded-full border text-xs font-bold transition-all",
                      formData.caseRiskLevel === level ? colors[level] : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
                    )}
                  >
                    {level}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center gap-4 pt-6 border-t border-slate-100">
        <button type="button" onClick={handleBack} className="text-slate-600 font-medium hover:text-slate-900 px-4 py-2">&larr; Back</button>
        <button type="button" onClick={onContinue} className="bg-[#1B4FD8] hover:bg-[#0F2557] text-white font-semibold px-8 py-2.5 rounded-lg ml-auto transition-colors">
          Continue &rarr;
        </button>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// STEP 4: YOU'RE READY!
// ──────────────────────────────────────────────────────────
function Step4({ formData, setFormData }: any) {
  const navigate = useNavigate();
  const { setUser, user } = useAuthStore();
  const [status, setStatus] = useState<'loading'|'success'|'error'>('loading');
  const [inviteStatus, setInviteStatus] = useState<'idle'|'sending'|'success'|'error'>('idle');

  const executeSetup = async () => {
    setStatus('loading');
    try {
      await axiosInstance.post('/onboarding/complete', formData);
      setUser({ ...user, onboardingComplete: true } as any);
      setStatus('success');
      triggerConfetti();
    } catch (error) {
      setStatus('error');
    }
  };

  useEffect(() => {
    executeSetup();
    // eslint-disable-next-line
  }, []);

  const triggerConfetti = () => {
    // Pure CSS/JS Confetti Effect
    const container = document.getElementById('confetti-container');
    if (!container) return;
    
    const colors = ['#1B4FD8', '#0EA5E9', '#0F2557', '#e2e8f0', '#3b82f6'];
    
    for (let i = 0; i < 30; i++) {
      const confeti = document.createElement('div');
      confeti.style.position = 'absolute';
      confeti.style.width = '10px';
      confeti.style.height = '10px';
      confeti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confeti.style.top = '0px';
      confeti.style.left = '50%';
      confeti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
      
      const xOffset = (Math.random() - 0.5) * 400; // -200 to 200
      const yOffset = Math.random() * 300 + 50; // 50 to 350
      
      // We animate via Web Animations API for cleanliness vs keyframe style insertion
      confeti.animate([
        { transform: 'translate3d(0,0,0) rotate(0)', opacity: 1 },
        { transform: `translate3d(${xOffset}px, ${yOffset}px, 0) rotate(${Math.random() * 360}deg)`, opacity: 0 }
      ], {
        duration: 1200 + Math.random() * 500,
        easing: 'cubic-bezier(.37,0,.63,1)',
        fill: 'forwards'
      });
      
      container.appendChild(confeti);
      setTimeout(() => confeti.remove(), 2000);
    }
  }

  const handleInvite = async () => {
    if (!formData.inviteEmail) return;
    setInviteStatus('sending');
    try {
      await axiosInstance.post('/users/invite', { email: formData.inviteEmail, role: 'analyst', fullName: formData.inviteEmail.split('@')[0] });
      setInviteStatus('success');
      setFormData((p: any) => ({ ...p, inviteEmail: '' }));
    } catch (e) {
      setInviteStatus('error');
    }
  }

  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Loader2 className="w-12 h-12 text-[#1B4FD8] animate-spin mb-6" />
        <h2 className="text-xl font-bold text-[#0F2557]">Setting up your workspace...</h2>
        <p className="text-slate-500 mt-2">Just a moment while we configure everything.</p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mb-6" />
        <h2 className="text-2xl font-bold text-slate-800">Something went wrong</h2>
        <p className="text-slate-600 mt-2 mb-8">We encountered an error while configuring your workspace. Please try again.</p>
        <button onClick={executeSetup} className="bg-[#1B4FD8] text-white px-8 py-3 rounded-xl font-bold">
          Retry Setup
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center relative" id="confetti-container">
      <CheckCircle className="w-16 h-16 text-green-500 mb-4 animate-in zoom-in duration-500" />
      <h2 className="text-3xl font-bold text-[#0F2557]">Your workspace is ready!</h2>
      
      <div className="bg-slate-50 rounded-xl p-6 mt-6 w-full text-left space-y-3 shadow-inner">
        <div className="flex items-center gap-2 text-slate-700 font-medium"><Check className="w-5 h-5 text-green-500" /> Organisation: {formData.displayName}</div>
        <div className="flex items-center gap-2 text-slate-700 font-medium"><Check className="w-5 h-5 text-green-500" /> Type: {formData.orgType.toUpperCase()}</div>
        <div className="flex items-center gap-2 text-slate-700 font-medium"><Check className="w-5 h-5 text-green-500" /> Framework: {formData.regulatoryFramework.replace('fca_', 'FCA ')}</div>
        <div className="flex items-center gap-2 text-slate-700 font-medium"><Check className="w-5 h-5 text-green-500" /> 14-day free trial active</div>
        {formData.createFirstCase && (
          <div className="flex items-center gap-2 text-slate-700 font-medium"><Check className="w-5 h-5 text-green-500" /> First case drafted: RS-2024-0001</div>
        )}
      </div>

      <div className="w-full mt-8 border-t border-slate-100 pt-6">
        <label className="text-sm font-bold text-slate-700 mb-2 block">Invite a team member (optional)</label>
        <div className="flex gap-2">
          <Input 
            placeholder="colleague@company.com" 
            value={formData.inviteEmail} 
            onChange={e => setFormData((p: any) => ({ ...p, inviteEmail: e.target.value }))}
            disabled={inviteStatus === 'sending'}
          />
          <button 
            disabled={inviteStatus === 'sending'}
            onClick={handleInvite}
            className="bg-slate-900 text-white px-4 py-2 flex-shrink-0 rounded-lg text-sm font-semibold hover:bg-slate-800 disabled:opacity-50"
          >
            {inviteStatus === 'sending' ? 'Sending...' : 'Send invite'}
          </button>
        </div>
        {inviteStatus === 'success' && <p className="text-green-600 text-xs mt-2">Invitation sent successfully.</p>}
        {inviteStatus === 'error' && <p className="text-red-600 text-xs mt-2">Failed to send invitation. You can try again from the dashboard.</p>}
      </div>

      <button 
        onClick={() => navigate(ROUTES.PROTECTED.DASHBOARD)} 
        className="w-full bg-[#1B4FD8] hover:bg-[#0F2557] text-white text-lg rounded-xl px-12 py-4 font-bold mt-10 shadow-lg shadow-blue-500/20 transition-all"
      >
        Go to Dashboard &rarr;
      </button>
    </div>
  );
}
