import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppLayout } from '../../components/layout/AppLayout';
import { CustomerTab } from '../../components/cases/tabs/CustomerTab';

export default function CustomerDetail() {
  const { id } = useParams();
  const { setPageTitle, setBreadcrumbs } = useAppLayout();

  useEffect(() => {
    document.title = 'Customer Profile — RegShield AI';
    setPageTitle('Customer Profile');
    setBreadcrumbs([{ label: 'Customers', href: '/customers' }, { label: 'John Williams' }]);
  }, [setPageTitle, setBreadcrumbs]);

  // Mock data mapping to existing Case Tab formats
  const mockData = {
    customer: {
      firstName: 'John',
      lastName: 'Williams',
      pepStatus: false,
      dateOfBirth: '1985-06-15',
      nationality: 'GB'
    }
  };

  return (
    <div className="max-w-screen-xl mx-auto -mt-6 animate-in fade-in duration-300">
      <div className="bg-white border-b border-slate-200 px-6 py-5 sticky top-[64px] z-30">
        <Link to="/customers" className="text-[#1B4FD8] text-sm mb-4 inline-block hover:underline">← Customers</Link>
        <div className="flex items-center gap-4">
           <div className="w-16 h-16 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-xl font-black">
             JW
           </div>
           <div>
             <h1 className="text-2xl font-bold font-mono text-[#0F2557]">John Williams</h1>
             <p className="text-slate-500 text-sm mt-1 uppercase tracking-wider font-semibold">🇬🇧 United Kingdom</p>
           </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
           <Link to={`/risk-scoring?customerId=${id}`} className="px-4 py-2 border border-[#1B4FD8] text-[#1B4FD8] rounded-xl text-sm font-bold hover:bg-blue-50 transition">Run Risk Assessment</Link>
           <button className="px-4 py-2 bg-[#1B4FD8] text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition shadow-sm">New Case</button>
        </div>
      </div>

      <div className="p-6">
        {/* We can re-use the exact same UI payload from Case Manager */}
        <CustomerTab caseData={mockData} />
      </div>
    </div>
  );
}
