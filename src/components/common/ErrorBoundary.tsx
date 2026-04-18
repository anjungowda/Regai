import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ShieldX } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6 shadow-sm border border-red-200">
            <ShieldX className="w-10 h-10 text-red-600" />
          </div>
          <h1 className="text-3xl font-black text-[#0F2557] mb-3">Something went wrong</h1>
          <p className="text-slate-600 max-w-md mx-auto mb-8 leading-relaxed">
            An unexpected error occurred within the application framework. Our engineering team has been notified.
          </p>
          <button 
            onClick={() => window.location.href = '/dashboard'}
            className="px-6 py-3 bg-[#1B4FD8] text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-sm"
          >
            Return to Dashboard
          </button>

          {process.env.NODE_ENV === 'development' && this.state.error && (
            <div className="mt-12 w-full max-w-3xl text-left">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-2 mb-2">Development Stack Trace</p>
              <pre className="bg-slate-900 text-slate-300 p-6 rounded-2xl text-[11px] overflow-auto shadow-inner w-full">
                {this.state.error.toString()}
                {'\n'}
                {this.state.error.stack}
              </pre>
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
