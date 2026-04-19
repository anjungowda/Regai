import React, { createContext, useContext, useState } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { ComplianceChatbot } from '../chatbot/ComplianceChatbot';
import { Outlet } from 'react-router-dom';

interface LayoutContextType {
  isSidebarOpen: boolean;
  setSidebarOpen: (o: boolean) => void;
  pageTitle: string;
  setPageTitle: (t: string) => void;
  breadcrumbs: { label: string, href?: string }[];
  setBreadcrumbs: (b: { label: string, href?: string }[]) => void;
}

const LayoutContext = createContext<LayoutContextType | null>(null);

export const useAppLayout = () => {
  const ctx = useContext(LayoutContext);
  if (!ctx) throw new Error('useAppLayout must be used within AppLayout');
  return ctx;
}

export const AppLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [pageTitle, setPageTitle] = useState('Dashboard');
  const [breadcrumbs, setBreadcrumbs] = useState([{ label: 'Dashboard' }]);

  const contextValue = React.useMemo(() => ({
    isSidebarOpen, setSidebarOpen, pageTitle, setPageTitle, breadcrumbs, setBreadcrumbs
  }), [isSidebarOpen, pageTitle, breadcrumbs]);

  return (
    <LayoutContext.Provider value={contextValue}>
      <div className="min-h-screen bg-slate-50 flex overflow-hidden selection:bg-blue-100 selection:text-blue-900">
         <Sidebar />
         
         <div className="flex-1 flex flex-col min-w-0 transition-all duration-300 relative">
            {import.meta.env.VITE_USE_MOCK_DATA === 'true' && (
              <div className="bg-amber-400 text-amber-900 text-xs font-semibold 
                              text-center py-2 px-4 flex items-center justify-center gap-2">
                <span>🎭</span>
                <span>DEMO MODE — Showing sample data for Horizon Payments Ltd. 
                      No data is being saved.</span>
                <span className="ml-4 bg-amber-900/20 rounded px-2 py-0.5">
                  Login: admin@horizonpayments.com / Demo1234!
                </span>
              </div>
            )}
            <Topbar />
            
            <main className="flex-1 overflow-y-auto overflow-x-hidden ml-0 lg:ml-64 p-4 lg:p-8 pt-6 relative border-t-0">
               <div className="max-w-[1600px] mx-auto mb-6">
                 <Breadcrumbs items={breadcrumbs} />
               </div>
               <Outlet />
            </main>
         </div>

         {/* Ensure Chatbot loads above all content in App shell */}
         <ComplianceChatbot />
      </div>
    </LayoutContext.Provider>
  );
};
