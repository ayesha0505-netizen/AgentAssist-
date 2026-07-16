import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import ChatContainer from './components/ChatContainer';
import CustomerProfilePage from './pages/CustomerProfilePage';
import { Layers, Sparkles } from 'lucide-react';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-dark-900 px-4">
        <div className="glass-card p-8 rounded-3xl border border-white/[0.08] flex flex-col items-center gap-4 max-w-sm w-full text-center shadow-2xl animate-fade-in">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-primary via-indigo-600 to-brand-accent p-[1px] flex items-center justify-center shadow-lg shadow-brand-primary/25">
            <div className="w-full h-full bg-dark-950 rounded-[15px] flex items-center justify-center overflow-hidden p-2">
              <img src="/helpflow-icon.png" alt="HelpFlow AI" className="w-full h-full object-contain animate-pulse" />
            </div>
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white tracking-tight">HelpFlow Enterprise Suite</h3>
            <p className="text-xs text-slate-400 mt-1 font-mono">Verifying secure workspace session...</p>
          </div>
          <div className="w-full bg-dark-950 h-1.5 rounded-full overflow-hidden border border-white/[0.06] mt-2">
            <div className="bg-gradient-to-r from-brand-primary via-brand-accent to-brand-secondary h-full w-1/2 animate-shimmer rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function AppContent() {
  const location = useLocation();
  const isAuthPage = ['/login', '/register', '/forgot-password'].includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col bg-dark-900 selection:bg-brand-primary/30 selection:text-brand-accent font-sans">
      {!isAuthPage && <Navbar />}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage initialMode="signin" />} />
          <Route path="/register" element={<LoginPage initialMode="signup" />} />
          <Route path="/forgot-password" element={<LoginPage initialMode="forgot" />} />
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <ChatContainer />
              </ProtectedRoute>
            }
          />
          <Route path="/glacier" element={<Navigate to="/chat" replace />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <CustomerProfilePage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}
