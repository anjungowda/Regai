import React, { useState, useEffect } from 'react';
import { AppLayout, useAppLayout } from '../../components/layout/AppLayout';
import { useAuth } from '../../hooks/useAuth';
import { useDashboardStats, useRecentActivity } from '../../hooks/useDashboardStats';
import { Plus, Briefcase, AlertTriangle, Clock, Bell, CheckCircle, FileSearch } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

import { StatCard } from '../../components/dashboard/StatCard';
import { RiskDistributionChart } from '../../components/dashboard/RiskDistributionChart';
import { ActivityFeed } from '../../components/dashboard/ActivityFeed';
import { CasesTable } from '../../components/dashboard/CasesTable';
import { NewCaseModal } from '../../components/cases/NewCaseModal';

export default function Dashboard() {
  const { user } = useAuth();
  const { setPageTitle, setBreadcrumbs } = useAppLayout();
  const navigate = useNavigate();
  
  const [newCaseModalOpen, setNewCaseModalOpen] = useState(false);

  const { data: statsResponse, isLoading: statsLoading } = useDashboardStats();
  const { data: activityResponse, isLoading: activityLoading } = useRecentActivity();

  useEffect(() => {
    setPageTitle('Dashboard');
    setBreadcrumbs([{ label: 'Dashboard' }]);
    document.title = 'Dashboard — RegShield AI';
  }, [setPageTitle, setBreadcrumbs]);

  const stats = statsResponse?.stats || {};
  const activity = activityResponse?.activity || [];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const firstName = user?.fullName?.split(' ')[0] ?? 'there';

  return (
    <div className="max-w-screen-xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* Welcome Bar */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0F2557]">
            {getGreeting()}, {firstName}
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            {format(new Date(), 'EEEE, d MMMM yyyy')}
          </p>
        </div>
        <button 
          onClick={() => setNewCaseModalOpen(true)}
          className="bg-[#1B4FD8] hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" /> New Case
        </button>
      </div>

      {/* Metric Stat Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <StatCard 
          title="Open Cases"
          value={stats.totalOpenCases}
          subtitle="Active investigations"
          icon={<Briefcase />}
          variant="default"
          isLoading={statsLoading}
          onClick={() => navigate('/cases')}
          trend={{ value: 0, label: "view all", direction: 'neutral' }}
        />
        <StatCard 
          title="High Risk"
          value={stats.highRiskCases}
          subtitle="High & critical risk"
          icon={<AlertTriangle />}
          variant={stats.highRiskCases > 0 ? 'danger' : 'default'}
          isLoading={statsLoading}
          onClick={() => navigate('/cases?riskLevel=high,critical')}
        />
        <StatCard 
          title="Overdue SLA"
          value={stats.overdueSlaCases}
          subtitle="Past deadline"
          icon={<Clock />}
          variant={stats.overdueSlaCases > 0 ? 'warning' : 'default'}
          isLoading={statsLoading}
          onClick={() => navigate('/cases?overdue=true')}
        />
        <StatCard 
          title="Alerts (7 days)"
          value={stats.alertsThisWeek}
          subtitle="Transaction monitoring"
          icon={<Bell />}
          variant="default"
          isLoading={statsLoading}
          onClick={() => navigate('/alerts')}
        />
        <StatCard 
          title="Closed This Month"
          value={stats.casesClosedThisMonth}
          subtitle="Completed investigations"
          icon={<CheckCircle />}
          variant="success"
          isLoading={statsLoading}
        />
        <StatCard 
          title="Pending Evidence"
          value={stats.pendingEvidence}
          subtitle="Awaiting verification"
          icon={<FileSearch />}
          variant={stats.pendingEvidence > 0 ? 'warning' : 'default'}
          isLoading={statsLoading}
          onClick={() => navigate('/evidence')}
        />
      </div>

      {/* Middle Row — Chart + Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="lg:col-span-3">
          <RiskDistributionChart data={stats.riskDistribution} isLoading={statsLoading} />
        </div>
        <div className="lg:col-span-2">
          <ActivityFeed activities={activity} isLoading={activityLoading} />
        </div>
      </div>

      {/* Bottom Row — My Cases Table */}
      <CasesTable />

      {/* New Case Modal */}
      <NewCaseModal 
        isOpen={newCaseModalOpen} 
        onClose={() => setNewCaseModalOpen(false)} 
      />

    </div>
  );
}
