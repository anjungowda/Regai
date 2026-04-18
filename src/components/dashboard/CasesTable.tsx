import React, { useState } from 'react';
import { useMyCases } from '../../hooks/useCases';
import { useAuth } from '../../hooks/useAuth';
import { Search, Briefcase, ChevronUp, ChevronDown, ChevronRight, ChevronLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

export const CasesTable: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isManager = ['admin', 'compliance_manager'].includes(user?.role ?? '');
  
  const [activeFilter, setActiveFilter] = useState<'all' | 'high_risk' | 'overdue' | 'escalated'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const { data: casesResponse, isLoading } = useMyCases();
  const cases = casesResponse?.cases || [];
  
  // Local filtering mimicking API filters for simplicity in this frontend test environment,
  // since the hook just fires /cases with limited params.
  let filteredCases = cases;
  if (activeFilter === 'high_risk') {
    filteredCases = cases.filter((c: any) => c.riskLevel === 'HIGH' || c.riskLevel === 'CRITICAL');
  } else if (activeFilter === 'overdue') {
    filteredCases = cases.filter((c: any) => new Date(c.dueDate) < new Date());
  } else if (activeFilter === 'escalated') {
    filteredCases = cases.filter((c: any) => c.status === 'ESCALATED');
  }

  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filteredCases = filteredCases.filter((c: any) => 
      c.id.toLowerCase().includes(q) || 
      (c.customer?.firstName && `${c.customer.firstName} ${c.customer.lastName}`.toLowerCase().includes(q)) ||
      (c.company?.name && c.company.name.toLowerCase().includes(q))
    );
  }

  const [sortCol, setSortCol] = useState('dueDate');
  const [sortAsc, setSortAsc] = useState(true);

  // Local Sort
  filteredCases.sort((a: any, b: any) => {
    let aVal = a[sortCol];
    let bVal = b[sortCol];
    if (sortCol === 'customer') {
      aVal = a.customer ? `${a.customer.firstName} ${a.customer.lastName}` : (a.company?.name || '');
      bVal = b.customer ? `${b.customer.firstName} ${b.customer.lastName}` : (b.company?.name || '');
    } else if (sortCol === 'riskLevel') {
      const riskScores: any = { 'LOW': 1, 'MEDIUM': 2, 'HIGH': 3, 'CRITICAL': 4 };
      aVal = riskScores[a.riskLevel] || 0;
      bVal = riskScores[b.riskLevel] || 0;
    }
    
    if (aVal < bVal) return sortAsc ? -1 : 1;
    if (aVal > bVal) return sortAsc ? 1 : -1;
    return 0;
  });

  const getEmptyStateText = () => {
    switch(activeFilter) {
      case 'high_risk': return "No high-risk cases found.";
      case 'overdue': return "No overdue cases. Great work!";
      case 'escalated': return "No escalated cases.";
      default: return "You have no open cases. Create your first case to get started.";
    }
  };

  const statusBadge = (status: string) => {
    switch(status) {
      case 'NEW': return <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs font-medium">New</span>;
      case 'IN_REVIEW': return <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full text-xs font-medium">In Review</span>;
      case 'ESCALATED': return <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded-full text-xs font-medium">Escalated</span>;
      case 'PENDING_REVIEW': return <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full text-xs font-medium">Pending Review</span>;
      default: return <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded-full text-xs font-medium">{status.replace('_', ' ')}</span>;
    }
  };

  const riskBadge = (risk: string) => {
    switch(risk) {
      case 'LOW': return <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs font-medium">Low</span>;
      case 'MEDIUM': return <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full text-xs font-medium">Medium</span>;
      case 'HIGH': return <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded-full text-xs font-medium">High</span>;
      case 'CRITICAL': return <span className="bg-red-900 text-white px-2 py-0.5 rounded-full text-xs font-medium">Critical</span>;
      default: return null;
    }
  };

  const caseTypeBadge = (type: string) => {
    switch(type) {
      case 'ONBOARDING': return <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-md text-xs font-medium">Onboarding</span>;
      case 'KYB_REVIEW': return <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded-md text-xs font-medium">KYB</span>;
      case 'PERIODIC_REVIEW': return <span className="bg-teal-100 text-teal-800 px-2 py-0.5 rounded-md text-xs font-medium">Periodic Review</span>;
      case 'TRANSACTION_MONITORING': return <span className="bg-orange-100 text-orange-800 px-2 py-0.5 rounded-md text-xs font-medium">TM Alert</span>;
      case 'ENHANCED_DUE_DILIGENCE': return <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded-md text-xs font-medium">EDD</span>;
      case 'LENDING_REVIEW': return <span className="bg-cyan-100 text-cyan-800 px-2 py-0.5 rounded-md text-xs font-medium">Lending</span>;
      default: return <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md text-xs font-medium">Ad-hoc</span>;
    }
  };

  const sortIcon = (col: string) => {
    if (sortCol !== col) return <ChevronUp className="w-3 h-3 text-slate-300 ml-1 inline" />;
    return sortAsc ? <ChevronUp className="w-3 h-3 text-[#1B4FD8] ml-1 inline" /> : <ChevronDown className="w-3 h-3 text-[#1B4FD8] ml-1 inline" />;
  };

  const toggleSort = (col: string) => {
    if (sortCol === col) setSortAsc(!sortAsc);
    else { setSortCol(col); setSortAsc(true); }
  };

  const pageTotal = filteredCases.length;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
      
      {/* Header Row */}
      <div className="px-6 py-4 border-b border-slate-100 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div className="flex items-center">
          <h2 className="font-semibold text-slate-800 text-lg">
            {isManager ? "All Open Cases" : "My Cases"}
          </h2>
          <span className="rounded-full bg-slate-100 text-slate-600 text-xs px-2.5 py-0.5 ml-3 font-medium">
            {pageTotal} cases
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex bg-slate-100/50 p-1 rounded-xl border border-slate-200">
            {[
              { id: 'all', label: 'All' },
              { id: 'high_risk', label: 'High Risk' },
              { id: 'overdue', label: 'Overdue' },
              { id: 'escalated', label: 'Escalated' }
            ].map(f => (
              <button 
                key={f.id}
                onClick={() => setActiveFilter(f.id as any)}
                className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${activeFilter === f.id ? 'bg-[#1B4FD8] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200/50'}`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search cases..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm w-full sm:w-48 focus:outline-none focus:ring-2 focus:ring-[#1B4FD8]/20 focus:border-[#1B4FD8]/30 transition-all"
            />
          </div>

          <Link to="/cases" className="text-[#1B4FD8] text-sm font-medium hover:underline ml-auto xl:ml-0 shrink-0">
            View All Cases →
          </Link>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="overflow-x-auto min-h-[300px]">
        {/* Mobile View */}
        <div className="md:hidden p-4 space-y-3 bg-slate-50/50 min-h-full">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-xl p-4 mb-3">
                 <div className="h-4 bg-slate-200 animate-shimmer rounded w-1/2 mb-3"></div>
                 <div className="h-4 bg-slate-200 animate-shimmer rounded w-3/4"></div>
              </div>
            ))
          ) : filteredCases.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center bg-white rounded-xl border border-dashed border-slate-200">
               <Briefcase className="w-10 h-10 text-slate-300 mb-3" />
               <p className="text-slate-600 font-medium whitespace-pre-wrap">{getEmptyStateText()}</p>
            </div>
          ) : (
            filteredCases.map((c: any) => (
              <div key={c.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm relative cursor-pointer hover:border-blue-200 transition-colors" onClick={() => navigate(`/cases/${c.id}`)}>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[#1B4FD8] font-mono font-bold text-sm">{c.id.substring(0,12)}</span>
                  <div className="flex gap-1.5">
                    {riskBadge(c.riskLevel)}
                    {statusBadge(c.status)}
                  </div>
                </div>
                <div className="text-slate-700 text-sm font-medium mb-2 truncate">
                  {c.customer ? `${c.customer.firstName} ${c.customer.lastName}` : (c.company?.name || '—')}
                </div>
                <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-100">
                  <div className="text-slate-500 text-xs flex items-center gap-2">
                    <span className="font-semibold text-slate-700">{format(new Date(c.dueDate), 'dd MMM yyyy')}</span>
                    {new Date(c.dueDate) < new Date() && <span className="bg-red-100 text-red-700 px-1.5 py-0.5 rounded text-[10px] uppercase font-bold">Overdue</span>}
                  </div>
                  <span className="text-[#1B4FD8] text-xs font-semibold flex items-center">Open <ChevronRight className="w-3 h-3 ml-0.5" /></span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop Table View */}
        <table className="w-full hidden md:table">
          <thead>
            <tr>
              <th className="text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3 bg-slate-50 border-b border-slate-200 text-left cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => toggleSort('id')}>
                Case ID {sortIcon('id')}
              </th>
              <th className="text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3 bg-slate-50 border-b border-slate-200 text-left">
                Type
              </th>
              <th className="text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3 bg-slate-50 border-b border-slate-200 text-left cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => toggleSort('customer')}>
                Customer / Company {sortIcon('customer')}
              </th>
              <th className="text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3 bg-slate-50 border-b border-slate-200 text-left cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => toggleSort('riskLevel')}>
                Risk Level {sortIcon('riskLevel')}
              </th>
              <th className="text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3 bg-slate-50 border-b border-slate-200 text-left cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => toggleSort('status')}>
                Status {sortIcon('status')}
              </th>
              <th className="text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3 bg-slate-50 border-b border-slate-200 text-left cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => toggleSort('dueDate')}>
                SLA Deadline {sortIcon('dueDate')}
              </th>
              {isManager && (
                <th className="text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3 bg-slate-50 border-b border-slate-200 text-left">
                  Assigned To
                </th>
              )}
              <th className="text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3 bg-slate-50 border-b border-slate-200 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-slate-50">
                  <td className="px-5 py-4"><div className="h-4 w-24 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-200 animate-shimmer rounded" /></td>
                  <td className="px-5 py-4"><div className="h-4 w-20 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-200 animate-shimmer rounded" /></td>
                  <td className="px-5 py-4"><div className="h-4 w-32 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-200 animate-shimmer rounded" /></td>
                  <td className="px-5 py-4"><div className="h-4 w-16 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-200 animate-shimmer rounded" /></td>
                  <td className="px-5 py-4"><div className="h-4 w-20 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-200 animate-shimmer rounded" /></td>
                  <td className="px-5 py-4"><div className="h-4 w-24 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-200 animate-shimmer rounded" /></td>
                  {isManager && <td className="px-5 py-4"><div className="h-4 w-24 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-200 animate-shimmer rounded" /></td>}
                  <td className="px-5 py-4 text-right"><div className="h-4 w-12 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-200 animate-shimmer rounded ml-auto" /></td>
                </tr>
              ))
            ) : filteredCases.length === 0 ? (
              <tr>
                <td colSpan={isManager ? 8 : 7} className="px-5 py-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <Briefcase className="w-10 h-10 text-slate-300 mb-3" />
                    <p className="text-slate-600 font-medium">{getEmptyStateText()}</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredCases.map((c: any) => {
                const isOverdue = new Date(c.dueDate) < new Date();
                return (
                  <tr key={c.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-4 text-sm font-mono text-[#1B4FD8] font-semibold">
                      <Link to={`/cases/${c.id}`} className="hover:underline">{c.id.substring(0,12)}...</Link>
                    </td>
                    <td className="px-5 py-4">{caseTypeBadge(c.caseType)}</td>
                    <td className="px-5 py-4 text-sm text-slate-700 font-medium">
                      {c.customer ? `${c.customer.firstName} ${c.customer.lastName}` : (c.company?.name || '—')}
                    </td>
                    <td className="px-5 py-4">{riskBadge(c.riskLevel)}</td>
                    <td className="px-5 py-4">{statusBadge(c.status)}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm ${isOverdue ? 'text-red-600 font-semibold' : 'text-slate-600'}`}>
                          {format(new Date(c.dueDate), 'dd MMM yyyy')}
                        </span>
                        {isOverdue && <span className="bg-red-100 text-red-700 text-[10px] font-bold px-1.5 py-0.5 rounded">OVERDUE</span>}
                      </div>
                    </td>
                    {isManager && (
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-xs font-bold shrink-0">
                            A
                          </div>
                          <span className="text-sm text-slate-600">Analyst</span>
                        </div>
                      </td>
                    )}
                    <td className="px-5 py-4 text-right">
                      <Link to={`/cases/${c.id}`} className="text-[#1B4FD8] text-sm font-medium hover:underline">
                        Open
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between text-sm">
        <span className="text-slate-500">
          Showing <span className="font-medium text-slate-700">{Math.min(1, filteredCases.length)}</span>–<span className="font-medium text-slate-700">{filteredCases.length}</span> of <span className="font-medium text-slate-700">{filteredCases.length}</span> cases
        </span>
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          <button className="px-2 py-1.5 text-slate-400 cursor-not-allowed"><ChevronLeft className="w-4 h-4" /></button>
          <button className="px-3 py-1 bg-white text-[#0F2557] font-medium rounded-lg shadow-sm">1</button>
          <button className="px-2 py-1.5 text-slate-400 cursor-not-allowed"><ChevronRight className="w-4 h-4" /></button>
        </div>
      </div>
    </div>
  );
};
