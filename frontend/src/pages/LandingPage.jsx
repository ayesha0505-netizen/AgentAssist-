import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Bot,
  Zap,
  Layers,
  Shield,
  CheckCircle2,
  Terminal,
  Database,
  Cpu,
  Workflow,
  Globe,
  Lock,
  MessageSquare,
  BarChart3,
  ChevronRight,
  Play,
  RefreshCw,
  Clock,
  Server,
  Share2
} from 'lucide-react';

const LandingPage = () => {
  const [demoQueryIndex, setDemoQueryIndex] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);

  const demoQueries = [
    {
      query: 'My order #HF-9921 is delayed and I need to update my shipping address before dispatch.',
      user: 'Sarah Jenkins (Enterprise VIP)',
      time: '09:42:01',
      intent: 'Order Status + Address Modification',
      confidence: '99.8%',
      tools: ['OrderManagementAPI.checkStatus("HF-9921")', 'ShippingAPI.updateAddress("404 Cyber Pkwy")'],
      response: "I've checked order #HF-9921 and successfully intercepted your package at our fulfillment center to update the delivery address to 404 Cyber Pkwy. Your tracking link remains active.",
      latency: '42ms'
    },
    {
      query: 'Can we configure custom SAML SSO and enforce role-based access for our 500 support agents?',
      user: 'Marcus Vance (VP of Eng)',
      time: '10:15:22',
      intent: 'Enterprise Auth & RBAC Inquiry',
      confidence: '99.9%',
      tools: ['KnowledgeGraph.query("SAML_SSO_RBAC")', 'SecurityAudit.verifyCompliance("SOC2_HIPAA")'],
      response: "Yes, HelpFlow natively supports custom SAML 2.0 / OIDC integrations (Okta, Azure AD, OneLogin) with granular RBAC permissions. We also provide automated SOC 2 Type II audit logs for all agent actions.",
      latency: '38ms'
    },
    {
      query: 'Our inventory webhook failed with error 504. Did the AI fallback queue catch the missed updates?',
      user: 'Elena Rostova (Lead Architect)',
      time: '11:04:45',
      intent: 'System Diagnostic & Fallback Verification',
      confidence: '99.7%',
      tools: ['WebhookMonitor.inspectQueue("inv_sync_09")', 'EventBus.replayDeadLetterQueue()'],
      response: "I inspected the dead-letter queue and confirmed that 14 inventory synchronization payloads were caught during the 504 gateway timeout. All 14 events have been replayed and committed to the primary Postgres replica.",
      latency: '46ms'
    }
  ];

  const currentQuery = demoQueries[demoQueryIndex];

  const handleSimulateNext = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setDemoQueryIndex((prev) => (prev + 1) % demoQueries.length);
      setIsSimulating(false);
    }, 400);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setDemoQueryIndex((prev) => (prev + 1) % demoQueries.length);
    }, 12000);
    return () => clearInterval(interval);
  }, [demoQueries.length]);

  return (
    <div className="bg-[#0b0e14] text-[#e0e2eb] selection:bg-[#5E6AD2] selection:text-white min-h-screen overflow-x-hidden font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap');

        .bg-grid-pattern {
          background-size: 40px 40px;
          background-image: 
            linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
        }

        .glow-sphere {
          background: radial-gradient(circle, rgba(94, 106, 210, 0.25) 0%, rgba(0, 242, 254, 0.08) 50%, transparent 70%);
        }

        .text-glow-primary {
          text-shadow: 0 0 30px rgba(94, 106, 210, 0.4);
        }
      `}</style>

      {/* Hero Section */}
      <section className="relative pt-12 pb-24 md:pt-20 md:pb-32 overflow-hidden" id="why">
        {/* Background Gradients & Grid */}
        <div className="absolute inset-0 bg-grid-pattern pointer-events-none opacity-80"></div>
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] glow-sphere blur-3xl pointer-events-none"></div>
        <div className="absolute top-10 right-10 w-[400px] h-[400px] bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center text-center">
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-white/[0.12] bg-dark-850/80 backdrop-blur-md text-xs font-mono text-slate-300 shadow-2xl mb-8 hover:border-brand-primary/40 transition-all cursor-default">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
            </span>
            <span className="tracking-widest uppercase text-cyan-300 font-bold">✦ NEXT-GEN AUTONOMOUS CUSTOMER SUPPORT ENGINE</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-extrabold tracking-tight text-white max-w-5xl leading-[1.08] mb-6">
            Enterprise-Grade <br />
            <span className="bg-gradient-to-r from-brand-primary via-[#a5b4fc] to-brand-accent bg-clip-text text-transparent text-glow-primary">
              Autonomous Customer Support
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-slate-300 max-w-3xl leading-relaxed font-normal mb-10">
            Transform your support infrastructure with self-evolving AI agents. Instant resolution across 100+ languages with zero human escalation required for 85% of complex queries.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto mb-16">
            <Link to="/chat" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-base bg-gradient-to-r from-brand-primary via-indigo-600 to-brand-secondary text-white shadow-2xl shadow-brand-primary/40 hover:shadow-brand-primary/60 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 border border-white/15 cursor-pointer">
                <span>Deploy Autonomous Agent</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
            <a href="#interactive-demo" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-base bg-dark-850/80 border border-white/15 text-slate-200 hover:bg-dark-800 hover:border-white/30 hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg">
                <span>Schedule Technical Demo</span>
              </button>
            </a>
          </div>

          {/* Trust Badge Bar */}
          <div className="w-full pt-8 border-t border-white/[0.06] flex flex-col items-center">
            <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-slate-400 mb-6 font-semibold">
              TRUSTED BY INNOVATIVE ENGINEERING & SUPPORT TEAMS WORLDWIDE
            </span>
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-mono text-slate-400">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-dark-900/60 border border-white/[0.04]">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>SOC 2 Type II Certified</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-dark-900/60 border border-white/[0.04]">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>99.99% SLA Guarantee</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-dark-900/60 border border-white/[0.04]">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span>&lt; 50ms Avg Latency</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-dark-900/60 border border-white/[0.04]">
                <Lock className="w-4 h-4 text-purple-400" />
                <span>ISO 27001 Compliant</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-dark-900/60 border border-white/[0.04]">
                <Globe className="w-4 h-4 text-indigo-400" />
                <span>100+ Languages Supported</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Command Center & 3 Pillar Metric Cards Section */}
      <section className="py-20 bg-dark-900/90 border-y border-white/[0.06] relative" id="interactive-demo">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-brand-primary/10 border border-brand-primary/30 text-xs font-mono text-brand-accent uppercase tracking-wider mb-3">
                <span>Interactive Live Preview</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                Real-Time Agent Resolution Workflow
              </h2>
            </div>
            <button
              onClick={handleSimulateNext}
              disabled={isSimulating}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-dark-800 hover:bg-dark-750 text-slate-300 hover:text-white border border-white/[0.08] text-xs font-semibold transition-all cursor-pointer shadow-md disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin text-brand-accent' : ''}`} />
              <span>Simulate Next Query</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start justify-center">
            {/* Left/Main Interactive Terminal Preview Card (Centered) */}
            <div className={`lg:col-span-10 lg:col-start-2 rounded-3xl bg-dark-950/90 border border-white/[0.1] shadow-2xl overflow-hidden transition-opacity duration-300 ${isSimulating ? 'opacity-50' : 'opacity-100'}`}>
              {/* Terminal Top Bar */}
              <div className="px-6 py-4 bg-dark-900/90 border-b border-white/[0.08] flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                  </div>
                  <span className="text-xs font-mono text-slate-400 border-l border-white/10 pl-3 flex items-center gap-2">
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span>System Status: Live &amp; Learning</span>
                  </span>
                </div>
              </div>

              {/* Terminal Content Body */}
              <div className="p-6 sm:p-8 space-y-6 font-mono text-xs">
                {/* User Incoming Query Card */}
                <div className="p-4 rounded-2xl bg-dark-900/80 border border-white/[0.08] space-y-2">
                  <div className="flex items-center justify-between text-slate-400 text-[11px]">
                    <span className="font-bold text-slate-200 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                      <span>INCOMING USER QUERY ({currentQuery.user})</span>
                    </span>
                    <span>[{currentQuery.time}]</span>
                  </div>
                  <p className="text-sm font-sans font-medium text-white pl-4 border-l-2 border-brand-primary py-1">
                    "{currentQuery.query}"
                  </p>
                </div>

                {/* AI Resolution Execution Log */}
                <div className="space-y-3 pl-2 border-l border-brand-primary/30 ml-2">
                  {/* Step 1: Intent */}
                  <div className="p-3.5 rounded-xl bg-dark-900/50 border border-white/[0.05] space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-cyan-300 font-bold">
                      <span>[Step 1: Intent Recognition &amp; Entity Extraction]</span>
                      <span className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-[10px]">
                        Confidence: {currentQuery.confidence}
                      </span>
                    </div>
                    <p className="text-slate-300 font-sans">
                      Detected: <span className="text-white font-semibold">{currentQuery.intent}</span>
                    </p>
                  </div>

                  {/* Step 2: Tools Execution */}
                  <div className="p-3.5 rounded-xl bg-dark-900/50 border border-purple-500/20 space-y-2.5">
                    <div className="flex items-center justify-between text-[11px] text-purple-300 font-bold">
                      <span>[Step 2: Autonomous Tool Orchestration]</span>
                      <span className="text-emerald-400 font-mono">Status: Executing 2 Parallel APIs</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-[11px]">
                      {currentQuery.tools.map((tool, idx) => (
                        <div key={idx} className="p-2 rounded-lg bg-dark-950 border border-white/[0.06] text-amber-300 flex items-center gap-2">
                          <Terminal className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                          <span className="truncate">{tool}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Step 3: Response */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-brand-primary/15 via-indigo-600/10 to-brand-accent/10 border border-brand-primary/40 space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-brand-accent flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '4s' }} />
                        <span>INSTANT AUTONOMOUS RESOLUTION SENT</span>
                      </span>
                      <span className="text-emerald-400 font-mono font-bold">Latency: {currentQuery.latency}</span>
                    </div>
                    <p className="text-sm font-sans text-slate-100 font-medium leading-relaxed">
                      "{currentQuery.response}"
                    </p>
                  </div>
                </div>

                {/* Footer simulation progress */}
                <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-white/[0.06]">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>Zero Human Escalation Required • Ticket Closed in 42ms</span>
                  </span>
                  <span>Simulation {demoQueryIndex + 1} of {demoQueries.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Features Grid Section */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative" id="features">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-purple-500/10 border border-purple-500/30 text-xs font-mono text-purple-300 uppercase tracking-wider mb-3">
            <span>Core Synergies</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            Built for Sovereign Enterprise Intelligence
          </h2>
          <p className="text-base text-slate-400">
            We move beyond shallow keyword bots into true cognitive understanding that operates safely inside your private perimeter.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-dark-900/60 border border-white/[0.06] hover:border-brand-primary/40 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-brand-primary/20 border border-brand-primary/40 flex items-center justify-center text-brand-accent mb-6 group-hover:scale-110 transition-transform">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Omnichannel Synchronization</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Deploy one unified agent memory across email, live web chat, WhatsApp, Slack, and voice channels without context loss.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-dark-900/60 border border-white/[0.06] hover:border-cyan-500/40 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 mb-6 group-hover:scale-110 transition-transform">
              <Database className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Neural Knowledge RAG</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Connect directly to internal Confluence wikis, Notion, PDF technical manuals, and live database tables with hybrid semantic search.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-dark-900/60 border border-white/[0.06] hover:border-purple-500/40 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 mb-6 group-hover:scale-110 transition-transform">
              <Workflow className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Autonomous Escalation Guardrails</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Real-time sentiment and policy evaluation hands off complex exceptions smoothly to human specialists with a complete resolution summary.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-dark-900/60 border border-white/[0.06] hover:border-emerald-500/40 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300 mb-6 group-hover:scale-110 transition-transform">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Zero-Retention Data Privacy</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Strict PII redaction at edge endpoints ensures sensitive customer card numbers and passwords are never logged or stored in LLM history.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-dark-900/60 border border-white/[0.06] hover:border-amber-500/40 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 mb-6 group-hover:scale-110 transition-transform">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Custom Fine-Tuned Weights</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              We fine-tune private domain-specific weights trained exclusively on your historical ticket resolutions and brand voice guidelines.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-dark-900/60 border border-white/[0.06] hover:border-rose-500/40 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-300 mb-6 group-hover:scale-110 transition-transform">
              <Server className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">On-Prem / VPC Deployment</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Deploy inside your own AWS, GCP, or Azure Virtual Private Cloud with dedicated hardware isolation and zero external egress.
            </p>
          </div>
        </div>
      </section>

      {/* System Architecture Section */}
      <section className="py-20 bg-dark-900/80 border-t border-white/[0.06]" id="architecture">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono text-cyan-300 uppercase tracking-wider mb-3">
            <span>Neural Topology</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            How HelpFlow Processes Enterprise Intelligence
          </h2>
          <p className="text-base text-slate-400 max-w-2xl mx-auto mb-16">
            An end-to-end cognitive pipeline built for sub-50ms latency and rigorous SOC 2 security.
          </p>

          <div className="p-8 sm:p-12 rounded-3xl bg-dark-950 border border-white/[0.08] grid grid-cols-1 md:grid-cols-5 gap-6 items-center relative overflow-hidden shadow-2xl">
            <div className="p-6 rounded-2xl bg-dark-900 border border-white/[0.08] space-y-2">
              <div className="w-10 h-10 rounded-xl bg-brand-primary/20 flex items-center justify-center mx-auto text-brand-accent">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-sm">Omnichannel Inputs</h4>
              <p className="text-[11px] text-slate-400">Web, Email, SMS, Voice AI</p>
            </div>

            <div className="hidden md:flex justify-center text-slate-600">
              <ArrowRight className="w-6 h-6 text-brand-primary animate-pulse" />
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-b from-brand-primary/20 to-dark-900 border border-brand-primary/50 space-y-2 shadow-lg shadow-brand-primary/20">
              <div className="w-10 h-10 rounded-xl bg-brand-primary flex items-center justify-center mx-auto text-white">
                <Cpu className="w-5 h-5 animate-spin" style={{ animationDuration: '6s' }} />
              </div>
              <h4 className="font-bold text-white text-sm">Neural Engine</h4>
              <p className="text-[11px] text-brand-accent">Intent + RAG + Tool Routing</p>
            </div>

            <div className="hidden md:flex justify-center text-slate-600">
              <ArrowRight className="w-6 h-6 text-brand-primary animate-pulse" />
            </div>

            <div className="p-6 rounded-2xl bg-dark-900 border border-white/[0.08] space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center mx-auto text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-sm">Action &amp; Resolution</h4>
              <p className="text-[11px] text-slate-400">DB Updates &amp; Instant Reply</p>
            </div>
          </div>
        </div>
      </section>

      {/* Integration Ecosystem Section */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="integration">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            Seamless Bidirectional Integrations
          </h2>
          <p className="text-base text-slate-400">
            Connect HelpFlow AI with your existing CRM, ticketing systems, and enterprise databases in minutes.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {['Zendesk', 'Salesforce', 'Jira Service', 'Shopify Plus', 'PostgreSQL', 'REST & GraphQL'].map((name, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-dark-900/60 border border-white/[0.06] hover:border-brand-primary/40 flex flex-col items-center justify-center text-center gap-3 transition-all hover:scale-105 group">
              <div className="w-12 h-12 rounded-xl bg-dark-800 border border-white/10 flex items-center justify-center text-white group-hover:text-brand-accent transition-colors">
                <Share2 className="w-6 h-6" />
              </div>
              <span className="text-sm font-bold text-slate-200">{name}</span>
              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Native API</span>
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-dark-900/90 border-t border-white/[0.06]" id="pricing">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-300 uppercase tracking-wider mb-3">
              <span>Transparent Scaling</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
              Enterprise-Grade Pricing
            </h2>
            <p className="text-base text-slate-400">
              Choose the right cognitive capacity for your organization's support volume.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {/* Starter */}
            <div className="p-8 rounded-3xl bg-dark-950 border border-white/[0.08] flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Growth Tier</h3>
                <p className="text-xs text-slate-400 mb-6">For fast-growing startups needing automated triage.</p>
                <div className="text-4xl font-extrabold text-white mb-6 font-mono">
                  $1,499 <span className="text-xs font-sans font-normal text-slate-400">/ month</span>
                </div>
                <ul className="space-y-4 text-xs text-slate-300 mb-8">
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Up to 15,000 autonomous resolutions</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Standard RAG (Confluence &amp; Notion)</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Zendesk &amp; Email Connectors</span>
                  </li>
                </ul>
              </div>
              <Link to="/chat">
                <button className="w-full py-3.5 rounded-xl font-bold text-xs bg-dark-850 hover:bg-dark-800 text-slate-200 border border-white/[0.08] transition-all cursor-pointer">
                  Start Free Trial
                </button>
              </Link>
            </div>

            {/* Pro - Most Popular */}
            <div className="p-8 rounded-3xl bg-gradient-to-b from-dark-950 via-dark-900 to-dark-950 border-2 border-brand-primary relative flex flex-col justify-between shadow-2xl shadow-brand-primary/20">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-brand-primary to-indigo-600 text-[10px] font-bold text-white uppercase tracking-widest shadow-md">
                Most Popular
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Enterprise Pro</h3>
                <p className="text-xs text-slate-400 mb-6">For global brands scaling multi-lingual autonomous support.</p>
                <div className="text-4xl font-extrabold text-white mb-6 font-mono">
                  $4,999 <span className="text-xs font-sans font-normal text-slate-400">/ month</span>
                </div>
                <ul className="space-y-4 text-xs text-slate-300 mb-8">
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-brand-accent flex-shrink-0" />
                    <span>Up to 100,000 autonomous resolutions</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-brand-accent flex-shrink-0" />
                    <span>Multi-System API Orchestration &amp; SQL RAG</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-brand-accent flex-shrink-0" />
                    <span>Custom Fine-Tuned Domain Weights</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-brand-accent flex-shrink-0" />
                    <span>Dedicated Technical Account Manager</span>
                  </li>
                </ul>
              </div>
              <Link to="/chat">
                <button className="w-full py-3.5 rounded-xl font-bold text-xs bg-gradient-to-r from-brand-primary via-indigo-600 to-brand-secondary text-white shadow-lg shadow-brand-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer">
                  Deploy Enterprise Pro
                </button>
              </Link>
            </div>

            {/* Sovereign Custom */}
            <div className="p-8 rounded-3xl bg-dark-950 border border-white/[0.08] flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Sovereign Cloud</h3>
                <p className="text-xs text-slate-400 mb-6">For financial, defense &amp; healthcare organizations requiring VPC isolation.</p>
                <div className="text-4xl font-extrabold text-white mb-6 font-mono">
                  Custom <span className="text-xs font-sans font-normal text-slate-400">/ annual</span>
                </div>
                <ul className="space-y-4 text-xs text-slate-300 mb-8">
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Unlimited Autonomous Ticket Volume</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>On-Prem / Private VPC Hardware Isolation</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Zero-Retention PII Guarantee &amp; HIPAA BAA</span>
                  </li>
                </ul>
              </div>
              <a href="#interactive-demo">
                <button className="w-full py-3.5 rounded-xl font-bold text-xs bg-dark-850 hover:bg-dark-800 text-slate-200 border border-white/[0.08] transition-all cursor-pointer">
                  Contact Solutions Architect
                </button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Final High-Impact CTA Section */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="p-12 sm:p-20 rounded-[3rem] bg-gradient-to-r from-dark-900 via-indigo-950/40 to-dark-900 border border-white/[0.1] text-center relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-brand-primary/20 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <h2 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
              Ready to Eliminate Ticket Backlogs Autonomously?
            </h2>
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
              Join engineering leaders deploying self-healing AI support agents in production.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link to="/chat" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-base bg-white text-dark-950 hover:bg-slate-200 shadow-2xl transition-all flex items-center justify-center gap-2 cursor-pointer">
                  <span>Deploy Autonomous Agent</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
              <a href="#interactive-demo" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-base bg-dark-850/90 text-white border border-white/20 hover:bg-dark-800 transition-all cursor-pointer">
                  <span>Schedule Technical Demo</span>
                </button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.08] py-16 px-4 bg-dark-950">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-primary via-indigo-600 to-brand-accent p-[1px] flex items-center justify-center">
                <div className="w-full h-full bg-dark-950 rounded-[15px] flex items-center justify-center p-1.5">
                  <img src="/helpflow-icon.png" alt="HelpFlow AI" className="w-full h-full object-contain" />
                </div>
              </div>
              <span className="font-extrabold text-lg tracking-tight text-white">HelpFlow AI</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm font-normal">
              The autonomous customer support platform powering next-generation enterprise operations with sub-50ms cognitive reasoning.
            </p>
            <div className="text-[11px] font-mono text-slate-500 pt-2">
              © 2026 HelpFlow AI Inc. All rights reserved. SOC 2 Type II Certified.
            </div>
          </div>

          <div>
            <h5 className="text-white font-bold text-xs uppercase tracking-wider mb-4 font-mono">Platform</h5>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><a className="hover:text-white transition-colors" href="#why">Why HelpFlow?</a></li>
              <li><a className="hover:text-white transition-colors" href="#features">Features</a></li>
              <li><a className="hover:text-white transition-colors" href="#architecture">Architecture</a></li>
              <li><a className="hover:text-white transition-colors" href="#integration">Integrations</a></li>
              <li><a className="hover:text-white transition-colors" href="#pricing">Pricing</a></li>
            </ul>
          </div>

          <div>
            <h5 className="text-white font-bold text-xs uppercase tracking-wider mb-4 font-mono">Security &amp; Legal</h5>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><a className="hover:text-white transition-colors" href="#">SOC 2 Compliance</a></li>
              <li><a className="hover:text-white transition-colors" href="#">GDPR &amp; HIPAA BAA</a></li>
              <li><a className="hover:text-white transition-colors" href="#">Privacy Policy</a></li>
              <li><a className="hover:text-white transition-colors" href="#">Terms of Service</a></li>
              <li><Link className="hover:text-white transition-colors" to="/login">Support Center</Link></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
