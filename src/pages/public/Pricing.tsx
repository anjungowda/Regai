import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Minus, ChevronDown, ChevronUp, Lock, RefreshCw, CreditCard, Crosshair, MapPin } from 'lucide-react';
import MetaTags from '../../components/common/MetaTags';
import { ROUTES } from '../../constants';

const Pricing: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    { q: "Can I cancel anytime?", a: "Yes, cancel anytime with no penalty. Your access continues until the end of the billing period." },
    { q: "Is there a free trial?", a: "Yes, both plans include a 14-day free trial. No credit card required to start." },
    { q: "Do you offer refunds?", a: "Yes, we offer a full refund within 14 days of your first payment if you are not satisfied." },
    { q: "What happens to my data if I cancel?", a: "Your data is retained for 30 days after cancellation, then securely deleted in accordance with GDPR." },
    { q: "Can I upgrade or downgrade my plan?", a: "Yes, you can change your plan at any time from the billing section of your admin panel." },
    { q: "How many users can I have?", a: "Both plans support unlimited users within your organisation. User roles control access permissions." },
    { q: "Is RegShield AI GDPR compliant?", a: "Yes. RegShield AI is built for UK-regulated firms. All data is stored in the UK and processed in accordance with UK GDPR." },
    { q: "Do you offer custom enterprise pricing?", a: "Contact us at info@regshield.ai to discuss custom pricing for larger teams or multi-entity organisations." },
  ];

  const comparisonFeatures = [
    { name: 'Compliance Dashboard', std: true, pro: true },
    { name: 'Case Management', std: 'Up to 50 active', pro: 'Unlimited' },
    { name: 'Evidence Vault Storage', std: '5GB', pro: '25GB' },
    { name: 'Customer Risk Scoring Engine', std: true, pro: true },
    { name: 'Risk Score PDF Export', std: true, pro: true },
    { name: 'Compliance Template Library', std: '8 templates', pro: 'All templates' },
    { name: 'AI Compliance Chatbot', std: true, pro: true },
    { name: 'Due Diligence Recommendations', std: true, pro: true },
    { name: 'Audit Trail', std: 'Case-level only', pro: 'Full platform' },
    { name: 'Email Support', std: '1 business day', pro: 'Priority (4 hours)' },
    { name: 'Periodic Review Automation', std: false, pro: true },
    { name: 'Advanced Risk Analytics', std: false, pro: true },
    { name: 'Analyst Performance Reports', std: false, pro: true },
    { name: 'Audit Preparation Reports', std: false, pro: true },
    { name: 'Alert Volume Reports', std: false, pro: true },
    { name: 'API Integrations', std: false, pro: true },
    { name: 'Custom Compliance Workflows', std: false, pro: true },
    { name: 'Workflow Approval Configuration', std: false, pro: true },
    { name: 'Custom template upload', std: false, pro: true },
    { name: 'Bulk CSV alert import', std: false, pro: true }
  ];

  return (
    <div className="flex flex-col w-full font-interface">
      <MetaTags 
        title="Pricing" 
        description="Simple pricing for UK compliance teams. No long-term contracts. 14-day free trial." 
      />

      {/* Hero Section */}
      <section className="bg-[#F8FAFC] py-16 px-4 text-center">
        <div className="max-w-4xl mx-auto animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-bold text-[#0F2557] mb-6">
            Simple pricing for compliance teams
          </h1>
          <p className="text-lg md:text-xl text-slate-600 leading-relaxed">
            14-day free trial on both plans. No long-term contracts. Cancel anytime.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-stretch">
          
          {/* Standard Plan */}
          <div className="bg-white rounded-2xl p-8 lg:p-10 border-2 border-[#1B4FD8] flex flex-col h-full shadow-lg relative">
            <h3 className="text-[#0F2557] font-bold text-3xl mb-2">Standard</h3>
            <div className="mb-2">
              <span className="text-5xl lg:text-6xl font-black text-[#0F2557]">£99</span>
              <span className="text-slate-500 text-xl font-medium">/month</span>
            </div>
            <p className="text-slate-500 text-sm mb-8 pb-8 border-b border-slate-200 uppercase tracking-widest font-semibold">
              Per organisation &middot; Billed monthly
            </p>
            
            <ul className="space-y-5 mb-10 flex-grow">
              {[
                'Compliance Dashboard',
                'Case Management — up to 50 active cases',
                'Evidence Vault — 5GB storage',
                'Customer Risk Scoring Engine',
                'Risk Score PDF Export',
                'Compliance Template Library (8 templates)',
                'AI Compliance Chatbot',
                'Due Diligence Recommendations',
                'Audit Trail (case-level)',
                'Email Support (1 business day response)'
              ].map((feature, i) => (
                <li key={i} className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-[#1B4FD8] flex-shrink-0" />
                  <span className="text-slate-700 font-medium leading-tight pt-0.5">{feature}</span>
                </li>
              ))}
            </ul>
            
            <Link 
              to={ROUTES.AUTH.REGISTER} 
              className="w-full block text-center bg-[#1B4FD8] text-white rounded-xl py-4 text-lg font-bold hover:bg-[#0F2557] transition-all shadow-md mt-auto hover:shadow-xl"
            >
              Start 14-Day Free Trial
            </Link>
          </div>

          {/* Professional Plan */}
          <div className="bg-[#0F2557] rounded-2xl p-8 lg:p-10 flex flex-col h-full shadow-2xl relative text-white">
            <div className="absolute top-0 right-10 -translate-y-1/2 bg-[#0EA5E9] text-white text-sm font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
              Most Popular
            </div>
            <h3 className="font-bold text-3xl mb-2">Professional</h3>
            <div className="mb-2">
              <span className="text-5xl lg:text-6xl font-black">£199</span>
              <span className="text-slate-300 text-xl font-medium">/month</span>
            </div>
            <p className="text-slate-400 text-sm mb-8 pb-8 border-b border-white/20 uppercase tracking-widest font-semibold">
              Per organisation &middot; Billed monthly
            </p>
            
            <ul className="space-y-4 mb-10 flex-grow">
              <li className="flex items-start gap-4 mb-2 pb-2 border-b border-white/10">
                 <span className="text-white font-bold leading-tight pt-0.5">Everything in Standard, plus:</span>
              </li>
              {[
                'Periodic Review Automation',
                'Advanced Risk Analytics',
                'Analyst Performance Reports',
                'Audit Preparation Reports',
                'Alert Volume Reports',
                'API Integrations',
                'Priority Support (4 hour response)',
                'Custom Compliance Workflows',
                'Workflow Approval Configuration',
                'Unlimited active cases',
                '25GB evidence storage',
                'Custom template upload',
                'Organisation-level audit trail export',
                'Bulk CSV alert import',
                'Multiple team roles (5 role types)',
                'Admin panel — full user management',
                'Stripe billing self-service',
                'Dedicated onboarding session'
              ].map((feature, i) => (
                <li key={i} className="flex items-start gap-4">
                  <CheckCircle className="w-5 h-5 text-[#0EA5E9] flex-shrink-0 mt-0.5" />
                  <span className="text-slate-200 text-sm font-medium leading-tight">{feature}</span>
                </li>
              ))}
            </ul>
            
            <Link 
              to={ROUTES.AUTH.REGISTER} 
              className="w-full block text-center bg-white text-[#0F2557] rounded-xl py-4 text-lg font-bold hover:bg-slate-100 transition-all mt-auto shadow-xl"
            >
              Start 14-Day Free Trial
            </Link>
          </div>

        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-white py-10 border-b border-slate-100 px-4">
        <div className="max-w-6xl mx-auto flex flex-wrap justify-center gap-6 lg:gap-12">
           <div className="flex items-center gap-2 text-slate-500 font-medium whitespace-nowrap"><Lock className="w-5 h-5" /> GDPR Compliant</div>
           <div className="flex items-center gap-2 text-slate-500 font-medium whitespace-nowrap"><MapPin className="w-5 h-5" /> 🇬🇧 UK Data Residency</div>
           <div className="flex items-center gap-2 text-slate-500 font-medium whitespace-nowrap"><RefreshCw className="w-5 h-5" /> Cancel Anytime</div>
           <div className="flex items-center gap-2 text-slate-500 font-medium whitespace-nowrap"><CreditCard className="w-5 h-5" /> No Setup Fee</div>
           <div className="flex items-center gap-2 text-slate-500 font-medium whitespace-nowrap"><Crosshair className="w-5 h-5" /> FCA-Aligned</div>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#F8FAFC]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#0F2557]">Compare plans in detail</h2>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-x-auto">
            <table className="w-full text-left min-w-[700px]">
              <thead className="bg-[#0F2557] text-white top-0 relative">
                <tr>
                  <th className="py-5 px-6 font-semibold w-1/2">Feature</th>
                  <th className="py-5 px-6 font-semibold text-center w-1/4 bg-[#1B4FD8]">Standard</th>
                  <th className="py-5 px-6 font-semibold text-center w-1/4 bg-[#0EA5E9]">Professional</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {comparisonFeatures.map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50 hover:bg-slate-100 transition-colors'}>
                    <td className="py-4 px-6 text-[#0F2557] font-medium text-sm">{row.name}</td>
                    <td className="py-4 px-6 text-center text-slate-700 text-sm font-medium">
                      {typeof row.std === 'boolean' ? (
                        row.std ? <CheckCircle className="w-5 h-5 text-[#1B4FD8] mx-auto" /> : <Minus className="w-5 h-5 text-slate-300 mx-auto" />
                      ) : (
                        row.std
                      )}
                    </td>
                    <td className="py-4 px-6 text-center text-slate-700 text-sm font-medium border-l border-slate-100">
                      {typeof row.pro === 'boolean' ? (
                        row.pro ? <CheckCircle className="w-5 h-5 text-[#0EA5E9] mx-auto" /> : <Minus className="w-5 h-5 text-slate-300 mx-auto" />
                      ) : (
                        row.pro
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#0F2557]">Frequently Asked Questions</h2>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className={`border rounded-xl transition-all ${openFaq === i ? 'border-[#1B4FD8] shadow-md bg-blue-50/30' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                <button 
                  onClick={() => toggleFaq(i)}
                  className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none"
                  aria-expanded={openFaq === i}
                >
                  <span className={`font-semibold text-lg ${openFaq === i ? 'text-[#1B4FD8]' : 'text-[#0F2557]'}`}>{faq.q}</span>
                  {openFaq === i ? (
                    <ChevronUp className="w-6 h-6 text-[#1B4FD8] flex-shrink-0 ml-4" />
                  ) : (
                    <ChevronDown className="w-6 h-6 text-slate-400 flex-shrink-0 ml-4" />
                  )}
                </button>
                <div 
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${openFaq === i ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <p className="px-6 pb-5 text-slate-600 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="bg-[#0F2557] py-20 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            See RegShield AI in action
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
        </div>
      </section>
    </div>
  );
};

export default Pricing;
