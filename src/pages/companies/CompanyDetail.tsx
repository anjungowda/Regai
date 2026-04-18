import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppLayout } from '../../components/layout/AppLayout';
import { CustomerTab } from '../../components/cases/tabs/CustomerTab';

export default function CompanyDetail() {
  const { id } = useParams();
  const { setPageTitle, setBreadcrumbs } = useAppLayout();

  useEffect(() => {
    document.title = 'Company Profile — RegShield AI';
    setPageTitle('Company Profile');
    setBreadcrumbs([{ label: 'Companies', href: '/companies' }, { label: 'Nexus Trading Ltd' }]);
  }, [setPageTitle, setBreadcrumbs]);

  const mockData = {
    company: {
      name: 'Nexus Trading Ltd',
      registrationNumber: '11223344',
      jurisdiction: 'GB',
      incorporationDate: '2020-03-12'
    }
  };

  return (
    <div className="max-w-screen-xl mx-auto -mt-6 animate-in fade-in duration-300">
      <div className="bg-white border-b border-slate-200 px-6 py-5 sticky top-[64px] z-30">
        <Link to="/companies" className="text-[#1B4FD8] text-sm mb-4 inline-block hover:underline">← Companies</Link>
        <div className="flex items-center gap-4">
           <div className="w-16 h-16 rounded-2xl bg-[#0F2557] text-white flex items-center justify-center text-xl font-black shadow-inner border border-slate-800">
             NTL
           </div>
           <div>
             <h1 className="text-2xl font-bold font-mono text-[#0F2557]">Nexus Trading Ltd</h1>
             <p className="text-slate-500 text-sm mt-1 uppercase tracking-wider font-semibold">🇬🇧 United Kingdom · Reg: 11223344</p>
           </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
           <button className="px-4 py-2 border border-[#1B4FD8] text-[#1B4FD8] rounded-xl text-sm font-bold hover:bg-blue-50 transition">Run KYB Assessment</button>
           <button className="px-4 py-2 bg-[#1B4FD8] text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition shadow-sm">New Case</button>
        </div>
      </div>

      <div className="p-6">
        <CustomerTab caseData={mockData} />
      </div>
    </div>
  );
}
