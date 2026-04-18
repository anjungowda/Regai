import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useCountUp } from '../../hooks/useCountUp';

export interface StatCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: { value: number; label: string; direction: 'up' | 'down' | 'neutral' };
  variant?: 'default' | 'warning' | 'danger' | 'success';
  isLoading?: boolean;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  variant = 'default',
  isLoading = false,
  onClick
}) => {
  const numericValue = typeof value === 'number' ? value : 0;
  const animatedValue = useCountUp(numericValue, 800);
  
  const displayValue = isLoading ? null : (typeof value === 'number' ? animatedValue : value);

  let borderClass = 'border-l-4 border-[#1B4FD8]';
  let iconContainerClass = 'bg-blue-50 text-[#1B4FD8]';

  if (variant === 'warning') {
    borderClass = 'border-l-4 border-amber-500';
    iconContainerClass = 'bg-amber-50 text-amber-600';
  } else if (variant === 'danger') {
    borderClass = 'border-l-4 border-red-500';
    iconContainerClass = 'bg-red-50 text-red-600';
  } else if (variant === 'success') {
    borderClass = 'border-l-4 border-green-500';
    iconContainerClass = 'bg-green-50 text-green-600';
  }

  return (
    <div 
      onClick={onClick}
      className={`bg-white rounded-2xl p-6 shadow-sm border border-slate-100 ${borderClass} ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow duration-200' : ''}`}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          {isLoading ? (
            <div className="h-4 w-24 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-200 animate-shimmer rounded mb-2" />
          ) : (
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">{title}</p>
          )}

          {isLoading ? (
            <div className="h-8 w-16 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-200 animate-shimmer rounded mt-2" />
          ) : (
            <h3 className="text-3xl font-black text-[#0F2557] mt-1">{displayValue}</h3>
          )}

          {subtitle && !isLoading && (
            <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
          )}
        </div>

        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ml-4 ${iconContainerClass}`}>
          {React.cloneElement(icon as React.ReactElement, { className: 'w-6 h-6' })}
        </div>
      </div>

      {trend && !isLoading && (
        <div className="flex items-center gap-1.5 mt-4">
          {trend.direction === 'up' && <TrendingUp className="w-4 h-4 text-green-600" />}
          {trend.direction === 'down' && <TrendingDown className="w-4 h-4 text-red-600" />}
          {trend.direction === 'neutral' && <Minus className="w-4 h-4 text-slate-500" />}
          
          <span className={`text-sm font-medium ${trend.direction === 'up' ? 'text-green-600' : trend.direction === 'down' ? 'text-red-600' : 'text-slate-600'}`}>
            {trend.value > 0 ? '+' : ''}{trend.value}%
          </span>
          <span className="text-xs text-slate-400 ml-1">{trend.label}</span>
        </div>
      )}
    </div>
  );
};
