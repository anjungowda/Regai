import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Shield, Building2, LayoutDashboard, Briefcase, Users, 
  Bell, ShieldAlert, Lock, FileText, CalendarCheck, BarChart3, 
  Settings, HelpCircle, ChevronUp, User, CreditCard, LogOut, X
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../constants';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user, organisation, isAdmin, isManager, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [showUserPopover, setShowUserPopover] = useState(false);

  // Grouped Navigation
  const navGroups = [
    {
      label: 'Overview',
      items: [
        { name: 'Dashboard', icon: <LayoutDashboard />, path: ROUTES.PROTECTED.DASHBOARD, exact: true },
      ]
    },
    {
      label: 'Investigations',
      items: [
        { name: 'Cases', icon: <Briefcase />, path: ROUTES.PROTECTED.CASES.LIST },
        { name: 'Customers', icon: <Users />, path: ROUTES.PROTECTED.CUSTOMERS.LIST },
        { name: 'Companies', icon: <Building2 />, path: '/companies' }, // Company placeholder
        { name: 'Alerts', icon: <Bell />, path: ROUTES.PROTECTED.ALERTS },
      ]
    },
    {
      label: 'Compliance Tools',
      items: [
        { name: 'Risk Scoring', icon: <ShieldAlert />, path: ROUTES.PROTECTED.RISK },
        { name: 'Evidence Vault', icon: <Lock />, path: ROUTES.PROTECTED.EVIDENCE },
        { name: 'Templates', icon: <FileText />, path: ROUTES.PROTECTED.TEMPLATES },
        { name: 'Periodic Reviews', icon: <CalendarCheck />, path: '/periodic-reviews' }, // placeholder
      ]
    },
    {
      label: 'Reporting',
      items: [
        { name: 'Reports', icon: <BarChart3 />, path: ROUTES.PROTECTED.REPORTS },
      ]
    }
  ];

  if (isAdmin || isManager) {
    navGroups.push({
      label: 'Administration',
      items: [
        { name: 'Admin Panel', icon: <Settings />, path: ROUTES.PROTECTED.ADMIN },
      ]
    });
  }

  const navigateAndClose = (path: string) => {
    navigate(path);
    if (window.innerWidth < 1024) onClose();
  };

  const isActive = (path: string, exact?: boolean) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0F2557] text-white flex flex-col transition-transform duration-250 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        
        {/* Top Logo */}
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Shield className="w-7 h-7 text-white" />
            <span className="font-bold text-lg text-white">RegShield</span>
            <span className="font-bold text-lg text-[#0EA5E9]">AI</span>
          </div>
          <button onClick={onClose} className="lg:hidden text-slate-300 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Organisation Display */}
        <div className="px-4 py-3 shrink-0">
          <div className="bg-white/5 rounded-xl px-3 py-2">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="text-sm font-medium text-white truncate">{organisation?.name || 'My Organisation'}</span>
            </div>
            <div className="mt-1.5">
              <span className="rounded-full bg-white/10 text-slate-300 text-xs px-2 py-0.5">
                {organisation?.subscriptionPlan ? organisation.subscriptionPlan.charAt(0).toUpperCase() + organisation.subscriptionPlan.slice(1).toLowerCase() : 'Standard'} plan
              </span>
            </div>
          </div>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent pb-4">
          {navGroups.map((group, i) => (
            <div key={i} className="mb-2">
              <div className="text-slate-500 text-[10px] font-bold uppercase tracking-widest px-4 mt-6 mb-2">
                {group.label}
              </div>
              <div className="space-y-0.5">
                {group.items.map((item, j) => {
                  const active = isActive(item.path, item.exact);
                  return (
                    <button
                      key={j}
                      onClick={() => navigateAndClose(item.path)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 mx-2 rounded-xl text-sm font-medium transition-all duration-150 ${
                        active ? 'bg-white/15 text-white' : 'text-slate-400 hover:bg-white/8 hover:text-slate-200'
                      }`}
                      style={{ width: 'calc(100% - 16px)' }}
                      aria-current={active ? "page" : undefined}
                    >
                      {React.cloneElement(item.icon as React.ReactElement, { className: "w-5 h-5 shrink-0" })}
                      <span className="truncate">{item.name}</span>
                      
                      {/* Hardcoded badges for UI display logic matching spec */}
                      {item.name === 'Cases' && (
                        <span className="rounded-full bg-[#1B4FD8] text-white text-[10px] px-2 py-0.5 ml-auto">12</span>
                      )}
                      {item.name === 'Alerts' && (
                        <span className="rounded-full bg-red-500 text-white text-[10px] px-2 py-0.5 ml-auto">3</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="shrink-0 border-t border-white/10 p-4 relative">
          <a 
            href="mailto:info@regshield.ai" 
            className="flex items-center gap-3 px-2 py-2 mb-2 rounded-lg text-sm text-slate-400 hover:bg-white/5 hover:text-white transition-colors"
          >
            <HelpCircle className="w-4 h-4 shrink-0" />
            <span>Help & Support</span>
          </a>

          <div 
            onClick={() => setShowUserPopover(!showUserPopover)}
            className="flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-white/5 transition-colors"
          >
             <div className="w-8 h-8 rounded-full bg-[#1B4FD8] flex items-center justify-center shrink-0">
               <span className="text-white text-[10px] font-bold">
                 {user?.firstName?.[0]}{user?.lastName?.[0] || 'U'}
               </span>
             </div>
             <div className="flex-1 min-w-0">
                <div className="text-white text-sm font-medium truncate">{user?.fullName}</div>
                <div className="text-slate-400 text-[10px] uppercase truncate tracking-wider">
                  {user?.role?.replace('_', ' ')}
                </div>
             </div>
             <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
          </div>

          {showUserPopover && (
             <div className="absolute bottom-20 left-4 w-52 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in slide-in-from-bottom-2">
               <button onClick={() => navigateAndClose('/admin/profile')} className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-2">
                 <User className="w-4 h-4" /> Your profile
               </button>
               <button onClick={() => navigateAndClose(ROUTES.PROTECTED.ADMIN)} className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-2">
                 <Settings className="w-4 h-4" /> Organisation settings
               </button>
               {isAdmin && (
                 <button onClick={() => navigateAndClose('/admin')} className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-2">
                   <CreditCard className="w-4 h-4" /> Billing
                 </button>
               )}
               <div className="h-px bg-slate-100 my-1"></div>
               <button onClick={logout} className="w-full text-left px-3 py-2 text-sm text-red-600 font-medium hover:bg-red-50 rounded-lg flex items-center gap-2">
                 <LogOut className="w-4 h-4" /> Log out
               </button>
             </div>
          )}
        </div>

      </div>
    </>
  );
};
