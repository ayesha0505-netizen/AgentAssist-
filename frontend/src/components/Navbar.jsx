import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bot, LogOut, MessageSquare, Sparkles, User as UserIcon, Package } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();

  const isActive = (path, tabParam) => {
    if (tabParam) {
      const searchParams = new URLSearchParams(location.search);
      const currentTab = searchParams.get('tab') || 'overview';
      return location.pathname === path && currentTab === tabParam;
    }
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-dark-900/80 backdrop-blur-2xl border-b border-white/[0.08] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-4 sm:gap-6">
          <div id="navbar-chat-left" className="empty:hidden flex items-center"></div>
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-primary via-indigo-600 to-brand-accent p-[1px] shadow-lg shadow-brand-primary/25 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-dark-950 rounded-[15px] flex items-center justify-center overflow-hidden p-1.5">
                <img src="/helpflow-icon.png" alt="HelpFlow AI" className="w-full h-full object-contain" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5 whitespace-nowrap">
                <span>HelpFlow AI</span>
                <span className="px-1.5 py-0.5 rounded-md text-[9px] font-mono bg-brand-primary/20 text-brand-accent border border-brand-primary/30 uppercase tracking-widest shrink-0">
                  Enterprise
                </span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium tracking-wide whitespace-nowrap">
                AI Customer Support Platform
              </span>
            </div>
          </Link>

          {/* System Health Indicator */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-dark-850/80 border border-white/[0.06] text-xs text-slate-300 font-mono">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>All Systems Operational</span>
          </div>
        </div>

        {/* Landing Page Section Navigation */}
        {isActive('/') && (
          <nav className="hidden lg:flex items-center gap-1 bg-dark-950/70 p-1.5 rounded-2xl border border-white/[0.08] shadow-inner">
            <a
              href="#why"
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-dark-850 transition-all"
            >
              Why HelpFlow?
            </a>
            <a
              href="#features"
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-dark-850 transition-all"
            >
              Features
            </a>
            <a
              href="#architecture"
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-dark-850 transition-all"
            >
              Architecture
            </a>
            <a
              href="#integration"
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-dark-850 transition-all"
            >
              Integration
            </a>
            <a
              href="#pricing"
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-dark-850 transition-all"
            >
              Pricing
            </a>
          </nav>
        )}

        {/* Navigation Tabs */}
        {isAuthenticated ? (
          <div className="flex items-center gap-3 sm:gap-6">
            <nav className="flex items-center gap-1 bg-dark-950/60 p-1.5 rounded-2xl border border-white/[0.06] overflow-x-auto no-scrollbar">
              <Link
                to="/chat"
                className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  isActive('/chat')
                    ? 'bg-gradient-to-r from-brand-primary to-indigo-600 text-white shadow-lg shadow-brand-primary/25 border border-white/10'
                    : 'text-slate-400 hover:text-white hover:bg-dark-850'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-[#7dd3fc]" />
                <span>AI Workspace</span>
              </Link>

              <Link
                to="/profile"
                className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  isActive('/profile')
                    ? 'bg-gradient-to-r from-brand-primary to-indigo-600 text-white shadow-lg shadow-brand-primary/25 border border-white/10'
                    : 'text-slate-400 hover:text-white hover:bg-dark-850'
                }`}
              >
                <Package className="w-3.5 h-3.5 text-emerald-400" />
                <span>Profile & Orders</span>
              </Link>
            </nav>

            <div id="navbar-chat-right" className="empty:hidden flex items-center gap-2"></div>

            {/* User Account Pill */}
            <div className="flex items-center gap-3 pl-3 border-l border-white/[0.08]">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-bold text-slate-200 leading-none">{user?.name}</span>
                <span className="text-[10px] text-brand-accent font-medium uppercase tracking-wider mt-1 flex items-center justify-end gap-1">
                  <UserIcon className="w-2.5 h-2.5 text-brand-accent" />
                  <span>Customer</span>
                </span>
              </div>

              <button
                onClick={logout}
                title="Sign Out"
                className="p-2.5 rounded-xl bg-dark-850 hover:bg-rose-500/15 text-slate-400 hover:text-rose-400 border border-white/[0.06] hover:border-rose-500/30 transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <a
              href="#interactive-demo"
              className="hidden sm:flex items-center justify-center px-4 py-2 rounded-xl bg-dark-800 hover:bg-dark-750 text-slate-300 hover:text-white text-xs font-semibold border border-white/[0.08] transition-all"
            >
              Request Demo
            </a>
            <Link
              to="/login"
              className="flex items-center justify-center px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-primary via-indigo-600 to-brand-secondary text-white text-xs font-bold shadow-lg shadow-brand-primary/25 hover:shadow-brand-primary/45 hover:scale-105 active:scale-95 transition-all border border-white/10"
            >
              Sign In
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
