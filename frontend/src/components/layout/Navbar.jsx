// components/layout/Navbar.jsx
import React from 'react';
import { Sun, Moon, Cloud, Zap } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const Navbar = () => {
  const { isDark, toggle } = useTheme();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center shadow-lg">
              <Cloud size={18} className="text-white" />
            </div>
            <div>
              <span className="text-white font-bold text-lg tracking-tight">CloudCalc</span>
              <span className="hidden sm:inline text-white/40 text-xs ml-2 font-normal">Multi-Cloud Calculator</span>
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <Zap size={12} className="text-emerald-400" />
              <span className="text-emerald-400 text-xs font-medium">Live Pricing</span>
            </div>

            <button
              onClick={toggle}
              className="w-9 h-9 rounded-xl glass flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
