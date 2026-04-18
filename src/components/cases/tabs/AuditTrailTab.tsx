import React, { useState } from 'react';
import { useCaseAuditLog } from '../../../hooks/useAuditLog';
import { format, formatDistanceToNow } from 'date-fns';
import { Download, Info, ShieldAlert } from 'lucide-react';

export const AuditTrailTab = ({ caseData }: any) => {
  const { data: rawLogs, isLoading } = useCaseAuditLog(caseData.id);
  const [filter, setFilter] = useState('ALL');

  const logs = (rawLogs || []).filter((log: any) => {
    if (filter === 'ALL') return true;
    if (filter === 'CHANGES' && (log.action.includes('updated') || log.action.includes('status'))) return true;
    if (filter === 'EVIDENCE' && log.action.includes('evidence')) return true;
    if (filter === 'NOTES' && (log.action.includes('note') || log.action.includes('task'))) return true;
    if (filter === 'DECISIONS' && (log.action.includes('decision') || log.action.includes('assessed'))) return true;
    return false;
  });

  const getLogStyle = (action: string) => {
    if (action.includes('created')) return 'bg-[#1B4FD8]';
    if (action.includes('closed')) return 'bg-green-500';
    if (action.includes('updated') || action.includes('status')) return 'bg-amber-400';
    if (action.includes('evidence_uploaded')) return 'bg-purple-500';
    if (action.includes('evidence_deleted')) return 'bg-red-500';
    if (action.includes('note')) return 'bg-slate-400';
    if (action.includes('task')) return 'bg-green-400';
    if (action.includes('assessed')) return 'bg-orange-400';
    if (action.includes('decision')) return 'bg-[#0F2557]';
    return 'bg-slate-300';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-8 border-b border-slate-100 pb-6">
        <div>
          <h3 className="font-bold text-xl text-slate-800">Audit Trail</h3>
          <p className="text-sm text-slate-500 mt-1">A permanent, uneditable record of every action on this case.</p>
        </div>
        <button className="px-4 py-2 bg-white border border-slate-200 text-[#1B4FD8] text-sm font-bold rounded-xl hover:bg-slate-50 transition flex items-center gap-2 shadow-sm shrink-0">
          <Download className="w-4 h-4" /> Export as PDF
        </button>
      </div>

      <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-xl px-5 py-4 text-sm flex gap-3 shadow-sm">
        <Info className="w-5 h-5 shrink-0 mt-0.5" />
        <p className="font-medium leading-relaxed">This audit trail is generated automatically and cannot be edited, deleted or disabled by any user. It forms part of the ultimate compliance record for this case.</p>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-8 bg-slate-100 p-1 w-fit rounded-xl">
        {[
          { id: 'ALL', label: 'All actions' },
          { id: 'CHANGES', label: 'Case changes' },
          { id: 'EVIDENCE', label: 'Evidence' },
          { id: 'NOTES', label: 'Notes & Tasks' },
          { id: 'DECISIONS', label: 'Decisions' }
        ].map(f => (
          <button 
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors ${filter === f.id ? 'bg-white text-[#0F2557] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Timeline */}
      <div className="relative border-l-2 border-slate-200 ml-4 pb-12">
        {isLoading ? (
          <div className="ml-8 space-y-6">
            <div className="h-24 bg-slate-100 rounded-xl animate-pulse"></div>
            <div className="h-32 bg-slate-100 rounded-xl animate-pulse"></div>
          </div>
        ) : logs.length === 0 ? (
          <div className="ml-8 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center">
            <ShieldAlert className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-600 font-medium">No records found for this filter.</p>
          </div>
        ) : (
          logs.map((log: any) => (
            <div key={log.id} className="relative mb-6 group">
              <div className={`absolute -left-[25px] top-4 w-3 h-3 rounded-full border-[3px] border-white shadow-sm transition-transform group-hover:scale-125 ${getLogStyle(log.action)}`}></div>
              
              <div className="ml-8 bg-white border border-slate-100 rounded-xl p-5 shadow-sm hover:shadow-md transition">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="text-sm font-bold text-slate-800">{log.action.replace(/_/g, ' ').toUpperCase()}</h4>
                  <div className="text-right">
                    <p className="text-xs font-bold text-[#1B4FD8]">{formatDistanceToNow(new Date(log.createdAt))} ago</p>
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">{format(new Date(log.createdAt), 'dd MMM yyyy, HH:mm')}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-[10px]">
                    {log.user?.firstName?.[0] || 'S'}
                  </div>
                  <p className="text-xs font-medium text-slate-600">
                    <span className="font-bold text-slate-800">{log.user ? `${log.user.firstName} ${log.user.lastName}` : 'System'}</span> 
                    {' • '} <span className="uppercase tracking-wider">{log.user?.role?.replace('_', ' ') || 'SYSTEM'}</span>
                    {' • '} <span className="text-slate-400 font-mono">{log.ipAddress}</span>
                  </p>
                </div>

                {log.details && Object.keys(log.details).length > 0 && (
                  <div className="bg-slate-50 rounded-lg p-3 mt-3 border border-slate-100 grid grid-cols-1 gap-2">
                    {Object.entries(log.details).map(([key, diff]: [string, any]) => {
                      if (diff?.old !== undefined && diff?.new !== undefined) {
                        return (
                          <div key={key} className="text-xs font-mono">
                            <span className="font-bold text-slate-600 mr-2">{key}:</span>
                            <span className="text-red-500 line-through mr-2">{String(diff.old)}</span>
                            <span className="text-slate-400 mr-2">→</span>
                            <span className="text-green-600 font-bold">{String(diff.new)}</span>
                          </div>
                        );
                      }
                      return (
                        <div key={key} className="text-xs font-mono">
                          <span className="font-bold text-slate-600">{key}:</span> <span className="text-slate-800 break-words">{JSON.stringify(diff)}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
