import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  rightElement?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  className,
  error,
  rightElement,
  disabled,
  ...props
}, ref) => {
  return (
    <div className="relative w-full">
      <input
        ref={ref}
        disabled={disabled}
        className={cn(
          'w-full px-3 py-2.5 border rounded-lg text-sm transition-colors outline-none',
          'placeholder:text-slate-400',
          !error && 'border-slate-300 focus:border-[#1B4FD8] focus:ring-2 focus:ring-[#1B4FD8]/10',
          error && 'border-red-400 ring-2 ring-red-400/10 bg-red-50/30',
          disabled && 'bg-slate-50 text-slate-400 cursor-not-allowed',
          rightElement && 'pr-10',
          className
        )}
        {...props}
      />
      {rightElement && (
        <div className="absolute top-1/2 right-3 -translate-y-1/2 flex items-center justify-center text-slate-400">
          {rightElement}
        </div>
      )}
    </div>
  );
});
Input.displayName = 'Input';
