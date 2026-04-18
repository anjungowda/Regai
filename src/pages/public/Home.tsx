import React from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckCircle, 
  LayoutGrid, 
  Link2Off, 
  Clock, 
  Briefcase, 
  ShieldAlert, 
  Lock, 
  FileText, 
  Quote 
} from 'lucide-react';
import PublicLayout from '../../components/layout/PublicLayout';
import { ROUTES } from '../../constants';

const Home: React.FC = () => {
  const scrollToHowItWorks = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    e.preventDefault();
    const element = document.getElementById('how-it-works');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col w-full">
      {/* SECTION 1 — HERO */}
      <section className="w-full bg-gradient-to-r from-[#0F2557] to-[#1B4FD8] min-h-[90vh] flex items-center relative overflow-hidden px-4 sm:px-6 lg:px-8 py-20 lg:py-0">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* LEFT COLUMN */}
          <div className="lg:col-span-7 flex flex-col items-start z-10">
            <div className="inline-flex items-center rounded-full bg-white/10 border border-white/20 px-3 py-1 mb-6">
              <span className="text-white text-xs font-medium tracking-wide">🇬🇧 Built for UK Fintech — FCA-Aligned</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-4">
              <span className="text-white block">Compliance Operations</span>
              <span className="text-[#0EA5E9] block">for Fintech Startups</span>
            </h1>
            
            <p className="text-xl text-slate-200 mt-4 max-w-lg leading-relaxed">
              Replace spreadsheets and disconnected tools with a structured compliance workflow platform. Built for AML teams that need to do more with less.
            </p>
            
            <div className="mt-8 flex gap-4 flex-wrap">
              <Link 
                to={ROUTES.PUBLIC.DEMO} 
                className="bg-white text-[#1B4FD8] font-semibold px-6 py-3 rounded-lg hover:bg-slate-100 shadow-lg transition-colors inline-block"
              >
                Book a Free Demo
              </Link>
              <button 
                onClick={scrollToHowItWorks} 
                className="border-2 border-white/40 text-white font-medium px-6 py-3 rounded-lg hover:bg-white/10 transition-colors"
              >
                See How It Works
              </button>
            </div>
            
            <div className="mt-8 pt-6 border-t border-white/10 flex gap-6 flex-wrap w-full max-w-lg">
              {['FCA-aligned workflows', 'GDPR compliant', 'UK data residency'].map((badge) => (
                <div key={badge} className="flex items-center gap-1.5 text-slate-300 text-sm font-medium">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>{badge}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN (Dashboard Mockup) */}
          <div className="hidden lg:block lg:col-span-5 relative z-10">
            <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full transform scale-150"></div>
            <div className="relative transform rotate-2 bg-white rounded-2xl shadow-2xl p-6 border border-slate-100 max-w-md mx-auto w-full transition-transform hover:rotate-0 duration-500">
              {/* Dashboard Layout Mockup */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                <div className="h-4 w-24 bg-slate-200 rounded-full"></div>
                <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                  <div className="h-3 w-3 rounded-full bg-slate-300"></div>
                </div>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs text-slate-500 font-medium">Open Cases</span>
                    <span className="text-2xl font-bold text-[#0F2557]">24</span>
                  </div>
                  <div className="w-12 h-1 bg-[#1B4FD8] rounded-full"></div>
                </div>
                
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs text-slate-500 font-medium">High Risk</span>
                    <span className="text-2xl font-bold text-[#0F2557]">7</span>
                  </div>
                  <div className="w-12 h-1 bg-red-500 rounded-full"></div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs text-slate-500 font-medium">SLA Overdue</span>
                    <span className="text-2xl font-bold text-[#0F2557]">3</span>
                  </div>
                  <div className="w-12 h-1 bg-amber-500 rounded-full"></div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Recent Priority</h4>
                <div className="p-3 border border-slate-200 rounded-lg flex items-center gap-3">
                  <div className="w-2 h-12 bg-red-500 rounded-full"></div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-slate-700">RS-2026-0042</span>
                      <span className="text-[10px] font-medium px-2 py-0.5 bg-red-100 text-red-700 rounded flex-shrink-0">High Risk</span>
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-2">
                       <span>EDD</span>
                       <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                       <span className="text-amber-600 font-medium">Due Tomorrow</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 — PROBLEM STATEMENT */}
      <section className="bg-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[#1B4FD8] text-sm font-semibold uppercase tracking-widest block mb-3">The Problem</span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0F2557] mb-4">Sound familiar?</h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              Compliance teams at early-stage fintechs are managing serious regulatory obligations with tools that were never built for the job.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="border border-slate-200 rounded-2xl p-8 hover:shadow-lg transition-shadow bg-white flex flex-col h-full">
              <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-red-50 mb-6">
                <LayoutGrid className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-[#0F2557] mb-3">Cases lost in spreadsheets</h3>
              <p className="text-slate-600 mb-8 flex-grow">
                AML investigations tracked across Excel files, shared drives and email threads. No structure, no audit trail, no accountability.
              </p>
              <div className="mt-auto">
                <span className="inline-block bg-red-50 text-red-700 text-xs font-medium px-3 py-1 rounded-full border border-red-100">
                  High operational risk
                </span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="border border-slate-200 rounded-2xl p-8 hover:shadow-lg transition-shadow bg-white flex flex-col h-full">
              <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-amber-50 mb-6">
                <Link2Off className="w-6 h-6 text-amber-500" />
              </div>
              <h3 className="text-xl font-bold text-[#0F2557] mb-3">Compliance data in five different places</h3>
              <p className="text-slate-600 mb-8 flex-grow">
                Evidence in email, decisions in a Word doc, alerts in a separate tool. When the FCA asks questions, you're scrambling to find the answers.
              </p>
              <div className="mt-auto">
                <span className="inline-block bg-amber-50 text-amber-700 text-xs font-medium px-3 py-1 rounded-full border border-amber-100">
                  Audit readiness risk
                </span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="border border-slate-200 rounded-2xl p-8 hover:shadow-lg transition-shadow bg-white flex flex-col h-full">
              <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-blue-50 mb-6">
                <Clock className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold text-[#0F2557] mb-3">An audit is coming — where's your evidence?</h3>
              <p className="text-slate-600 mb-8 flex-grow">
                Without a structured evidence vault and decision log, demonstrating a robust compliance framework to regulators is a manual nightmare.
              </p>
              <div className="mt-auto">
                <span className="inline-block bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1 rounded-full border border-blue-100">
                  Regulatory exposure
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 — SOLUTION OVERVIEW */}
      <section className="bg-[#F8FAFC] py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[#1B4FD8] text-sm font-semibold uppercase tracking-widest block mb-3">The Solution</span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0F2557] mb-4">
              RegShield AI is the operational layer your compliance team needs
            </h2>
            <p className="text-lg text-slate-600">
              One platform for case management, risk scoring, evidence storage and audit-ready reporting.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 max-w-5xl mx-auto">
            
            <div className="flex gap-6 items-start">
              <div className="w-16 h-16 rounded-2xl bg-[#1B4FD8]/10 flex items-center justify-center flex-shrink-0">
                <Briefcase className="w-8 h-8 text-[#1B4FD8]" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#0F2557] mb-2">Structured Case Management</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-3">
                  Every compliance investigation as a tracked case with SLA deadlines, evidence vault and full audit trail.
                </p>
                <Link to={ROUTES.PUBLIC.FEATURES} className="text-[#1B4FD8] text-sm font-semibold hover:underline flex items-center gap-1">
                  Learn more &rarr;
                </Link>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="w-16 h-16 rounded-2xl bg-[#1B4FD8]/10 flex items-center justify-center flex-shrink-0">
                <ShieldAlert className="w-8 h-8 text-[#1B4FD8]" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#0F2557] mb-2">Transparent Risk Scoring</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-3">
                  Rule-based customer risk scoring with full methodology visibility. No black boxes — every score is explainable to regulators.
                </p>
                <Link to={ROUTES.PUBLIC.FEATURES} className="text-[#1B4FD8] text-sm font-semibold hover:underline flex items-center gap-1">
                  Learn more &rarr;
                </Link>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="w-16 h-16 rounded-2xl bg-[#1B4FD8]/10 flex items-center justify-center flex-shrink-0">
                <Lock className="w-8 h-8 text-[#1B4FD8]" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#0F2557] mb-2">Secure Evidence Vault</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-3">
                  Upload, categorise and verify compliance documents in one secure location. Pre-signed S3 links, version control, access logging.
                </p>
                <Link to={ROUTES.PUBLIC.FEATURES} className="text-[#1B4FD8] text-sm font-semibold hover:underline flex items-center gap-1">
                  Learn more &rarr;
                </Link>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="w-16 h-16 rounded-2xl bg-[#1B4FD8]/10 flex items-center justify-center flex-shrink-0">
                <FileText className="w-8 h-8 text-[#1B4FD8]" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#0F2557] mb-2">Automated Audit Trail</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-3">
                  Every action logged automatically. Case-level and organisation-level audit trails exportable for FCA submissions.
                </p>
                <Link to={ROUTES.PUBLIC.FEATURES} className="text-[#1B4FD8] text-sm font-semibold hover:underline flex items-center gap-1">
                  Learn more &rarr;
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 4 — HOW IT WORKS */}
      <section id="how-it-works" className="bg-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[#1B4FD8] text-sm font-semibold uppercase tracking-widest block mb-3">How It Works</span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0F2557]">
              From alert to audit-ready record in three steps
            </h2>
          </div>

          <div className="relative">
            {/* Desktop connecting line */}
            <div className="hidden md:block absolute top-[60px] left-[15%] right-[15%] border-t-2 border-dashed border-[#1B4FD8]/20 z-0"></div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
              
              <div className="flex flex-col md:items-center md:text-center">
                <div className="text-[#1B4FD8]/20 text-6xl md:text-7xl font-black mb-4 select-none bg-white md:px-4">1</div>
                <h3 className="text-xl font-bold text-[#0F2557] mb-3">Import or create a compliance case</h3>
                <p className="text-slate-600">
                  Manually create a case or import a transaction monitoring alert. Assign to an analyst, set the SLA deadline and open the investigation.
                </p>
              </div>

              <div className="flex flex-col md:items-center md:text-center mt-6 md:mt-0">
                <div className="text-[#1B4FD8]/20 text-6xl md:text-7xl font-black mb-4 select-none bg-white md:px-4">2</div>
                <h3 className="text-xl font-bold text-[#0F2557] mb-3">Investigate, document and score the risk</h3>
                <p className="text-slate-600">
                  Upload evidence, run the risk scoring engine, write investigation notes, assign tasks to team members and track every action automatically.
                </p>
              </div>

              <div className="flex flex-col md:items-center md:text-center mt-6 md:mt-0">
                <div className="text-[#1B4FD8]/20 text-6xl md:text-7xl font-black mb-4 select-none bg-white md:px-4">3</div>
                <h3 className="text-xl font-bold text-[#0F2557] mb-3">Close with a full audit-ready record</h3>
                <p className="text-slate-600">
                  Record the formal decision, capture the due diligence level applied, and close the case. Every action since creation is logged and exportable.
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5 — SOCIAL PROOF / VALIDATION */}
      <section className="bg-gradient-to-r from-[#0F2557] to-[#1B4FD8] py-16 px-4 sm:px-6 lg:px-8 text-center text-white">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <Quote className="w-20 h-20 text-white/20 mb-6" />
          <blockquote className="text-2xl md:text-3xl font-medium leading-relaxed italic mb-4">
            "Manual tracking of cases across multiple systems is still a major issue for compliance teams at growing fintechs."
          </blockquote>
          <p className="text-slate-300 text-sm mb-12">
            — Financial Crime Analyst, UK Fintech
          </p>

          <div className="w-full h-px bg-white/20 mb-12"></div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center w-full">
            <div className="flex flex-col items-center">
              <span className="text-4xl md:text-5xl font-bold text-white mb-2">100%</span>
              <span className="text-slate-300 text-sm max-w-xs">
                of compliance professionals surveyed confirmed workflow tools would significantly improve operations
              </span>
            </div>
            <div className="flex flex-col items-center mt-8 md:mt-0">
              <span className="text-4xl md:text-5xl font-bold text-white mb-2">7 case types</span>
              <span className="text-slate-300 text-sm max-w-xs">
                managed in a single platform — from onboarding to EDD to periodic reviews
              </span>
            </div>
            <div className="flex flex-col items-center mt-8 md:mt-0">
              <span className="text-3xl md:text-4xl font-bold text-white mb-2 leading-tight flex items-center h-[50px] md:h-[60px]">Full audit trail</span>
              <span className="text-slate-300 text-sm max-w-xs block mt-1 md:mt-2">
                on every case, exportable for FCA and internal audit submission
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6 — PRICING PREVIEW */}
      <section className="bg-[#F8FAFC] py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0F2557] mb-4">Simple, transparent pricing</h2>
            <p className="text-lg text-slate-600">
              No long-term contracts. Cancel anytime. 14-day free trial on both plans.
            </p>
          </div>

          <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            
            {/* Standard Plan */}
            <div className="bg-white rounded-2xl p-8 border-2 border-[#1B4FD8] flex flex-col h-full shadow-md relative">
              <h3 className="text-[#0F2557] font-bold text-2xl mb-2">Standard</h3>
              <div className="mb-2">
                <span className="text-5xl font-black text-[#0F2557]">£99</span>
                <span className="text-slate-500 text-lg">/month</span>
              </div>
              <p className="text-slate-500 text-sm mb-6 pb-6 border-b border-slate-200">
                Per organisation · Billed monthly
              </p>
              
              <ul className="space-y-4 mb-8 flex-grow">
                {[
                  'Risk Scoring Engine',
                  'Case Management (50 active cases)',
                  'Evidence Vault (5GB)',
                  'Compliance Template Library',
                  'AI Compliance Chatbot',
                  'Email Support'
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#1B4FD8] flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700 text-sm font-medium">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Link 
                to={ROUTES.PUBLIC.PRICING} 
                className="w-full block text-center bg-[#1B4FD8] text-white rounded-lg py-3 font-semibold hover:bg-[#0F2557] transition-colors mt-auto"
              >
                Start Free Trial
              </Link>
            </div>

            {/* Professional Plan */}
            <div className="bg-[#0F2557] rounded-2xl p-8 flex flex-col h-full shadow-xl relative text-white">
              <div className="absolute top-0 right-8 -translate-y-1/2 bg-[#0EA5E9] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Most Popular
              </div>
              <h3 className="font-bold text-2xl mb-2">Professional</h3>
              <div className="mb-2">
                <span className="text-5xl font-black">£199</span>
                <span className="text-slate-300 text-lg">/month</span>
              </div>
              <p className="text-slate-300 text-sm mb-6 pb-6 border-b border-white/20">
                Per organisation · Billed monthly
              </p>
              
              <ul className="space-y-4 mb-8 flex-grow">
                {[
                  <span key="1"><strong>Everything in Standard</strong>, plus:</span>,
                  'Periodic Review Automation',
                  'Advanced Risk Analytics',
                  'Compliance Reporting Tools',
                  'Audit Preparation Reports',
                  'API Integrations',
                  'Priority Support',
                  'Unlimited cases',
                  '25GB storage'
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#0EA5E9] flex-shrink-0 mt-0.5" />
                    <span className="text-slate-200 text-sm font-medium">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Link 
                to={ROUTES.PUBLIC.PRICING} 
                className="w-full block text-center bg-white text-[#0F2557] rounded-lg py-3 font-semibold hover:bg-slate-100 transition-colors mt-auto"
              >
                Start Free Trial
              </Link>
            </div>
          </div>
          
          <div className="text-center mt-10">
            <Link to={ROUTES.PUBLIC.PRICING} className="text-[#1B4FD8] font-semibold hover:underline inline-flex items-center gap-1">
              View full pricing details &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 7 — FINAL CTA */}
      <section className="bg-[#0F2557] py-20 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to replace your compliance spreadsheets?
          </h2>
          <p className="text-lg text-slate-300 mb-10 max-w-xl mx-auto">
            Join the fintech compliance teams already building structured, audit-ready operations with RegShield AI.
          </p>
          <Link 
            to={ROUTES.PUBLIC.DEMO} 
            className="inline-block bg-white text-[#0F2557] font-bold px-10 py-4 rounded-xl hover:bg-slate-100 shadow-xl transition-transform hover:scale-105 active:scale-95"
          >
            Book a Free Demo
          </Link>
          <div className="mt-8 flex justify-center items-center gap-4 text-slate-400 text-sm flex-wrap">
            <span>No long contracts</span>
            <span className="w-1 h-1 bg-slate-500 rounded-full"></span>
            <span>Cancel anytime</span>
            <span className="w-1 h-1 bg-slate-500 rounded-full"></span>
            <span>Built for fintech compliance teams</span>
            <span className="w-1 h-1 bg-slate-500 rounded-full"></span>
            <span>FCA-aligned</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
