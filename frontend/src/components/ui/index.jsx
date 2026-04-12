// components/ui/index.jsx — Shared UI primitives

import React from 'react';
import { Loader2 } from 'lucide-react';

// ─── Button ──────────────────────────────────────────────────
export const Button = ({
  children, onClick, disabled, loading, variant = 'primary',
  size = 'md', className = '', type = 'button', fullWidth = false,
}) => {
  const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 select-none focus:outline-none focus:ring-2 focus:ring-violet-500/50';

  const variants = {
    primary:  'bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 active:scale-[0.98]',
    secondary:'bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/30 active:scale-[0.98]',
    danger:   'bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 active:scale-[0.98]',
    ghost:    'bg-transparent hover:bg-white/10 text-white/70 hover:text-white active:scale-[0.98]',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-8 py-3.5 text-base',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {loading && <Loader2 size={16} className="animate-spin" />}
      {children}
    </button>
  );
};

// ─── Badge ────────────────────────────────────────────────────
export const Badge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default:  'bg-white/10 text-white/70',
    success:  'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25',
    warning:  'bg-amber-500/15 text-amber-400 border border-amber-500/25',
    danger:   'bg-red-500/15 text-red-400 border border-red-500/25',
    info:     'bg-blue-500/15 text-blue-400 border border-blue-500/25',
    purple:   'bg-violet-500/15 text-violet-400 border border-violet-500/25',
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

// ─── Spinner ──────────────────────────────────────────────────
export const Spinner = ({ size = 24, className = '' }) => (
  <Loader2 size={size} className={`animate-spin text-violet-400 ${className}`} />
);

// ─── Card ─────────────────────────────────────────────────────
export const Card = ({ children, className = '', hover = false, glow = false }) => (
  <div className={`
    rounded-2xl glass-card p-5
    ${hover ? 'hover:bg-white/10 hover:border-white/20 cursor-pointer' : ''}
    ${glow  ? 'hover:shadow-lg hover:shadow-violet-500/10' : ''}
    transition-all duration-300
    ${className}
  `}>
    {children}
  </div>
);

// ─── Skeleton ────────────────────────────────────────────────
export const Skeleton = ({ className = '' }) => (
  <div className={`shimmer rounded-xl ${className}`} />
);

// ─── Divider ─────────────────────────────────────────────────
export const Divider = ({ label, className = '' }) => (
  <div className={`flex items-center gap-3 ${className}`}>
    <div className="flex-1 h-px bg-white/10" />
    {label && <span className="text-white/30 text-xs font-medium">{label}</span>}
    <div className="flex-1 h-px bg-white/10" />
  </div>
);

// ─── Stat ─────────────────────────────────────────────────────
export const Stat = ({ label, value, sub, icon: Icon, color = 'text-white' }) => (
  <div className="flex flex-col gap-1">
    <div className="flex items-center gap-1.5">
      {Icon && <Icon size={13} className="text-white/40" />}
      <span className="text-white/50 text-xs font-medium uppercase tracking-wide">{label}</span>
    </div>
    <span className={`text-2xl font-bold ${color}`}>{value}</span>
    {sub && <span className="text-white/40 text-xs">{sub}</span>}
  </div>
);

// ─── InputField ──────────────────────────────────────────────
export const InputField = ({
  label, value, onChange, min, max, step = 1,
  unit, icon: Icon, error, hint, type = 'number',
}) => (
  <div className="flex flex-col gap-1.5">
    <label className="flex items-center gap-2 text-white/70 text-sm font-medium">
      {Icon && <Icon size={14} className="text-violet-400" />}
      {label}
    </label>
    <div className="relative">
      <input
        type={type}
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={onChange}
        className={`
          w-full bg-white/5 border ${error ? 'border-red-500/50' : 'border-white/10'}
          rounded-xl px-4 py-3 text-white placeholder-white/20
          focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500/50
          hover:border-white/20 transition-all duration-200 text-sm
          ${unit ? 'pr-16' : ''}
        `}
      />
      {unit && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 text-sm font-medium pointer-events-none">
          {unit}
        </span>
      )}
    </div>
    {error && <p className="text-red-400 text-xs">{error}</p>}
    {hint  && <p className="text-white/30 text-xs">{hint}</p>}
  </div>
);
