import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bot, ShieldAlert, LogOut, MessageSquare, UserCheck, Sparkles } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 bg-dark-900/90 backdrop-blur-md border-b border-dark-700/60 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-primary via-brand-secondary to-brand-accent p-[2px] shadow-lg shadow-brand-primary/20 group-hover:scale-105 transition-transform duration-200">
            <div className="w-full h-full bg-dark-900 rounded-[10px] flex items-center justify-center">
              <Bot className="w-5 h-5 text-brand-accent group-hover:rotate-12 transition-transform duration-200" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                AgentAssist AI
              </span>
              <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded-md bg-brand-primary/20 text-brand-primary border border-brand-primary/30">
                Agentic
              </span>
            </div>
            <p className="text-xs text-slate-400 -mt-0.5 font-medium">BCT Demo System</p>
          </div>
        </Link>

        {/* Navigation & User Actions */}
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              {/* Route links */}
              <div className="flex items-center gap-1 bg-dark-800/80 p-1 rounded-xl border border-dark-700/50">
                <Link
                  to="/chat"
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                    location.pathname === '/chat'
                      ? 'bg-brand-primary text-white shadow-md shadow-brand-primary/25'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-dark-700/50'
                  }`}
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>AI Assistant</span>
                </Link>
                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                      location.pathname === '/admin'
                        ? 'bg-brand-secondary text-white shadow-md shadow-brand-secondary/25'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-dark-700/50'
                    }`}
                  >
                    <ShieldAlert className="w-4 h-4" />
                    <span>Supervisor Hub</span>
                  </Link>
                )}
              </div>

              {/* User badge */}
              <div className="flex items-center gap-3 pl-2 border-l border-dark-700/60">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-dark-800 border border-dark-700/60 text-xs text-slate-300">
                  <UserCheck className="w-3.5 h-3.5 text-brand-accent" />
                  <span className="font-semibold text-white">{user?.name}</span>
                  <span className={`px-1.5 py-0.2 rounded text-[10px] uppercase font-bold ${user?.role === 'admin' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-brand-primary/20 text-brand-primary border border-brand-primary/30'}`}>
                    {user?.role}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="p-2 rounded-xl bg-dark-800 text-slate-400 hover:text-red-400 hover:bg-dark-700 border border-dark-700/60 transition-all duration-150"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <Link
              to="/login"
              className="btn-primary text-sm shadow-md"
            >
              <Sparkles className="w-4 h-4" />
              <span>Launch Demo</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
