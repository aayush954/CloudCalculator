// components/ui/ResultsSummary.jsx
import React from 'react';
import { Trophy, TrendingDown, Calendar, Cpu, MemoryStick, HardDrive, Clock } from 'lucide-react';
import { formatCurrency } from '../../utils/format';

const PROVIDER_NAMES = { aws: 'AWS', azure: 'Azure', gcp: 'GCP' };

const MetaPill = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/8">
    <Icon size={12} className="text-white/40" />
    <span className="text-white/40 text-xs">{label}:</span>
    <span className="text-white/70 text-xs font-semibold">{value}</span>
  </div>
);

const ResultsSummary = ({ result }) => {
  const cheapestData = result.providers[result.cheapest];
  const cheapestMonthly = cheapestData.totals.monthly;
  const maxMonthly = Math.max(...Object.values(result.providers).map((p) => p.totals.monthly));
  const maxSaving = maxMonthly - cheapestMonthly;

  return (
    <div className="rounded-2xl glass-card overflow-hidden animate-slide-up">
      {/* Top gradient banner */}
      <div className="bg-gradient-to-r from-emerald-600/20 via-emerald-500/10 to-transparent px-5 py-4 border-b border-emerald-500/15">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <Trophy size={20} className="text-emerald-400" />
            </div>
            <div>
              <p className="text-emerald-400/70 text-xs font-semibold uppercase tracking-widest">Cheapest Provider</p>
              <p className="text-white font-extrabold text-xl">
                {cheapestData.name}
                <span className="text-emerald-400 ml-2">{formatCurrency(cheapestMonthly)}<span className="text-sm font-normal text-emerald-400/70">/mo</span></span>
              </p>
            </div>
          </div>

          {maxSaving > 0 && (
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <TrendingDown size={16} className="text-emerald-400" />
              <div>
                <p className="text-emerald-400 font-bold text-base">{formatCurrency(maxSaving)}/mo</p>
                <p className="text-emerald-400/60 text-xs">saved vs most expensive</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Ranking row */}
      <div className="px-5 py-3 border-b border-white/5">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-white/30 text-xs">Ranking:</span>
          {result.ranking.map((key, i) => {
            const p = result.providers[key];
            return (
              <div key={key} className="flex items-center gap-1.5">
                {i > 0 && <span className="text-white/20 text-xs">›</span>}
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
                  i === 0
                    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                    : 'bg-white/5 text-white/50 border-white/10'
                }`}>
                  {PROVIDER_NAMES[key]} {formatCurrency(p.totals.monthly, 0)}
                </span>
                {i > 0 && (
                  <span className="text-red-400/50 text-[10px]">
                    +{p.premiumPercent}%
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Input summary */}
      <div className="px-5 py-3 flex flex-wrap gap-2">
        <MetaPill icon={Cpu}       label="CPU"     value={`${result.inputs.cpu} vCPU`} />
        <MetaPill icon={MemoryStick} label="RAM"   value={`${result.inputs.ram} GB`} />
        <MetaPill icon={HardDrive} label="Storage" value={`${result.inputs.storage} GB`} />
        <MetaPill icon={Clock}     label="Hours"   value={`${result.inputs.hours}h/mo`} />
        <MetaPill icon={Calendar}  label="Region"  value={cheapestData.region} />
      </div>
    </div>
  );
};

export default ResultsSummary;
