import React, { useState } from 'react';
import api from '../services/api';
import { Upload, FileText, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';

const KnowledgeUpload = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
      setError(null);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setResult(null);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await api.post('/api/knowledge/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setResult(res.data);
      setFile(null);
      if (onUploadSuccess) onUploadSuccess(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to upload document or rebuild FAISS index.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="glass-card rounded-2xl p-6 border-dark-700/80 shadow-xl max-w-2xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2.5 rounded-xl bg-gradient-to-tr from-brand-primary to-brand-secondary text-white shadow-md shadow-brand-primary/20">
          <Upload className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-semibold text-white">Ingest New RAG Document</h3>
          <p className="text-xs text-slate-400">
            Upload Markdown (`.md`) or Text (`.txt`) policy documents to re-index FAISS vectors in real time.
          </p>
        </div>
      </div>

      <form onSubmit={handleUpload} className="space-y-4">
        <div className="border-2 border-dashed border-dark-600 hover:border-brand-primary/60 rounded-2xl p-6 text-center transition-all bg-dark-900/40 relative">
          <input
            type="file"
            accept=".md,.txt"
            onChange={handleFileChange}
            disabled={uploading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          />
          <div className="flex flex-col items-center justify-center gap-2">
            <FileText className="w-8 h-8 text-slate-400" />
            {file ? (
              <div>
                <span className="text-sm font-semibold text-brand-accent block">{file.name}</span>
                <span className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB</span>
              </div>
            ) : (
              <div>
                <span className="text-sm font-medium text-slate-300">Click or drag a `.md` or `.txt` file here</span>
                <span className="text-xs text-slate-500 block mt-1">Chunk size: 500 chars | Embedding: all-MiniLM-L6-v2</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          {file && (
            <button
              type="button"
              onClick={() => setFile(null)}
              className="btn-secondary py-2 px-4 text-xs"
            >
              Clear
            </button>
          )}
          <button
            type="submit"
            disabled={!file || uploading}
            className="btn-primary py-2 px-5 text-xs font-semibold disabled:opacity-50"
          >
            {uploading ? (
              <>
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                <span>Vectorizing & Re-Indexing...</span>
              </>
            ) : (
              <>
                <Upload className="w-3.5 h-3.5" />
                <span>Upload to Knowledge Base</span>
              </>
            )}
          </button>
        </div>
      </form>

      {result && (
        <div className="mt-4 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{result.message}</span>
        </div>
      )}

      {error && (
        <div className="mt-4 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2.5 animate-fade-in">
          <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default KnowledgeUpload;
