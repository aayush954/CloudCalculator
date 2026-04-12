// components/charts/CostBarChart.jsx
import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, Legend,
} from 'recharts';
import { formatCurrency } from '../../utils/format';

const COLORS = {
  aws:   '#FF9900',
  azure: '#3b82f6',
  gcp:   '#6366f1',
};

const BREAKDOWN_COLORS = {
  compute: '#a78bfa',
  memory:  '#60a5fa',
  storage: '#34d399',
  support: '#f59e0b',
};

// Custom tooltip
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-gray-900/95 border border-white/10 rounded-xl p-3 shadow-xl min-w-[160px]">
      <p className="text-white font-semibold text-sm mb-2">{label}</p>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex justify-between gap-4 text-xs">
          <span style={{ color: p.fill || p.color }} className="capitalize">{p.dataKey}</span>
          <span className="text-white font-medium">{formatCurrency(p.value)}</span>
        </div>
      ))}
      {payload.length > 1 && (
        <div className="flex justify-between gap-4 text-xs border-t border-white/10 mt-1.5 pt-1.5">
          <span className="text-white/50">Total</span>
          <span className="text-white font-bold">
            {formatCurrency(payload.reduce((s, p) => s + (p.value || 0), 0))}
          </span>
        </div>
      )}
    </div>
  );
};

const CostBarChart = ({ providers }) => {
  const [view, setView] = useState('total'); // 'total' | 'breakdown' | 'yearly'

  const totalData = Object.values(providers).map((p) => ({
    name: p.shortName,
    provider: p.provider,
    Monthly: parseFloat(p.totals.monthly.toFixed(2)),
    Reserved: parseFloat(p.totals.reservedMonthly.toFixed(2)),
  }));

  const breakdownData = Object.values(providers).map((p) => ({
    name: p.shortName,
    compute: parseFloat(p.breakdown.compute.toFixed(2)),
    memory:  parseFloat(p.breakdown.memory.toFixed(2)),
    storage: parseFloat(p.breakdown.storage.toFixed(2)),
    support: parseFloat(p.breakdown.support.toFixed(2)),
  }));

  const yearlyData = Object.values(providers).map((p) => ({
    name: p.shortName,
    provider: p.provider,
    'On-Demand': parseFloat(p.totals.yearly.toFixed(2)),
    'Reserved':  parseFloat(p.totals.reservedYearly.toFixed(2)),
  }));

  const tabs = [
    { id: 'total',     label: 'Monthly' },
    { id: 'breakdown', label: 'Breakdown' },
    { id: 'yearly',    label: 'Yearly' },
  ];

  return (
    <div className="rounded-2xl glass-card p-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h3 className="text-white font-bold text-base">Cost Comparison</h3>
          <p className="text-white/40 text-xs mt-0.5">Visual breakdown by provider</p>
        </div>
        <div className="flex bg-white/5 rounded-xl p-1 gap-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setView(t.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                view === t.id
                  ? 'bg-violet-600 text-white shadow'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={260}>
        {view === 'breakdown' ? (
          <BarChart data={breakdownData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={(v) => `$${v}`} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} width={50} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
            <Legend formatter={(v) => <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, textTransform: 'capitalize' }}>{v}</span>} />
            <Bar dataKey="compute" stackId="a" fill={BREAKDOWN_COLORS.compute} radius={[0,0,0,0]} />
            <Bar dataKey="memory"  stackId="a" fill={BREAKDOWN_COLORS.memory}  radius={[0,0,0,0]} />
            <Bar dataKey="storage" stackId="a" fill={BREAKDOWN_COLORS.storage} radius={[0,0,0,0]} />
            <Bar dataKey="support" stackId="a" fill={BREAKDOWN_COLORS.support} radius={[6,6,0,0]} />
          </BarChart>
        ) : view === 'yearly' ? (
          <BarChart data={yearlyData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={(v) => `$${(v/1000).toFixed(1)}k`} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} width={55} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
            <Legend formatter={(v) => <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>{v}</span>} />
            <Bar dataKey="On-Demand" fill="#6366f1" radius={[4,4,0,0]}>
              {yearlyData.map((d) => <Cell key={d.name} fill={COLORS[d.provider] || '#6366f1'} />)}
            </Bar>
            <Bar dataKey="Reserved"  fill="#34d399" radius={[4,4,0,0]} />
          </BarChart>
        ) : (
          <BarChart data={totalData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={(v) => `$${v}`} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} width={55} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
            <Legend formatter={(v) => <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>{v}</span>} />
            <Bar dataKey="Monthly" radius={[4,4,0,0]}>
              {totalData.map((d) => <Cell key={d.name} fill={COLORS[d.provider] || '#888'} />)}
            </Bar>
            <Bar dataKey="Reserved" fill="#34d399" radius={[4,4,0,0]} />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

export default CostBarChart;
