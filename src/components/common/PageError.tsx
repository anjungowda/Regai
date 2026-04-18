import React from 'react';
import { FileQuestion, ShieldAlert, MonitorX } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PageErrorProps {
  code: '404' | '403' | '500';
  message?: string;
}

export const PageError: React.FC<PageErrorProps> = ({ code, message }) => {
  const content = {
    '404': {
      icon: <FileQuestion className="w-16 h-16 text-slate-300 mb-6" />,
      title: "Page not found",
      desc: message || "The requested resource could not be located in our registry."
    },
    '403': {
      icon: <ShieldAlert className="w-16 h-16 text-red-400 mb-6" />,
      title: "Access denied",
      desc: message || "You lack the appropriate permissions to view this secure interface."
    },
    '500': {
      icon: <MonitorX className="w-16 h-16 text-amber-400 mb-6" />,
      title: "Internal Error",
      desc: message || "A server-side anomaly occurred while processing your request."
    }
  }[code];

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center animate-in zoom-in-95 duration-500">
      {content.icon}
      <h1 className="text-3xl font-black text-[#0F2557] mb-3">{content.title}</h1>
      <p className="text-slate-600 max-w-md mx-auto mb-8 leading-relaxed">
        {content.desc}
      </p>
      <Link 
        to="/dashboard"
        className="px-6 py-3 bg-[#1B4FD8] text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-sm"
      >
        Go to Dashboard
      </Link>
    </div>
  );
};
