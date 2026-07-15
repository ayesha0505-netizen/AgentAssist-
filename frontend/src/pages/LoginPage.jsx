import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bot, Lock, Mail, User, Sparkles, ArrowRight } from 'lucide-react';

const LoginPage = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('customer@example.com');
  const [password, setPassword] = useState('password');
  const [name, setName] = useState('John Doe');
  const [role, setRole] = useState('customer');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isRegister) {
        await register(name, email, password, role);
      } else {
        await login(email, password);
      }
      navigate('/chat');
    } catch (err) {
      setError(err.response?.data?.detail || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCreds = (demoType) => {
    if (demoType === 'customer') {
      setEmail('customer@example.com');
      setPassword('password');
      setIsRegister(false);
    } else {
      setEmail('admin@example.com');
      setPassword('admin');
      setIsRegister(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Background ambient light */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-primary/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-md w-full space-y-8 glass-card p-8 rounded-3xl border-dark-700/80 shadow-2xl relative z-10">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-brand-primary to-brand-secondary text-white shadow-lg shadow-brand-primary/25 mb-2">
            <Bot className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            {isRegister ? 'Create Demo Account' : 'Welcome to AgentAssist AI'}
          </h2>
          <p className="text-xs text-slate-400">
            {isRegister ? 'Join the autonomous customer support experience' : 'Sign in to interact with the Agentic support bot'}
          </p>
        </div>

        {/* Demo Account Switcher */}
        <div className="p-3 rounded-2xl bg-dark-900/80 border border-dark-700/80 space-y-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block text-center">
            Quick Fill Demo Credentials
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => fillDemoCreds('customer')}
              className="px-3 py-1.5 rounded-xl bg-dark-800 hover:bg-dark-700 text-xs font-medium text-slate-200 border border-dark-700 transition-colors flex items-center justify-center gap-1.5"
            >
              <User className="w-3.5 h-3.5 text-brand-accent" />
              <span>Customer User</span>
            </button>
            <button
              type="button"
              onClick={() => fillDemoCreds('admin')}
              className="px-3 py-1.5 rounded-xl bg-dark-800 hover:bg-dark-700 text-xs font-medium text-slate-200 border border-dark-700 transition-colors flex items-center justify-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>Admin Supervisor</span>
            </button>
          </div>
        </div>

        {/* Form */}
        <form className="space-y-4 mt-6" onSubmit={handleSubmit}>
          {isRegister && (
            <>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-dark-900/80 text-white text-sm pl-10 pr-4 py-3 rounded-xl border border-dark-700 focus:outline-none focus:border-brand-primary"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-dark-900/80 text-white text-sm px-4 py-3 rounded-xl border border-dark-700 focus:outline-none focus:border-brand-primary"
                >
                  <option value="customer">Customer</option>
                  <option value="admin">Supervisor Admin</option>
                </select>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-dark-900/80 text-white text-sm pl-10 pr-4 py-3 rounded-xl border border-dark-700 focus:outline-none focus:border-brand-primary"
                placeholder="customer@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-dark-900/80 text-white text-sm pl-10 pr-4 py-3 rounded-xl border border-dark-700 focus:outline-none focus:border-brand-primary"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-3.5 text-sm font-semibold shadow-lg shadow-brand-primary/25 disabled:opacity-50"
          >
            <span>{isRegister ? 'Register Account' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Toggle Register/Login */}
        <div className="text-center text-xs text-slate-400 pt-2 border-t border-dark-700/60">
          {isRegister ? 'Already have an account?' : "Don't have an account yet?"}{' '}
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setError(null);
            }}
            className="text-brand-accent hover:underline font-semibold"
          >
            {isRegister ? 'Sign in' : 'Create an account'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
