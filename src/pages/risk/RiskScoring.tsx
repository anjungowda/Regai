import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAppLayout } from '../../components/layout/AppLayout';
import { Info, Search } from 'lucide-react';
import { IndividualScoringForm } from '../../components/risk/IndividualScoringForm';
import { BusinessScoringForm } from '../../components/risk/BusinessScoringForm';

export default function RiskScoring() {
  const { setPageTitle, setBreadcrumbs } = useAppLayout();
  const [searchParams] = useSearchParams();
  
  const [activeTab, setActiveTab] = useState<'individual' | 'business'>('individual');
  const [caseSearch, setCaseSearch] = useState(searchParams.get('caseId') || '');
  const [customerSearch, setCustomerSearch] = useState(searchParams.get('customerId') || '');

  useEffect(() => {
    document.title = 'Risk Scoring — RegShield AI';
    setPageTitle('Risk Scoring');
    setBreadcrumbs([{ label: 'Risk Scoring' }]);
  }, [setPageTitle, setBreadcrumbs]);

  return (
    <div className="max-w-[1600px] mx-auto pb-10 animate-in fade-in duration-300">
      
      <div className="mb-6">
        <h1 className="font-bold text-2xl text-[#0F2557]">Customer Risk Scoring Engine</h1>
        <p className="text-slate-500 text-sm mt-1">Assess individual or business customer risk using a structured, rule-based methodology aligned to UK AML regulations.</p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3 mb-6 shadow-sm">
        <Info className="w-5 h-5 text-[#1B4FD8] shrink-0 mt-0.5" />
        <p className="text-blue-900 text-sm font-medium leading-relaxed">
          RegShield AI uses a transparent, rule-based scoring methodology. Every score is fully explainable — you can show regulators exactly how each risk rating was reached. No black boxes.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-6 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex gap-2 bg-slate-100 p-1 rounded-xl w-full md:w-auto">
          <button 
            onClick={() => setActiveTab('individual')}
            className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors flex-1 md:flex-none ${activeTab === 'individual' ? 'bg-[#1B4FD8] text-white shadow-sm' : 'text-slate-600 hover:text-slate-800'}`}
          >
            Individual Customer
          </button>
          <button 
            onClick={() => setActiveTab('business')}
            className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors flex-1 md:flex-none ${activeTab === 'business' ? 'bg-[#1B4FD8] text-white shadow-sm' : 'text-slate-600 hover:text-slate-800'}`}
          >
            Business Customer
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Link to case (optional)" 
              value={caseSearch}
              onChange={(e) => setCaseSearch(e.target.value)}
              className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm w-full outline-none focus:ring-1 focus:ring-[#1B4FD8]"
            />
          </div>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Link to customer (optional)" 
              value={customerSearch}
              onChange={(e) => setCustomerSearch(e.target.value)}
              className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm w-full outline-none focus:ring-1 focus:ring-[#1B4FD8]"
            />
          </div>
        </div>
      </div>

      <div className="w-full">
        {activeTab === 'individual' ? <IndividualScoringForm linkedCaseId={caseSearch} linkedCustomerId={customerSearch} /> : <BusinessScoringForm linkedCaseId={caseSearch} linkedCustomerId={customerSearch} />}
      </div>
      
    </div>
  );
}
