import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Home } from 'lucide-react';

export default function NotFound() {
  const isAuthenticated = true; // Use real auth logic if integrating router explicitly

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-6 text-center">
       <h1 className="text-9xl font-black text-slate-200 tracking-tighter mix-blend-multiply mb-4">404</h1>
       <h2 className="text-2xl font-bold text-[#0F2557] mb-2">Page Not Found</h2>
       <p className="text-slate-500 mb-8 max-w-sm">The targeted compliance path doesn't exist, has been redacted, or you lack sufficient access permissions.</p>

       <div className="flex gap-4">
          <Link to="/dashboard" className="bg-[#1B4FD8] text-white font-bold px-6 py-3 rounded-xl shadow-sm hover:bg-blue-700 transition flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5"/> Go to Dashboard
          </Link>
          <Link to="/" className="bg-white border border-[#1B4FD8] text-[#1B4FD8] font-bold px-6 py-3 rounded-xl shadow-sm hover:bg-blue-50 transition flex items-center gap-2">
            <Home className="w-5 h-5"/> Return to Public Home
          </Link>
       </div>
    </div>
  );
}
