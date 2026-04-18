import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { useCaseDetail, useUpdateCase } from '../../hooks/useCaseDetail';
import { useAuth } from '../../hooks/useAuth';
import { useAppLayout } from '../../components/layout/AppLayout';
import { 
  ArrowUpCircle, CheckCircle, Clock, Eye, MessageSquare, 
  Upload, UserCheck, CheckSquare, AlertTriangle, ChevronDown 
} from 'lucide-react';
import { format } from 'date-fns';

import { OverviewTab } from '../../components/cases/tabs/OverviewTab';
import { CustomerTab } from '../../components/cases/tabs/CustomerTab';
import { AlertsTab } from '../../components/cases/tabs/AlertsTab';
import { EvidenceTab } from '../../components/cases/tabs/EvidenceTab';
import { NotesTab } from '../../components/cases/tabs/NotesTab';
import { TasksTab } from '../../components/cases/tabs/TasksTab';
import { DecisionTab } from '../../components/cases/tabs/DecisionTab';
import { AuditTrailTab } from '../../components/cases/tabs/AuditTrailTab';

import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { StatusChangeModal } from '../../components/cases/StatusChangeModal';
import { ReassignModal } from '../../components/cases/ReassignModal';

export default function CaseDetail() {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const { setBreadcrumbs } = useAppLayout();
  
  const activeTab = searchParams.get('tab') || 'overview';
  
  const { data: caseData, isLoading, isError } = useCaseDetail(id as string);
  const updateCase = useUpdateCase(id as string);

  const [escalateConfirmOpen, setEscalateConfirmOpen] = useState(false);
  const [closeConfirmOpen, setCloseConfirmOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [reassignModalOpen, setReassignModalOpen] = useState(false);

  useEffect(() => {
    if (caseData) {
      document.title = `${caseData.id} — RegShield AI`;
      setBreadcrumbs([{ label: 'Cases', href: '/cases' }, { label: caseData.id.substring(0,10) }]);
    }
  }, [caseData, setBreadcrumbs]);

  if (isLoading) {
    return (
      <div className="max-w-screen-xl mx-auto animate-pulse">
        <div className="bg-white border-b border-slate-200 px-6 py-5 sticky top-16 z-30 space-y-4">
          <div className="h-4 bg-slate-200 rounded w-16 mb-2"></div>
          <div className="h-8 bg-slate-200 rounded w-48"></div>
        </div>
        <div className="px-6 py-6 space-y-4">
          <div className="h-64 bg-slate-200 rounded-2xl w-full"></div>
        </div>
      </div>
    );
  }

  if (isError || !caseData) {
    return (
      <div className="max-w-screen-xl mx-auto px-6 py-12 text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Case Not Found</h2>
        <p className="text-slate-500 mb-6">The case you are looking for does not exist or you do not have permission to view it.</p>
        <Link to="/cases" className="text-[#1B4FD8] font-medium hover:underline">← Back to Cases</Link>
      </div>
    );
  }

  const isOverdue = new Date(caseData.dueDate) < new Date();
  const isManager = ['admin', 'compliance_manager'].includes(user?.role ?? '');
  const isAnalystAndAbove = ['admin', 'compliance_manager', 'analyst'].includes(user?.role ?? '');

  const handleEscalate = () => {
    updateCase.mutate({ status: 'ESCALATED' }, { onSuccess: () => setEscalateConfirmOpen(false) });
  };

  const handleClose = () => {
    updateCase.mutate({ status: 'CLOSED' }, { onSuccess: () => setCloseConfirmOpen(false) });
  };

  const handleRequestReview = () => {
    updateCase.mutate({ status: 'PENDING_REVIEW' });
  };

  const statusBadgeClass = () => {
    const s = caseData.status;
    if (s === 'NEW') return 'bg-blue-100 text-blue-800';
    if (s === 'IN_REVIEW') return 'bg-amber-100 text-amber-800';
    if (s === 'ESCALATED') return 'bg-red-100 text-red-800';
    if (s === 'PENDING_REVIEW') return 'bg-purple-100 text-purple-800';
    return 'bg-slate-100 text-slate-600';
  };

  const riskBadgeClass = () => {
    const r = caseData.riskLevel;
    if (r === 'LOW') return 'bg-green-100 text-green-800 border-green-200';
    if (r === 'MEDIUM') return 'bg-amber-100 text-amber-800 border-amber-200';
    if (r === 'HIGH') return 'bg-red-100 text-red-800 border-red-200';
    return 'bg-red-900 text-white border-transparent';
  };

  return (
    <div className="max-w-screen-xl mx-auto -mt-6">
      {/* HEADER */}
      <div className="bg-white border-b border-slate-200 px-6 py-5 sticky top-[64px] z-30">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
          <div>
            <Link to="/cases" className="text-[#1B4FD8] text-sm mb-2 inline-block hover:underline">← Cases</Link>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold font-mono text-[#0F2557]">{caseData.id.substring(0,10)}</h1>
              <span className="bg-blue-50 text-[#1B4FD8] border border-blue-200 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider">{caseData.caseType.replace(/_/g, ' ')}</span>
            </div>
            <p className="text-slate-500 text-sm mt-1">Opened {format(new Date(caseData.createdAt), 'dd MMM yyyy')} by External API</p>
          </div>

          <div className="flex gap-3 items-start shrink-0">
            <button 
              disabled={!isAnalystAndAbove} 
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm font-semibold transition-colors ${riskBadgeClass()}`}
            >
              {caseData.riskLevel} {isAnalystAndAbove && <ChevronDown className="w-3 h-3" />}
            </button>
            <button 
              onClick={() => isAnalystAndAbove && setStatusModalOpen(true)}
              disabled={!isAnalystAndAbove || caseData.status === 'CLOSED'}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold transition-colors ${statusBadgeClass()}`}
            >
              {caseData.status.replace(/_/g, ' ')} 
              {isAnalystAndAbove && caseData.status !== 'CLOSED' && <ChevronDown className="w-3 h-3" />}
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-x-6 gap-y-2 mt-3 text-sm text-slate-600">
          <div className="flex items-center gap-1.5">
            <UserCheck className="w-4 h-4 text-slate-400" />
            <span>Assigned to: <span className="font-semibold text-slate-800">{caseData.assignedTo || 'Unassigned'}</span></span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className={`w-4 h-4 ${isOverdue ? 'text-red-600' : 'text-slate-400'}`} />
            <span className={isOverdue ? 'text-red-600 font-medium' : ''}>SLA: {format(new Date(caseData.dueDate), 'dd MMM yyyy')}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Eye className="w-4 h-4 text-slate-400" />
            <span>Reviewer: Not assigned</span>
          </div>
          {isOverdue && (
            <div className="flex items-center gap-1.5 text-red-600 font-medium">
              <AlertTriangle className="w-4 h-4" /> <span>Overdue SLA</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-100">
          <button onClick={() => setSearchParams({ tab: 'notes' })} className="px-3 py-1.5 bg-slate-50 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-100 border border-slate-200 flex items-center gap-1.5 transition-colors">
            <MessageSquare className="w-4 h-4 text-slate-400" /> Add Note
          </button>
          <button onClick={() => setSearchParams({ tab: 'evidence' })} className="px-3 py-1.5 bg-slate-50 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-100 border border-slate-200 flex items-center gap-1.5 transition-colors">
            <Upload className="w-4 h-4 text-slate-400" /> Upload Evidence
          </button>
          <button onClick={() => setSearchParams({ tab: 'tasks' })} className="px-3 py-1.5 bg-slate-50 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-100 border border-slate-200 flex items-center gap-1.5 transition-colors">
            <CheckSquare className="w-4 h-4 text-slate-400" /> Add Task
          </button>
          
          <div className="border-l border-slate-300 mx-2 hidden sm:block"></div>

          {isAnalystAndAbove && caseData.status !== 'ESCALATED' && caseData.status !== 'CLOSED' && (
            <button onClick={() => setEscalateConfirmOpen(true)} className="px-3 py-1.5 text-red-600 hover:bg-red-50 text-sm font-medium rounded-lg border border-transparent transition-colors flex items-center gap-1.5">
              <ArrowUpCircle className="w-4 h-4" /> Escalate
            </button>
          )}

          {isAnalystAndAbove && caseData.status !== 'PENDING_REVIEW' && caseData.status !== 'CLOSED' && (
            <button onClick={handleRequestReview} className="px-3 py-1.5 text-[#1B4FD8] hover:bg-blue-50 text-sm font-medium rounded-lg border border-transparent transition-colors flex items-center gap-1.5">
              <Eye className="w-4 h-4" /> Request Review
            </button>
          )}

          {isManager && caseData.status === 'PENDING_REVIEW' && (
            <button onClick={() => setCloseConfirmOpen(true)} className="px-3 py-1.5 bg-green-600 text-white hover:bg-green-700 text-sm font-medium rounded-lg border border-transparent transition-colors flex items-center gap-1.5 shadow-sm">
              <CheckCircle className="w-4 h-4" /> Close Case
            </button>
          )}
        </div>
      </div>

      {/* TABS NAVIGATION */}
      <div className="bg-white border-b border-slate-200 px-6 sticky top-[188px] z-20 overflow-x-auto hide-scrollbar">
        <div className="flex min-w-max">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'customer', label: 'Customer / Company' },
            { id: 'alerts', label: 'Alerts & Flags', count: 0 },
            { id: 'evidence', label: 'Evidence', count: 0 },
            { id: 'notes', label: 'Notes', count: 0 },
            { id: 'tasks', label: 'Tasks', count: 0 },
            { id: 'decision', label: 'Decision' },
            { id: 'audit-trail', label: 'Audit Trail' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSearchParams({ tab: tab.id })}
              className={`px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                activeTab === tab.id 
                  ? 'text-[#1B4FD8] border-[#1B4FD8]' 
                  : 'text-slate-500 border-transparent hover:text-slate-700'
              }`}
            >
              {tab.label}
              {typeof tab.count === 'number' && (
                <span className="ml-1.5 bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-full font-bold">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* TAB CONTENT AREAS */}
      <div className="p-6 min-h-[400px]">
        {activeTab === 'overview' && <OverviewTab caseData={caseData} updateCase={updateCase} />}
        {activeTab === 'customer' && <CustomerTab caseData={caseData} />}
        {activeTab === 'alerts' && <AlertsTab caseData={caseData} />}
        {activeTab === 'evidence' && <EvidenceTab caseData={caseData} />}
        {activeTab === 'notes' && <NotesTab caseData={caseData} />}
        {activeTab === 'tasks' && <TasksTab caseData={caseData} />}
        {activeTab === 'decision' && <DecisionTab caseData={caseData} updateCase={updateCase} isManager={isManager} />}
        {activeTab === 'audit-trail' && <AuditTrailTab caseData={caseData} />}
      </div>

      {/* MODALS */}
      <StatusChangeModal isOpen={statusModalOpen} onClose={() => setStatusModalOpen(false)} caseId={id!} currentStatus={caseData.status} />
      <ReassignModal isOpen={reassignModalOpen} onClose={() => setReassignModalOpen(false)} caseId={id!} currentAssigneeId={caseData.assignedTo} />
      <ConfirmDialog 
        isOpen={escalateConfirmOpen} 
        onCancel={() => setEscalateConfirmOpen(false)} 
        onConfirm={handleEscalate} 
        title="Escalate Case" 
        message="Are you sure you want to escalate this case to MLRO? This will immediately transition its status." 
        confirmLabel="Escalate" 
        confirmVariant="danger" 
      />
      <ConfirmDialog 
        isOpen={closeConfirmOpen} 
        onCancel={() => setCloseConfirmOpen(false)} 
        onConfirm={handleClose} 
        title="Close Case" 
        message="You are about to securely close this case. The decision record will be permanently locked." 
        confirmLabel="Close Case" 
        confirmVariant="primary" 
      />
    </div>
  );
}
