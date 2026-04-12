// components/ui/OptimizationTips.jsx
import React, { useState } from 'react';
import { Lightbulb, ChevronRight } from 'lucide-react';
import { Badge } from './index';

const impactConfig = {
  high:   { label: 'High Impact',   className: 'impact-high'   },
  medium: { label: 'Medium Impact', className: 'impact-medium' },
  low:    { label: 'Low Impact',    className: 'impact-low'    },
};

const OptimizationTips = ({ tips = [], multiCloud }) => {
  const [showAll, setShowAll] = useState(false);

  if (!tips.length && !multiCloud?.recommended) return null;

  const displayed = showAll ? tips : tips.slice(0, 3);

  return (
    <div className="flex flex-col gap-4">
      {/* Tips header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500/15 flex items-center justify-center">
            <Lightbulb size={14} className="text-amber-400" />
          </div>
          <h3 className="text-white font-bold text-base">Optimization Tips</h3>
          <Badge variant="warning">{tips.length}</Badge>
        </div>
        {tips.length > 3 && (
          <button
            onClick={() => setShowAll((p) => !p)}
            className="text-violet-400 hover:text-violet-300 text-xs font-medium flex items-center gap-1 transition-colors"
          >
            {showAll ? 'Show less' : `+${tips.length - 3} more`}
            <ChevronRight size={12} className={`transition-transform ${showAll ? 'rotate-90' : ''}`} />
          </button>
        )}
      </div>

      {/* Tip cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
        {displayed.map((tip, i) => {
          const impact = impactConfig[tip.impact] || impactConfig.low;
          return (
            <div
              key={i}
              className="rounded-xl bg-white/5 border border-white/8 hover:bg-white/8 hover:border-white/15 p-4 transition-all duration-200 animate-fade-in"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="flex items-start gap-3">
                <span className="text-xl leading-none mt-0.5 flex-shrink-0">{tip.icon}</span>
                <div className="flex flex-col gap-1.5 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-white font-semibold text-sm leading-tight">{tip.title}</p>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${impact.className}`}>
                      {impact.label}
                    </span>
                  </div>
                  <p className="text-white/50 text-xs leading-relaxed">{tip.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Multi-cloud recommendation */}
      {multiCloud?.recommended && (
        <div className="rounded-xl bg-gradient-to-br from-violet-500/10 to-blue-500/5 border border-violet-500/20 p-4 animate-fade-in">
          <div className="flex items-start gap-3">
            <span className="text-2xl leading-none flex-shrink-0">🌐</span>
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <p className="text-white font-bold text-sm">Multi-Cloud Strategy</p>
                <Badge variant="purple">Recommended</Badge>
              </div>
              <p className="text-white/50 text-xs mb-3">{multiCloud.strategy}</p>
              <ul className="flex flex-col gap-1.5">
                {multiCloud.suggestions.map((s, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-violet-400 text-xs mt-0.5">→</span>
                    <span className="text-white/60 text-xs">{s}</span>
                  </li>
                ))}
              </ul>
              {multiCloud.estimatedSavings > 0 && (
                <div className="mt-3 flex items-center gap-2 text-emerald-400">
                  <span className="text-sm">💰</span>
                  <span className="text-xs font-semibold">
                    Potential savings: ~${multiCloud.estimatedSavings.toFixed(0)}/month with hybrid approach
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OptimizationTips;
