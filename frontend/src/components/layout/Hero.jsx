// components/layout/Hero.jsx
import React from 'react';
import { Sparkles, ArrowDown } from 'lucide-react';

const Hero = () => (
  <div className="text-center pt-24 pb-10 px-4">
    {/* Announcement badge */}
    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/25 text-violet-300 text-xs font-semibold mb-6 animate-fade-in">
      <Sparkles size={12} className="text-violet-400" />
      Real-time pricing for AWS · Azure · GCP
    </div>

    {/* Headline */}
    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-4 animate-slide-up">
      Find the
      <span className="gradient-text"> Cheapest Cloud </span>
      <br className="hidden sm:block" />
      in Seconds
    </h1>

    <p className="text-white/50 text-base sm:text-lg max-w-2xl mx-auto mb-8 animate-fade-in" style={{ animationDelay: '150ms' }}>
      Compare costs across AWS, Azure, and Google Cloud instantly.
      Get optimization tips, reserved savings, and multi-cloud recommendations.
    </p>

    {/* Stat pills */}
    <div className="flex flex-wrap justify-center gap-3 mb-8 animate-fade-in" style={{ animationDelay: '250ms' }}>
      {[
        { emoji: '☁️', label: '3 Cloud Providers' },
        { emoji: '💰', label: 'Reserved Savings' },
        { emoji: '⚡', label: 'Instant Results' },
        { emoji: '🌍', label: '8 Regions' },
      ].map(({ emoji, label }) => (
        <div key={label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass border-white/10 text-white/50 text-xs font-medium">
          <span>{emoji}</span>
          {label}
        </div>
      ))}
    </div>

    <ArrowDown size={16} className="text-white/20 mx-auto animate-bounce" />
  </div>
);

export default Hero;
