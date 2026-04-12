// components/ui/ProviderCard.jsx
import React, { useState } from 'react';
import { Trophy, TrendingDown, ChevronDown, ChevronUp, CheckCircle } from 'lucide-react';
import { formatCurrency } from '../../utils/format';
import { Badge } from './index';

const PROVIDER_META = {
  aws:   { emoji: '☁️', gradient: 'from-amber-500/20 to-orange-600/10', border: 'border-amber-500/30', accent: 'text-amber-400', glow: 'hover:shadow-amber-500/10' },
  azure: { emoji: '🔷', gradient: 'from-blue-500/20 to-blue-700/10',   border: 'border-blue-500/30',  accent: 'text-blue-400',  glow: 'hover:shadow-blue-500/10' },
  gcp:   { emoji: '🌐', gradient: 'from-indigo-500/20 to-blue-500/10', border: 'border-indigo-500/30',accent: 'text-indigo-400',glow: 'hover:shadow-indigo-500/10' },
};

const BreakdownRow = ({ label, value, color = 'text-white/70' }) => (
  <div className="flex justify-between items-center py-1.5 border-b border-white/5 last:border-0">
    <span className="text-white/50 text-xs">{label}</span>
    <span className={`text-sm font-semibold ${color}`}>{formatCurrency(value)}</span>
  </div>
);

const ProviderCard = ({ data, index }) => {
  const [expanded, setExpanded] = useState(false);
  const meta = PROVIDER_META[data.provider] || PROVIDER_META.aws;

  const savings = data.premiumVsCheapest
    ? `+${formatCurrency(data.premiumVsCheapest)}/mo vs cheapest`
    : null;

  return (
    <div
      className={`
        relative rounded-2xl border bg-gradient-to-br ${meta.gradient} ${meta.border}
        ${data.isCheapest ? 'ring-2 ring-emerald-500/50 shadow-lg shadow-emerald-500/10' : ''}
        hover:shadow-xl ${meta.glow} transition-all duration-300
        animate-slide-up
      `}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Cheapest badge */}
      {data.isCheapest && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
          <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500 text-white text-xs font-bold shadow-lg">
            <Trophy size={11} />
            Best Price
          </div>
        </div>
      )}

      <div className="p-5 pt-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center text-2xl`}>
              {meta.emoji}
            </div>
            <div>
              <h3 className="text-white font-bold text-base leading-tight">{data.name}</h3>
              <p className="text-white/40 text-xs mt-0.5">{data.instanceType}</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <Badge variant={data.isCheapest ? 'success' : 'default'}>
              #{data.rank}
            </Badge>
            {savings && (
              <span className="text-red-400/70 text-[10px] font-medium">{savings}</span>
            )}
          </div>
        </div>

        {/* Main price */}
        <div className="text-center py-4 mb-4 rounded-xl bg-black/20">
          <p className="text-white/40 text-xs mb-1 uppercase tracking-wider">Monthly Estimate</p>
          <p className={`text-3xl font-extrabold ${data.isCheapest ? 'text-emerald-400' : 'text-white'}`}>
            {formatCurrency(data.totals.monthly)}
          </p>
          <p className="text-white/30 text-xs mt-1">
            {formatCurrency(data.totals.monthly / 730, 4)}/hr
          </p>
        </div>

        {/* Yearly & Reserved */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="rounded-xl bg-white/5 p-3 text-center">
            <p className="text-white/30 text-[10px] uppercase tracking-wide mb-1">Yearly</p>
            <p className="text-white font-bold text-sm">{formatCurrency(data.totals.yearly, 0)}</p>
          </div>
          <div className="rounded-xl bg-emerald-500/5 border border-emerald-500/15 p-3 text-center">
            <p className="text-emerald-400/60 text-[10px] uppercase tracking-wide mb-1">Reserved</p>
            <p className="text-emerald-400 font-bold text-sm">{formatCurrency(data.totals.reservedYearly, 0)}</p>
          </div>
        </div>

        {/* Reserved savings */}
        {data.totals.reservedSavings > 0 && (
          <div className="flex items-center gap-2 rounded-xl bg-emerald-500/5 border border-emerald-500/15 px-3 py-2 mb-4">
            <TrendingDown size={14} className="text-emerald-400 flex-shrink-0" />
            <p className="text-emerald-400 text-xs">
              Save <strong>{formatCurrency(data.totals.reservedSavings, 0)}/yr</strong> with reserved instances
            </p>
          </div>
        )}

        {/* Expand breakdown */}
        <button
          onClick={() => setExpanded((p) => !p)}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/50 hover:text-white/80 text-xs font-medium transition-all duration-200"
        >
          Cost Breakdown
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {expanded && (
          <div className="mt-3 animate-fade-in">
            <BreakdownRow label="💻 Compute (CPU)"    value={data.breakdown.compute} />
            <BreakdownRow label="🧠 Memory (RAM)"     value={data.breakdown.memory}  />
            <BreakdownRow label="💾 Storage (SSD)"    value={data.breakdown.storage} />
            <BreakdownRow label="🛠  Support (est.)"   value={data.breakdown.support} />
            <div className="flex justify-between items-center pt-2 mt-1">
              <span className="text-white/50 text-xs font-semibold">Total</span>
              <span className={`text-sm font-extrabold ${data.isCheapest ? 'text-emerald-400' : 'text-white'}`}>
                {formatCurrency(data.totals.monthly)}
              </span>
            </div>
          </div>
        )}

        {/* Features */}
        <div className="mt-4 pt-4 border-t border-white/5">
          <p className="text-white/30 text-[10px] uppercase tracking-widest mb-2">Key Strengths</p>
          <ul className="flex flex-col gap-1.5">
            {data.features.map((f, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle size={12} className={`${meta.accent} mt-0.5 flex-shrink-0`} />
                <span className="text-white/50 text-xs leading-tight">{f}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProviderCard;
