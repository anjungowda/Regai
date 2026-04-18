import React, { useEffect } from 'react';
import { useAppLayout } from '../../components/layout/AppLayout';
import { NavLink, Routes, Route, Navigate } from 'react-router-dom';
import { Users, Building2, CreditCard, GitBranch, ScrollText, FileText } from 'lucide-react';

import UserManagement from './UserManagement';
import OrgSettings from './OrgSettings';
import Billing from './Billing';
import OrgAuditLog from './OrgAuditLog';

export default function AdminPanel() {
  const { setPageTitle, setBreadcrumbs } = useAppLayout();

  useEffect(() => {
    document.title = 'Organisation Settings — RegShield AI';
    setPageTitle('Organisation Settings');
    setBreadcrumbs([{ label: 'Admin Console' }]);
  }, [setPageTitle, setBreadcrumbs]);

  const navItems = [
    { label: 'Team Members', path: '/admin/users', icon: <Users className="w-5 h-5"/> },
    { label: 'Firm Identity', path: '/admin/settings', icon: <Building2 className="w-5 h-5"/> },
    { label: 'Subscriptions & Billing', path: '/admin/billing', icon: <CreditCard className="w-5 h-5"/> },
    { label: 'Audit Telemetry', path: '/admin/audit', icon: <ScrollText className="w-5 h-5"/> },
    { label: 'Workflow Directives', path: '/admin/workflows', icon: <GitBranch className="w-5 h-5"/>, disabled: true },
    { label: 'Global Templates', path: '/templates', icon: <FileText className="w-5 h-5"/>, external: true }
  ];

  return (
    <div className="max-w-[1600px] mx-auto pb-10 flex flex-col md:flex-row gap-6 animate-in fade-in duration-300">
      
      {/* Left Vertical Nav */}
      <div className="w-full md:w-64 shrink-0 px-4 md:px-0">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-4 mb-4">Administration</h2>
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            if (item.disabled) {
              return (
                 <div key={item.path} className="flex px-4 py-2.5 items-center justify-between text-slate-400 font-medium">
                   <div className="flex items-center gap-3">{item.icon} <span className="text-sm">{item.label}</span></div>
                   <span className="text-[9px] bg-slate-100 text-slate-500 font-bold uppercase px-1.5 py-0.5 rounded">Soon</span>
                 </div>
              )
            }
            if (item.external) {
               return (
                 <a key={item.path} href={item.path} className="flex gap-3 px-4 py-2.5 items-center text-slate-600 font-medium hover:bg-slate-50 rounded-xl transition">
                   {item.icon} <span className="text-sm">{item.label}</span>
                 </a>
               )
            }
            return (
              <NavLink 
                key={item.path} 
                to={item.path}
                className={({ isActive }) => `flex gap-3 px-4 py-2.5 items-center text-sm font-medium rounded-xl transition ${isActive ? 'bg-blue-50 text-[#1B4FD8] font-bold' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                {item.icon} {item.label}
              </NavLink>
            )
          })}
        </nav>
      </div>

      {/* Right Core Routes Frame */}
      <div className="flex-1 min-w-0 bg-white border border-slate-200 rounded-2xl shadow-sm min-h-[70vh]">
         <Routes>
           <Route path="/" element={<Navigate to="/admin/users" replace />} />
           <Route path="/users" element={<UserManagement />} />
           <Route path="/settings" element={<OrgSettings />} />
           <Route path="/billing" element={<Billing />} />
           <Route path="/audit" element={<OrgAuditLog />} />
         </Routes>
      </div>

    </div>
  );
}
