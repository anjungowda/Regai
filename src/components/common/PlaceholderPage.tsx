import React, { useEffect } from 'react';
import { useAppLayout } from '../layout/AppLayout';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants';

interface PlaceholderPageProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  comingSoon?: boolean;
}

export const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title, description, icon, comingSoon = true }) => {
  const { setPageTitle } = useAppLayout();
  const navigate = useNavigate();

  useEffect(() => {
    setPageTitle(title);
    document.title = `${title} — RegShield AI`;
  }, [title, setPageTitle]);

  return (
    <div className="min-h-full flex flex-col items-center justify-center py-20 text-center animate-in fade-in duration-300">
      <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6 shadow-inner text-slate-300">
        {React.cloneElement(icon as React.ReactElement, { className: "w-10 h-10" })}
      </div>
      
      {comingSoon && (
        <span className="bg-blue-50 text-[#1B4FD8] text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4 border border-blue-100">
          Coming in the next build step
        </span>
      )}

      <h2 className="text-2xl font-bold text-[#0F2557] mb-2">{title}</h2>
      <p className="text-slate-500 max-w-md mx-auto mb-8">{description}</p>
      
      <button 
        onClick={() => navigate(ROUTES.PROTECTED.DASHBOARD)}
        className="text-[#1B4FD8] font-medium flex items-center gap-2 hover:gap-3 transition-all hover:text-[#0F2557]"
      >
        Go to Dashboard <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};
