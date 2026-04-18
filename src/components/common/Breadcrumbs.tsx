import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export const Breadcrumbs = ({ items }: { items: BreadcrumbItem[] }) => {
  return (
    <nav className="flex items-center text-sm font-medium text-slate-500 mb-6">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        
        return (
          <div key={index} className="flex items-center">
             {item.href && !isLast ? (
               <Link to={item.href} className="hover:text-slate-800 transition-colors">
                 {item.label}
               </Link>
             ) : (
               <span className={isLast ? 'text-slate-800 font-bold' : ''}>
                 {item.label}
               </span>
             )}
             
             {!isLast && (
               <ChevronRight className="w-4 h-4 mx-2 text-slate-300" />
             )}
          </div>
        );
      })}
    </nav>
  );
};
