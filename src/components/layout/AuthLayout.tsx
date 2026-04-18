import React from 'react';
import { Shield, CheckCircle2 } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen flex">
      {/* LEFT PANEL */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-[#0F2557] to-[#1B4FD8] flex-col justify-center px-12 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2">
            <Shield className="w-8 h-8 text-white" />
            <span className="text-white text-2xl font-bold">RegShield</span>
            <span className="text-[#0EA5E9] text-2xl font-bold">AI</span>
          </div>
          
          <h1 className="text-white text-4xl font-bold mt-12 leading-tight">
            Compliance operations infrastructure for UK fintech teams
          </h1>
          
          <p className="text-slate-300 text-lg mt-4 leading-relaxed max-w-sm">
            Manage cases, score risk, store evidence and generate audit-ready records — all in one FCA-aligned platform.
          </p>
          
          <div className="mt-10 flex flex-col gap-4">
            {[
              "Structured case management with full audit trail",
              "Transparent risk scoring — no black boxes",
              "Evidence vault built for regulatory inspection"
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#0EA5E9] shrink-0" />
                <span className="text-slate-200 text-sm">{feature}</span>
              </div>
            ))}
          </div>

          <div className="absolute bottom-12 left-12 flex gap-4 text-slate-400 text-xs mt-20">
            <span>🇬🇧 UK Data Residency</span>
            <span>·</span>
            <span>GDPR Compliant</span>
            <span>·</span>
            <span>FCA-Aligned</span>
          </div>
        </div>

        {/* Decorative background shapes */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-full lg:w-1/2 bg-[#F8FAFC] flex flex-col justify-center px-6 lg:px-12 py-12">
        <div className="max-w-md w-full mx-auto">
          {/* Mobile Logo */}
          <div className="flex lg:hidden items-center justify-center gap-2 mb-8">
            <Shield className="w-6 h-6 text-[#1B4FD8]" />
            <span className="text-[#0F2557] text-xl font-bold">RegShield</span>
            <span className="text-[#0EA5E9] text-xl font-bold">AI</span>
          </div>

          <h2 className="text-2xl font-bold text-[#0F2557] text-center">{title}</h2>
          <p className="text-slate-500 text-sm text-center mt-1 mb-8">{subtitle}</p>
          
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
