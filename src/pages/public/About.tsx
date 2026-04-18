import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Award, Quote, CheckCircle } from 'lucide-react';
import MetaTags from '../../components/common/MetaTags';
import { ROUTES } from '../../constants';

const About: React.FC = () => {
  return (
    <div className="flex flex-col w-full font-interface">
      <MetaTags 
        title="About Us" 
        description="Built by compliance practitioners, for compliance teams. Learn about the RegShield AI mission and founder." 
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#0F2557] to-[#1B4FD8] py-24 px-4 text-center">
        <div className="max-w-4xl mx-auto animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Built by compliance practitioners, for compliance teams
          </h1>
        </div>
      </section>

      {/* Founder Story Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-16 items-center">
          
          <div className="md:col-span-4 flex justify-center">
            <div className="w-64 h-64 md:w-full md:max-w-[320px] md:h-auto md:aspect-square rounded-full bg-gradient-to-br from-[#1B4FD8] to-[#0EA5E9] flex items-center justify-center shadow-2xl relative">
              <div className="absolute inset-0 bg-black/10 rounded-full"></div>
              <span className="text-8xl font-bold text-white tracking-tighter opacity-90 relative z-10">AN</span>
            </div>
          </div>
          
          <div className="md:col-span-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#0F2557] mb-2">Anju Narasegowda</h2>
            <h3 className="text-xl font-medium text-[#1B4FD8] mb-8 uppercase tracking-wide text-sm">Founder — RegShield AI</h3>
            
            <p className="text-slate-600 text-lg leading-relaxed mb-10">
              RegShield AI was created by Anju Narasegowda, a Financial Crime Periodic Review Analyst at Starling Bank, after observing first-hand how compliance teams at early-stage fintechs struggle to manage investigations through spreadsheets, emails and disconnected tools. With an MSc in Accounting and Finance from Cardiff Metropolitan University and an ICA Specialist Certificate in Financial Crime Risk and New Technology, Anju brings direct domain expertise to every aspect of the product.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
               <div className="flex items-center gap-4 bg-[#F8FAFC] border border-slate-200 p-4 rounded-xl flex-1">
                 <div className="bg-blue-100 p-3 rounded-full flex-shrink-0">
                   <GraduationCap className="w-6 h-6 text-[#1B4FD8]" />
                 </div>
                 <div>
                   <h4 className="text-sm font-bold text-[#0F2557]">MSc Accounting & Finance</h4>
                   <span className="text-xs text-slate-500 font-medium">Cardiff Metropolitan University</span>
                 </div>
               </div>
               <div className="flex items-center gap-4 bg-[#F8FAFC] border border-slate-200 p-4 rounded-xl flex-1">
                 <div className="bg-blue-100 p-3 rounded-full flex-shrink-0">
                   <Award className="w-6 h-6 text-[#1B4FD8]" />
                 </div>
                 <div>
                   <h4 className="text-sm font-bold text-[#0F2557]">ICA Specialist Certificate</h4>
                   <span className="text-xs text-slate-500 font-medium">Financial Crime Risk & New Technology</span>
                 </div>
               </div>
            </div>
          </div>

        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#F8FAFC] text-center border-y border-slate-200">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <Quote className="w-16 h-16 text-[#1B4FD8]/20 mb-8" />
          <p className="text-3xl md:text-4xl font-medium text-[#0F2557] leading-tight italic">
            "To make structured, audit-ready compliance operations accessible and affordable for every fintech startup — not just those with enterprise budgets."
          </p>
        </div>
      </section>

      {/* Why We're Different Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0F2557]">Why We're Different</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white border text-center p-8 rounded-2xl shadow-sm hover:shadow-lg transition-shadow border-slate-200">
              <div className="w-14 h-14 bg-blue-50 text-[#1B4FD8] flex items-center justify-center rounded-2xl mx-auto mb-6">
                <CheckCircle className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-[#0F2557] mb-4">Built by compliance practitioners</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                RegShield AI was not built by a generic SaaS team that added 'compliance' to the feature list. Every workflow, every field and every template was designed by someone who has conducted AML investigations in a regulated UK firm.
              </p>
            </div>
            
            <div className="bg-white border text-center p-8 rounded-2xl shadow-sm hover:shadow-lg transition-shadow border-slate-200">
              <div className="w-14 h-14 bg-teal-50 text-[#0EA5E9] flex items-center justify-center rounded-2xl mx-auto mb-6">
                <CheckCircle className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-[#0F2557] mb-4">Focused on operations, not detection</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                RegShield AI manages what happens after a compliance risk is identified. We are the operational layer between risk detection and regulatory audit readiness.
              </p>
            </div>
            
            <div className="bg-white border text-center p-8 rounded-2xl shadow-sm hover:shadow-lg transition-shadow border-slate-200">
              <div className="w-14 h-14 bg-green-50 text-green-600 flex items-center justify-center rounded-2xl mx-auto mb-6">
                <CheckCircle className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-[#0F2557] mb-4">Priced for startup budgets</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                Enterprise compliance platforms cost tens of thousands of pounds per year. RegShield AI delivers the same structured workflow capability at a price that works for early-stage fintechs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="bg-[#0F2557] py-20 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-2xl mx-auto text-white">
          <h2 className="text-3xl font-bold mb-4">Want to speak to Anju directly?</h2>
          <p className="text-lg text-slate-300 mb-8">
            You can reach out directly via email at <a href="mailto:info@regshield.ai" className="font-semibold hover:underline text-[#0EA5E9]">info@regshield.ai</a> or use our contact form.
          </p>
          <Link 
            to={ROUTES.PUBLIC.CONTACT} 
            className="inline-block bg-white text-[#0F2557] font-bold px-10 py-4 rounded-xl hover:bg-slate-100 shadow-xl transition-all"
          >
            Get in Touch
          </Link>
        </div>
      </section>
    </div>
  );
};

export default About;
