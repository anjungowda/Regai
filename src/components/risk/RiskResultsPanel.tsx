import React, { useState } from 'react';
import { ChevronDown, Download, CheckCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const RiskResultsPanel = ({ score, breakdown, isComplete }: any) => {
  const [expanded, setExpanded] = useState(true);
  const [saved, setSaved] = useState(false);
  const navigate = useNavigate();

  const getRiskDetails = (s: number) => {
    if (s <= 20) return { label: 'LOW RISK', col: '#16A34A', bg: 'bg-green-50 border-green-200', tCol: 'text-green-800', desc: 'Simplified Due Diligence (SDD) — Proceed with standard onboarding. Document your rationale.' };
    if (s <= 50) return { label: 'MEDIUM RISK', col: '#D97706', bg: 'bg-amber-50 border-amber-200', tCol: 'text-amber-800', desc: 'Standard Customer Due Diligence (CDD) — Complete standard checks before onboarding.' };
    if (s <= 75) return { label: 'HIGH RISK', col: '#DC2626', bg: 'bg-red-50 border-red-200', tCol: 'text-red-800', desc: 'Enhanced Due Diligence (EDD) Required — Conduct enhanced investigation before onboarding. Senior management review recommended.' };
    return { label: 'CRITICAL RISK', col: '#7F1D1D', bg: 'bg-red-900 border-red-900', tCol: 'text-white', desc: '⚠ Enhanced Due Diligence + MLRO Review Required — Do not onboard without written MLRO approval.' };
  };

  const details = getRiskDetails(score);

  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const handleSave = () => {
    // API logic simulated...
    setSaved(true);
  };

  if (saved) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95 duration-500">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-black text-slate-800 mb-2">Assessment Saved</h2>
        <p className="text-slate-500 mb-8">Ref: RA-2026-{Math.floor(Math.random()*9000)+1000}</p>
        
        <div className="space-y-3 w-full">
          <button className="w-full py-3 bg-[#1B4FD8] text-white font-bold rounded-xl hover:bg-blue-700 transition">View Assessment</button>
          <button className="w-full py-3 border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition">Create Case</button>
          <button onClick={() => setSaved(false)} className="w-full py-3 text-[#1B4FD8] font-bold hover:underline">New Assessment</button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col">
       <h3 className="font-bold text-slate-800 mb-6 text-center">Live Score Engine</h3>
       
       <div className="relative flex justify-center mb-6">
         <svg width="160" height="160" className="transform -rotate-90">
            {/* Background Track */}
            <circle cx="80" cy="80" r={radius} stroke="#f1f5f9" strokeWidth="12" fill="transparent" />
            {/* Animated Dynamic Fill */}
            <circle 
              cx="80" cy="80" r={radius} 
              stroke={details.col} strokeWidth="12" fill="transparent"
              strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-700 ease-out"
            />
         </svg>
         <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
            <span className="text-4xl font-black" style={{ color: details.col }}>{score}</span>
            <span className="text-sm font-bold text-slate-400">/ 100</span>
         </div>
       </div>

       <div className="text-center mb-6">
         <span className="inline-block px-4 py-1.5 rounded-full text-sm font-bold tracking-wider text-white mb-4" style={{ backgroundColor: details.col }}>
           {details.label}
         </span>
         <div className={`p-4 rounded-xl border text-sm font-medium leading-relaxed ${details.bg} ${details.tCol}`}>
           {details.desc}
         </div>
       </div>

       <div className="border-t border-slate-100 mt-2 pt-4">
         <button onClick={() => setExpanded(!expanded)} className="flex items-center justify-between w-full text-sm font-bold text-slate-700 mb-4 hover:bg-slate-50 p-2 rounded-lg transition-colors">
            View scoring breakdown 
            <ChevronDown className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`} />
         </button>

         {expanded && (
           <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 mb-6 max-h-64 overflow-y-auto">
             {breakdown.length === 0 ? (
               <p className="text-sm text-slate-500 text-center py-4">Start answering questions to see logic matrix.</p>
             ) : (
               <table className="w-full text-sm text-left">
                 <tbody>
                   {breakdown.map((row: any, idx: number) => (
                      <tr key={idx} className="border-b border-slate-200/50 last:border-0">
                        <td className="py-2 text-slate-600 font-medium">{row.name}</td>
                        <td className={`py-2 text-right font-bold ${row.pts >= 15 ? 'text-red-600' : row.pts >= 5 ? 'text-amber-600' : 'text-green-600'}`}>+{row.pts}</td>
                      </tr>
                   ))}
                   <tr className="border-t-2 border-slate-200">
                      <td className="py-2 font-black text-slate-800">TOTAL</td>
                      <td className="py-2 text-right font-black text-slate-800">{score}</td>
                   </tr>
                 </tbody>
               </table>
             )}
           </div>
         )}
       </div>

       <div className="mt-auto space-y-3">
         <button 
           onClick={handleSave}
           disabled={!isComplete} 
           className="w-full py-3 bg-[#1B4FD8] text-white font-bold rounded-xl hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
         >
           {isComplete ? 'Save Assessment' : `Answer ${8 - breakdown.length} more factors`}
         </button>
         <button disabled={!isComplete} className="w-full py-3 border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition disabled:opacity-50 flex items-center justify-center gap-2">
           Create Case from Assessment <ArrowRight className="w-4 h-4" />
         </button>
         <button disabled={!isComplete} className="w-full py-3 text-[#1B4FD8] font-bold rounded-xl hover:bg-blue-50 transition disabled:opacity-50 flex items-center justify-center gap-2">
           <Download className="w-4 h-4" /> Download PDF Report
         </button>
       </div>

    </div>
  );
};
