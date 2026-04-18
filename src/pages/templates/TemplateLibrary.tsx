import React, { useEffect, useState } from 'react';
import { useAppLayout } from '../../components/layout/AppLayout';
import { FileText, ClipboardList, FileBarChart, CheckSquare, Scale, Upload, Eye, Download } from 'lucide-react';
import { TemplatePreviewModal } from '../../components/templates/TemplatePreviewModal';
import { UploadTemplateModal } from '../../components/templates/UploadTemplateModal';

export default function TemplateLibrary() {
  const { setPageTitle, setBreadcrumbs } = useAppLayout();
  const [activeTab, setActiveTab] = useState('All');
  const [previewTemplate, setPreviewTemplate] = useState<any>(null);
  const [uploadOpen, setUploadOpen] = useState(false);

  useEffect(() => {
    document.title = 'Compliance Templates — RegShield AI';
    setPageTitle('Compliance Templates');
    setBreadcrumbs([{ label: 'Compliance Templates' }]);
  }, [setPageTitle, setBreadcrumbs]);

  const tabs = ['All', 'Policies', 'Assessments', 'Reports', 'Checklists', 'Regulatory'];

  const templates = [
    { id: 1, type: 'Policy', name: 'AML & CTF Policy 2026', desc: 'Comprehensive Anti-Money Laundering and Counter-Terrorist Financing policy aligned to MLR 2017.', date: '12 Apr 2026', isCustom: false },
    { id: 2, type: 'Assessment', name: 'Enterprise Risk Assessment (EWRA)', desc: 'Firm-wide risk assessment framework covering products, jurisdictions, and delivery channels.', date: '05 Mar 2026', isCustom: false },
    { id: 3, type: 'Report', name: 'NCA SAR Template', desc: 'Suspicious Activity Report draft template formatted for NCA online portal submission.', date: '22 Feb 2026', isCustom: false },
    { id: 4, type: 'Checklist', name: 'Enhanced Due Diligence (EDD) Checklist', desc: 'Step-by-step EDD requirements for high-risk individuals and PEPs.', date: '10 Jan 2026', isCustom: false },
    { id: 5, type: 'Regulatory', name: 'MLRO Annual Report Structure', desc: 'Standard structure for the MLRO annual compliance report to the Board of Directors.', date: '15 Nov 2025', isCustom: true },
  ];

  const filtered = activeTab === 'All' ? templates : templates.filter(t => t.type + 's' === activeTab || t.type === activeTab.replace(/y$/, 'ie').slice(0, -1));

  const getIcon = (type: string) => {
    switch (type) {
      case 'Policy': return <div className="w-12 h-12 bg-blue-50 text-[#1B4FD8] flex items-center justify-center rounded-xl mb-3"><FileText className="w-6 h-6"/></div>;
      case 'Assessment': return <div className="w-12 h-12 bg-purple-50 text-purple-600 flex items-center justify-center rounded-xl mb-3"><ClipboardList className="w-6 h-6"/></div>;
      case 'Report': return <div className="w-12 h-12 bg-green-50 text-green-600 flex items-center justify-center rounded-xl mb-3"><FileBarChart className="w-6 h-6"/></div>;
      case 'Checklist': return <div className="w-12 h-12 bg-amber-50 text-amber-600 flex items-center justify-center rounded-xl mb-3"><CheckSquare className="w-6 h-6"/></div>;
      case 'Regulatory': return <div className="w-12 h-12 bg-red-50 text-red-600 flex items-center justify-center rounded-xl mb-3"><Scale className="w-6 h-6"/></div>;
      default: return null;
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto pb-10 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
        <div>
          <h1 className="font-bold text-2xl text-[#0F2557]">Compliance Templates</h1>
          <p className="text-slate-500 text-sm mt-1">FCA-aligned compliance documents ready to use. Customise and download as DOCX.</p>
        </div>
        <button onClick={() => setUploadOpen(true)} className="bg-white border border-[#1B4FD8] text-[#1B4FD8] hover:bg-blue-50 px-4 py-2 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-sm">
          <Upload className="w-4 h-4" /> Upload Custom Template
        </button>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3 mb-8 shadow-sm">
        <p className="text-blue-900 text-sm font-medium leading-relaxed">
          All templates are aligned to JMLSG guidance and FCA expectations. They are provided as starting points — always review with your compliance team before use. RegShield AI does not provide legal advice.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map(tab => (
          <button 
            key={tab} 
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors ${activeTab === tab ? 'bg-[#1B4FD8] text-white shadow-sm' : 'text-slate-600 hover:text-slate-800'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
         {filtered.map(t => (
           <div key={t.id} className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-md transition-shadow cursor-default flex flex-col">
              <div className="flex justify-between items-start">
                 {getIcon(t.type)}
                 <div className="flex gap-2">
                   {t.isCustom && <span className="bg-purple-100 text-purple-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Custom</span>}
                   <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">{t.type}</span>
                 </div>
              </div>
              <h3 className="font-bold text-[#0F2557] text-lg mt-3">{t.name}</h3>
              <p className="text-slate-500 text-sm mt-1 leading-relaxed line-clamp-2 min-h-[40px]">{t.desc}</p>
              
              <div className="mt-auto pt-4 border-t border-slate-100 flex justify-between items-center">
                 <span className="text-xs text-slate-400 font-medium">Updated {t.date}</span>
                 <div className="flex gap-2">
                    <button onClick={() => setPreviewTemplate({ ...t, contentHtml: '<h1>' + t.name + '</h1><p>' + t.desc + '</p><h2>1. Introduction</h2><p>This is a standard template payload rendering exactly as intended within the DOM purifications boundaries.</p>' })} className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition"><Eye className="w-4 h-4"/></button>
                    <button className="p-2 text-[#1B4FD8] hover:bg-blue-50 border border-slate-100 rounded-lg transition"><Download className="w-4 h-4"/></button>
                 </div>
              </div>
           </div>
         ))}
      </div>

      <TemplatePreviewModal template={previewTemplate} onClose={() => setPreviewTemplate(null)} />
      <UploadTemplateModal isOpen={uploadOpen} onClose={() => setUploadOpen(false)} />
    </div>
  );
}
