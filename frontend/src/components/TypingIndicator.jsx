import React from 'react';
import { Bot, Sparkles } from 'lucide-react';

const TypingIndicator = () => {
  return (
    <div className="flex items-start gap-3.5 my-3 animate-fade-in">
      <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-primary to-brand-secondary flex items-center justify-center text-white shadow-md shadow-brand-primary/20 flex-shrink-0 mt-0.5">
        <Bot className="w-4 h-4 animate-pulse" />
      </div>
      <div className="glass-card px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-brand-accent animate-bounce [animation-delay:-0.3s]"></span>
          <span className="w-2 h-2 rounded-full bg-brand-primary animate-bounce [animation-delay:-0.15s]"></span>
          <span className="w-2 h-2 rounded-full bg-brand-secondary animate-bounce"></span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium pl-2 border-l border-dark-700/80">
          <Sparkles className="w-3.5 h-3.5 text-brand-accent animate-spin [animation-duration:3s]" />
          <span>Agentic reasoning in progress... (ReAct Loop + RAG)</span>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
