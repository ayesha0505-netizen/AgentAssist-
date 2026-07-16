import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import ChatSidebar from './ChatSidebar';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Send, RefreshCw, Sparkles, Package, Ticket, FileText, HelpCircle, Layers, Paperclip, PanelLeft, User as UserIcon, Terminal, ArrowDown, CornerDownLeft, ShieldCheck, CheckCircle2, Zap } from 'lucide-react';

const starterPrompts = [
  {
    icon: <Package className="w-4 h-4 text-emerald-400" />,
    category: "Order Tracking",
    label: "Check Order #ORD1005 Status",
    prompt: "Can you give me a live status update on order #ORD1005? What is the expected delivery date?"
  },
  {
    icon: <Ticket className="w-4 h-4 text-amber-400" />,
    category: "Support Escalation",
    label: "Log Priority Shipping Ticket",
    prompt: "My headphones arrived with a damaged box. Please create a priority support ticket right now."
  },
  {
    icon: <FileText className="w-4 h-4 text-brand-accent" />,
    category: "Policy & FAQ",
    label: "30-Day Refund Policy & Fees",
    prompt: "What is your 30-day refund policy and what are the restocking fees for opened electronics?"
  },
  {
    icon: <HelpCircle className="w-4 h-4 text-purple-400" />,
    category: "Product Catalog",
    label: "Search Laptops & Stock",
    prompt: "Can you search your live product catalog for laptops and show real-time pricing and stock count?"
  }
];

