import React from 'react';
import { X, Download, List } from 'lucide-react';
import DOMPurify from 'dompurify';
import { downloadTemplateAsDOCX } from '../../utils/templateDownload';

export const TemplatePreviewModal = ({ template, onClose }: any) => {
  if (!template) return null;

  const mockOrg = { displayName: 'Horizon Payments Ltd', regulatoryFramework: 'FCA' };

  const cleanHtml = DOMPurify.sanitize(template.contentHtml || '');
  
  // Mock ToC Generator from headings
  const toc = [
    { level: 1, text: template.name },
    { level: 2, text: '1. Introduction' },
    { level: 2, text: '2. Scope & Applicability' },
    { level: 2, text: '3. Legal Framework' },
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl h-[85vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
         <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 shrink-0">
           <div>
             <h2 className="text-xl font-bold text-[#0F2557]">{template.name}</h2>
             <p className="text-xs text-slate-400 mt-0.5 uppercase tracking-wider">{template.type} TEMPLATE</p>
           </div>
           <div className="flex items-center gap-3">
             <button onClick={() => downloadTemplateAsDOCX(template, mockOrg)} className="bg-[#1B4FD8] text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-blue-700 transition flex gap-2"><Download className="w-4 h-4"/> Download DOCX</button>
             <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 transition-colors bg-slate-100 rounded-full"><X className="w-5 h-5"/></button>
           </div>
         </div>

         <div className="flex flex-1 overflow-hidden">
            <div className="w-56 border-r border-slate-100 bg-slate-50 p-4 overflow-y-auto shrink-0 hidden md:block">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><List className="w-4 h-4"/> Contents</h4>
              <ul className="space-y-3">
                {toc.map((t, idx) => (
                  <li key={idx} className={`text-sm cursor-pointer hover:text-[#1B4FD8] truncate ${t.level === 1 ? 'font-bold text-slate-800' : 'text-slate-600 ml-3'}`}>
                    {t.text}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex-1 p-8 overflow-y-auto bg-white">
               <div className="max-w-2xl mx-auto border border-slate-100 shadow-sm p-12 min-h-full">
                 {/* Internal Template Renderer Styles */}
                 <style dangerouslySetInnerHTML={{__html: `
                    .template-preview h1 { font-size: 1.5rem; font-weight: 800; color: #0F2557; margin-bottom: 1rem; margin-top: 1.5rem; }
                    .template-preview h2 { font-size: 1.25rem; font-weight: 700; color: #0F2557; margin-bottom: 0.75rem; margin-top: 1.25rem; }
                    .template-preview p { color: #334155; line-height: 1.7; margin-bottom: 1rem; font-size: 0.875rem; }
                 `}} />
                 <div className="template-preview" dangerouslySetInnerHTML={{ __html: cleanHtml }} />
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};
