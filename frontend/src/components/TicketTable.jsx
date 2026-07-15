import React, { useState } from 'react';
import api from '../services/api';
import { Ticket, CheckCircle2, Clock, AlertCircle, RefreshCw } from 'lucide-react';

const TicketTable = ({ tickets, onStatusChange, onRefresh, loading }) => {
  const [updatingId, setUpdatingId] = useState(null);

  const handleUpdate = async (ticketId, newStatus) => {
    setUpdatingId(ticketId);
    try {
      await api.put(`/api/tickets/${ticketId}`, { status: newStatus });
      if (onStatusChange) onStatusChange(ticketId, newStatus);
    } catch (e) {
      alert('Failed to update ticket status. Ensure you have admin privileges.');
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'OPEN':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <AlertCircle className="w-3.5 h-3.5" />
            OPEN
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-sky-500/15 text-sky-400 border border-sky-500/30">
            <Clock className="w-3.5 h-3.5" />
            IN PROGRESS
          </span>
        );
      case 'RESOLVED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5" />
            RESOLVED
          </span>
        );
      default:
        return <span className="text-slate-400">{status}</span>;
    }
  };

  return (
    <div className="glass-card rounded-2xl overflow-hidden border-dark-700/80 shadow-xl">
      <div className="px-6 py-4 border-b border-dark-700/80 flex items-center justify-between bg-dark-800/40">
        <div className="flex items-center gap-2">
          <Ticket className="w-5 h-5 text-brand-accent" />
          <h3 className="font-semibold text-white">Customer Support Tickets</h3>
          <span className="px-2 py-0.5 rounded-full bg-dark-900 text-xs font-mono text-slate-400 border border-dark-700">
            {tickets.length} total
          </span>
        </div>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="btn-secondary py-1.5 px-3 text-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-dark-700/80 bg-dark-900/60 text-xs uppercase font-semibold text-slate-400">
              <th className="py-3.5 px-6">Ticket ID</th>
              <th className="py-3.5 px-6">User ID</th>
              <th className="py-3.5 px-6">Issue Description</th>
              <th className="py-3.5 px-6">Created At</th>
              <th className="py-3.5 px-6">Status</th>
              <th className="py-3.5 px-6 text-right">Supervisor Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-700/60 text-sm">
            {tickets.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-12 text-center text-slate-500 font-medium">
                  No support tickets logged yet. Ask the AI to open a ticket!
                </td>
              </tr>
            ) : (
              tickets.map((t) => (
                <tr key={t.id} className="hover:bg-dark-800/40 transition-colors">
                  <td className="py-4 px-6 font-mono font-bold text-brand-accent">{t.id}</td>
                  <td className="py-4 px-6 font-mono text-slate-400">User #{t.user_id || 'N/A'}</td>
                  <td className="py-4 px-6 text-slate-200 max-w-md truncate">{t.issue}</td>
                  <td className="py-4 px-6 text-xs text-slate-400 font-mono">
                    {t.created_at ? new Date(t.created_at).toLocaleString() : 'Just now'}
                  </td>
                  <td className="py-4 px-6">{getStatusBadge(t.status)}</td>
                  <td className="py-4 px-6 text-right">
                    <select
                      value={t.status}
                      disabled={updatingId === t.id}
                      onChange={(e) => handleUpdate(t.id, e.target.value)}
                      className="bg-dark-900 text-slate-200 text-xs font-semibold px-3 py-1.5 rounded-xl border border-dark-700 focus:outline-none focus:border-brand-primary disabled:opacity-50"
                    >
                      <option value="OPEN">OPEN</option>
                      <option value="IN_PROGRESS">IN_PROGRESS</option>
                      <option value="RESOLVED">RESOLVED</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TicketTable;
