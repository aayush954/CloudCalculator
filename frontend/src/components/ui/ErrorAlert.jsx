// components/ui/ErrorAlert.jsx
import React from 'react';
import { AlertTriangle, X, RefreshCw } from 'lucide-react';

const ErrorAlert = ({ message, onDismiss, onRetry }) => (
  <div className="rounded-2xl bg-red-500/10 border border-red-500/25 p-4 flex items-start gap-3 animate-fade-in">
    <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
      <AlertTriangle size={15} className="text-red-400" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-red-300 font-semibold text-sm">Calculation Failed</p>
      <p className="text-red-400/70 text-xs mt-0.5 leading-relaxed">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 flex items-center gap-1.5 text-red-400 hover:text-red-300 text-xs font-medium transition-colors"
        >
          <RefreshCw size={11} />
          Try again
        </button>
      )}
    </div>
    {onDismiss && (
      <button
        onClick={onDismiss}
        className="text-white/30 hover:text-white/60 transition-colors flex-shrink-0"
      >
        <X size={14} />
      </button>
    )}
  </div>
);

export default ErrorAlert;
