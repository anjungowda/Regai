import React, { useState } from 'react';
import { Edit2, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { Link } from 'react-router-dom';

export const OverviewTab = ({ caseData, updateCase }: any) => {
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [descInput, setDescInput] = useState(caseData.description || '');

  const handleSaveDesc = () => {
    updateCase.mutate({ description: descInput }, { onSuccess: () => setIsEditingDesc(false) });
  };

  const isOverdue = new Date(caseData.dueDate) < new Date();
  const totalDays = differenceInDays(new Date(caseData.dueDate), new Date(caseData.createdAt)) || 1;
  const elapsedDays = differenceInDays(new Date(), new Date(caseData.createdAt));
  const progressPercent = Math.min(Math.max((elapsedDays / totalDays) * 100, 0), 100);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
      
      {/* LEFT COLUMN */}
      <div className="lg:col-span-2 space-y-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-800 text-lg">Case Summary</h3>
            {!isEditingDesc && (
              <button onClick={() => setIsEditingDesc(true)} className="text-[#1B4FD8] hover:bg-blue-50 p-1.5 rounded-lg transition-colors">
                <Edit2 className="w-4 h-4" />
              </button>
            )}
          </div>
          
          {isEditingDesc ? (
            <div className="space-y-3">
              <textarea 
                value={descInput}
                onChange={(e) => setDescInput(e.target.value)}
                className="w-full min-h-[100px] border border-slate-200 rounded-xl p-3 text-sm focus:border-[#1B4FD8] outline-none"
              />
              <div className="flex gap-2 justify-end">
                <button onClick={() => setIsEditingDesc(false)} className="px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 rounded-lg font-medium">Cancel</button>
                <button onClick={handleSaveDesc} className="px-3 py-1.5 text-sm bg-[#1B4FD8] text-white rounded-lg font-medium">Save</button>
              </div>
            </div>
          ) : (
            <p className={`text-sm leading-relaxed ${caseData.description ? 'text-slate-700' : 'text-slate-400 italic'}`}>
              {caseData.description || 'No description added.'}
            </p>
          )}

          <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-slate-100">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">Priority</p>
              <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${caseData.priority === 'URGENT' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'}`}>
                {caseData.priority || 'NORMAL'}
              </span>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">Case Type</p>
              <p className="text-sm font-medium text-slate-800">{caseData.caseType.replace(/_/g, ' ')}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">Created</p>
              <p className="text-sm font-medium text-slate-800">{format(new Date(caseData.createdAt), 'dd MMM yyyy')}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">Last Updated</p>
              <p className="text-sm font-medium text-slate-800">{format(new Date(caseData.updatedAt), 'dd MMM yyyy HH:mm')}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-slate-800 text-lg mb-4">SLA Deadline</h3>
          <div className="flex items-center gap-3 mb-4">
            {isOverdue ? <AlertTriangle className="w-8 h-8 text-red-600" /> : <Clock className="w-8 h-8 text-amber-500" />}
            <div>
              <p className={`text-2xl font-black ${isOverdue ? 'text-red-600' : 'text-slate-800'}`}>
                {format(new Date(caseData.dueDate), 'dd MMMM yyyy')}
              </p>
              <p className={`text-sm font-medium ${isOverdue ? 'text-red-600' : 'text-slate-500'}`}>
                {isOverdue ? `${Math.abs(differenceInDays(new Date(), new Date(caseData.dueDate)))} days overdue` : `${Math.abs(differenceInDays(new Date(caseData.dueDate), new Date()))} days remaining`}
              </p>
            </div>
          </div>
          
          <div className="w-full bg-slate-100 rounded-full h-2 mt-3 overflow-hidden">
            <div 
              className={`h-full rounded-full ${isOverdue ? 'bg-red-600' : progressPercent > 80 ? 'bg-amber-500' : 'bg-green-500'}`}
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-slate-100 text-right">
            <button className="text-sm text-[#1B4FD8] font-medium hover:underline">Extend SLA</button>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN */}
      <div className="space-y-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-4">Case Team</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#0F2557] text-white flex items-center justify-center font-bold text-sm uppercase">
                  {(caseData.assignedTo && typeof caseData.assignedTo === 'object' ? caseData.assignedTo.fullName : (caseData.assignedTo || 'U'))[0]}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">
                    {caseData.assignedTo && typeof caseData.assignedTo === 'object' ? caseData.assignedTo.fullName : (caseData.assignedTo || 'Unassigned')}
                  </p>
                  <p className="text-xs text-slate-500">Assigned Analyst</p>
                </div>
              </div>
              <button className="text-xs text-[#1B4FD8] font-medium hover:underline">Reassign</button>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center font-bold text-sm">?</div>
                <div>
                  <p className="text-sm font-bold text-slate-800 text-slate-400">Not assigned</p>
                  <p className="text-xs text-slate-500">Reviewer</p>
                </div>
              </div>
              <button className="text-xs text-[#1B4FD8] font-medium hover:underline">Assign</button>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm bg-gradient-to-br from-white to-slate-50">
          <h3 className="font-bold text-slate-800 mb-4">Risk Assessment</h3>
          <div className="flex flex-col items-center justify-center py-4">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center border-4 mb-3 ${
              caseData.riskLevel === 'LOW' ? 'border-green-500 text-green-700' :
              caseData.riskLevel === 'MEDIUM' ? 'border-amber-500 text-amber-700' : 'border-red-600 text-red-700'
            }`}>
              <span className="text-sm font-black">{caseData.riskLevel}</span>
            </div>
            <p className="text-sm font-bold text-slate-800 text-center">Enhanced Due Diligence Recommended</p>
            <p className="text-xs text-slate-500 text-center mt-1">Assessed {format(new Date(caseData.createdAt), 'dd MMM yyyy')}</p>
          </div>
          <Link to={`/risk-scoring?caseId=${caseData.id}`} className="block w-full py-2 bg-white border border-slate-200 text-slate-700 text-center text-sm font-bold rounded-lg hover:bg-slate-50 transition-colors shadow-sm mt-2">
            Run Risk Assessment
          </Link>
        </div>
      </div>
    </div>
  );
};
