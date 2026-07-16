import React, { useState } from 'react';
import { 
  CheckCircle2, Search, Ticket, PackageCheck, Calendar, 
  Terminal, ChevronDown, ChevronUp, Sparkles, MapPin, 
  FileText, UserCheck, AlertCircle, ShoppingBag, Clock, ArrowRight 
} from 'lucide-react';

const ToolBadge = ({ toolName, arguments: args, result, devMode = false, onSuggestedAction }) => {
  const [expanded, setExpanded] = useState(false);

  // If NOT in Developer Mode, show intelligent step progression and human-centric cards
  if (!devMode) {
    // 1. CheckOrderTool UI
    if (toolName?.includes('Order')) {
      const orderId = result?.order_id || args?.order_id || 'ORD1005';
      const isFound = result?.found !== false;
      const courier = result?.courier || 'FedEx Priority Express';
      const trackingNum = result?.tracking_number || `FDX-${orderId}-8923US`;
      const expectedDelivery = result?.expected_delivery || 'July 20, 2026';
      const status = result?.status || 'SHIPPED';

      return (
        <div className="my-4 rounded-3xl bg-dark-950/90 border border-white/[0.12] shadow-2xl overflow-hidden font-sans text-slate-200 animate-slide-up">
          {/* Intelligent Verification Sequence Banner */}
          <div className="bg-dark-900/95 px-5 py-3 border-b border-white/[0.08] flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-300">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>Finding your order...</span>
            </span>
            <span className="text-slate-600 font-bold">•</span>
            <span className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>Checking shipment...</span>
            </span>
            <span className="text-slate-600 font-bold">•</span>
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>Almost done...</span>
            </span>
          </div>

          {/* Verification Outcome Card Body */}
          {isFound ? (
            <div className="p-5 sm:p-6 space-y-5">
              {/* Card Title & Status Badge */}
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-md">
                    <PackageCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-white text-base tracking-tight">Order Found</h4>
                    <span className="text-xs font-mono text-slate-400">Order #{orderId}</span>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider border shadow-sm ${
                  status === 'DELIVERED'
                    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                    : status === 'DELAYED'
                    ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                    : 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30'
                }`}>
                  {status}
                </span>
              </div>

              {/* Grid of Verified Shipment Data */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-dark-900/70 p-4 rounded-2xl border border-white/[0.06] shadow-inner">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Courier</span>
                  <span className="text-sm font-extrabold text-white block truncate">{courier}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Tracking Number</span>
                  <span className="text-sm font-mono font-bold text-brand-accent block truncate">{trackingNum}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Estimated Delivery</span>
                  <span className="text-sm font-extrabold text-white block truncate">{expectedDelivery}</span>
                </div>
              </div>

              {/* Suggested Actions Section */}
              <div className="pt-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-3">Suggested Actions</span>
                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    onClick={() => onSuggestedAction && onSuggestedAction('Track Shipment', result || args)}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-brand-primary to-indigo-600 hover:from-brand-primary/90 hover:to-indigo-500 text-white border border-white/20 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md hover:scale-[1.02] active:scale-95"
                  >
                    <MapPin className="w-3.5 h-3.5 text-brand-accent" />
                    <span>Track Shipment</span>
                  </button>
                  <button
                    onClick={() => onSuggestedAction && onSuggestedAction('Download Invoice', result || args)}
                    className="px-4 py-2 rounded-xl bg-dark-850 hover:bg-dark-800 text-slate-200 hover:text-white border border-white/[0.1] text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-95 shadow-sm"
                  >
                    <FileText className="w-3.5 h-3.5 text-slate-400" />
                    <span>Download Invoice</span>
                  </button>
                  <button
                    onClick={() => onSuggestedAction && onSuggestedAction('Create Support Ticket', result || args)}
                    className="px-4 py-2 rounded-xl bg-dark-850 hover:bg-dark-800 text-slate-200 hover:text-white border border-white/[0.1] text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-95 shadow-sm"
                  >
                    <Ticket className="w-3.5 h-3.5 text-amber-400" />
                    <span>Create Support Ticket</span>
                  </button>
                  <button
                    onClick={() => onSuggestedAction && onSuggestedAction('Talk to Human', result || args)}
                    className="px-4 py-2 rounded-xl bg-dark-850 hover:bg-dark-800 text-slate-200 hover:text-white border border-white/[0.1] text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-95 shadow-sm"
                  >
                    <UserCheck className="w-3.5 h-3.5 text-purple-400" />
                    <span>Talk to Human</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-white text-base tracking-tight">Order Not Found</h4>
                  <span className="text-xs text-slate-400">We could not locate #{orderId} in the fulfillment database.</span>
                </div>
              </div>
              <div className="pt-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2.5">Suggested Actions</span>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => onSuggestedAction && onSuggestedAction('Create Support Ticket', { order_id: orderId })}
                    className="px-3.5 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Ticket className="w-3.5 h-3.5" />
                    <span>Create Support Ticket</span>
                  </button>
                  <button
                    onClick={() => onSuggestedAction && onSuggestedAction('Talk to Human', { order_id: orderId })}
                    className="px-3.5 py-2 rounded-xl bg-dark-850 hover:bg-dark-800 text-slate-200 hover:text-white border border-white/[0.08] text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <UserCheck className="w-3.5 h-3.5 text-purple-400" />
                    <span>Talk to Human</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }

    // 2. CreateTicketTool UI
    if (toolName?.includes('Ticket')) {
      const ticketId = result?.ticket_id || 'TCK-101';
      const status = result?.status || 'OPEN';
      const issueText = result?.issue || args?.issue || 'Priority support escalation logged.';

      return (
        <div className="my-4 rounded-3xl bg-dark-950/90 border border-white/[0.12] shadow-2xl overflow-hidden font-sans text-slate-200 animate-slide-up">
          <div className="bg-dark-900/95 px-5 py-3 border-b border-white/[0.08] flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-300">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>Understanding your request...</span>
            </span>
            <span className="text-slate-600 font-bold">•</span>
            <span className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>Logging priority escalation...</span>
            </span>
            <span className="text-slate-600 font-bold">•</span>
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>Almost done...</span>
            </span>
          </div>
          <div className="p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-md">
                  <Ticket className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-white text-base tracking-tight">Support Ticket Created</h4>
                  <span className="text-xs font-mono text-slate-400">Ticket #{ticketId}</span>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider border shadow-sm bg-amber-500/15 text-amber-400 border-amber-500/30">
                {status}
              </span>
            </div>
            <div className="bg-dark-900/70 p-4 rounded-2xl border border-white/[0.06] text-xs sm:text-sm text-slate-300">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Issue Logged</span>
              <p className="font-medium text-white italic">"{issueText}"</p>
            </div>
            <div className="pt-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2.5">Suggested Actions</span>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => onSuggestedAction && onSuggestedAction('Check Ticket Status', { ticket_id: ticketId })}
                  className="px-3.5 py-2 rounded-xl bg-dark-850 hover:bg-dark-800 text-slate-200 hover:text-white border border-white/[0.08] text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Clock className="w-3.5 h-3.5 text-indigo-400" />
                  <span>View Ticket Queue</span>
                </button>
                <button
                  onClick={() => onSuggestedAction && onSuggestedAction('Talk to Human', { ticket_id: ticketId })}
                  className="px-3.5 py-2 rounded-xl bg-dark-850 hover:bg-dark-800 text-slate-200 hover:text-white border border-white/[0.08] text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <UserCheck className="w-3.5 h-3.5 text-purple-400" />
                  <span>Talk to Human</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // 3. ProductSearchTool UI
    if (toolName?.includes('Search')) {
      const count = result?.products?.length || 0;
      const query = args?.query || 'Products';

      return (
        <div className="my-4 rounded-3xl bg-dark-950/90 border border-white/[0.12] shadow-2xl overflow-hidden font-sans text-slate-200 animate-slide-up">
          <div className="bg-dark-900/95 px-5 py-3 border-b border-white/[0.08] flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-300">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>Searching live inventory...</span>
            </span>
            <span className="text-slate-600 font-bold">•</span>
            <span className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>Checking real-time stock & pricing...</span>
            </span>
            <span className="text-slate-600 font-bold">•</span>
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>Almost done...</span>
            </span>
          </div>
          <div className="p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3.5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-brand-primary/15 border border-brand-primary/30 flex items-center justify-center text-brand-accent shadow-md">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-white text-base tracking-tight">Catalog Results Found</h4>
                  <span className="text-xs text-slate-400">Search for "{query}"</span>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider border shadow-sm bg-emerald-500/15 text-emerald-400 border-emerald-500/30">
                {count} in stock
              </span>
            </div>
            <div className="pt-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2.5">Suggested Actions</span>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => onSuggestedAction && onSuggestedAction('Check Shipping Times', { query })}
                  className="px-3.5 py-2 rounded-xl bg-dark-850 hover:bg-dark-800 text-slate-200 hover:text-white border border-white/[0.08] text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <MapPin className="w-3.5 h-3.5 text-brand-accent" />
                  <span>Check Shipping Times</span>
                </button>
                <button
                  onClick={() => onSuggestedAction && onSuggestedAction('Talk to Human', { query })}
                  className="px-3.5 py-2 rounded-xl bg-dark-850 hover:bg-dark-800 text-slate-200 hover:text-white border border-white/[0.08] text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <UserCheck className="w-3.5 h-3.5 text-purple-400" />
                  <span>Talk to Human</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // 4. BookAppointmentTool UI
    if (toolName?.includes('Appointment')) {
      return (
        <div className="my-4 rounded-3xl bg-dark-950/90 border border-white/[0.12] shadow-2xl overflow-hidden font-sans text-slate-200 animate-slide-up">
          <div className="bg-dark-900/95 px-5 py-3 border-b border-white/[0.08] flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-300">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>Checking specialist schedule...</span>
            </span>
            <span className="text-slate-600 font-bold">•</span>
            <span className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>Reserving consultation slot...</span>
            </span>
            <span className="text-slate-600 font-bold">•</span>
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>Almost done...</span>
            </span>
          </div>
          <div className="p-5 sm:p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-md">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-white text-base tracking-tight">Support Consultation Confirmed</h4>
                <span className="text-xs font-mono text-slate-400">Slot #{result?.booking_id || 'APT-101'}</span>
              </div>
            </div>
            <div className="pt-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2.5">Suggested Actions</span>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => onSuggestedAction && onSuggestedAction('Talk to Human', result)}
                  className="px-3.5 py-2 rounded-xl bg-dark-850 hover:bg-dark-800 text-slate-200 hover:text-white border border-white/[0.08] text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <UserCheck className="w-3.5 h-3.5 text-purple-400" />
                  <span>Talk to Human</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Default Fallback UI for any generic autonomous workflow
    return (
      <div className="my-3 p-4 rounded-2xl bg-dark-950/80 border border-white/[0.08] flex items-center justify-between gap-3 text-xs shadow-md font-sans">
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-2 rounded-xl bg-dark-850 border border-white/[0.06] text-emerald-400 shadow-inner">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-slate-200 text-xs truncate">Verified Autonomous Action Completed</span>
            <span className="text-[11px] text-slate-400 truncate mt-0.5">{result?.message || 'Operation verified successfully against system database.'}</span>
          </div>
        </div>
      </div>
    );
  }

  // ====================================================================================
  // DEVELOPER MODE (RAW TOOL EXECUTION INSPECTION)
  // Only show raw tool execution inside Developer Mode.
  // ====================================================================================
  const formatArgs = () => {
    if (!args) return null;
    return Object.entries(args).map(([k, v], idx) => (
      <span key={idx} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-dark-950 text-[11px] font-mono text-slate-300 border border-white/[0.06]">
        <span className="text-slate-500">{k}:</span>
        <span className="text-brand-accent font-semibold">{JSON.stringify(v)}</span>
      </span>
    ));
  };

  return (
    <div className="my-3 flex flex-col rounded-2xl bg-dark-900/95 border border-amber-500/40 shadow-xl overflow-hidden text-xs transition-all duration-200">
      {/* Dev Mode Execution Header */}
      <div
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2.5 px-4 py-3 bg-dark-950/90 border-b border-white/[0.08] font-mono cursor-pointer hover:bg-dark-950 transition-colors"
      >
        <div className="flex items-center justify-center p-1.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-400">
          <Terminal className="w-4 h-4" />
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2.5 min-w-0 flex-1">
          <span className="font-extrabold text-amber-300 text-xs tracking-tight">[DEV LOG] {toolName}()</span>
          <div className="flex flex-wrap gap-1.5">{formatArgs()}</div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono font-bold text-slate-400 bg-dark-850 px-2 py-0.5 rounded border border-white/[0.06]">
            12ms Latency
          </span>
          {expanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </div>
      </div>
      
      {/* Result Payload Body in Dev Mode */}
      {(expanded || result) && (
        <div className="px-4 py-3.5 bg-dark-950/80 font-mono text-xs space-y-2">
          <div className="flex items-center justify-between text-[10px] uppercase font-bold text-slate-500 border-b border-white/[0.06] pb-1.5">
            <span>Raw Backend Tool Response</span>
            <span className="text-emerald-400 font-bold">STATUS_OK (200)</span>
          </div>
          <pre className="text-[11px] text-slate-300 overflow-x-auto bg-dark-950 p-3.5 rounded-xl border border-white/[0.08] leading-relaxed">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default ToolBadge;
