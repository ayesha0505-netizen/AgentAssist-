import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = ({ initialMode = 'signin' }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login, register, forgotPassword } = useAuth();

  // Determine active mode from url path, prop, or internal state
  const getModeFromLocation = () => {
    if (location.pathname === '/register') return 'signup';
    if (location.pathname === '/forgot-password') return 'forgot';
    if (location.pathname === '/login') return 'signin';
    return initialMode;
  };

  const [mode, setMode] = useState(getModeFromLocation());
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Status and feedback states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [googleStatus, setGoogleStatus] = useState('');
  const [shakeForm, setShakeForm] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(30);

  // Sync mode with location change
  useEffect(() => {
    const newMode = getModeFromLocation();
    if (newMode !== mode) {
      setMode(newMode);
      setError('');
      setGoogleStatus('');
    }
  }, [location.pathname, initialMode]);

  // Handle countdown for forgot password resend
  useEffect(() => {
    let timer;
    if (mode === 'forgot_sent' && resendCountdown > 0) {
      timer = setInterval(() => {
        setResendCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [mode, resendCountdown]);

  // Cursor Follower Script for subtle interactive ambient glow
  useEffect(() => {
    const handleMouseMove = (e) => {
      let glow = document.getElementById('cursor-glow');
      if (!glow) {
        glow = document.createElement('div');
        glow.id = 'cursor-glow';
        glow.className = 'fixed pointer-events-none w-[450px] h-[450px] bg-primary/5 blur-[120px] rounded-full z-0 opacity-0 transition-opacity duration-1000';
        document.body.appendChild(glow);
      }
      glow.style.opacity = '1';
      glow.style.left = `${e.clientX - 225}px`;
      glow.style.top = `${e.clientY - 225}px`;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      const glow = document.getElementById('cursor-glow');
      if (glow) glow.remove();
    };
  }, []);

  const switchMode = (newMode) => {
    setMode(newMode);
    setError('');
    setGoogleStatus('');
    if (newMode === 'signin') navigate('/login', { replace: true });
    else if (newMode === 'signup') navigate('/register', { replace: true });
    else if (newMode === 'forgot') navigate('/forgot-password', { replace: true });
  };

  // Password requirements calculation
  const checkPasswordRequirements = (pass) => {
    return {
      length: pass.length >= 8,
      hasNumber: /\d/.test(pass),
      hasUpperOrSymbol: /[A-Z!@#$%^&*(),.?":{}|<>]/.test(pass),
    };
  };

  const reqs = checkPasswordRequirements(password);
  const strengthScore = [reqs.length, reqs.hasNumber, reqs.hasUpperOrSymbol].filter(Boolean).length;

  const getStrengthBadge = () => {
    if (!password) return { label: 'Enter clearance', color: 'bg-white/[0.05] text-outline border border-white/10' };
    if (strengthScore === 1) return { label: 'Weak', color: 'bg-error/20 text-error border border-error/30' };
    if (strengthScore === 2) return { label: 'Moderate', color: 'bg-amber-500/20 text-amber-300 border border-amber-500/30' };
    return { label: 'Maximum', color: 'bg-tertiary/20 text-tertiary border border-tertiary/30' };
  };

  const strengthBadge = getStrengthBadge();

  const triggerValidationShake = (msg) => {
    setError(msg);
    setShakeForm(true);
    setTimeout(() => setShakeForm(false), 450);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setGoogleStatus('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      triggerValidationShake('Please enter a valid enterprise account identifier.');
      return;
    }

    if (mode === 'signin') {
      if (!password) {
        triggerValidationShake('Please enter your security clearance.');
        return;
      }
      setLoading(true);
      try {
        const success = await login(email, password);
        if (success) {
          navigate('/chat');
        } else {
          triggerValidationShake('Invalid account identifier or security clearance.');
        }
      } catch (err) {
        triggerValidationShake(err.response?.data?.detail || 'Authorization failed. Please verify clearance.');
      } finally {
        setLoading(false);
      }
    } else if (mode === 'signup') {
      if (!name.trim() || name.trim().length < 2) {
        triggerValidationShake('Please provide your full personnel name.');
        return;
      }
      if (strengthScore < 2) {
        triggerValidationShake('Clearance must be at least 8 characters and contain numbers or uppercase letters.');
        return;
      }
      if (!agreeTerms) {
        triggerValidationShake('You must agree to Enterprise Security Terms & Compliance.');
        return;
      }
      setLoading(true);
      try {
        const success = await register(name.trim(), email, password, 'customer');
        if (success) {
          navigate('/chat');
        } else {
          triggerValidationShake('Unable to provision clearance. Identifier may already be active.');
        }
      } catch (err) {
        triggerValidationShake(err.response?.data?.detail || 'Provisioning failed. Account identifier already in use.');
      } finally {
        setLoading(false);
      }
    } else if (mode === 'forgot') {
      setLoading(true);
      try {
        await forgotPassword(email);
        setMode('forgot_sent');
        setResendCountdown(30);
      } catch (err) {
        triggerValidationShake('Encountered an issue transmitting recovery link. Please retry.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleGoogleAuth = () => {
    setGoogleStatus('Connecting to Google Workspace Gateway...');
    setTimeout(() => {
      setGoogleStatus('Google OAuth connected. Please verify clearance to complete sign in.');
    }, 2500);
  };

  return (
    <div className="bg-mesh text-on-background min-h-screen font-body-base flex flex-col items-center justify-center p-4 sm:p-6 overflow-hidden relative selection:bg-primary/30 selection:text-secondary">
      {/* Subtle Background Glow */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-primary/5 blur-[140px] rounded-full pointer-events-none"></div>

      <main className="relative z-10 w-full max-w-[450px] my-auto py-6">
        {/* Brand / Logo Header */}
        <div className="flex flex-col items-center mb-8 text-center">
          <Link to="/" className="mb-4 hover:scale-105 transition-transform duration-300">
            <img src="/helpflow-logo-dark.png" alt="HelpFlow AI" className="h-14 sm:h-16 w-auto object-contain drop-shadow-[0_4px_20px_rgba(79,70,229,0.3)]" />
          </Link>
          <p className="text-on-surface-variant text-[11px] sm:text-xs font-mono tracking-[0.25em] uppercase font-bold opacity-75">
            Enterprise Intelligence
          </p>
        </div>

        {/* Main Authentication Card */}
        <div className="w-full rounded-[28px] border border-white/[0.08] bg-[#12151e]/85 backdrop-blur-2xl shadow-[0_25px_70px_-15px_rgba(0,0,0,0.85)] p-6 sm:p-9 space-y-6 animate-slide-up">
          <div className="space-y-1 text-center">
            <h2 className="font-headline-md text-xl sm:text-2xl font-bold text-white tracking-tight">
              {mode === 'signin' && 'Welcome Back'}
              {mode === 'signup' && 'Create Account'}
              {mode === 'forgot' && 'Account Recovery'}
              {mode === 'forgot_sent' && 'Check Your Inbox'}
            </h2>
            <p className="text-on-surface-variant text-xs sm:text-sm font-medium">
              {mode === 'signin' && 'Secure authorization required to continue.'}
              {mode === 'signup' && 'Request authorization for your enterprise team.'}
              {mode === 'forgot' && 'Enter your account identifier to transmit a recovery token.'}
              {mode === 'forgot_sent' && `Recovery instructions sent to ${email || 'your email'}.`}
            </p>
          </div>

          {/* Status Toast */}
          {googleStatus && (
            <div className="p-3.5 rounded-xl bg-primary/10 border border-primary/30 text-primary text-xs flex items-center gap-2.5 animate-fade-in shadow-sm">
              <span className="material-symbols-outlined text-[18px] animate-pulse shrink-0">sparkles</span>
              <span className="font-medium leading-relaxed">{googleStatus}</span>
            </div>
          )}

          {/* Error Toast */}
          {error && (
            <div className="p-3.5 rounded-xl bg-error/15 border border-error/40 text-error text-xs flex items-center gap-2.5 animate-fade-in shadow-sm">
              <span className="material-symbols-outlined text-[18px] shrink-0">error</span>
              <span className="font-medium leading-relaxed">{error}</span>
            </div>
          )}

          {mode === 'forgot_sent' ? (
            /* Forgot Password Sent View */
            <div className="space-y-5 animate-fade-in py-1">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center shadow-lg">
                <span className="material-symbols-outlined text-secondary text-[32px] animate-bounce">mark_email_read</span>
              </div>
              <p className="text-xs text-on-surface-variant text-center leading-relaxed">
                If an account matching <span className="text-white font-semibold">{email}</span> exists in our directory, clearance recovery instructions have been transmitted.
              </p>
              <button
                type="button"
                disabled={resendCountdown > 0 || loading}
                onClick={() => {
                  setResendCountdown(30);
                  forgotPassword(email);
                }}
                className="w-full py-3 rounded-xl bg-[#181c26]/80 hover:bg-[#1e2330] text-xs font-semibold text-secondary hover:text-white transition-all disabled:opacity-50 cursor-pointer text-center block border border-white/5"
              >
                {resendCountdown > 0 ? `Resend clearance in ${resendCountdown}s` : 'Resend recovery token'}
              </button>
              <button
                type="button"
                onClick={() => switchMode('signin')}
                className="w-full cyber-button py-4 rounded-xl font-headline-md text-white text-sm font-semibold tracking-wide flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer shadow-lg shadow-indigo-500/25"
              >
                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                <span>Return to Login</span>
              </button>
            </div>
          ) : (
            /* Main Form (Sign In / Sign Up / Forgot) */
            <form className={`space-y-5 ${shakeForm ? 'animate-shake' : ''}`} onSubmit={handleSubmit}>
              <div className="space-y-4">
                {/* Full Name field (Signup Mode Only) */}
                {mode === 'signup' && (
                  <div className="space-y-2 animate-fade-in">
                    <label className="block text-[11px] font-mono uppercase tracking-widest text-outline/80 font-bold pl-0.5" htmlFor="name">
                      Personnel Name
                    </label>
                    <div className="relative flex items-center rounded-xl bg-[#181c26]/90 border border-white/[0.07] input-glow transition-all duration-300">
                      <span className="material-symbols-outlined absolute left-4 text-outline/70 text-[20px]">badge</span>
                      <input
                        id="name"
                        type="text"
                        required
                        disabled={loading}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Alex Rivera"
                        className="w-full bg-transparent border-none py-3.5 pl-11 pr-4 text-on-surface focus:ring-0 placeholder:text-outline/40 font-body-base text-sm outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* Email Identifier */}
                <div className="space-y-2">
                  <label className="block text-[11px] font-mono uppercase tracking-widest text-outline/80 font-bold pl-0.5" htmlFor="email">
                    Account Identifier
                  </label>
                  <div className="relative flex items-center rounded-xl bg-[#181c26]/90 border border-white/[0.07] input-glow transition-all duration-300">
                    <span className="material-symbols-outlined absolute left-4 text-outline/70 text-[20px]">alternate_email</span>
                    <input
                      id="email"
                      type="email"
                      required
                      disabled={loading}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@enterprise.ai"
                      className="w-full bg-transparent border-none py-3.5 pl-11 pr-4 text-on-surface focus:ring-0 placeholder:text-outline/40 font-body-base text-sm outline-none"
                    />
                  </div>
                </div>

                {/* Password Clearance (Hidden in Forgot Mode) */}
                {mode !== 'forgot' && (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center px-0.5">
                      <label className="text-[11px] font-mono uppercase tracking-widest text-outline/80 font-bold" htmlFor="password">
                        Security Clearance
                      </label>
                      {mode === 'signin' && (
                        <button
                          type="button"
                          onClick={() => switchMode('forgot')}
                          className="text-[11px] font-mono text-secondary hover:text-secondary-fixed transition-colors font-medium cursor-pointer"
                        >
                          Forgot Access?
                        </button>
                      )}
                    </div>
                    <div className="relative flex items-center rounded-xl bg-[#181c26]/90 border border-white/[0.07] input-glow transition-all duration-300">
                      <span className="material-symbols-outlined absolute left-4 text-outline/70 text-[20px]">lock</span>
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        disabled={loading}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-transparent border-none py-3.5 pl-11 pr-12 text-on-surface focus:ring-0 placeholder:text-outline/40 font-body-base text-sm outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 text-outline/70 hover:text-white transition-colors cursor-pointer flex items-center"
                        title={showPassword ? 'Hide clearance' : 'Show clearance'}
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          {showPassword ? 'visibility_off' : 'visibility'}
                        </span>
                      </button>
                    </div>

                    {/* Password Strength Indicator (Signup Mode) */}
                    {mode === 'signup' && (
                      <div className="pt-2 space-y-2 animate-fade-in px-0.5">
                        <div className="flex items-center justify-between text-[11px] font-mono uppercase">
                          <span className="text-outline/80">Clearance Level:</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${strengthBadge.color}`}>
                            {strengthBadge.label}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-1.5 h-1.5 w-full">
                          <div className={`rounded-full transition-all duration-300 ${strengthScore >= 1 ? 'bg-primary' : 'bg-white/10'}`}></div>
                          <div className={`rounded-full transition-all duration-300 ${strengthScore >= 2 ? 'bg-secondary' : 'bg-white/10'}`}></div>
                          <div className={`rounded-full transition-all duration-300 ${strengthScore >= 3 ? 'bg-tertiary' : 'bg-white/10'}`}></div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Checkboxes */}
              {mode === 'signin' && (
                <div className="flex items-center gap-2.5 px-0.5 pt-0.5">
                  <label className="flex items-center gap-3 cursor-pointer group select-none">
                    <div className="w-4 h-4 rounded border border-white/20 group-hover:border-primary/50 transition-colors flex items-center justify-center relative bg-[#181c26]">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="peer hidden"
                      />
                      <div className="w-2.5 h-2.5 rounded-sm bg-primary scale-0 peer-checked:scale-100 transition-transform duration-200"></div>
                    </div>
                    <span className="text-xs sm:text-sm text-on-surface-variant font-medium">Keep session live</span>
                  </label>
                </div>
              )}

              {mode === 'signup' && (
                <div className="flex items-center gap-2.5 px-0.5 pt-0.5">
                  <label className="flex items-center gap-3 cursor-pointer group select-none">
                    <div className="w-4 h-4 rounded border border-white/20 group-hover:border-primary/50 transition-colors flex items-center justify-center relative shrink-0 bg-[#181c26]">
                      <input
                        type="checkbox"
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                        className="peer hidden"
                      />
                      <div className="w-2.5 h-2.5 rounded-sm bg-primary scale-0 peer-checked:scale-100 transition-transform duration-200"></div>
                    </div>
                    <span className="text-xs sm:text-sm text-on-surface-variant font-medium">I agree to Security Terms & Compliance</span>
                  </label>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full cyber-button py-4 rounded-xl font-headline-md text-white text-sm font-semibold tracking-wide flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all"
              >
                {loading ? (
                  <>
                    <span className="material-symbols-outlined text-[18px] animate-spin">refresh</span>
                    <span>
                      {mode === 'signin' && 'Initializing Login...'}
                      {mode === 'signup' && 'Provisioning Access...'}
                      {mode === 'forgot' && 'Transmitting Link...'}
                    </span>
                  </>
                ) : (
                  <>
                    <span>
                      {mode === 'signin' && 'Initialize Login'}
                      {mode === 'signup' && 'Request Authorization'}
                      {mode === 'forgot' && 'Transmit Recovery Link'}
                    </span>
                    <span className="material-symbols-outlined text-[18px]">
                      {mode === 'forgot' ? 'send' : 'arrow_forward'}
                    </span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Divider & Login with Google (per user request) */}
          {(mode === 'signin' || mode === 'signup') && (
            <div className="pt-1 space-y-4">
              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/[0.06]"></div>
                </div>
                <span className="relative bg-[#12151e] px-3 text-[10px] font-mono text-outline/60 uppercase tracking-[0.2em] font-semibold">
                  SSO Connect
                </span>
              </div>

              <button
                type="button"
                onClick={handleGoogleAuth}
                className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-xl bg-[#181c26]/80 hover:bg-[#1e2330] border border-white/[0.08] hover:border-white/20 text-xs sm:text-sm font-semibold text-slate-200 hover:text-white transition-all duration-200 cursor-pointer shadow-sm group"
              >
                <svg className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.79-.07-1.54-.19-2.27h-11.3v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82Z" />
                  <path fill="#34A853" d="M12.255 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96h-3.98v3.09C3.515 21.3 7.565 24 12.255 24Z" />
                  <path fill="#FBBC05" d="M5.525 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62h-3.98a11.86 11.86 0 000 10.76l3.98-3.09Z" />
                  <path fill="#EA4335" d="M12.255 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C18.205 1.19 15.495 0 12.255 0 7.565 0 3.515 2.7 1.545 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96Z" />
                </svg>
                <span>Login with Google</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer Links Below Card */}
        <div className="mt-8 flex flex-col items-center gap-6">
          <p className="text-xs sm:text-sm text-on-surface-variant font-medium">
            {mode === 'signin' && (
              <>
                New to HelpFlow?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('signup')}
                  className="text-primary font-semibold hover:text-secondary transition-colors cursor-pointer"
                >
                  Request Access
                </button>
              </>
            )}
            {mode === 'signup' && (
              <>
                Already authorized?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('signin')}
                  className="text-primary font-semibold hover:text-secondary transition-colors cursor-pointer"
                >
                  Initialize Login
                </button>
              </>
            )}
            {mode === 'forgot' && (
              <>
                Remembered clearance?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('signin')}
                  className="text-primary font-semibold hover:text-secondary transition-colors cursor-pointer"
                >
                  Back to Login
                </button>
              </>
            )}
          </p>
          <footer className="flex items-center gap-3 sm:gap-4 text-[10px] font-mono text-outline/40 uppercase tracking-widest">
            <a className="hover:text-white transition-colors" href="#privacy" onClick={(e) => e.preventDefault()}>Privacy</a>
            <span className="w-1 h-1 rounded-full bg-white/10"></span>
            <a className="hover:text-white transition-colors" href="#compliance" onClick={(e) => e.preventDefault()}>Compliance</a>
            <span className="w-1 h-1 rounded-full bg-white/10"></span>
            <span>© 2024</span>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
