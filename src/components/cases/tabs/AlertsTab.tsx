import React from 'react';
import { Plus, BellRing, Flag } from 'lucide-react';
import { format } from 'date-fns';

export const AlertsTab = ({ caseData }: any) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* ALERTS SECTION */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
            Alerts <span className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-full font-bold">0</span>
          </h3>
          <button className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition flex items-center gap-1.5">
            <Plus className="w-4 h-4" /> Add Alert
          </button>
        </div>

        <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center">
          <BellRing className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-600 font-medium">No alerts linked to this case</p>
          <p className="text-slate-400 text-sm mt-1 mb-4">Transaction monitoring alerts will display here.</p>
        </div>
      </section>

      {/* FLAGS SECTION */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
            Risk Flags <span className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-full font-bold">0</span>
          </h3>
          <button className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition flex items-center gap-1.5">
            <Plus className="w-4 h-4" /> Add Flag
          </button>
        </div>

        <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center">
          <Flag className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-600 font-medium">No risk flags generated</p>
          <p className="text-slate-400 text-sm mt-1 mb-4">Manual and automated risk flags will display here.</p>
        </div>
      </section>
    </div>
  );
};
