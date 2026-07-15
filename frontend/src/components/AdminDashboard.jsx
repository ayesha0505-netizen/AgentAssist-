import React, { useState, useEffect } from 'react';
import TicketTable from './TicketTable';
import KnowledgeUpload from './KnowledgeUpload';
import api from '../services/api';
import { ShieldAlert, Database, Ticket, Cpu, CheckCircle } from 'lucide-react';

const AdminDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('tickets');

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/tickets');
      setTickets(res.data);
    } catch (e) {
      console.error('Failed to fetch tickets:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (ticketId, newStatus) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status: newStatus } : t))
    );
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header Banner */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border-dark-700/80 bg-gradient-to-r from-dark-800 via-dark-800 to-brand-primary/10 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-primary to-brand-secondary p-[2px] shadow-lg shadow-brand-primary/25">
            <div className="w-full h-full bg-dark-900 rounded-[14px] flex items-center justify-center">
              <ShieldAlert className="w-7 h-7 text-brand-accent" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white tracking-tight">Supervisor Control Center</h1>
              <span className="px-2 py-0.5 rounded text-[11px] uppercase font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                Admin
              </span>
            </div>
            <p className="text-sm text-slate-400 mt-0.5">
              Monitor AI-generated support tickets, adjust resolution statuses, and inject knowledge into the FAISS vector index.
            </p>
          </div>
        </div>

        {/* Quick Stats Summary */}
        <div className="flex items-center gap-4 bg-dark-900/80 px-5 py-3 rounded-2xl border border-dark-700 w-full sm:w-auto justify-around sm:justify-start">
          <div className="text-center sm:text-left">
            <span className="text-xs text-slate-400 block font-medium">Open Tickets</span>
            <span className="text-lg font-bold text-amber-400 font-mono">
              {tickets.filter((t) => t.status === 'OPEN').length}
            </span>
          </div>
          <div className="w-px h-8 bg-dark-700"></div>
          <div className="text-center sm:text-left">
            <span className="text-xs text-slate-400 block font-medium">Resolved</span>
            <span className="text-lg font-bold text-emerald-400 font-mono">
              {tickets.filter((t) => t.status === 'RESOLVED').length}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-dark-700/80 pb-2">
        <button
          onClick={() => setActiveTab('tickets')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
            activeTab === 'tickets'
              ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/25'
              : 'text-slate-400 hover:text-white hover:bg-dark-800'
          }`}
        >
          <Ticket className="w-4 h-4" />
          <span>Support Tickets Management</span>
        </button>
        <button
          onClick={() => setActiveTab('knowledge')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
            activeTab === 'knowledge'
              ? 'bg-brand-secondary text-white shadow-lg shadow-brand-secondary/25'
              : 'text-slate-400 hover:text-white hover:bg-dark-800'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>RAG Knowledge Base Ingestion</span>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'tickets' ? (
        <TicketTable
          tickets={tickets}
          onStatusChange={handleStatusChange}
          onRefresh={fetchTickets}
          loading={loading}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start animate-fade-in">
          <div className="lg:col-span-2">
            <KnowledgeUpload onUploadSuccess={() => {}} />
          </div>
          <div className="glass-card p-6 rounded-2xl border-dark-700/80 space-y-4">
            <div className="flex items-center gap-2 text-brand-accent font-semibold">
              <Cpu className="w-5 h-5" />
              <span>How Local RAG Indexing Works</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              When you upload a document (`.md` or `.txt`), the backend processes it through a custom `RecursiveTextSplitter` (chunk size 500, overlap 50).
            </p>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>Encodes chunks into 384-dim dense vectors using `sentence-transformers/all-MiniLM-L6-v2`.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>Builds an exact Inner Product (`IndexFlatIP`) FAISS similarity graph on disk (`index.faiss`).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>AgentCoordinator queries top-3 snippets whenever a user asks policy questions!</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
