import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const GlobalSearch = () => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e: any) => {
    e.preventDefault();
    if (!query.trim()) return;
    setIsOpen(false);
    navigate(`/cases?search=${encodeURIComponent(query)}`);
  };

  return (
    <div className="relative z-50">
       <form onSubmit={handleSearch} className="relative">
         <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
         <input 
           type="text" 
           value={query}
           onChange={(e) => { setQuery(e.target.value); setIsOpen(true); }}
           onBlur={() => setTimeout(() => setIsOpen(false), 200)}
           placeholder="Search network namespace..." 
           className="w-full sm:w-64 md:w-80 pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-1 focus:ring-[#1B4FD8] focus:bg-white transition-all shadow-sm"
         />
       </form>

       {isOpen && query.length > 1 && (
         <div className="absolute top-full mt-2 w-full bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden py-2 animate-in fade-in duration-200">
            <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Active Cases</span>
            </div>
            <button onMouseDown={() => navigate(`/cases/RS-2026-0001`)} className="w-full text-left px-4 py-2 hover:bg-blue-50 transition border-b border-slate-50">
               <span className="font-mono text-sm text-[#1B4FD8] font-bold block">RS-2026-0001</span>
               <span className="text-xs text-slate-500">Viktor Petrov (High Risk Matching)</span>
            </button>
            <div className="px-4 py-2 bg-slate-50 border-y border-slate-100 mt-1 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Global Evidence</span>
            </div>
            <button onMouseDown={() => navigate(`/evidence`)} className="w-full text-left px-4 py-2 hover:bg-blue-50 transition">
               <span className="text-sm font-bold text-slate-700 block">passport_scan.pdf</span>
               <span className="text-xs text-slate-500">ID Documentation Blob</span>
            </button>
         </div>
       )}
    </div>
  )
}