const ChatContainer = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  // Workspace View State
  const [devMode, setDevMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  const [searchQuery, setSearchQuery] = useState('');
  const [attachedFile, setAttachedFile] = useState(null);
  const [isScrolledUp, setIsScrolledUp] = useState(false);

  // Conversations State
  const [activeConversationId, setActiveConversationId] = useState('sess-active');
  const [conversations, setConversations] = useState([
    {
      id: 'sess-active',
      title: 'Order & Shipping Tracking',
      snippet: 'Where is my order #ORD1005? And if delayed...',
      timestamp: 'Just now',
      tag: 'Order #ORD1005'
    },
    {
      id: 'sess-policy',
      title: 'Refund Policy & Fees Inquiry',
      snippet: 'What is your 30-day return policy for laptops?',
      timestamp: 'Yesterday',
      tag: 'Policy FAQ'
    },
    {
      id: 'sess-ticket',
      title: 'Priority Escalation Ticket',
      snippet: 'Logged ticket #TCK-101 for shipment delay.',
      timestamp: '2 days ago',
      tag: 'Priority Ticket'
    }
  ]);

  const messagesEndRef = useRef(null);
  const viewportRef = useRef(null);

  const scrollToBottom = (smooth = true) => {
    messagesEndRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
    setIsScrolledUp(false);
  };

  useEffect(() => {
    fetchHistory();
  }, [user, activeConversationId]);

  useEffect(() => {
    if (!isScrolledUp) {
      scrollToBottom();
    }
  }, [messages, loading]);

  useEffect(() => {
    if (location.state?.initialPrompt && !loading && messages.length > 0) {
      handleSend(location.state.initialPrompt);
      // Clear state so it doesn't fire again on reload
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, loading, messages.length]);

  const handleScroll = () => {
    if (!viewportRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = viewportRef.current;
    const distanceToBottom = scrollHeight - scrollTop - clientHeight;
    setIsScrolledUp(distanceToBottom > 160);
  };

  const fetchHistory = async () => {
    if (!user) return;
    setLoading(true);
    try {
      if (activeConversationId === 'sess-active') {
        const res = await api.get('/api/chat/history');
        const loaded = [];
        res.data.forEach((turn) => {
          loaded.push({ role: 'user', content: turn.message, timestamp: 'Session Turn' });
          let toolsUsed = [];
          try {
            toolsUsed = JSON.parse(turn.tools_called || '[]');
          } catch (e) {}
          loaded.push({ role: 'assistant', content: turn.response, toolsUsed, timestamp: 'Verified' });
        });
        if (loaded.length === 0) {
          setMessages([]);
        } else {
          setMessages(loaded);
        }
      } else if (activeConversationId === 'sess-policy') {
        setMessages([
          {
            role: 'user',
            content: 'What is your 30-day return policy and what are the restocking fees for opened electronics?',
            timestamp: 'Yesterday at 3:15 PM'
          },
          {
            role: 'assistant',
            content: `According to our **Company Refund Policy (` + '`refund_policy.md`' + `)**:\n\n1. **30-Day Window**: You may return any unopened item within 30 days of delivery for a full refund.\n2. **Restocking Fee**: For opened electronics (laptops, headphones), a **15% restocking fee** applies unless the item is verified as defective upon arrival.\n\nWould you like me to generate a pre-paid return shipping label for any of your active orders right now?`,
            toolsUsed: [{ tool_name: 'PolicyKnowledgeSearch', arguments: { query: 'refund policy restocking fees' }, result: { retrieved: 'refund_policy.md' } }],
            timestamp: 'Yesterday at 3:15 PM'
          }
        ]);
      } else if (activeConversationId === 'sess-ticket') {
        setMessages([
          {
            role: 'user',
            content: 'Please check my previous support tickets.',
            timestamp: '2 days ago'
          },
          {
            role: 'assistant',
            content: `I retrieved your active priority escalation records:\n\n- **Ticket ID**: \`#TCK-101\`\n- **Status**: **OPEN**\n- **Priority**: **High**\n- **Summary**: Inquiry regarding billing breakdown for Order ORD1005.\n\nOur senior support management team is currently reviewing this request. I can attach additional context notes right now if you have updates!`,
            toolsUsed: [{ tool_name: 'GetCustomerTickets', arguments: { user_id: user?.id || '1' }, result: { total: 1 } }],
            timestamp: '2 days ago'
          }
        ]);
      }
    } catch (e) {
      console.error('Failed to load chat history:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (textToSend) => {
    const text = textToSend !== undefined && typeof textToSend === 'string' ? textToSend : input;
    if (!text.trim() && !attachedFile) return;
    if (loading) return;

    setError(null);
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    let displayContent = text;
    if (attachedFile) {
      displayContent = `[📎 Attached file: **${attachedFile.name}** - ${(attachedFile.size / 1024).toFixed(1)} KB]\n\n${text || 'Please inspect the attached screenshot/document.'}`;
    }

    const newMsg = { role: 'user', content: displayContent, timestamp: timeNow };
    setMessages((prev) => [...prev, newMsg]);
    if (textToSend === undefined || typeof textToSend !== 'string' || textToSend === input) {
      setInput('');
    }
    setAttachedFile(null);
    setLoading(true);
    scrollToBottom();

    try {
      const response = await api.post('/api/chat', {
        message: displayContent,
        user_id: user?.id
      });
      const aiReply = {
        role: 'assistant',
        content: response.data.response,
        toolsUsed: response.data.tools_used || [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, aiReply]);
      
      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeConversationId
            ? { ...c, snippet: displayContent.substring(0, 48) + '...', timestamp: 'Just now' }
            : c
        )
      );
    } catch (err) {
      setError('Unable to reach the AI customer support cluster right now. Please verify your connection or try resending.');
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: '⚠️ **Connection Notice**: Unable to reach our AI support server right now. Please verify your connection or try resending.',
          timestamp: timeNow
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = (lastContent) => {
    if (loading) return;
    const userTurns = messages.filter((m) => m.role === 'user');
    if (userTurns.length > 0) {
      const lastUserText = userTurns[userTurns.length - 1].content;
      handleSend(lastUserText);
    }
  };

  const handleNewConversation = () => {
    const newId = `sess-${Date.now()}`;
    const newChat = {
      id: newId,
      title: `Support Inquiry #${conversations.length + 1}`,
      snippet: 'New support inquiry initiated...',
      timestamp: 'Just now',
      tag: 'New Inquiry'
    };
    setConversations([newChat, ...conversations]);
    setActiveConversationId(newId);
    setMessages([]);
  };

  const handleDeleteConversation = (idToDelete) => {
    const nextList = conversations.filter((c) => c.id !== idToDelete);
    setConversations(nextList);
    if (activeConversationId === idToDelete && nextList.length > 0) {
      setActiveConversationId(nextList[0].id);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setAttachedFile(e.target.files[0]);
    }
  };

  const clearChat = () => {
    if (window.confirm('Are you sure you want to clear current conversation history?')) {
      setMessages([]);
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex overflow-hidden bg-dark-900 relative">
      {/* Left Sidebar: Conversations & Search */}
      <ChatSidebar
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={setActiveConversationId}
        onNewConversation={handleNewConversation}
        onDeleteConversation={handleDeleteConversation}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Chat Workspace Viewport */}
      <div className="flex-1 flex flex-col min-w-0 relative h-full">
        {/* Navbar Injected Chat Controls */}
        {createPortal(
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            title="Toggle Conversations Sidebar"
            className="p-2.5 rounded-xl bg-dark-850 hover:bg-dark-800 text-slate-300 hover:text-white border border-white/[0.08] transition-all cursor-pointer"
          >
            <PanelLeft className="w-4 h-4" />
          </button>,
          document.getElementById('navbar-chat-left') || document.body
        )}

        {createPortal(
          <>
            <button
              onClick={() => setDevMode(!devMode)}
              title={devMode ? "Switch to Standard Customer View" : "Switch to System Diagnostics & Tool Inspection Mode"}
              className={`px-3 sm:px-3.5 py-1.5 rounded-xl border flex items-center gap-2 text-xs font-bold transition-all cursor-pointer shrink-0 ${
                devMode
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/45 shadow-lg shadow-amber-500/15 animate-pulse'
                  : 'bg-dark-850 text-slate-300 border-white/[0.08] hover:text-white hover:border-white/20'
              }`}
            >
              <Terminal className={`w-3.5 h-3.5 shrink-0 ${devMode ? 'text-amber-400' : 'text-slate-400'}`} />
              <span className="hidden sm:inline font-mono whitespace-nowrap">{devMode ? 'Developer Mode: ON' : 'Developer Mode: OFF'}</span>
            </button>

            <button
              onClick={clearChat}
              title="Reset Active Workspace Session"
              className="p-2 sm:p-2.5 rounded-xl bg-dark-850 text-slate-400 hover:text-white hover:bg-dark-800 border border-white/[0.08] transition-all cursor-pointer shrink-0"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </>,
          document.getElementById('navbar-chat-right') || document.body
        )}

        {/* Scrollable Messages Container */}
        <div
          ref={viewportRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 space-y-2 scroll-smooth"
        >
          <div className="max-w-4xl mx-auto w-full">
            {messages.map((msg, index) => (
              <MessageBubble
                key={index}
                role={msg.role}
                content={msg.content}
                timestamp={msg.timestamp}
                toolsUsed={msg.toolsUsed}
                devMode={devMode}
                onRegenerate={handleRegenerate}
              />
            ))}
            {loading && <TypingIndicator devMode={devMode} />}
            {error && (
              <div className="p-4 my-4 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs flex items-center justify-between font-bold animate-fade-in shadow-xl">
                <span>{error}</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Floating Scroll to Bottom Arrow */}
        {isScrolledUp && (
          <button
            onClick={() => scrollToBottom(true)}
            className="absolute bottom-32 right-8 sm:right-12 p-3.5 rounded-full bg-gradient-to-r from-brand-primary to-indigo-600 text-white shadow-2xl hover:scale-110 active:scale-95 transition-all cursor-pointer z-20 animate-bounce flex items-center justify-center border border-white/25"
            title="Scroll to latest messages"
          >
            <ArrowDown className="w-4 h-4" />
          </button>
        )}

        {/* Floating Input & Suggested Actions Section */}
        <div className="px-4 sm:px-8 pb-6 pt-3 bg-gradient-to-t from-dark-900 via-dark-900/95 to-transparent relative z-20">
          <div className="max-w-4xl mx-auto w-full space-y-3.5">
            {/* Suggested Starter Workflows when chat is minimal */}
            {messages.length <= 2 && !loading && (
              <div className="animate-fade-in">
                <div className="flex items-center justify-between text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-2.5 px-1">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-brand-accent" />
                    <span>Suggested One-Click Workflows</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">Instant Verified Action</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {starterPrompts.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(item.prompt)}
                      className="glass-panel p-3.5 rounded-2xl flex items-center gap-3.5 text-left hover:border-brand-primary/60 hover:bg-dark-800/90 transition-all duration-200 group active:scale-[0.99] cursor-pointer shadow-md"
                    >
                      <div className="p-2.5 rounded-xl bg-dark-950/90 border border-white/[0.08] group-hover:scale-110 group-hover:border-brand-primary/50 transition-all flex-shrink-0 shadow-inner">
                        {item.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-bold text-white block truncate group-hover:text-brand-accent transition-colors">{item.label}</span>
                        <span className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{item.category}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Attached File Pill Preview if attached */}
            {attachedFile && (
              <div className="flex items-center justify-between p-3 px-4 rounded-2xl bg-dark-850/95 border border-brand-primary/50 text-xs text-slate-200 animate-fade-in shadow-xl">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-brand-primary/20 text-brand-accent">
                    <Paperclip className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-white block truncate max-w-sm">{attachedFile.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">Ready for AI document inspection ({Math.max(1, Math.round(attachedFile.size / 1024))} KB)</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setAttachedFile(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-dark-950 transition-all font-bold text-sm cursor-pointer"
                  title="Remove attachment"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Floating Chat Input Box */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="relative flex items-center rounded-3xl bg-dark-950/90 backdrop-blur-2xl border border-white/[0.14] focus-within:border-brand-primary focus-within:ring-4 focus-within:ring-brand-primary/20 shadow-2xl transition-all p-1.5"
            >
              {/* File Attachment Button */}
              <label
                title="Attach file, receipt, or screenshot"
                className="p-3.5 rounded-2xl text-slate-400 hover:text-white hover:bg-dark-850 transition-all cursor-pointer flex-shrink-0 flex items-center justify-center"
              >
                <input
                  type="file"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Paperclip className="w-4 h-4" />
              </label>

              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask HelpFlow Assistant anything... (e.g. check order #ORD1005, refund fees, priority ticket)"
                disabled={loading}
                className="w-full bg-transparent text-white placeholder-slate-500 text-xs sm:text-sm px-3 py-3.5 focus:outline-none font-medium"
              />

              <div className="flex items-center gap-2 pr-1.5 flex-shrink-0">
                <span className="hidden md:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-dark-850 border border-white/[0.08] text-[10px] text-slate-400 font-mono">
                  <span>Enter</span>
                  <CornerDownLeft className="w-2.5 h-2.5 text-brand-accent" />
                </span>
                <button
                  type="submit"
                  disabled={(!input.trim() && !attachedFile) || loading}
                  className="btn-primary py-3 px-6 rounded-2xl text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed shadow-xl shadow-brand-primary/30 cursor-pointer flex items-center gap-2"
                >
                  <span>Send</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatContainer;
