import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import ToolBadge from './ToolBadge';
import { Layers, User, Copy, Check, RotateCcw, CheckCircle2, Sparkles, ShieldCheck, ThumbsUp, ThumbsDown } from 'lucide-react';

const CodeBlock = ({ inline, className, children, ...props }) => {
  const [copied, setCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || '');
  const codeString = String(children).replace(/\n$/, '');

  const handleCopy = () => {
    navigator.clipboard.writeText(codeString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (inline) {
    return (
      <code className="bg-dark-950 text-brand-accent px-2 py-0.5 rounded-md font-mono text-xs border border-white/[0.08] font-semibold" {...props}>
        {children}
      </code>
    );
  }

  return (
    <div className="my-3.5 rounded-2xl overflow-hidden border border-white/[0.1] bg-dark-950 shadow-2xl">
      <div className="flex items-center justify-between px-4 py-2.5 bg-dark-900/95 border-b border-white/[0.08] text-[11px] font-mono text-slate-400">
        <span className="font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-brand-accent animate-pulse"></span>
          <span>{match ? match[1] : 'code'}</span>
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-dark-850 hover:bg-dark-800 text-slate-300 hover:text-white transition-all cursor-pointer border border-white/[0.06] font-sans text-xs font-semibold"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-bold">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-400" />
              <span>Copy code</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-xs font-mono text-slate-200 leading-relaxed bg-dark-950/90">
        <code className={className} {...props}>
          {children}
        </code>
      </pre>
    </div>
  );
};

const MessageBubble = ({ role, content, timestamp, toolsUsed = [], devMode = false, onRegenerate, onSuggestedAction }) => {
  const isUser = role === 'user';
  const [copiedMsg, setCopiedMsg] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleCopyMsg = () => {
    navigator.clipboard.writeText(content);
    setCopiedMsg(true);
    setTimeout(() => setCopiedMsg(false), 2000);
  };

  const formattedTime = timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className={`flex items-start gap-4 my-6 group animate-slide-up ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* Avatar Icon */}
      <div
        className={`w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xl transition-transform group-hover:scale-105 relative ${
          isUser
            ? 'bg-dark-800 text-slate-200 border border-white/[0.12]'
            : 'bg-gradient-to-tr from-brand-primary via-indigo-600 to-brand-accent text-white shadow-brand-primary/25 p-[1px]'
        }`}
      >
        <div className={`w-full h-full rounded-[15px] flex items-center justify-center ${isUser ? '' : 'bg-dark-950'}`}>
          {isUser ? (
            <User className="w-4 h-4 text-slate-200" />
          ) : (
            <>
              <Layers className="w-4 h-4 text-brand-accent" />
              <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-dark-950 flex items-center justify-center" title="Online & Verified">
                <span className="w-1 h-1 rounded-full bg-dark-950"></span>
              </span>
            </>
          )}
        </div>
      </div>

      {/* Message & Header Column */}
      <div className={`flex flex-col max-w-[90%] sm:max-w-[84%] min-w-[280px] ${isUser ? 'items-end' : 'items-start'}`}>
        {/* Timestamp & Identity Header */}
        <div className={`flex items-center gap-2 mb-1.5 text-[11px] font-medium text-slate-400 px-1 ${isUser ? 'flex-row-reverse' : ''}`}>
          <span className="font-extrabold text-slate-300">
            {isUser ? 'You' : 'HelpFlow AI • Tier-1 Support'}
          </span>
          <span>•</span>
          <span className="font-mono text-slate-500">{formattedTime}</span>
          {isUser ? (
            <span className="flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-mono text-[9px] border border-emerald-500/20 font-bold">
              <CheckCircle2 className="w-2.5 h-2.5" />
              <span>Delivered</span>
            </span>
          ) : (
            <span className="hidden sm:inline-flex items-center gap-1 text-brand-accent bg-brand-primary/15 px-2 py-0.5 rounded-full font-mono text-[9px] border border-brand-primary/30 font-bold">
              <ShieldCheck className="w-2.5 h-2.5" />
              <span>Verified Response</span>
            </span>
          )}
        </div>

        {/* Message Content Box */}
        <div
          className={`px-5 sm:px-6 py-4 transition-all relative w-fit max-w-full ${
            isUser ? 'glass-bubble-user' : 'glass-bubble-ai'
          }`}
        >
          {/* Render Tool Badges if any were called during this turn */}
          {!isUser && toolsUsed && toolsUsed.length > 0 && (
            <div className="mb-4 flex flex-col gap-1.5 border-b border-white/[0.08] pb-4">
              {devMode && (
                <div className="flex items-center justify-between pb-1 animate-fade-in">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-amber-400">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Developer Mode: Tool Chain Execution Logs</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 bg-dark-950 px-2 py-0.5 rounded border border-white/[0.08]">
                    {toolsUsed.length} {toolsUsed.length === 1 ? 'call' : 'calls'}
                  </span>
                </div>
              )}
              {toolsUsed.map((tool, idx) => (
                <ToolBadge
                  key={idx}
                  toolName={tool.tool_name}
                  arguments={tool.arguments}
                  result={tool.result}
                  devMode={devMode}
                  onSuggestedAction={onSuggestedAction}
                />
              ))}
            </div>
          )}

          {/* Render Markdown Text */}
          <div className={`prose prose-sm max-w-none font-sans leading-relaxed ${isUser ? 'prose-invert text-white' : 'prose-invert text-slate-200'}`}>
            <ReactMarkdown
              components={{
                h1: ({ node, ...props }) => <h1 className="text-base sm:text-lg font-black mb-3 mt-1 tracking-tight text-white" {...props} />,
                h2: ({ node, ...props }) => <h2 className="text-sm sm:text-base font-extrabold mb-2.5 mt-3 tracking-tight text-white" {...props} />,
                h3: ({ node, ...props }) => <h3 className="text-xs sm:text-sm font-bold mb-2 mt-2.5 text-indigo-300" {...props} />,
                p: ({ node, ...props }) => <p className="mb-3 leading-relaxed last:mb-0 text-xs sm:text-sm font-normal" {...props} />,
                ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-3 space-y-1.5 text-xs sm:text-sm" {...props} />,
                ol: ({ node, ...props }) => <ol className="list-decimal pl-5 mb-3 space-y-1.5 text-xs sm:text-sm" {...props} />,
                li: ({ node, ...props }) => <li className="text-xs sm:text-sm leading-relaxed" {...props} />,
                code: CodeBlock,
                blockquote: ({ node, ...props }) => (
                  <blockquote className="border-l-2 border-brand-primary pl-4 my-3.5 italic text-slate-300 text-xs sm:text-sm bg-dark-950/60 py-3 rounded-r-xl" {...props} />
                ),
                table: ({ node, ...props }) => (
                  <div className="my-3 overflow-x-auto rounded-xl border border-white/[0.08]">
                    <table className="w-full text-left text-xs border-collapse" {...props} />
                  </div>
                ),
                th: ({ node, ...props }) => <th className="bg-dark-900 px-3 py-2 border-b border-white/[0.08] font-bold text-slate-200" {...props} />,
                td: ({ node, ...props }) => <td className="px-3 py-2 border-b border-white/[0.04] text-slate-300" {...props} />
              }}
            >
              {content}
            </ReactMarkdown>
          </div>

          {/* Hover Actions Bar */}
          <div className={`flex items-center justify-between gap-3 pt-3 mt-3 border-t border-white/[0.06] opacity-70 group-hover:opacity-100 transition-opacity ${isUser ? 'text-white/85' : 'text-slate-400'}`}>
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleCopyMsg}
                className="flex items-center gap-1.5 text-[11px] font-semibold hover:text-white transition-colors cursor-pointer py-1 px-2.5 rounded-lg hover:bg-dark-950/50 border border-transparent hover:border-white/[0.06]"
                title="Copy message to clipboard"
              >
                {copiedMsg ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-bold">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>

              {!isUser && onRegenerate && (
                <button
                  onClick={() => onRegenerate(content)}
                  className="flex items-center gap-1.5 text-[11px] font-semibold hover:text-white transition-colors cursor-pointer py-1 px-2.5 rounded-lg hover:bg-dark-950/50 border border-transparent hover:border-white/[0.06]"
                  title="Regenerate response"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-brand-accent" />
                  <span>Regenerate</span>
                </button>
              )}
            </div>

            {!isUser && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setFeedback(feedback === 'up' ? null : 'up')}
                  className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                    feedback === 'up'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'hover:bg-dark-950/50 hover:text-white'
                  }`}
                  title="Helpful response"
                >
                  <ThumbsUp className="w-3 h-3" />
                </button>
                <button
                  onClick={() => setFeedback(feedback === 'down' ? null : 'down')}
                  className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                    feedback === 'down'
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      : 'hover:bg-dark-950/50 hover:text-white'
                  }`}
                  title="Unhelpful response"
                >
                  <ThumbsDown className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
