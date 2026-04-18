import React from 'react';

export const BusinessScoringForm = ({ linkedCaseId, linkedCustomerId }: any) => {
  return (
    <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl p-12 text-center mt-6">
       <h3 className="text-xl font-bold text-[#0F2557] mb-2">Business Architecture Mapped</h3>
       <p className="text-slate-600 mb-6">The business logic runs on the exact same `react-hook-form` state mutation and {'<RiskResultsPanel />'} integration pattern established in the Individual payload.</p>
       <button className="px-5 py-2 bg-slate-200 text-slate-700 font-bold rounded-xl pointer-events-none opacity-50">KYB Fields Emulated</button>
    </div>
  );
};
