import React from 'react';
import { format } from 'date-fns';

export const CustomerTab = ({ caseData }: any) => {
  if (!caseData.customer && !caseData.company) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm max-w-2xl mx-auto">
        <h3 className="text-lg font-bold text-slate-800 mb-2">No Entity Linked</h3>
        <p className="text-slate-500 text-sm mb-6">There is no customer or company currently linked to this investigation.</p>
        <button className="px-4 py-2 bg-[#1B4FD8] text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition">Link Entity</button>
      </div>
    );
  }

  const isCompany = !!caseData.company;
  const entity = isCompany ? caseData.company : caseData.customer;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden min-h-[500px] animate-in fade-in duration-300">
      <div className="bg-slate-50 px-6 py-5 border-b border-slate-100 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-black text-[#0F2557]">{isCompany ? entity.name : `${entity.firstName} ${entity.lastName}`}</h2>
          <div className="flex gap-2 mt-1">
            <span className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider">{isCompany ? 'Corporate' : 'Individual'}</span>
            {entity.pepStatus && <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider">PEP</span>}
          </div>
        </div>
        <button className="px-3 py-1.5 text-sm font-medium border border-slate-200 bg-white rounded-lg hover:bg-slate-50">Edit Profile</button>
      </div>

      <div className="p-6">
        {entity.pepStatus && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-xl text-sm font-medium mb-6">
            ⚠ Politically Exposed Person — EDD required
          </div>
        )}
        
        {entity.sanctionsHit && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl text-sm font-medium mb-6">
            ⚠ Confirmed sanctions match — do not proceed without MLRO approval
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
          {!isCompany ? (
            <>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">First Name</p>
                <p className="text-sm font-semibold text-slate-800">{entity.firstName}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Last Name</p>
                <p className="text-sm font-semibold text-slate-800">{entity.lastName}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Date of Birth</p>
                <p className="text-sm font-semibold text-slate-800">{entity.dateOfBirth ? format(new Date(entity.dateOfBirth), 'dd MMM yyyy') : '—'}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Nationality</p>
                <p className="text-sm font-semibold text-slate-800">{entity.nationality || '—'}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Registered Address</p>
                <p className="text-sm font-semibold text-slate-800 whitespace-pre-wrap">{entity.address?.line1 || '—'}</p>
              </div>
            </>
          ) : (
            <>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Company Name</p>
                <p className="text-sm font-semibold text-slate-800">{entity.name}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Registration Number</p>
                <p className="text-sm font-semibold text-slate-800 font-mono">{entity.registrationNumber}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Jurisdiction</p>
                <p className="text-sm font-semibold text-slate-800">{entity.jurisdiction}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Incorporation Date</p>
                <p className="text-sm font-semibold text-slate-800">{entity.incorporationDate ? format(new Date(entity.incorporationDate), 'dd MMM yyyy') : '—'}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Operational Address</p>
                <p className="text-sm font-semibold text-slate-800 whitespace-pre-wrap">{entity.operationalAddress?.line1 || '—'}</p>
              </div>
            </>
          )}
        </div>

        <div className="mt-8 pt-8 border-t border-slate-100">
          <h3 className="font-bold text-slate-800 mb-4">Review Schedule</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Review Frequency</p>
              <p className="text-sm font-bold text-[#1B4FD8]">Annual</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Last Review</p>
              <p className="text-sm font-bold text-slate-800">—</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Next Review Due</p>
              <p className="text-sm font-bold text-amber-600">Pending Setup</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
