import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useCases } from '../../hooks/useCases';
import { useAppLayout } from '../../components/layout/AppLayout';
import { 
  Search, X, Plus, SlidersHorizontal, ChevronLeft, ChevronRight, 
  ChevronUp, ChevronDown, Download, EllipsisVertical, ExternalLink, 
  UserCheck, RefreshCw, ScrollText 
} from 'lucide-react';
import { format } from 'date-fns';
import { NewCaseModal } from '../../components/cases/NewCaseModal';
import { ReassignModal } from '../../components/cases/ReassignModal';
import { StatusChangeModal } from '../../components/cases/StatusChangeModal';

export default function CaseList() {
  const { setPageTitle, setBreadcrumbs } = useAppLayout();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [newCaseModalOpen, setNewCaseModalOpen] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [selectedCaseIds, setSelectedCaseIds] = useState<string[]>([]);
  
  const [reassignModalOpen, setReassignModalOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [activeCaseId, setActiveCaseId] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Cases — RegShield AI';
    setPageTitle('Cases');
    setBreadcrumbs([{ label: 'Cases' }]);
  }, [setPageTitle, setBreadcrumbs]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'n' && (e.target as HTMLElement).tagName !== 'INPUT' && (e.target as HTMLElement).tagName !== 'TEXTAREA') {
        setNewCaseModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Sync Search Params
  const updateParams = (newParams: Record<string, string | null>) => {
    const current = Object.fromEntries(searchParams.entries());
    Object.keys(newParams).forEach(k => {
      if (newParams[k] === null || newParams[k] === '') delete current[k];
      else current[k] = newParams[k] as string;
    });
    setSearchParams(current);
  };

  const statusFilter = searchParams.get('status') || '';
  const overdueFilter = searchParams.get('overdue') === 'true';
  const querySearch = searchParams.get('search') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const sortBy = searchParams.get('sortBy') || 'createdAt';
  const sortOrder = searchParams.get('sortOrder') || 'desc';

  const [searchInput, setSearchInput] = useState(querySearch);

  useEffect(() => {
    const delay = setTimeout(() => {
      updateParams({ search: searchInput, page: '1' });
    }, 400);
    return () => clearTimeout(delay);
  }, [searchInput]);

  const { data: response, isLoading } = useCases({
    status: statusFilter,
    overdue: overdueFilter,
    search: querySearch,
    page,
    sortBy,
    sortOrder
  });

  const cases = response?.cases || [];
  const total = response?.total || 0;
  const maxPage = Math.ceil(total / 20) || 1;

  const toggleSelectAll = () => {
    if (selectedCaseIds.length === cases.length && cases.length > 0) {
      setSelectedCaseIds([]);
    } else {
      setSelectedCaseIds(cases.map((c: any) => c.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedCaseIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const toggleSort = (col: string) => {
    if (sortBy === col) updateParams({ sortOrder: sortOrder === 'asc' ? 'desc' : 'asc' });
    else updateParams({ sortBy: col, sortOrder: 'asc' });
  };

  const sortIcon = (col: string) => {
    if (sortBy !== col) return <ChevronUp className="w-3 h-3 text-slate-300 ml-1 inline" />;
    return sortOrder === 'asc' ? <ChevronUp className="w-3 h-3 text-[#1B4FD8] ml-1 inline" /> : <ChevronDown className="w-3 h-3 text-[#1B4FD8] ml-1 inline" />;
  };

  const getStatusPillClass = (targetStatus: string, current: string) => {
    if (current !== targetStatus) return 'bg-slate-100 text-slate-600 hover:bg-slate-200';
    if (targetStatus === 'escalated') return 'bg-red-100 text-red-700 font-medium';
    return 'bg-[#1B4FD8] text-white font-medium';
  };

  return (
    <div className="max-w-[1600px] mx-auto pb-10 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h1 className="font-bold text-2xl text-[#0F2557]">Cases</h1>
          <p className="text-slate-500 text-sm mt-1">{total} cases</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 hidden sm:inline-block">Press <kbd className="bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded font-mono text-[10px]">N</kbd> anywhere</span>
          <button 
            onClick={() => setNewCaseModalOpen(true)}
            className="bg-[#1B4FD8] hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            <Plus className="w-5 h-5" /> New Case
          </button>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm px-5 py-4 mb-5">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search by case ID, customer, company..." 
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-9 pr-9 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm w-full focus:outline-none focus:bg-white focus:border-[#1B4FD8] transition-colors"
              />
              {searchInput && (
                <button onClick={() => setSearchInput('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex gap-2 flex-wrap">
              <button 
                onClick={() => updateParams({ status: null, overdue: null, page: '1' })}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${getStatusPillClass('', statusFilter && !overdueFilter ? statusFilter : '')}`}
              >All</button>
              <button 
                onClick={() => updateParams({ status: 'new', overdue: null, page: '1' })}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${getStatusPillClass('new', !overdueFilter ? statusFilter : '')}`}
              >New</button>
              <button 
                onClick={() => updateParams({ status: 'in_review', overdue: null, page: '1' })}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${getStatusPillClass('in_review', !overdueFilter ? statusFilter : '')}`}
              >In Review</button>
              <button 
                onClick={() => updateParams({ status: 'escalated', overdue: null, page: '1' })}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${getStatusPillClass('escalated', !overdueFilter ? statusFilter : '')}`}
              >Escalated</button>
              <button 
                onClick={() => updateParams({ status: null, overdue: 'true', page: '1' })}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${overdueFilter ? 'bg-red-100 text-red-700 font-medium' : 'bg-red-50 text-red-500 hover:bg-red-100'}`}
              >Overdue</button>
            </div>
          </div>

          <button 
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="flex items-center gap-2 text-sm font-medium text-slate-600 px-3 py-2 rounded-lg hover:bg-slate-100 border border-slate-200 shrink-0"
          >
            <SlidersHorizontal className="w-4 h-4" /> More Filters
          </button>
        </div>

        {/* Collapsible Advanced Filters */}
        {showAdvancedFilters && (
          <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-4 gap-4 animate-in slide-in-from-top-2 duration-200">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">Risk Level</label>
              <select className="w-full bg-slate-50 border border-slate-200 rounded-lg text-sm py-2 px-3 text-slate-700" disabled>
                <option>All Risk Levels</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">Case Type</label>
              <select className="w-full bg-slate-50 border border-slate-200 rounded-lg text-sm py-2 px-3 text-slate-700" disabled>
                <option>All Types</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">Assigned To</label>
              <select className="w-full bg-slate-50 border border-slate-200 rounded-lg text-sm py-2 px-3 text-slate-700" disabled>
                <option>Anyone</option>
              </select>
            </div>
            <div className="flex items-end">
              <button className="text-[#1B4FD8] text-sm hover:underline" onClick={() => updateParams({ page: '1', status: null, overdue: null, search: null })}>
                Clear all filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* BULK SELECTION BAR */}
      {selectedCaseIds.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <span className="bg-[#1B4FD8] text-white text-xs font-bold px-2 py-0.5 rounded-full">{selectedCaseIds.length}</span>
            <span className="text-blue-900 font-medium text-sm">cases selected</span>
            <button onClick={() => setSelectedCaseIds([])} className="text-blue-600 hover:text-blue-800 ml-2"><X className="w-4 h-4" /></button>
          </div>
          <div className="flex items-center gap-2">
            <button className="text-sm bg-white border border-blue-200 text-blue-700 px-3 py-1.5 rounded-lg hover:bg-blue-100 font-medium transition-colors">Change Status...</button>
            <button className="text-sm bg-white border border-blue-200 text-blue-700 px-3 py-1.5 rounded-lg hover:bg-blue-100 font-medium transition-colors">Assign to...</button>
            <button className="text-sm bg-white border border-blue-200 text-blue-700 px-3 py-1.5 rounded-lg hover:bg-blue-100 font-medium transition-colors flex items-center gap-1.5"><Download className="w-4 h-4"/> Export CSV</button>
          </div>
        </div>
      )}

      {/* MAIN DATA TABLE */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden min-h-[500px] overflow-x-auto">
        <table className="w-full whitespace-nowrap">
          <thead>
            <tr>
              <th className="px-5 py-3 bg-slate-50 border-b border-slate-200 w-10">
                <input 
                  type="checkbox" 
                  checked={selectedCaseIds.length === cases.length && cases.length > 0}
                  onChange={toggleSelectAll}
                  className="w-4 h-4 rounded border-slate-300 text-[#1B4FD8] focus:ring-[#1B4FD8]"
                />
              </th>
              <th className="text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3 bg-slate-50 border-b border-slate-200 text-left cursor-pointer hover:bg-slate-100" onClick={() => toggleSort('id')}>Case ID {sortIcon('id')}</th>
              <th className="text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3 bg-slate-50 border-b border-slate-200 text-left cursor-pointer hover:bg-slate-100" onClick={() => toggleSort('caseType')}>Type {sortIcon('caseType')}</th>
              <th className="text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3 bg-slate-50 border-b border-slate-200 text-left cursor-pointer hover:bg-slate-100" onClick={() => toggleSort('customer')}>Customer/Company {sortIcon('customer')}</th>
              <th className="text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3 bg-slate-50 border-b border-slate-200 text-left cursor-pointer hover:bg-slate-100" onClick={() => toggleSort('riskLevel')}>Risk {sortIcon('riskLevel')}</th>
              <th className="text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3 bg-slate-50 border-b border-slate-200 text-left cursor-pointer hover:bg-slate-100" onClick={() => toggleSort('status')}>Status {sortIcon('status')}</th>
              <th className="text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3 bg-slate-50 border-b border-slate-200 text-left cursor-pointer hover:bg-slate-100" onClick={() => toggleSort('dueDate')}>SLA Deadline {sortIcon('dueDate')}</th>
              <th className="text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3 bg-slate-50 border-b border-slate-200 text-left">Assigned To</th>
              <th className="text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3 bg-slate-50 border-b border-slate-200 text-left cursor-pointer hover:bg-slate-100" onClick={() => toggleSort('createdAt')}>Created {sortIcon('createdAt')}</th>
              <th className="w-10 px-4 py-3 bg-slate-50 border-b border-slate-200"></th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 8 }).map((_, idx) => (
                <tr key={idx} className="border-b border-slate-50">
                  <td className="px-5 py-4"><div className="h-4 w-4 bg-slate-200 rounded animate-shimmer"></div></td>
                  <td className="px-4 py-4"><div className="h-4 w-24 bg-slate-200 rounded animate-shimmer"></div></td>
                  <td className="px-4 py-4"><div className="h-4 w-20 bg-slate-200 rounded animate-shimmer"></div></td>
                  <td className="px-4 py-4"><div className="h-4 w-32 bg-slate-200 rounded animate-shimmer"></div></td>
                  <td className="px-4 py-4"><div className="h-4 w-12 bg-slate-200 rounded animate-shimmer"></div></td>
                  <td className="px-4 py-4"><div className="h-4 w-20 bg-slate-200 rounded animate-shimmer"></div></td>
                  <td className="px-4 py-4"><div className="h-4 w-24 bg-slate-200 rounded animate-shimmer"></div></td>
                  <td className="px-4 py-4"><div className="h-4 w-24 bg-slate-200 rounded animate-shimmer"></div></td>
                  <td className="px-4 py-4"><div className="h-4 w-20 bg-slate-200 rounded animate-shimmer"></div></td>
                  <td className="px-4 py-4"></td>
                </tr>
              ))
            ) : cases.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-4 py-20 text-center text-slate-500 font-medium">No cases found matching these filters.</td>
              </tr>
            ) : (
              cases.map((c: any) => {
                const isOverdue = new Date(c.dueDate) < new Date();
                return (
                  <tr key={c.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
                    <td className="px-5 py-4">
                      <input 
                        type="checkbox" 
                        checked={selectedCaseIds.includes(c.id)}
                        onChange={() => toggleSelect(c.id)}
                        className="w-4 h-4 rounded border-slate-300 text-[#1B4FD8] focus:ring-[#1B4FD8]"
                      />
                    </td>
                    <td className="px-4 py-4 text-sm font-mono font-bold text-[#1B4FD8]">
                      <Link to={`/cases/${c.caseRef}`} className="hover:underline">{c.caseRef}</Link>
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-600">{c.caseType.replace(/_/g, ' ')}</td>
                    <td className="px-4 py-4 text-sm font-medium text-slate-800 truncate max-w-[200px]">
                      {c.customer ? `${c.customer.firstName} ${c.customer.lastName}` : (c.company?.name || '—')}
                    </td>
                    <td className="px-4 py-4">
                       <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                         c.riskLevel === 'LOW' ? 'bg-green-100 text-green-800' :
                         c.riskLevel === 'MEDIUM' ? 'bg-amber-100 text-amber-800' :
                         c.riskLevel === 'HIGH' ? 'bg-red-100 text-red-800' : 'bg-red-900 text-white'
                       }`}>{c.riskLevel}</span>
                    </td>
                    <td className="px-4 py-4 text-xs font-medium text-slate-600">
                      <span className={`px-2 py-0.5 rounded-full ${
                        c.status === 'NEW' ? 'bg-blue-100 text-blue-800' :
                        c.status === 'IN_REVIEW' ? 'bg-amber-100 text-amber-800' :
                        c.status === 'ESCALATED' ? 'bg-red-100 text-red-800' :
                        c.status === 'PENDING_REVIEW' ? 'bg-purple-100 text-purple-800' :
                        'bg-slate-100 text-slate-800'
                      }`}>{c.status.replace(/_/g, ' ')}</span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2 text-sm">
                        <span className={isOverdue ? 'text-red-600 font-bold' : 'text-slate-600'}>
                          {format(new Date(c.dueDate), 'dd MMM yyyy')}
                        </span>
                        {isOverdue && <span className="bg-red-100 text-red-700 text-[10px] uppercase font-bold px-1 rounded">Overdue</span>}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-600">
                      {c.assignedTo && typeof c.assignedTo === 'object' ? c.assignedTo.fullName : (c.assignedTo || 'Unassigned')}
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-500">{format(new Date(c.createdAt), 'dd MMM yyyy')}</td>
                    <td className="px-4 py-4 text-right">
                      <div className="relative inline-block text-left group/menu">
                        <button className="p-1 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-100">
                          <EllipsisVertical className="w-5 h-5" />
                        </button>
                        <div className="absolute right-0 mt-1 w-48 bg-white border border-slate-200 rounded-xl shadow-lg z-10 hidden group-hover/menu:block py-1">
                          <Link to={`/cases/${c.caseRef}`} className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"><ExternalLink className="w-4 h-4"/> View case</Link>
                          <button onClick={() => { setActiveCaseId(c.id); setReassignModalOpen(true); }} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"><UserCheck className="w-4 h-4"/> Edit assignment</button>
                          <button onClick={() => { setActiveCaseId(c.id); setStatusModalOpen(true); }} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"><RefreshCw className="w-4 h-4"/> Change status</button>
                          <Link to={`/cases/${c.caseRef}?tab=audit-trail`} className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"><ScrollText className="w-4 h-4"/> View audit trail</Link>
                          <div className="border-t border-slate-100 my-1"></div>
                          <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[#1B4FD8] hover:bg-slate-50"><Download className="w-4 h-4"/> Export case PDF</button>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* SUMMARY AND PAGINATION */}
      <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-sm text-slate-500">
            Showing <span className="font-medium text-slate-700">{cases.length > 0 ? (page-1)*20+1 : 0}</span>–<span className="font-medium text-slate-700">{Math.min(page*20, total)}</span> of <span className="font-medium text-slate-700">{total}</span> cases
          </span>
          <button className="ml-4 text-sm text-[#1B4FD8] font-medium hover:underline inline-flex items-center gap-1">
            <Download className="w-4 h-4" /> Export all results
          </button>
        </div>

        <div className="flex items-center gap-1">
          <button 
            disabled={page <= 1}
            onClick={() => { updateParams({ page: (page-1).toString() }); window.scrollTo(0,0); }}
            className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          ><ChevronLeft className="w-4 h-4 mr-1"/> Prev</button>

          <div className="hidden md:flex items-center mx-2 gap-1">
            {Array.from({ length: Math.min(5, maxPage) }).map((_, i) => {
              const p = i + 1;
              return (
                <button 
                  key={p} onClick={() => { updateParams({ page: p.toString() }); window.scrollTo(0,0); }}
                  className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${p === page ? 'bg-[#1B4FD8] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}
                >{p}</button>
              );
            })}
          </div>

          <button 
            disabled={page >= maxPage}
            onClick={() => { updateParams({ page: (page+1).toString() }); window.scrollTo(0,0); }}
            className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >Next <ChevronRight className="w-4 h-4 ml-1"/></button>
        </div>
      </div>

      <NewCaseModal isOpen={newCaseModalOpen} onClose={() => setNewCaseModalOpen(false)} />
      {activeCaseId && <ReassignModal isOpen={reassignModalOpen} onClose={() => { setReassignModalOpen(false); setActiveCaseId(null); }} caseId={activeCaseId} />}
      {activeCaseId && <StatusChangeModal isOpen={statusModalOpen} onClose={() => { setStatusModalOpen(false); setActiveCaseId(null); }} caseId={activeCaseId} currentStatus={cases.find((c: any) => c.id === activeCaseId)?.status || 'NEW'} />}
    </div>
  );
}
