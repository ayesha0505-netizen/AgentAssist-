import React from 'react';
import { Wrench, CheckCircle2, Search, Ticket, PackageCheck, Calendar } from 'lucide-react';

const ToolBadge = ({ toolName, arguments: args, result }) => {
  const getIcon = () => {
    if (toolName.includes('Order')) return <PackageCheck className="w-3.5 h-3.5 text-emerald-400" />;
    if (toolName.includes('Ticket')) return <Ticket className="w-3.5 h-3.5 text-amber-400" />;
    if (toolName.includes('Search')) return <Search className="w-3.5 h-3.5 text-sky-400" />;
    if (toolName.includes('Appointment')) return <Calendar className="w-3.5 h-3.5 text-purple-400" />;
    return <Wrench className="w-3.5 h-3.5 text-brand-accent" />;
  };

  const formatArgs = () => {
    if (!args) return '';
    return Object.entries(args)
      .map(([k, v]) => `${k}="${v}"`)
      .join(', ');
  };

  return (
    <div className="my-2.5 inline-flex flex-col gap-1.5 p-3 rounded-xl bg-dark-900/90 border border-dark-700/80 shadow-md max-w-full overflow-hidden text-xs">
      <div className="flex items-center gap-2 font-mono">
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-dark-800 text-slate-200 border border-dark-700 font-semibold">
          {getIcon()}
          <span>{toolName}</span>
        </div>
        <span className="text-slate-400 truncate font-medium">({formatArgs()})</span>
        <div className="ml-auto flex items-center gap-1 text-emerald-400 font-semibold text-[11px] px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
          <CheckCircle2 className="w-3 h-3" />
          <span>Executed</span>
        </div>
      </div>
      
      {result && (
        <div className="pl-6 text-slate-300 font-sans text-xs border-l-2 border-brand-primary/40 py-0.5">
          {result.message ? (
            <span className="italic text-slate-300">{result.message}</span>
          ) : result.status ? (
            <span>Status returned: <strong className="text-white font-mono">{result.status}</strong></span>
          ) : result.products ? (
            <span>Found {result.products.length} matching catalog items.</span>
          ) : (
            <span className="font-mono text-slate-400">{JSON.stringify(result)}</span>
          )}
        </div>
      )}
    </div>
  );
};

export default ToolBadge;
