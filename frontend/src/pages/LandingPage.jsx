import React from 'react';
import { Link } from 'react-router-dom';
import { Bot, Sparkles, ArrowRight, ShieldCheck, Cpu, Database, Wrench, CheckCircle } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-brand-primary/20 via-brand-secondary/15 to-transparent rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-5xl mx-auto text-center relative z-10 space-y-8">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-dark-800/80 border border-brand-primary/40 text-xs font-semibold text-brand-accent shadow-lg animate-fade-in">
          <Sparkles className="w-3.5 h-3.5" />
          <span>BCT Agentic AI Demonstration System — Version 1.0</span>
        </div>

        {/* Hero Title */}
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Autonomous Customer Support Powered by{' '}
            <span className="bg-gradient-to-r from-brand-primary via-brand-accent to-purple-400 bg-clip-text text-transparent">
              Agentic Reasoning
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
            Experience the future of AI assistants. Built with Google Gemini, multi-step ReAct loop reasoning, local FAISS vector search, and live database tool execution.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            to="/login"
            className="w-full sm:w-auto btn-primary px-8 py-4 text-base font-semibold shadow-xl shadow-brand-primary/30"
          >
            <span>Launch Live Demo</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
          <a
            href="#features"
            className="w-full sm:w-auto btn-secondary px-8 py-4 text-base font-semibold"
          >
            Explore Architecture
          </a>
        </div>

        {/* Features Grid */}
        <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 text-left">
          <div className="glass-card p-6 rounded-3xl border-dark-700/80 space-y-3 hover:border-brand-primary/50 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-brand-primary/20 border border-brand-primary/30 flex items-center justify-center text-brand-primary group-hover:scale-110 transition-transform">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-white">ReAct Multi-Step Loop</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Synthesizes observations and plans successive actions. Example: checks order delay first, then autonomously executes ticket creation if needed.
            </p>
          </div>

          <div className="glass-card p-6 rounded-3xl border-dark-700/80 space-y-3 hover:border-brand-secondary/50 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-brand-secondary/20 border border-brand-secondary/30 flex items-center justify-center text-brand-secondary group-hover:scale-110 transition-transform">
              <Database className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-white">Local RAG Knowledge</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Ingests FAQ and policy documents (`.md`), chunks via recursive text splitting, and retrieves exact answers using FAISS vector indexing.
            </p>
          </div>

          <div className="glass-card p-6 rounded-3xl border-dark-700/80 space-y-3 hover:border-brand-accent/50 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-brand-accent/20 border border-brand-accent/30 flex items-center justify-center text-brand-accent group-hover:scale-110 transition-transform">
              <Wrench className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-white">Deterministic Tool Dispatch</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Executes exact SQL operations: checking live orders, searching product stock, booking consultation appointments, and opening tickets.
            </p>
          </div>
        </div>

        {/* Demo Credentials Footer Info */}
        <div className="glass-panel max-w-2xl mx-auto mt-12 p-4 rounded-2xl border-dark-700 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>Pre-seeded Database Ready (`ORD1005` Delayed Order, `ORD1008` Shipped)</span>
          </div>
          <Link to="/login" className="text-brand-accent font-semibold hover:underline flex items-center gap-1">
            <span>Try login now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
