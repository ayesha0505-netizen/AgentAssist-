import React, { useState, useEffect } from 'react';
import { Layers, Activity, Sparkles, PackageCheck, Search, ShieldCheck } from 'lucide-react';

const friendlySteps = [
  { text: 'Checking your order...', icon: <PackageCheck className="w-3.5 h-3.5 text-emerald-400 animate-pulse" /> },
  { text: 'Retrieving shipment information...', icon: <Search className="w-3.5 h-3.5 text-brand-accent animate-pulse" /> },
  { text: 'Synthesizing knowledge base documentation...', icon: <ShieldCheck className="w-3.5 h-3.5 text-indigo-400 animate-pulse" /> },
  { text: 'Preparing response...', icon: <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-spin" /> }
];

const TypingIndicator = ({ devMode = false }) => {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % friendlySteps.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const currentStep = friendlySteps[stepIndex];

  return (
    <div className="flex items-start gap-3.5 my-5 animate-fade-in">
      {/* Beautiful AI Avatar */}
      <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-brand-primary via-indigo-600 to-brand-accent p-[1px] flex items-center justify-center text-white shadow-lg shadow-brand-primary/25 flex-shrink-0 mt-0.5">
        <div className="w-full h-full bg-dark-950 rounded-[15px] flex items-center justify-center relative">
          <Layers className="w-4 h-4 text-brand-accent animate-pulse" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-dark-950"></span>
        </div>
      </div>

      {/* Typing Bubble */}
      <div className="glass-card px-5 py-4 rounded-3xl rounded-tl-sm flex items-center gap-4 border-white/[0.08] shadow-2xl">
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span className="w-2 h-2 rounded-full bg-brand-accent animate-bounce [animation-delay:-0.3s]"></span>
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:-0.15s]"></span>
          <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce"></span>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-300 font-medium pl-3.5 border-l border-white/[0.08] min-w-0">
          {devMode ? (
            <div className="flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-amber-400 animate-pulse flex-shrink-0" />
              <span className="font-mono text-amber-300 truncate">
                [DEV LOG] Dispatching ReAct tool chain & querying FAISS inner-product vector store...
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {currentStep.icon}
              <span className="truncate text-slate-200 font-semibold">{currentStep.text}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
