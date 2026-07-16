import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, ShieldCheck, Package, Ticket, Award, Star, Copy, ArrowRight, Sparkles, CheckCircle2, AlertCircle, RefreshCw, Layers } from 'lucide-react';

const CustomerProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const orders = [
    { id: 'ORD1005', status: 'DELAYED', eta: 'July 20, 2026', item: 'HelpFlow Pro Laptop (16-inch)', progress: 65, step: 'In Transit - Customs Hold' },
    { id: 'ORD1008', status: 'SHIPPED', eta: 'July 17, 2026', item: 'Wireless Noise-Cancelling Headphones', progress: 90, step: 'Out for Delivery' }
  ];

  const tickets = [
    { id: 'TCK-101', status: 'OPEN', priority: 'High', issue: 'Inquiry regarding billing breakdown for Order ORD1005.' }
  ];

  const handleAskAI = (promptText) => {
    // Navigate cleanly to AI Workspace with state/query or copy text
    navigate('/chat', { state: { initialPrompt: promptText } });
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border-white/[0.08] bg-gradient-to-r from-dark-850 via-dark-850 to-indigo-950/40 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-brand-primary/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex items-center gap-4 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-primary via-indigo-600 to-brand-accent p-[2px] shadow-xl shadow-brand-primary/25 flex-shrink-0">
            <div className="w-full h-full bg-dark-950 rounded-[14px] flex items-center justify-center text-white font-black text-2xl tracking-tight">
              {user?.name?.charAt(0) || 'C'}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">{user?.name || 'Customer Profile'}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold font-mono bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                Verified Enterprise
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 font-mono flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-slate-500" />
              <span>{user?.email || 'customer@example.com'}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <span className="px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-500/20 to-amber-600/20 text-amber-300 border border-amber-500/40 font-bold text-xs flex items-center gap-2 shadow-sm">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>VIP Gold Tier Account</span>
          </span>
        </div>
      </div>

      {/* Account Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-6 rounded-2xl border-white/[0.08] flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Support SLA</span>
            <span className="text-base font-extrabold text-white font-mono mt-0.5 block">Priority 24/7 Guaranteed</span>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl border-white/[0.08] flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <Star className="w-6 h-6 fill-amber-400" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Customer Rating</span>
            <span className="text-base font-extrabold text-white font-mono mt-0.5 block">4.9 / 5.0 (Excellent)</span>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl border-white/[0.08] flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-brand-primary/15 text-brand-accent border border-brand-primary/30">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Security Status</span>
            <span className="text-base font-extrabold text-white font-mono mt-0.5 block">2FA Enabled • Active</span>
          </div>
        </div>
      </div>

      {/* Active Orders & Shipments Tab Information */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border-white/[0.08] space-y-6">
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-brand-primary/20 text-brand-accent">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">Active Orders & Fulfillment Status</h2>
              <p className="text-xs text-slate-400">Real-time synchronized tracking with logistics database</p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-dark-950 text-slate-300 border border-white/10">
            {orders.length} Active Shipments
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {orders.map((ord) => (
            <div
              key={ord.id}
              className="glass-panel p-6 rounded-2xl border-white/[0.08] space-y-4 hover:border-brand-primary/50 transition-all shadow-md group"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-black text-base text-brand-accent">
                  #{ord.id}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-mono font-extrabold tracking-wider uppercase ${
                  ord.status === 'DELAYED'
                    ? 'bg-amber-500/15 text-amber-400 border border-amber-500/35'
                    : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/35'
                }`}>
                  {ord.status}
                </span>
              </div>

              <p className="text-base font-bold text-white">{ord.item}</p>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-slate-300">
                  <span>{ord.step}</span>
                  <span className="font-bold text-brand-accent">{ord.progress}%</span>
                </div>
                <div className="w-full bg-dark-950 h-2 rounded-full overflow-hidden border border-white/[0.08]">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      ord.status === 'DELAYED'
                        ? 'bg-gradient-to-r from-amber-500 to-amber-300'
                        : 'bg-gradient-to-r from-brand-primary via-indigo-500 to-brand-accent'
                    }`}
                    style={{ width: `${ord.progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/[0.06] text-xs font-mono">
                <span className="text-slate-400">Expected Delivery: <strong className="text-white">{ord.eta}</strong></span>
                <button
                  onClick={() => handleAskAI(`Can you give me a detailed explanation on why order #${ord.id} is currently ${ord.status.toLowerCase()} and when it will arrive?`)}
                  className="px-3.5 py-1.5 rounded-xl bg-brand-primary/20 hover:bg-brand-primary/30 text-brand-accent font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Ask AI Assistant</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Support Tickets Queue Tab Information */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border-white/[0.08] space-y-6">
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
              <Ticket className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">Priority Escalation Tickets</h2>
              <p className="text-xs text-slate-400">Manage and track your active support inquiries</p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-dark-950 text-amber-300 border border-white/10">
            {tickets.length} Open Ticket
          </span>
        </div>

        <div className="space-y-4">
          {tickets.map((tck) => (
            <div
              key={tck.id}
              className="glass-panel p-6 rounded-2xl border-white/[0.08] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-amber-500/50 transition-all shadow-md"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono font-black text-sm text-amber-300">#{tck.id}</span>
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-dark-950 text-slate-300 border border-white/[0.08]">
                    {tck.priority} Priority
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider bg-amber-500/15 text-amber-400 border border-amber-500/35">
                    {tck.status}
                  </span>
                </div>
                <p className="text-sm text-white font-medium">{tck.issue}</p>
              </div>

              <button
                onClick={() => handleAskAI(`Check status and updates for my support ticket #${tck.id}`)}
                className="px-4 py-2 sm:py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-xs transition-all flex items-center gap-2 cursor-pointer flex-shrink-0"
              >
                <span>Check Status with AI</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomerProfilePage;
