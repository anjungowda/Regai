import React from 'react';
import { useAppLayout } from './AppLayout';
import { Menu, Bell } from 'lucide-react';
import { GlobalSearch } from '../common/GlobalSearch';
import { Link } from 'react-router-dom';

export const Topbar = () => {
  const { isSidebarOpen, setSidebarOpen } = useAppLayout();
  
  return (
    <header className="h-[72px] bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 z-30 ml-0 lg:ml-64 shadow-sm relative transition-all duration-300">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setSidebarOpen(!isSidebarOpen)}
          className="p-2 -ml-2 rounded-xl text-slate-500 hover:bg-slate-100 lg:hidden transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="hidden md:block">
           <GlobalSearch />
        </div>
      </div>
      <div className="flex items-center gap-3">
         <button className="relative p-2 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors hidden sm:block">
           <Bell className="w-5 h-5 text-slate-500" />
           <span className="absolute top-2 right-2 w-2 h-2 bg-[#1B4FD8] rounded-full border border-white" />
         </button>
         <div className="h-8 w-px bg-slate-200 mx-2 hidden sm:block" />
         <Link to="/admin/profile" className="flex items-center gap-3 bg-slate-50 hover:bg-slate-100 transition px-3 py-1.5 rounded-xl cursor-pointer">
           <div className="w-8 h-8 rounded-full bg-[#0F2557] text-white flex items-center justify-center text-xs font-bold shadow-inner">
             AN
           </div>
           <div className="hidden sm:block">
             <p className="text-sm font-bold text-slate-700 leading-none">Anju Narasegowda</p>
             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Admin</p>
           </div>
         </Link>
      </div>
    </header>
  );
};
