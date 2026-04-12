// pages/Dashboard.jsx
import React, { useRef } from 'react';
import { ArrowDown } from 'lucide-react';
import CalculatorForm from '../components/forms/CalculatorForm';
import ProviderCard     from '../components/ui/ProviderCard';
import CostBarChart     from '../components/charts/CostBarChart';
import OptimizationTips from '../components/ui/OptimizationTips';
import ResultsSummary   from '../components/ui/ResultsSummary';
import LoadingSkeleton  from '../components/ui/LoadingSkeleton';
import ErrorAlert       from '../components/ui/ErrorAlert';
import Hero             from '../components/layout/Hero';
import useCalculator    from '../hooks/useCalculator';

const Dashboard = () => {
  const { result, loading, error, calculate, reset } = useCalculator();
  const resultsRef = useRef(null);

  const handleCalculate = async (inputs) => {
    await calculate(inputs);
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)' }}>
      {/* Hero */}
      <Hero />

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Two-column layout on lg+ */}
        <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-8 items-start">
          {/* Left: Form (sticky on desktop) */}
          <div className="lg:sticky lg:top-24">
            <div className="rounded-2xl glass-card p-6 shadow-2xl">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-1.5 h-6 rounded-full bg-gradient-to-b from-violet-500 to-purple-600" />
                <h2 className="text-white font-bold text-lg">Configure Resources</h2>
              </div>
              <CalculatorForm onCalculate={handleCalculate} loading={loading} />
            </div>
          </div>

          {/* Right: Results */}
          <div ref={resultsRef} className="flex flex-col gap-6 min-h-[200px]">
            {/* Error state */}
            {error && (
              <ErrorAlert
                message={error}
                onDismiss={reset}
                onRetry={() => {}}
              />
            )}

            {/* Loading state */}
            {loading && <LoadingSkeleton />}

            {/* Results */}
            {!loading && result && (
              <>
                {/* Summary banner */}
                <ResultsSummary result={result} />

                {/* Provider cards */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1.5 h-5 rounded-full bg-gradient-to-b from-amber-400 to-orange-500" />
                    <h2 className="text-white font-bold text-base">Provider Comparison</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {result.ranking.map((key, i) => (
                      <ProviderCard key={key} data={result.providers[key]} index={i} />
                    ))}
                  </div>
                </div>

                {/* Chart */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1.5 h-5 rounded-full bg-gradient-to-b from-blue-400 to-indigo-500" />
                    <h2 className="text-white font-bold text-base">Visual Comparison</h2>
                  </div>
                  <CostBarChart providers={result.providers} />
                </div>

                {/* Tips */}
                {result.tips?.length > 0 && (
                  <div>
                    <OptimizationTips tips={result.tips} multiCloud={result.multiCloud} />
                  </div>
                )}
              </>
            )}

            {/* Empty state */}
            {!loading && !result && !error && (
              <div className="flex flex-col items-center justify-center h-[420px] text-center">
                <div className="w-20 h-20 rounded-2xl glass flex items-center justify-center text-4xl mb-5 pulse-slow">
                  ☁️
                </div>
                <h3 className="text-white/60 font-semibold text-lg mb-2">Ready to Compare</h3>
                <p className="text-white/30 text-sm max-w-xs leading-relaxed">
                  Configure your workload on the left and click <strong className="text-violet-400">Compare Cloud Costs</strong> to see a full breakdown.
                </p>
                <div className="flex items-center gap-2 mt-6 text-white/20 text-xs">
                  <ArrowDown size={14} className="rotate-[270deg]" />
                  <span>Fill the form to get started</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
