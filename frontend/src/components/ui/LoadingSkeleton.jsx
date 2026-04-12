// components/ui/LoadingSkeleton.jsx
import React from 'react';

const SkeletonBlock = ({ className = '' }) => (
  <div className={`shimmer rounded-xl ${className}`} />
);

const LoadingSkeleton = () => (
  <div className="flex flex-col gap-6 animate-fade-in">
    {/* Summary skeleton */}
    <div className="rounded-2xl glass-card p-5">
      <div className="flex items-center gap-3 mb-4">
        <SkeletonBlock className="w-10 h-10 rounded-xl" />
        <div className="flex flex-col gap-2 flex-1">
          <SkeletonBlock className="h-3 w-32" />
          <SkeletonBlock className="h-5 w-48" />
        </div>
      </div>
      <div className="flex gap-2">
        {[1,2,3,4].map(i => <SkeletonBlock key={i} className="h-7 w-24 rounded-full" />)}
      </div>
    </div>

    {/* Cards skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[1,2,3].map((i) => (
        <div key={i} className="rounded-2xl glass-card p-5 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <SkeletonBlock className="w-11 h-11 rounded-xl" />
            <div className="flex flex-col gap-2 flex-1">
              <SkeletonBlock className="h-4 w-28" />
              <SkeletonBlock className="h-3 w-20" />
            </div>
          </div>
          <SkeletonBlock className="h-20 rounded-xl" />
          <div className="grid grid-cols-2 gap-3">
            <SkeletonBlock className="h-14 rounded-xl" />
            <SkeletonBlock className="h-14 rounded-xl" />
          </div>
          <SkeletonBlock className="h-8 rounded-xl" />
        </div>
      ))}
    </div>

    {/* Chart skeleton */}
    <div className="rounded-2xl glass-card p-5">
      <div className="flex justify-between mb-4">
        <SkeletonBlock className="h-5 w-36" />
        <div className="flex gap-2">
          {[1,2,3].map(i => <SkeletonBlock key={i} className="h-7 w-20 rounded-xl" />)}
        </div>
      </div>
      <SkeletonBlock className="h-60 rounded-xl" />
    </div>

    {/* Tips skeleton */}
    <div className="flex flex-col gap-3">
      <SkeletonBlock className="h-5 w-44" />
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
        {[1,2,3].map(i => <SkeletonBlock key={i} className="h-24 rounded-xl" />)}
      </div>
    </div>
  </div>
);

export default LoadingSkeleton;
