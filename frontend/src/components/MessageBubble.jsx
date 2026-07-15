import React from 'react';
import ReactMarkdown from 'react-markdown';
import ToolBadge from './ToolBadge';
import { Bot, User } from 'lucide-react';

const MessageBubble = ({ role, content, toolsUsed = [] }) => {
  const isUser = role === 'user';

  return (
    <div className={`flex items-start gap-3.5 my-4 animate-slide-up ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* Avatar icon */}
      <div
        className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 shadow-md ${
          isUser
            ? 'bg-dark-700 text-slate-200 border border-dark-600'
            : 'bg-gradient-to-tr from-brand-primary to-brand-secondary text-white shadow-brand-primary/20'
        }`}
      >
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>

      {/* Message content box */}
      <div
        className={`max-w-[82%] px-5 py-3.5 rounded-2xl ${
          isUser
            ? 'bg-brand-primary text-white rounded-tr-sm shadow-lg shadow-brand-primary/15'
            : 'glass-card text-slate-200 rounded-tl-sm border-dark-700/80 shadow-lg'
        }`}
      >
        {/* Render tool badges if any were called during this turn */}
        {!isUser && toolsUsed && toolsUsed.length > 0 && (
          <div className="mb-3 flex flex-col gap-1 border-b border-dark-700/60 pb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Agent Actions Executed:
            </span>
            {toolsUsed.map((tool, idx) => (
              <ToolBadge
                key={idx}
                toolName={tool.tool_name}
                arguments={tool.arguments}
                result={tool.result}
              />
            ))}
          </div>
        )}

        {/* Render Markdown text */}
        <div className={`prose prose-sm max-w-none ${isUser ? 'prose-invert text-white' : 'prose-invert text-slate-200'}`}>
          <ReactMarkdown
            components={{
              h1: ({ node, ...props }) => <h1 className="text-base font-bold mb-2 mt-1" {...props} />,
              h2: ({ node, ...props }) => <h2 className="text-sm font-bold mb-1.5 mt-2" {...props} />,
              h3: ({ node, ...props }) => <h3 className="text-xs font-semibold mb-1 mt-1.5 text-brand-accent" {...props} />,
              p: ({ node, ...props }) => <p className="mb-2 leading-relaxed last:mb-0" {...props} />,
              ul: ({ node, ...props }) => <ul className="list-disc pl-4 mb-2 space-y-1" {...props} />,
              ol: ({ node, ...props }) => <ol className="list-decimal pl-4 mb-2 space-y-1" {...props} />,
              li: ({ node, ...props }) => <li className="text-xs sm:text-sm" {...props} />,
              code: ({ node, inline, ...props }) =>
                inline ? (
                  <code className="bg-dark-900/80 text-brand-accent px-1.5 py-0.5 rounded font-mono text-xs border border-dark-700/60" {...props} />
                ) : (
                  <pre className="bg-dark-900 p-3 rounded-xl overflow-x-auto text-xs my-2 border border-dark-700/80 font-mono">
                    <code {...props} />
                  </pre>
                ),
              blockquote: ({ node, ...props }) => (
                <blockquote className="border-l-2 border-brand-primary pl-3 my-2 italic text-slate-400 text-xs bg-dark-900/40 py-1.5 rounded-r" {...props} />
              )
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
