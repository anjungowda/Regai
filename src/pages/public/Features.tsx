import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ShieldAlert, ArrowRight, LayoutDashboard, Briefcase, Lock, FileText, Bell, BarChart3, Clock } from 'lucide-react';
import MetaTags from '../../components/common/MetaTags';
import { ROUTES } from '../../constants';

const navItems = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'case-management', label: 'Case Management' },
  { id: 'risk-scoring', label: 'Risk Scoring' },
  { id: 'evidence-vault', label: 'Evidence Vault' },
  { id: 'templates', label: 'Templates' },
  { id: 'tm-alerts', label: 'TM Alerts' },
  { id: 'periodic-reviews', label: 'Periodic Reviews' },
  { id: 'audit-trail', label: 'Audit Trail' },
  { id: 'reporting', label: 'Reporting' },
  { id: 'notifications', label: 'Notifications' },
];

const Features: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('dashboard');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -80% 0px' }
    );

    navItems.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 120,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="flex flex-col w-full font-interface">
      <MetaTags 
        title="Features" 
        description="Every feature designed around the real workflows of AML analysts, MLROs and compliance managers." 
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#0F2557] to-[#1B4FD8] py-24 px-4 text-center">
        <div className="max-w-4xl mx-auto flex flex-col items-center animate-fade-in-up">
          <div className="inline-flex items-center rounded-full bg-white/10 border border-white/20 px-3 py-1 mb-6 text-white text-xs font-medium tracking-wide">
            Platform Features
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Everything your compliance team needs in one place
          </h1>
          <p className="text-lg md:text-xl text-slate-200 leading-relaxed">
            Purpose-built for UK fintech compliance operations. Every feature designed around the real workflows of AML analysts, MLROs and compliance managers.
          </p>
        </div>
      </section>

      {/* Features Navigation Bar */}
      <div className="sticky top-20 z-40 bg-white border-b border-slate-200 overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-2 md:space-x-6 min-w-max py-2">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => scrollToSection(item.id, e)}
                className={`text-sm font-medium px-4 py-3 whitespace-nowrap transition-colors border-b-2 ${
                  activeSection === item.id
                    ? 'border-[#1B4FD8] text-[#1B4FD8]'
                    : 'border-transparent text-slate-600 hover:text-[#1B4FD8]'
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </div>

      {/* Feature Section 1: Dashboard */}
      <section id="dashboard" className="py-20 px-4 sm:px-6 lg:px-8 bg-white scroll-mt-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-[#1B4FD8] uppercase text-xs tracking-widest font-semibold block mb-2">Compliance Dashboard</span>
            <h2 className="text-3xl font-bold text-[#0F2557] mb-6">Full operational visibility at a glance</h2>
            <p className="text-slate-600 text-lg leading-relaxed mb-8">
              The compliance dashboard gives managers and analysts an immediate, real-time view of the organisation's compliance workload. No more checking five tools to understand what's open, what's overdue and where the high-risk cases are.
            </p>
            <ul className="space-y-4">
              {[
                'Total open cases with drill-down by case type',
                'High-risk and critical cases flagged prominently',
                'Overdue SLA cases highlighted in amber and red',
                'Transaction monitoring alerts received this week',
                'Cases closed this month — team productivity view',
                'Recent activity feed from the full organisation audit log'
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#1B4FD8] flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-[#F8FAFC] rounded-2xl p-6 border border-slate-200 shadow-lg">
            <div className="bg-white rounded-t-xl border-b border-slate-200 p-3 flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-amber-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
            <div className="bg-white p-6 rounded-b-xl">
               <div className="grid grid-cols-3 gap-4 mb-8">
                 <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex flex-col">
                   <span className="text-blue-800 text-sm font-semibold mb-1">24 Open Cases</span>
                   <div className="h-1.5 w-full bg-blue-200 rounded-full overflow-hidden mt-auto"><div className="h-full bg-blue-500 w-3/4"></div></div>
                 </div>
                 <div className="bg-red-50 p-4 rounded-lg border border-red-100 flex flex-col">
                   <span className="text-red-800 text-sm font-semibold mb-1">7 High Risk</span>
                   <div className="h-1.5 w-full bg-red-200 rounded-full overflow-hidden mt-auto"><div className="h-full bg-red-500 w-1/3"></div></div>
                 </div>
                 <div className="bg-amber-50 p-4 rounded-lg border border-amber-100 flex flex-col">
                   <span className="text-amber-800 text-sm font-semibold mb-1">3 Overdue</span>
                   <div className="h-1.5 w-full bg-amber-200 rounded-full overflow-hidden mt-auto"><div className="h-full bg-amber-500 w-1/5"></div></div>
                 </div>
               </div>
               <div className="space-y-3">
                 {[
                   { id: 'RS-26-001', type: 'EDD', risk: 'High Risk', date: 'Today' },
                   { id: 'RS-26-002', type: 'KYB', risk: 'Medium', date: 'Tomorrow' },
                   { id: 'RS-26-003', type: 'TM Alert', risk: 'Critical', date: 'Overdue' }
                 ].map((row, i) => (
                   <div key={i} className="flex justify-between items-center p-3 border border-slate-100 rounded-lg">
                     <span className="font-mono text-xs text-slate-500">{row.id}</span>
                     <span className="text-xs font-semibold px-2 py-1 bg-slate-100 rounded">{row.type}</span>
                     <span className={`text-xs font-semibold px-2 py-1 rounded ${row.risk === 'Critical' || row.risk.includes('High') ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>{row.risk}</span>
                     <span className={`text-xs font-medium ${row.date === 'Overdue' ? 'text-red-600' : 'text-slate-500'}`}>{row.date}</span>
                   </div>
                 ))}
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section 2: Case Management */}
      <section id="case-management" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#F8FAFC] scroll-mt-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1 bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
             <div className="bg-[#0F2557] p-4 text-white">
                <div className="font-mono text-sm opacity-80 mb-1">RS-2026-8892</div>
                <div className="text-lg font-semibold">Acme Trading Ltd - Periodic Review</div>
             </div>
             <div className="border-b border-slate-200 flex overflow-x-hidden p-2 gap-1 bg-slate-50">
               {['Overview', 'Evidence', 'Notes', 'Tasks', 'Decision', 'Audit Trail'].map((tab, i) => (
                 <div key={i} className={`px-4 py-2 text-sm font-medium rounded-md ${i === 0 ? 'bg-white shadow-sm text-[#1B4FD8]' : 'text-slate-500'}`}>
                   {tab}
                 </div>
               ))}
             </div>
             <div className="p-8 h-64 bg-white flex flex-col gap-4">
               <div className="h-4 bg-slate-100 rounded w-3/4"></div>
               <div className="h-4 bg-slate-100 rounded w-1/2"></div>
               <div className="h-4 bg-slate-100 rounded w-5/6"></div>
               <div className="mt-8 flex gap-4">
                 <div className="w-1/2 h-20 border border-slate-200 rounded-lg bg-slate-50"></div>
                 <div className="w-1/2 h-20 border border-slate-200 rounded-lg bg-slate-50"></div>
               </div>
             </div>
          </div>
          <div className="order-1 lg:order-2">
            <span className="text-[#1B4FD8] uppercase text-xs tracking-widest font-semibold block mb-2">Case Management</span>
            <h2 className="text-3xl font-bold text-[#0F2557] mb-6">Every investigation. Structured, tracked, and audit-ready.</h2>
            <p className="text-slate-600 text-lg leading-relaxed mb-8">
              RegShield AI transforms compliance investigations from informal, ad-hoc processes into managed cases. Every case has a unique reference, an assigned analyst, SLA tracking, a full evidence vault and an uneditable audit trail.
            </p>
            <div className="flex flex-wrap gap-2 mb-8">
              {['Onboarding Review', 'KYB / Company Review', 'Periodic Review', 'TM Alert', 'Enhanced Due Diligence', 'Lending Application Review', 'Ad-hoc Investigation'].map(tag => (
                <span key={tag} className="bg-slate-200 text-slate-700 text-xs font-semibold px-3 py-1 rounded-full">{tag}</span>
              ))}
            </div>
            <ul className="space-y-4">
              {[
                '8-tab case detail: Overview, Evidence, Notes, Tasks, Decision, Audit Trail',
                'Automatic SLA deadline calculation by case type',
                'Case assignment and escalation workflow',
                'Reviewer approval before case closure',
                'Case ID auto-generation: RS-2026-XXXX format'
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#1B4FD8] flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Feature Section 3: Customer Risk Scoring */}
      <section id="risk-scoring" className="py-20 px-4 sm:px-6 lg:px-8 bg-white scroll-mt-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-[#1B4FD8] uppercase text-xs tracking-widest font-semibold block mb-2">Risk Scoring Engine</span>
            <h2 className="text-3xl font-bold text-[#0F2557] mb-6">Transparent, explainable risk scores. Not a black box.</h2>
            <p className="text-slate-600 text-lg leading-relaxed mb-6">
              The RegShield AI risk scoring engine assesses individual and business customers using a structured, rule-based methodology aligned to UK AML regulations. Every score is explainable — analysts can show regulators exactly how a risk rating was reached.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-8">
              <p className="text-blue-900 text-sm leading-relaxed">
                Unlike systems that produce unexplained outputs, RegShield AI shows the full scoring breakdown — every risk factor, every point value, and the total calculation — so your compliance team can defend every decision.
              </p>
            </div>
            <div className="space-y-3">
               <div className="flex items-center gap-4"><div className="w-24 text-xs font-bold text-slate-500 text-right">0-20</div><div className="flex-1 h-3 bg-green-500 rounded-full"></div><div className="w-20 text-xs font-bold text-green-700">Low</div></div>
               <div className="flex items-center gap-4"><div className="w-24 text-xs font-bold text-slate-500 text-right">21-50</div><div className="flex-1 h-3 bg-amber-500 rounded-full"></div><div className="w-20 text-xs font-bold text-amber-700">Medium</div></div>
               <div className="flex items-center gap-4"><div className="w-24 text-xs font-bold text-slate-500 text-right">51-75</div><div className="flex-1 h-3 bg-red-500 rounded-full w-3/4"></div><div className="w-20 text-xs font-bold text-red-700">High</div></div>
               <div className="flex items-center gap-4"><div className="w-24 text-xs font-bold text-slate-500 text-right">76-100</div><div className="flex-1 h-3 bg-red-900 rounded-full w-full"></div><div className="w-20 text-xs font-bold text-red-900">Critical</div></div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-xl max-w-md mx-auto w-full">
            <div className="flex flex-col items-center mb-8 pb-8 border-b border-slate-100">
               <div className="w-32 h-32 rounded-full border-8 border-red-500 flex items-center justify-center mb-4">
                 <span className="text-5xl font-black text-[#0F2557]">68</span>
               </div>
               <span className="bg-red-100 text-red-700 font-bold px-4 py-1.5 rounded-full text-sm mb-3">High Risk</span>
               <div className="flex items-center gap-2 text-sm text-[#0F2557] font-semibold bg-slate-50 px-4 py-2 rounded-lg w-full justify-center">
                 <ShieldAlert className="w-4 h-4 text-amber-500" />
                 Enhanced Due Diligence Required
               </div>
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Scoring Breakdown</h4>
              <div className="space-y-3">
                 {[
                   { factor: "PEP Status Match", pts: 20 },
                   { factor: "High-risk jurisdiction", pts: 15 },
                   { factor: "Complex corporate structure", pts: 15 },
                   { factor: "Adverse media flag", pts: 10 },
                   { factor: "Recent account activity", pts: 8 }
                 ].map((fv, i) => (
                   <div key={i} className="flex justify-between items-center text-sm border-b border-dashed border-slate-200 pb-2">
                     <span className="text-slate-600">{fv.factor}</span>
                     <span className="font-semibold text-[#0F2557]">+{fv.pts}pts</span>
                   </div>
                 ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section 4: Evidence Vault */}
      <section id="evidence-vault" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#F8FAFC] scroll-mt-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1 bg-white p-6 rounded-2xl border border-slate-200 shadow-lg">
             <div className="flex justify-between items-center mb-6">
               <h4 className="font-bold text-[#0F2557]">Case Evidence</h4>
               <button className="bg-[#1B4FD8] text-white text-xs px-3 py-1.5 rounded disabled opacity-50 font-medium">Upload File</button>
             </div>
             <table className="w-full text-sm text-left">
               <thead className="text-xs text-slate-500 bg-slate-50">
                 <tr>
                   <th className="px-4 py-2 rounded-l-lg">Document</th>
                   <th className="px-4 py-2">Category</th>
                   <th className="px-4 py-2 rounded-r-lg">Status</th>
                 </tr>
               </thead>
               <tbody>
                 {[
                   { name: 'passport_scan.pdf', cat: 'ID', stat: 'Verified', color: 'bg-green-100 text-green-700' },
                   { name: 'bank_statement_q1.pdf', cat: 'Bank Statement', stat: 'Pending', color: 'bg-amber-100 text-amber-700' },
                   { name: 'cert_incorporation.jpg', cat: 'Corporate', stat: 'Verified', color: 'bg-green-100 text-green-700' },
                   { name: 'utility_bill_old.png', cat: 'Address', stat: 'Rejected', color: 'bg-red-100 text-red-700' },
                 ].map((row, i) => (
                   <tr key={i} className="border-b border-slate-50">
                     <td className="px-4 py-3 flex items-center gap-2 font-medium text-[#0F2557]"><FileText className="w-4 h-4 text-slate-400" />{row.name}</td>
                     <td className="px-4 py-3"><span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs">{row.cat}</span></td>
                     <td className="px-4 py-3"><span className={`${row.color} px-2 py-0.5 rounded text-xs font-semibold`}>{row.stat}</span></td>
                   </tr>
                 ))}
               </tbody>
             </table>
          </div>
          <div className="order-1 lg:order-2">
            <span className="text-[#1B4FD8] uppercase text-xs tracking-widest font-semibold block mb-2">Evidence Vault</span>
            <h2 className="text-3xl font-bold text-[#0F2557] mb-6">Secure, organised, audit-ready document storage</h2>
            <p className="text-slate-600 text-lg leading-relaxed mb-8">
              All compliance evidence stored in one secure location — ID documents, bank statements, contracts, corporate filings. Every upload is categorised, versioned and access-logged.
            </p>
            <ul className="space-y-4">
              {[
                'AWS S3 storage with pre-signed URL access (15-minute expiry)',
                'Document categories: ID / Bank Statement / Invoice / Contract / Corporate Document / Regulatory Correspondence',
                'Version control — previous versions retained, never deleted',
                'Verification status tracking: Pending / Verified / Rejected',
                'Soft-delete only — deletions logged to audit trail',
                'Supported formats: PDF, JPEG, PNG, DOCX, XLSX (max 25MB)'
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#0EA5E9] flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Feature Section 5: Templates */}
      <section id="templates" className="py-20 px-4 sm:px-6 lg:px-8 bg-white scroll-mt-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-[#1B4FD8] uppercase text-xs tracking-widest font-semibold block mb-2">Compliance Templates</span>
            <h2 className="text-3xl font-bold text-[#0F2557] mb-6">FCA-aligned compliance documents — ready to use</h2>
            <p className="text-slate-600 text-lg leading-relaxed mb-8">
              Access a library of pre-built compliance templates aligned to JMLSG guidance and FCA expectations. Customise with your organisation's details and download as DOCX — no consultant required.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { n: 'AML Policy Template', t: 'Policy' },
                { n: 'Customer Risk Assessment', t: 'Assessment' },
                { n: 'EDD Report', t: 'Report' },
                { n: 'SAR Draft', t: 'Regulatory' },
                { n: 'Periodic Review Checklist', t: 'Checklist' },
                { n: 'KYB Due Diligence Checklist', t: 'Checklist' },
                { n: 'TM Investigation Log', t: 'Report' },
                { n: 'Compliance Breach Report', t: 'Report' }
              ].map((temp, i) => (
                <div key={i} className="border border-slate-200 rounded-lg p-4 hover:border-[#1B4FD8] transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <FileText className="w-5 h-5 text-slate-400" />
                    <span className="text-[10px] uppercase tracking-wide font-bold bg-slate-100 text-slate-500 px-2 flex items-center rounded">{temp.t}</span>
                  </div>
                  <h4 className="text-sm font-semibold text-[#0F2557]">{temp.n}</h4>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-[#F8FAFC] p-8 rounded-2xl border border-slate-200 shadow-inner flex flex-col gap-4 relative">
             <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-100 to-transparent rounded-tr-2xl"></div>
             <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between z-10 transition-transform hover:scale-[1.02]">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-50 p-3 rounded-lg"><FileText className="w-6 h-6 text-[#1B4FD8]"/></div>
                  <div>
                    <h5 className="font-bold text-[#0F2557]">Draft AML Policy v2.docx</h5>
                    <p className="text-xs text-slate-500 mt-1">Last updated 2 days ago</p>
                  </div>
                </div>
                <button className="text-[#1B4FD8] font-medium text-sm bg-blue-50 px-4 py-2 rounded-lg">Download</button>
             </div>
             <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between z-10 opacity-75 grayscale transition-transform hover:scale-[1.02] hover:grayscale-0 hover:opacity-100">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-50 p-3 rounded-lg"><FileText className="w-6 h-6 text-[#1B4FD8]"/></div>
                  <div>
                    <h5 className="font-bold text-[#0F2557]">KYB Checklist_Director.docx</h5>
                    <p className="text-xs text-slate-500 mt-1">Last updated 1 month ago</p>
                  </div>
                </div>
                <button className="text-[#1B4FD8] font-medium text-sm bg-blue-50 px-4 py-2 rounded-lg">Download</button>
             </div>
          </div>
        </div>
      </section>

      {/* Feature Section 6: TM Alerts */}
      <section id="tm-alerts" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#F8FAFC] scroll-mt-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1 bg-white border border-slate-200 shadow-md rounded-2xl overflow-hidden">
             <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 font-bold text-[#0F2557] flex items-center justify-between">
               <span>Recent Alerts Queue</span>
               <span className="text-xs font-semibold bg-blue-100 text-blue-800 px-3 py-1 rounded-full">12 Open</span>
             </div>
             <div className="divide-y divide-slate-100">
               {[
                 { id: 'TRX-99812A', amount: '£45,000.00', rule: 'Velocity Outlier', risk: 85 },
                 { id: 'TRX-77642B', amount: '£12,500.00', rule: 'High-risk jurisdiction', risk: 72 },
                 { id: 'TRX-11234D', amount: '£5,000.00', rule: 'Structuring suspected', risk: 45 }
               ].map((itm, i) => (
                 <div key={i} className="p-4 hover:bg-slate-50 cursor-pointer flex justify-between items-center transition-colors">
                    <div>
                      <div className="font-mono text-xs text-slate-500 mb-1">{itm.id}</div>
                      <div className="font-bold text-[#0F2557]">{itm.amount}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-slate-600 font-medium mb-1">{itm.rule}</div>
                      <div className={`text-xs font-bold ${itm.risk > 70 ? 'text-red-600' : 'text-amber-600'}`}>Risk Score: {itm.risk}</div>
                    </div>
                 </div>
               ))}
             </div>
          </div>
          <div className="order-1 lg:order-2">
            <span className="text-[#1B4FD8] uppercase text-xs tracking-widest font-semibold block mb-2">Transaction Monitoring Alerts</span>
            <h2 className="text-3xl font-bold text-[#0F2557] mb-6">Manage alerts from any TM system in one place</h2>
            <p className="text-slate-600 text-lg leading-relaxed mb-8">
              RegShield AI does not perform transaction monitoring — it manages what happens after an alert is generated. Import alerts manually or via CSV upload from your existing TM system and link them directly to compliance cases.
            </p>
            <ul className="space-y-4">
              {[
                'Manual alert entry with full field set',
                'CSV batch upload from external TM systems',
                'Alert fields: transaction ID, amount, currency, origin/destination country, risk score, trigger rule',
                'Direct link from alert to case creation',
                'Alert status tracking: Open / Under Review / Resolved / Escalated'
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#1B4FD8] flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Feature Section 7: Periodic Reviews */}
      <section id="periodic-reviews" className="py-20 px-4 sm:px-6 lg:px-8 bg-white scroll-mt-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-[#1B4FD8] uppercase text-xs tracking-widest font-semibold block mb-2">Periodic Review Module</span>
            <h2 className="text-3xl font-bold text-[#0F2557] mb-6">Never miss a scheduled compliance review</h2>
            <p className="text-slate-600 text-lg leading-relaxed mb-8">
              UK AML regulations require firms to conduct periodic reviews of existing customers based on risk level. The RegShield AI periodic review module automates scheduling, provides structured review checklists and tracks completion.
            </p>
            
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-8">
              <table className="w-full text-sm text-left">
                <thead><tr className="border-b border-slate-200 text-slate-500 font-semibold"><th className="pb-2">Risk Level</th><th className="pb-2">Review Frequency</th></tr></thead>
                <tbody className="divide-y divide-slate-100">
                  <tr><td className="py-2"><span className="text-green-700 font-semibold bg-green-100 px-2 rounded text-xs">Low</span></td><td className="py-2 text-[#0F2557] font-medium">3 years</td></tr>
                  <tr><td className="py-2"><span className="text-amber-700 font-semibold bg-amber-100 px-2 rounded text-xs">Medium</span></td><td className="py-2 text-[#0F2557] font-medium">12 months</td></tr>
                  <tr><td className="py-2"><span className="text-red-700 font-semibold bg-red-100 px-2 rounded text-xs">High</span></td><td className="py-2 text-[#0F2557] font-medium">6 months</td></tr>
                  <tr><td className="py-2"><span className="text-white font-semibold bg-red-900 px-2 rounded text-xs">Critical</span></td><td className="py-2 text-[#0F2557] font-medium">As required</td></tr>
                </tbody>
              </table>
            </div>

            <ul className="space-y-4">
              <li className="flex items-start gap-3"><CheckCircle className="w-5 h-5 text-[#0EA5E9] flex-shrink-0 mt-0.5" /><span className="text-slate-700">Auto-scheduling based on risk level</span></li>
              <li className="flex items-start gap-3"><CheckCircle className="w-5 h-5 text-[#0EA5E9] flex-shrink-0 mt-0.5" /><span className="text-slate-700">Overdue review alerts sent to analysts</span></li>
              <li className="flex items-start gap-3"><CheckCircle className="w-5 h-5 text-[#0EA5E9] flex-shrink-0 mt-0.5" /><span className="text-slate-700">Structured checklist: Identity / Ownership / Expected Activity vs Actual / Sanctions Check / Adverse Media / Final Decision</span></li>
              <li className="flex items-start gap-3"><CheckCircle className="w-5 h-5 text-[#0EA5E9] flex-shrink-0 mt-0.5" /><span className="text-slate-700">Automatic next review date calculation upon closure</span></li>
            </ul>
          </div>
          <div className="bg-[#F8FAFC] border-8 border-slate-100 shadow-xl rounded-full aspect-square w-full max-w-sm mx-auto flex items-center justify-center relative overflow-hidden">
             <div className="absolute inset-0 bg-blue-500/10 animate-pulse"></div>
             <div className="text-center z-10 bg-white p-8 rounded-full shadow border border-slate-100">
               <Clock className="w-16 h-16 text-[#1B4FD8] mx-auto mb-4" />
               <h4 className="font-bold text-[#0F2557] text-xl">Review Due</h4>
               <p className="text-sm text-amber-600 font-semibold mt-1">in 14 Days</p>
             </div>
          </div>
        </div>
      </section>

      {/* Feature Section 8: Audit Trail */}
      <section id="audit-trail" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#F8FAFC] scroll-mt-24">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <span className="text-[#1B4FD8] uppercase text-xs tracking-widest font-semibold block mb-2">Audit Trail</span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#0F2557] mb-6 max-w-3xl mx-auto">An uneditable record of everything. For every case.</h2>
          <p className="text-slate-600 text-lg leading-relaxed max-w-4xl mx-auto">
            Every action on every case is automatically logged — who did what, when, and on which record. The audit trail cannot be edited, disabled or deleted by any user including Admin. It is your first line of defence in a regulatory inspection.
          </p>
        </div>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
           <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
             <h3 className="text-2xl font-bold text-[#1B4FD8] mb-4">Automatic</h3>
             <p className="text-slate-600 leading-relaxed">No manual effort required. Every case action, status change, evidence upload and decision is logged without any analyst input.</p>
           </div>
           <div className="bg-white p-8 rounded-2xl shadow-sm border border-amber-200">
             <h3 className="text-2xl font-bold text-amber-600 mb-4">Uneditable</h3>
             <p className="text-slate-600 leading-relaxed">Audit log entries cannot be modified or deleted by any user, including Admins. This is enforced at the database layer, not just the UI.</p>
           </div>
           <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#0EA5E9]/30">
             <h3 className="text-2xl font-bold text-[#0EA5E9] mb-4">Exportable</h3>
             <p className="text-slate-600 leading-relaxed">Export the full case audit trail as a PDF for regulatory submission or internal quality assurance review.</p>
           </div>
        </div>
      </section>

      {/* Feature Section 9: Reporting */}
      <section id="reporting" className="py-20 px-4 sm:px-6 lg:px-8 bg-white scroll-mt-24">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <span className="text-[#1B4FD8] uppercase text-xs tracking-widest font-semibold block mb-2">Reporting Module</span>
            <h2 className="text-3xl font-bold text-[#0F2557]">Reports built for compliance managers and regulators</h2>
          </div>
          
          <div className="flex overflow-x-auto pb-8 gap-6 snap-x hide-scrollbar">
            {[
              { n: 'Case Summary Report', d: 'All cases in a date range with status, risk level and decision. Export PDF or CSV.', t: 'Both plans', i: FileText },
              { n: 'Risk Distribution Report', d: 'Customer risk portfolio breakdown. Bar chart and table.', t: 'Both plans', i: BarChart3 },
              { n: 'Analyst Performance Report', d: 'Cases handled, average close time, SLA compliance rate.', t: 'Professional only', i: LayoutDashboard, p: true },
              { n: 'Audit Preparation Report', d: 'Closed cases with full decision records formatted for regulatory submission.', t: 'Professional only', i: ShieldAlert, p: true },
              { n: 'Alert Volume Report', d: 'Alert trends by week, type and status. Export CSV.', t: 'Both plans', i: Bell },
            ].map((rep, i) => (
              <div key={i} className={`min-w-[300px] shrink-0 border ${rep.p ? 'border-[#1B4FD8]' : 'border-slate-200'} rounded-2xl p-6 relative bg-white snap-center shadow-sm`}>
                {rep.p && <div className="absolute top-0 right-0 bg-[#1B4FD8] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-bl-lg rounded-tr-xl">Pro</div>}
                <rep.i className={`w-8 h-8 mb-4 ${rep.p ? 'text-[#1B4FD8]' : 'text-slate-400'}`} />
                <h3 className="text-lg font-bold text-[#0F2557] mb-2">{rep.n}</h3>
                <p className="text-sm text-slate-600 mb-4">{rep.d}</p>
                <div className="text-xs font-semibold text-slate-500 mt-auto">{rep.t}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Section 10: Notifications */}
      <section id="notifications" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#F8FAFC] scroll-mt-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[#1B4FD8] uppercase text-xs tracking-widest font-semibold block mb-2">Notifications</span>
            <h2 className="text-3xl font-bold text-[#0F2557] mb-6">Stay ahead of deadlines and escalations</h2>
            <p className="text-slate-600 text-lg leading-relaxed max-w-3xl mx-auto">
              RegShield AI sends targeted notifications so compliance teams never miss an SLA breach, an overdue review or an escalation — via in-platform notifications and email.
            </p>
          </div>

          <div className="bg-white border border-slate-200 shadow-md rounded-2xl overflow-hidden">
             <table className="w-full text-sm text-left">
               <thead className="bg-[#0F2557] text-white">
                 <tr>
                   <th className="px-6 py-4 font-semibold text-sm">Trigger</th>
                   <th className="px-6 py-4 font-semibold text-sm">Who Receives It</th>
                   <th className="px-6 py-4 font-semibold text-sm">Delivery</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-200">
                 {[
                   { t: 'New case assigned', w: 'Assigned analyst', d: 'Platform + Email' },
                   { t: 'SLA deadline in 24 hours', w: 'Analyst + Compliance Manager', d: 'Platform + Email' },
                   { t: 'SLA deadline passed', w: 'Analyst + Manager', d: 'Daily email until resolved' },
                   { t: 'Case escalated', w: 'Compliance Manager + MLRO', d: 'Platform + Email' },
                   { t: 'Review due reminder', w: 'Assigned analyst', d: 'Email (3 days before)' },
                   { t: 'Trial ending in 3 days', w: 'Admin', d: 'Email' },
                 ].map((row, i) => (
                   <tr key={i} className="hover:bg-slate-50">
                     <td className="px-6 py-4 font-medium text-[#0F2557]">{row.t}</td>
                     <td className="px-6 py-4 text-slate-600">{row.w}</td>
                     <td className="px-6 py-4 text-slate-600"><span className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs font-semibold">{row.d}</span></td>
                   </tr>
                 ))}
               </tbody>
             </table>
          </div>
        </div>
      </section>

      {/* FINAL CTA Section */}
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

export default Features;
