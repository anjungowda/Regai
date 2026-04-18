import React, { useRef, useState } from 'react';
import { Upload, X, CheckCircle, FileText, Download, Trash2, ShieldCheck, ShieldAlert } from 'lucide-react';
import { useCaseEvidence } from '../../../hooks/useEvidence';
import { format } from 'date-fns';

export const EvidenceTab = ({ caseData }: any) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data: evidenceList, isLoading } = useCaseEvidence(caseData.id);
  const [isDragging, setIsDragging] = useState(false);
  
  // Minimal placeholder implementation of Evidence XHR.
  const [uploads, setUploads] = useState<any[]>([]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const newUploads = files.map(f => ({ name: f.name, progress: 0, status: 'uploading' }));
      setUploads(prev => [...prev, ...newUploads]);
      
      // Simulate file upload progress since we don't have S3 attached
      newUploads.forEach((u, i) => {
        let p = 0;
        const interval = setInterval(() => {
          p += 20;
          setUploads(current => current.map((item, idx) => 
            idx === (current.length - newUploads.length + i) 
              ? { ...item, progress: p, status: p >= 100 ? 'complete' : 'uploading' }
              : item
          ));
          if (p >= 100) clearInterval(interval);
        }, 500);
      });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-lg text-slate-800">Evidence Vault</h3>
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="px-4 py-2 bg-[#1B4FD8] text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition flex items-center gap-2"
        >
          <Upload className="w-4 h-4" /> Upload Document
        </button>
      </div>

      <div 
        className={`bg-slate-50 border-2 border-dashed rounded-2xl p-10 text-center transition-colors ${
          isDragging ? 'border-[#1B4FD8] bg-blue-50/50' : 'border-slate-300'
        }`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => { e.preventDefault(); setIsDragging(false); /* connect drag drop to handler */ }}
      >
        <Upload className={`w-10 h-10 mx-auto mb-4 ${isDragging ? 'text-[#1B4FD8]' : 'text-slate-400'}`} />
        <p className="text-slate-700 font-medium text-lg">Drag and drop files here</p>
        <p className="text-slate-500 text-sm mt-1 mb-4">or <span className="text-[#1B4FD8] hover:underline cursor-pointer" onClick={() => fileInputRef.current?.click()}>browse files</span></p>
        <p className="text-xs text-slate-400 font-medium">PDF, JPEG, PNG, DOCX, XLSX · Max 25MB per file</p>
        
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          multiple 
          accept=".pdf,.jpg,.jpeg,.png,.docx,.xlsx" 
          onChange={handleFileSelect} 
        />
      </div>

      {uploads.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
          <h4 className="text-sm font-bold text-slate-800">Active Uploads</h4>
          {uploads.map((u, i) => (
            <div key={i} className="flex flex-col gap-1.5">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-slate-700 truncate mr-4">{u.name}</span>
                {u.status === 'complete' ? (
                  <span className="text-green-600 font-bold flex items-center gap-1 hover:cursor-pointer"><CheckCircle className="w-4 h-4" /> Uploaded</span>
                ) : (
                  <span className="text-slate-500">{u.progress}%</span>
                )}
              </div>
              {u.status !== 'complete' && (
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-[#1B4FD8] h-full transition-all duration-300" style={{ width: `${u.progress}%` }}></div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* EVIDENCE TABLE STAGE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-500 uppercase">Document</th>
              <th className="px-5 py-3 border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-500 uppercase">Category</th>
              <th className="px-5 py-3 border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-500 uppercase">Date</th>
              <th className="px-5 py-3 border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-500 uppercase">Status</th>
              <th className="px-5 py-3 border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(evidenceList || []).length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center text-slate-500 font-medium">No verified documents available in the vault.</td>
              </tr>
            ) : (
              (evidenceList || []).map((ev: any) => (
                <tr key={ev.id} className="border-b border-slate-50 hover:bg-slate-50 transition">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-50 text-red-500 flex items-center justify-center rounded-lg">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                         <p className="text-sm font-semibold text-slate-800 truncate max-w-[200px]">{ev.fileName}</p>
                         <p className="text-xs text-slate-400">PDF • {(ev.fileSize/1024).toFixed(1)} KB</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4"><span className="bg-slate-100 text-slate-700 text-xs font-bold px-2 py-1 rounded-md">{ev.documentType || 'General'}</span></td>
                  <td className="px-5 py-4 text-sm text-slate-600">{format(new Date(ev.createdAt), 'dd MMMM yyyy')}</td>
                  <td className="px-5 py-4">
                    <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-1 rounded-full inline-flex items-center gap-1">
                      Pending Verification
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2 text-slate-400">
                      <button className="p-1 hover:text-[#1B4FD8] hover:bg-blue-50 rounded"><Download className="w-4 h-4"/></button>
                      <button className="p-1 hover:text-green-600 hover:bg-green-50 rounded"><ShieldCheck className="w-4 h-4"/></button>
                      <button className="p-1 hover:text-red-500 hover:bg-red-50 rounded"><ShieldAlert className="w-4 h-4"/></button>
                      <button className="p-1 hover:text-red-600 hover:bg-red-50 rounded ml-2"><Trash2 className="w-4 h-4"/></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
