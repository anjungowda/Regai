import React from 'react';
import { useToastStore } from '../../hooks/useToast';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { cn } from './Button';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "pointer-events-auto shadow-lg rounded-lg px-4 py-3 min-w-64 max-w-sm flex items-start gap-3",
            "animate-in slide-in-from-right duration-300 fade-in",
            toast.type === 'success' && "bg-green-600 text-white",
            toast.type === 'error' && "bg-red-600 text-white",
            toast.type === 'warning' && "bg-amber-500 text-white",
            toast.type === 'info' && "bg-[#1B4FD8] text-white"
          )}
        >
          <div className="flex-shrink-0 mt-0.5">
            {toast.type === 'success' && <CheckCircle className="w-5 h-5" />}
            {toast.type === 'error' && <XCircle className="w-5 h-5" />}
            {toast.type === 'warning' && <AlertTriangle className="w-5 h-5" />}
            {toast.type === 'info' && <Info className="w-5 h-5" />}
          </div>
          <div className="flex-1 text-sm font-medium pr-2">
            {toast.message}
          </div>
          <button 
            onClick={() => removeToast(toast.id)}
            className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
            aria-label="Close notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
