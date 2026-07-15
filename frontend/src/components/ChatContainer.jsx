import React, { useState, useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Send, RefreshCw, Sparkles, Package, Ticket, FileText, HelpCircle } from 'lucide-react';

const starterPrompts = [
  {
    icon: <Package className="w-4 h-4 text-emerald-400" />,
    label: "Check Order Status",
    prompt: "Where is my order #ORD1005? What is the expected delivery date?"
  },
  {
    icon: <Ticket className="w-4 h-4 text-amber-400" />,
    label: "Open Support Ticket",
    prompt: "My headphones arrived with a damaged box. Please create a priority support ticket."
  },
  {
    icon: <FileText className="w-4 h-4 text-sky-400" />,
    label: "Refund Policy (RAG)",
    prompt: "What is your 30-day refund policy and restocking fee for opened items?"
  },
  {
    icon: <HelpCircle className="w-4 h-4 text-purple-400" />,
    label: "Product Catalog",
    prompt: "Can you search your product catalog for laptops and show pricing?"
  }
];

const ChatContainer = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    fetchHistory();
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const fetchHistory = async () => {
    if (!user) return;
    try {
      const res = await api.get('/api/chat/history');
      const loaded = [];
      res.data.forEach((turn) => {
        loaded.push({ role: 'user', content: turn.message });
        let toolsUsed = [];
        try {
          toolsUsed = JSON.parse(turn.tools_called || '[]');
        } catch (e) {}
        loaded.push({ role: 'assistant', content: turn.response, toolsUsed });
      });
      if (loaded.length === 0) {
        setMessages([
          {
            role: 'assistant',
            content: `Hello **${user.name}**! Welcome to **AgentAssist AI**. I can check live order statuses (` +
              '`#ORD1005`' +
              `), create support tickets, search products, or answer policy FAQs using our RAG pipeline. How can I help you today?`
          }
        ]);
      } else {
        setMessages(loaded);
      }
    } catch (e) {
      console.error('Failed to load chat history:', e);
    }
  };

  const handleSend = async (textToSend) => {
    const text = textToSend || input;
    if (!text.trim() || loading) return;

    setError(null);
    const newMsg = { role: 'user', content: text };
    setMessages((prev) => [...prev, newMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const response = await api.post('/api/chat', {
        message: text,
        user_id: user?.id
      });
      const aiReply = {
        role: 'assistant',
        content: response.data.response,
        toolsUsed: response.data.tools_used || []
      };
      setMessages((prev) => [...prev, aiReply]);
    } catch (err) {
      setError('Failed to connect to AgentAssist AI. Please verify the backend server is running.');
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: '⚠️ **Connection Error**: Unable to reach our Agentic reasoning engine. Please try again or contact live support.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    if (window.confirm('Are you sure you want to clear current chat display?')) {
      setMessages([
        {
          role: 'assistant',
          content: `Chat session reset. How else may I assist you today, **${user?.name}**?`
        }
      ]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-5.5rem)] flex flex-col pt-4 pb-6 px-4">
      {/* Header Bar */}
      <div className="glass-card px-5 py-3 rounded-2xl mb-4 flex items-center justify-between border-dark-700/80">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
          <span className="font-semibold text-sm text-white">Agentic Support Workspace</span>
          <span className="text-xs text-slate-400 font-mono pl-2 border-l border-dark-700">
            Gemini ReAct + FAISS RAG
          </span>
        </div>
        <button
          onClick={clearChat}
          title="Reset View"
          className="p-2 rounded-xl bg-dark-800 text-slate-400 hover:text-white border border-dark-700/60 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Viewport */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-1 my-1">
        {messages.map((msg, index) => (
          <MessageBubble
            key={index}
            role={msg.role}
            content={msg.content}
            toolsUsed={msg.toolsUsed}
          />
        ))}
        {loading && <TypingIndicator />}
        {error && (
          <div className="p-3 my-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center justify-between">
            <span>{error}</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Starter Quick Prompts (only show if <= 1 turn) */}
      {messages.length <= 2 && !loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 my-3 animate-fade-in">
          {starterPrompts.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(item.prompt)}
              className="glass-panel p-3 rounded-xl flex items-center gap-3 text-left hover:border-brand-primary/50 hover:bg-dark-800/80 transition-all duration-150 group"
            >
              <div className="p-2 rounded-lg bg-dark-900 border border-dark-700 group-hover:scale-105 transition-transform">
                {item.icon}
              </div>
              <div>
                <span className="text-xs font-semibold text-white block">{item.label}</span>
                <span className="text-[11px] text-slate-400 line-clamp-1">{item.prompt}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="mt-3 relative flex items-center"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about orders (#ORD1005), report issues, or check policies..."
          disabled={loading}
          className="w-full bg-dark-800/90 text-white placeholder-slate-500 text-sm pl-4 pr-28 py-3.5 rounded-2xl border border-dark-700/80 focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all shadow-lg"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="absolute right-2.5 btn-primary py-2 px-4 rounded-xl text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>Send</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};

export default ChatContainer;
