// components/layout/Footer.jsx
import React from 'react';
import { Cloud, Heart } from 'lucide-react';

const Footer = () => (
  <footer className="border-t border-white/5 py-8 mt-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-white/30 text-sm">
          <Cloud size={14} />
          <span>CloudCalc</span>
          <span className="text-white/15">·</span>
          <span>Prices are estimates. Always verify with official provider calculators.</span>
        </div>
        <div className="flex items-center gap-1.5 text-white/20 text-xs">
          <span>Built with</span>
          <Heart size={11} className="text-red-500/50" />
          <span>using React, Node.js & MongoDB</span>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
