import React, { useState } from 'react';
import { MessageSquare, Plus, Search, Clock, CheckCircle2, Sparkles, Trash2, X, Filter, Package, Ticket, FileText, Layers } from 'lucide-react';

const ChatSidebar = ({
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  searchQuery,
  onSearchChange,
  isOpen,
  onClose
}) => {
  const [activeFilter, setActiveFilter] = useState('All');

  const filters = [
    { label: 'All', icon: null },
    { label: 'Orders', icon: <Package className="w-3 h-3" /> },
    { label: 'Tickets', icon: <Ticket className="w-3 h-3" /> },
    { label: 'Policy', icon: <FileText className="w-3 h-3" /> }
  ];

  const filteredConversations = conversations.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.snippet.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (c.tag && c.tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (!matchesSearch) return false;
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Orders') return c.tag?.includes('Order') || c.title?.toLowerCase().includes('order');
    if (activeFilter === 'Tickets') return c.tag?.includes('Ticket') || c.title?.toLowerCase().includes('ticket');
    if (activeFilter === 'Policy') return c.tag?.includes('Policy') || c.title?.toLowerCase().includes('refund') || c.title?.toLowerCase().includes('policy');
    return true;
  });

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-dark-950/80 backdrop-blur-md z-40 lg:hidden animate-fade-in"
        />
      )}

      <aside
        className={`fixed lg:static top-16 bottom-0 left-0 z-40 bg-dark-900/95 lg:bg-dark-900/70 backdrop-blur-2xl border-r border-white/[0.08] flex flex-col transition-all duration-300 ease-in-out shadow-2xl overflow-hidden ${
          isOpen ? 'translate-x-0 w-80 sm:w-88 opacity-100' : '-translate-x-full lg:translate-x-0 lg:hidden w-80 sm:w-88 opacity-100'
        }`}
      >
        {/* Sidebar Header & New Chat */}
        <div className="p-4 border-b border-white/[0.08] space-y-3.5 bg-dark-950/50">
          <div className="flex items-center justify-between lg:hidden pb-1">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-brand-accent" />
              <span className="font-extrabold text-white text-xs uppercase tracking-wider font-mono">Conversations</span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-dark-800 transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => {
              onNewConversation();
              if (window.innerWidth < 1024) onClose();
            }}
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-brand-primary via-indigo-600 to-brand-secondary text-white font-black text-xs shadow-xl shadow-brand-primary/25 hover:shadow-brand-primary/45 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2.5 cursor-pointer border border-white/15"
          >
            <Plus className="w-4 h-4" />
            <span>New Support Workspace</span>
          </button>

          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search chats, order #, or topics..."
              className="w-full bg-dark-950/90 text-slate-200 placeholder-slate-500 text-xs pl-9 pr-8 py-2.5 rounded-xl border border-white/[0.08] focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all font-medium shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-3 text-slate-500 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 pt-1 overflow-x-auto pb-1 no-scrollbar">
            {filters.map((f, idx) => (
              <button
                key={idx}
                onClick={() => setActiveFilter(f.label)}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1.5 cursor-pointer flex-shrink-0 ${
                  activeFilter === f.label
                    ? 'bg-brand-primary/25 text-white border border-brand-primary/50 shadow-sm'
                    : 'bg-dark-950/60 text-slate-400 border border-white/[0.06] hover:text-white hover:bg-dark-850'
                }`}
              >
                {f.icon}
                <span>{f.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Filter Summary Header */}
        <div className="px-4 py-2.5 border-b border-white/[0.06] flex items-center justify-between text-[11px] text-slate-400 bg-dark-950/30">
          <span className="font-extrabold uppercase tracking-wider text-slate-500 font-mono">Recent Inquiries</span>
          <span className="px-2 py-0.5 rounded-md bg-dark-950 font-mono text-[10px] text-slate-300 border border-white/[0.06] font-bold">
            {filteredConversations.length} {filteredConversations.length === 1 ? 'Session' : 'Sessions'}
          </span>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2 scroll-smooth">
          {filteredConversations.length === 0 ? (
            <div className="py-14 px-4 text-center text-slate-500 space-y-2.5 animate-fade-in">
              <div className="w-12 h-12 rounded-2xl bg-dark-950 border border-white/[0.06] flex items-center justify-center mx-auto text-slate-600">
                <MessageSquare className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-slate-300">No conversations found</p>
              <p className="text-[11px] text-slate-500 max-w-[200px] mx-auto leading-relaxed">
                {searchQuery || activeFilter !== 'All'
                  ? 'Try clearing your search query or switching category filter.'
                  : 'Start your first support inquiry above.'}
              </p>
            </div>
          ) : (
            filteredConversations.map((chat) => {
              const isActive = chat.id === activeConversationId;
              return (
                <div
                  key={chat.id}
                  onClick={() => {
                    onSelectConversation(chat.id);
                    if (window.innerWidth < 1024) onClose();
                  }}
                  className={`group relative p-4 rounded-2xl transition-all cursor-pointer flex flex-col gap-1.5 border shadow-sm ${
                    isActive
                      ? 'bg-dark-800/95 border-brand-primary/60 shadow-xl shadow-brand-primary/10'
                      : 'bg-dark-950/45 border-white/[0.04] hover:bg-dark-850 hover:border-white/[0.08]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${isActive ? 'bg-brand-accent animate-pulse' : 'bg-slate-600 group-hover:bg-slate-400'}`} />
                      <span className={`text-xs font-black truncate ${isActive ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>
                        {chat.title}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 flex-shrink-0">
                      {chat.timestamp}
                    </span>
                  </div>

                  <p className={`text-xs line-clamp-1 pl-4 leading-relaxed ${isActive ? 'text-slate-200 font-medium' : 'text-slate-400 group-hover:text-slate-300'}`}>
                    {chat.snippet}
                  </p>

                  {/* Status & Tag Pill */}
                  <div className="flex items-center justify-between pl-4 pt-1.5 border-t border-white/[0.04]">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-black tracking-wider uppercase ${
                      chat.tag?.includes('Order') || chat.title?.includes('Order')
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : chat.tag?.includes('Ticket') || chat.title?.includes('Ticket')
                        ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                        : 'bg-brand-primary/15 text-brand-accent border border-brand-primary/30'
                    }`}>
                      {chat.tag || 'Support Inquiry'}
                    </span>

                    {/* Delete button */}
                    {conversations.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteConversation(chat.id);
                        }}
                        title="Delete Conversation"
                        className="opacity-0 group-hover:opacity-100 p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-dark-900 transition-all cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Sidebar Footer - SLA Notice */}
        <div className="p-4 border-t border-white/[0.08] bg-dark-950/80 text-xs text-slate-400 flex items-center justify-between shadow-inner">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-accent" />
            <span className="font-bold text-slate-300">Enterprise AI SLA</span>
          </div>
          <span className="font-mono text-[10px] text-emerald-400 font-extrabold bg-emerald-500/15 px-2.5 py-1 rounded-full border border-emerald-500/30">
            99.9% Online
          </span>
        </div>
      </aside>
    </>
  );
};

export default ChatSidebar;
