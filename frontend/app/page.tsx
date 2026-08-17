'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from './context/AuthContext';
import {
  Sparkles,
  Play,
  Check,
  CheckCircle2,
  Star,
  ArrowRight,
  ShieldCheck,
  Zap,
  Video,
  Layers,
  Copy,
  Code2,
  Cpu,
  MessageSquareQuote,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  ExternalLink,
  Globe,
  Mail,
  Send,
  X,
  Clock,
  Eye,
  Sliders,
  FileCode,
  Terminal,
  User,
} from 'lucide-react';

const FEATURES = [
  {
    title: 'Guided Discovery Engine',
    description: 'Progressive, focused questionnaires extract high-precision context from your project vision.',
    icon: Sliders,
    badge: 'Smart Context',
    highlight: 'Zero Guesswork',
  },
  {
    title: 'Production Spec Generation',
    description: 'Instantly format prompts into structured Markdown, JSON, or direct system instructions.',
    icon: FileCode,
    badge: 'Multi-Format',
    highlight: 'Copy & Paste',
  },
  {
    title: 'Architecture Guardrails',
    description: 'Prevent AI hallucinations by embedding security protocols, stack constraints, and edge cases.',
    icon: ShieldCheck,
    badge: 'Security Ready',
    highlight: 'Hallucination Proof',
  },
  {
    title: 'Multi-Model Tuning',
    description: 'Targeted prompt optimization for Claude 3.7 Sonnet, GPT-4o, DeepSeek R1, and Gemini 2.5.',
    icon: Cpu,
    badge: 'AI Optimized',
    highlight: 'Top LLM Support',
  },
  {
    title: 'Actionable Stack Advice',
    description: 'Get tailored architectural recommendations for database schemas, state management, and auth.',
    icon: Code2,
    badge: 'Tech Guidance',
    highlight: 'Best Practices',
  },
  {
    title: 'Instant Execution Specs',
    description: 'Empower AI code agents like Cursor, Windsurf, and Copilot to write bug-free code on the first attempt.',
    icon: Zap,
    badge: '10x Speed',
    highlight: 'High Accuracy',
  },
];

const STEPS = [
  {
    step: '01',
    title: 'Define Project Vision',
    description: 'Answer simple guided questions about your target app, stack preferences, and core feature goals.',
    icon: Terminal,
  },
  {
    step: '02',
    title: 'Auto-Tuning & Validation',
    description: 'Prompt Mastery applies architectural guardrails, edge-case checks, and security requirements.',
    icon: Sliders,
  },
  {
    step: '03',
    title: 'Generate Spec Prompt',
    description: 'Receive a high-signal prompt spec rated with a 95%+ precision score ready for your favorite LLM.',
    icon: Sparkles,
  },
  {
    step: '04',
    title: 'Ship Production Code',
    description: 'Paste into Cursor, ChatGPT, or Claude to build full-stack features with minimal iterations.',
    icon: CheckCircle2,
  },
];

const VIDEO_DEMOS = [
  {
    id: 'quick-tour',
    title: 'Prompt Mastery 1-Minute Quick Tour',
    subtitle: 'See how to transform a vague feature idea into a comprehensive 50-line AI prompt spec.',
    duration: '01:30',
    category: 'Product Overview',
    views: '14.2k views',
    thumbnailColor: 'from-sky-500 to-blue-600',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1', // Placeholder demo video
    bullets: ['Guided prompt questionnaire', 'Instant LLM spec generation', 'One-click copy to clipboard'],
  },
  {
    id: 'arch-guardrails',
    title: 'Eliminating AI Code Hallucinations',
    subtitle: 'Learn how architectural guardrails keep AI assistants bound to your exact tech stack.',
    duration: '02:15',
    category: 'Advanced Workflow',
    views: '9.8k views',
    thumbnailColor: 'from-blue-600 to-indigo-600',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1',
    bullets: ['Defining explicit edge-cases', 'State management rules', 'Strict TypeScript typings'],
  },
  {
    id: 'cursor-integration',
    title: 'Cursor & Windsurf Workflow Integration',
    subtitle: 'Watch how senior developers use Prompt Mastery specs inside AI IDEs for 10x faster shipping.',
    duration: '01:50',
    category: 'IDE Integration',
    views: '18.5k views',
    thumbnailColor: 'from-cyan-500 to-sky-600',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1',
    bullets: ['System prompt structure', 'Database schema injection', 'Test-driven AI generation'],
  },
];

const TESTIMONIALS = [
  {
    name: 'Sarah Lin',
    role: 'Lead AI Engineer',
    company: 'TechFlow Labs',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    tag: 'Saved 15 hrs/week',
    quote:
      'Prompt Mastery has completely eliminated the back-and-forth with Claude. We generate structured prompt specs that work on the very first try.',
  },
  {
    name: 'Alex Rivera',
    role: 'Fullstack Architect',
    company: 'Launchpad Studio',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    tag: 'Zero Hallucinations',
    quote:
      'The architectural guardrails feature is insane. Our AI coding agents stop making up non-existent libraries and follow our exact stack.',
  },
  {
    name: 'Michael Chen',
    role: 'Founder & CTO',
    company: 'DevPulse Inc.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    tag: '10x Shipping Velocity',
    quote:
      'We went from spending hours prompt tweaking to generating production-ready prompts in 20 seconds. It is an indispensable tool for our team.',
  },
  {
    name: 'Priya Sharma',
    role: 'Staff Software Engineer',
    company: 'CloudScale AI',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    tag: 'Must-have for Cursor',
    quote:
      'I use Prompt Mastery before writing any major feature spec. The clarity and structure it brings to AI code generation is unmatched.',
  },
  {
    name: 'David Vance',
    role: 'Product Lead',
    company: 'NextGen Apps',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    tag: 'High ROI Tool',
    quote:
      'Our junior developers now write prompt specs as good as our staff engineers. The guided discovery questions make all the difference.',
  },
  {
    name: 'Elena Rostova',
    role: 'AI Research Architect',
    company: 'SaaSify Global',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    tag: 'Seamless Workflow',
    quote:
      'Lightweight, blazingly fast, and produces clean prompt outputs tailored for GPT-4o and Claude Sonnet alike. Highly recommended!',
  },
];

const FAQS = [
  {
    question: 'How does Prompt Mastery improve AI response quality?',
    answer:
      'Prompt Mastery structures your intent using software engineering principles: defining strict context boundaries, explicit stack parameters, input/output contracts, and anti-hallucination guardrails. This results in 90%+ accurate code generation on the first turn.',
  },
  {
    question: 'Which AI models and tools are supported?',
    answer:
      'Generated prompts are optimized for all leading AI models and coding assistants, including Cursor, Claude 3.7 Sonnet, ChatGPT / GPT-4o, GitHub Copilot, Windsurf, DeepSeek R1, and Gemini 2.5 Pro.',
  },
  {
    question: 'Can I export the prompt specs into markdown or JSON?',
    answer:
      'Yes! You can copy prompt specifications directly to your clipboard in raw Markdown format, clean formatted text, or structured JSON specs with a single click.',
  },
  {
    question: 'Is there a free trial or free tier available?',
    answer:
      'Absolutely! Prompt Mastery is free to start. You can generate unlimited standard prompt specifications directly in your browser without any credit card required.',
  },
];

export default function Home() {
  const { user, isAuthenticated, login, logout, loading } = useAuth();
  const [activeVideoTab, setActiveVideoTab] = useState(0);
  const [selectedModalVideo, setSelectedModalVideo] = useState<typeof VIDEO_DEMOS[0] | null>(null);
  const [activePromptTab, setActivePromptTab] = useState<'raw' | 'enhanced'>('enhanced');
  const [copied, setCopied] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const handleCopyPrompt = () => {
    const samplePrompt = `# ROLE & OBJECTIVE
Act as a Principal Full-Stack Engineer specializing in Next.js 15 (App Router), TypeScript, and Tailwind CSS.

## TASK CONTEXT
Build a production-grade authentication flow featuring JWT handling, session persistence, and responsive UI.

## TECHNICAL CONSTRAINTS
- Strict TypeScript mode enabled
- Tailwind CSS v4 with HSL design tokens
- Comprehensive error boundary & loading fallback states
- Zero external UI libraries unless specified

## ACCEPTANCE CRITERIA
1. Server actions for login and signup operations
2. Client-side form validation using Zod
3. Accessible modal UI with keyboard navigation (Esc to close)
4. Unit tests skeleton with Vitest`;

    navigator.clipboard.writeText(samplePrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSubscribed(true);
      setTimeout(() => {
        setNewsletterSubscribed(false);
        setNewsletterEmail('');
      }, 4000);
    }
  };

  return (
    <main className="relative min-h-screen bg-slate-50 text-slate-900 overflow-hidden font-sans">
      {/* Light Blue Ambient Background Gradients */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-sky-200/50 via-cyan-100/30 to-transparent blur-3xl opacity-70" />
        <div className="absolute top-96 -left-32 w-96 h-96 bg-sky-300/20 rounded-full blur-3xl" />
        <div className="absolute top-[1200px] -right-32 w-[500px] h-[500px] bg-cyan-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-40 left-1/3 w-[600px] h-[400px] bg-blue-100/40 rounded-full blur-3xl" />
        {/* Fine Light Grid Overlay */}
        <div className="absolute inset-0 opacity-[0.35] [background:radial-gradient(#0284c7_1px,transparent_1px)] [background-size:28px_28px]" />
      </div>

      {/* Floating 3D/CSS Animated Visual Objects */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {/* Floating Badge Left */}
        <div className="hidden lg:flex items-center gap-2 absolute top-40 left-8 xl:left-16 animate-float glass-panel-light px-4 py-2.5 rounded-2xl shadow-lg border border-sky-200 text-xs font-bold text-sky-800">
          <div className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-ping" />
          <Sparkles className="w-4 h-4 text-sky-600" />
          <span>AI Spec Engine v2.0</span>
        </div>

        {/* Floating Badge Right */}
        <div className="hidden lg:flex items-center gap-2 absolute top-64 right-8 xl:right-16 animate-float-reverse glass-panel-light px-4 py-2.5 rounded-2xl shadow-lg border border-sky-200 text-xs font-bold text-sky-800">
          <Zap className="w-4 h-4 text-amber-500" />
          <span>10x Shipping Speed</span>
        </div>

        {/* Floating Orb Bottom Right */}
        <div className="hidden md:block absolute top-[680px] right-20 animate-float glass-panel-light p-4 rounded-3xl border border-sky-200 shadow-xl max-w-[200px]">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 mb-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Prompt Signal</span>
          </div>
          <p className="text-2xl font-extrabold text-sky-700">98.4%</p>
          <p className="text-[10px] text-slate-500">Hallucination-free specs</p>
        </div>
      </div>

      {/* STICKY GLASS NAVBAR */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-sky-100 shadow-xs">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <Link href="/" className="group flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-sky-600 to-cyan-500 text-white shadow-md shadow-sky-500/25 transition group-hover:scale-105">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-tight text-slate-900 group-hover:text-sky-600 transition">
                Prompt<span className="text-sky-600">Mastery</span>
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-sky-600">AI Studio</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <a href="#features" className="hover:text-sky-600 transition">
              Features
            </a>
            <a href="#demo-preview" className="hover:text-sky-600 transition">
              Live Preview
            </a>
            <a href="#video-demos" className="hover:text-sky-600 transition flex items-center gap-1.5">
              <span>Short Videos</span>
              <span className="rounded-full bg-sky-100 px-2 py-0.5 text-[10px] font-bold text-sky-700">NEW</span>
            </a>
            <a href="#how-it-works" className="hover:text-sky-600 transition">
              How It Works
            </a>
            <a href="#testimonials" className="hover:text-sky-600 transition">
              Testimonials
            </a>
            <a href="#faq" className="hover:text-sky-600 transition">
              FAQ
            </a>
          </nav>

          <div className="flex items-center gap-3">
            {!loading && (
              <>
                {isAuthenticated ? (
                  <div className="flex items-center gap-3">
                    <div className="hidden sm:flex flex-col text-right">
                      <span className="text-[10px] font-medium text-slate-400">Signed in</span>
                      <span className="text-xs font-bold text-slate-700">{user?.email}</span>
                    </div>
                    <button
                      onClick={logout}
                      className="rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-rose-300 hover:text-rose-600 cursor-pointer shadow-xs"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={login}
                    className="rounded-xl border border-sky-200 bg-sky-50/70 px-4 py-2 text-xs font-bold text-sky-700 transition hover:bg-sky-100 cursor-pointer"
                  >
                    Sign In
                  </button>
                )}
              </>
            )}

            <Link
              href="/builder"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-600 via-sky-500 to-cyan-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-sky-500/25 transition hover:shadow-sky-500/40 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Launch Builder</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        {/* HERO SECTION */}
        <section className="pt-12 pb-16 lg:pt-20 lg:pb-24 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white/80 px-4 py-1.5 text-xs font-bold text-sky-700 shadow-sm backdrop-blur-sm mb-6 animate-pulse-glow">
            <span className="flex h-2 w-2 rounded-full bg-sky-500" />
            <span>Introducing Prompt Mastery 2.0</span>
            <span className="text-slate-300">•</span>
            <span className="text-sky-600 font-semibold">Light Blue Edition</span>
          </div>

          <h1 className="mx-auto max-w-4xl text-4xl font-black tracking-tight text-slate-900 sm:text-6xl md:text-7xl leading-[1.1]">
            Turn Rough Ideas Into{' '}
            <span className="bg-gradient-to-r from-sky-600 via-cyan-600 to-blue-700 bg-clip-text text-transparent">
              Build-Ready AI Prompts
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 leading-relaxed sm:text-xl font-normal">
            Eliminate low-quality AI output and hallucinations. Answer guided discovery questions to generate structured,
            production-ready specs for Cursor, Claude 3.7, and ChatGPT.
          </p>

          {/* Hero CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/builder"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-600 px-8 py-4 text-base font-bold text-white shadow-xl shadow-sky-500/30 transition hover:bg-sky-500 hover:shadow-sky-500/40 hover:-translate-y-0.5"
            >
              <Sparkles className="w-5 h-5" />
              <span>Start Building Free</span>
            </Link>
            <a
              href="#video-demos"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-2xl border border-sky-200 bg-white/90 px-7 py-4 text-base font-bold text-slate-700 shadow-md transition hover:bg-sky-50/80 hover:border-sky-300 hover:text-sky-600"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-100 text-sky-600">
                <Play className="w-3 h-3 fill-sky-600 ml-0.5" />
              </div>
              <span>Watch 2-Min Demo</span>
            </a>
          </div>

          {/* Trust Badges */}
          <div className="mt-10 flex items-center justify-center gap-6 text-xs font-medium text-slate-500">
            <div className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-sky-600" />
              <span>No Credit Card Required</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-sky-600" />
              <span>Copy-Paste Specs</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-sky-600" />
              <span>Supports Claude & Cursor</span>
            </div>
          </div>
        </section>

        {/* LIVE PROMPT TRANSFORMER DEMO CARD */}
        <section id="demo-preview" className="mb-24">
          <div className="glass-panel-light rounded-3xl p-4 sm:p-6 lg:p-8 border border-sky-200/80 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-4 border-b border-sky-100">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                </div>
                <span className="text-xs font-bold text-slate-500 tracking-wide uppercase">Interactive Spec Transformation</span>
              </div>

              {/* Tab Switcher */}
              <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200/80">
                <button
                  onClick={() => setActivePromptTab('raw')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
                    activePromptTab === 'raw'
                      ? 'bg-white text-slate-800 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  ❌ Raw Vague Request
                </button>
                <button
                  onClick={() => setActivePromptTab('enhanced')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                    activePromptTab === 'enhanced'
                      ? 'bg-sky-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-sky-600'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>✨ Prompt Mastery Spec</span>
                </button>
              </div>
            </div>

            {/* Code Box Display */}
            <div className="relative rounded-2xl bg-slate-900 text-slate-100 p-6 font-mono text-xs sm:text-sm leading-relaxed overflow-x-auto shadow-inner border border-slate-800">
              <button
                onClick={handleCopyPrompt}
                className="absolute top-4 right-4 flex items-center gap-1.5 rounded-lg bg-slate-800/80 px-3 py-1.5 text-xs font-semibold text-slate-300 transition hover:bg-sky-600 hover:text-white border border-slate-700"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied to Clipboard!' : 'Copy Spec'}</span>
              </button>

              {activePromptTab === 'raw' ? (
                <div className="space-y-2 text-rose-300">
                  <p className="text-slate-400">// Typical unstructured request that leads to buggy AI code:</p>
                  <p className="font-semibold text-white">&quot;Hey AI, build a full user auth system for my Next.js website with database and login form.&quot;</p>
                  <div className="mt-4 pt-4 border-t border-slate-800 text-xs text-rose-400 flex items-center gap-2">
                    <span className="font-bold">⚠️ Issues:</span> Missing stack details, no TypeScript contracts, zero security constraints, high hallucination risk.
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sky-400 font-bold">
                    <span className="rounded bg-sky-950 px-2 py-0.5 border border-sky-800 text-[11px]">SIGNAL SCORE: 98%</span>
                    <span className="text-slate-400">•</span>
                    <span>READY FOR CURSOR & CLAUDE SONNET 3.7</span>
                  </div>
                  <pre className="text-slate-200 whitespace-pre-wrap font-mono">
                    {`# ROLE & OBJECTIVE
Act as a Principal Full-Stack Engineer specializing in Next.js 15 (App Router), TypeScript, and Tailwind CSS.

## TASK CONTEXT
Build a production-grade authentication flow featuring JWT handling, session persistence, and responsive UI.

## TECHNICAL CONSTRAINTS & STACK
- Framework: Next.js 15 App Router (Server Actions & React 19)
- Language: Strict TypeScript mode enabled
- Styling: Tailwind CSS v4 with custom HSL design tokens
- Security: HTTP-Only Cookies, CSRF tokens, Zod schema validation

## ACCEPTANCE CRITERIA
1. Server actions for login and signup operations with error states
2. Client-side form validation using Zod schemas
3. Accessible modal UI with keyboard navigation (Esc to close)
4. Unit test skeleton covering authentication handler functions`}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* METRICS & ROI STATS BAR */}
        <section className="mb-24">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div className="glass-panel-light p-6 rounded-2xl border border-sky-100 text-center glass-card-hover">
              <p className="text-3xl sm:text-4xl font-black text-sky-700">50K+</p>
              <p className="mt-1 text-xs sm:text-sm font-semibold text-slate-600">Prompts Generated</p>
            </div>
            <div className="glass-panel-light p-6 rounded-2xl border border-sky-100 text-center glass-card-hover">
              <p className="text-3xl sm:text-4xl font-black text-cyan-600">99.4%</p>
              <p className="mt-1 text-xs sm:text-sm font-semibold text-slate-600">Spec Accuracy Rate</p>
            </div>
            <div className="glass-panel-light p-6 rounded-2xl border border-sky-100 text-center glass-card-hover">
              <p className="text-3xl sm:text-4xl font-black text-blue-700">4.9 / 5</p>
              <div className="mt-1 flex justify-center text-amber-400 gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                ))}
              </div>
              <p className="mt-1 text-xs font-semibold text-slate-600">Developer Rating</p>
            </div>
            <div className="glass-panel-light p-6 rounded-2xl border border-sky-100 text-center glass-card-hover">
              <p className="text-3xl sm:text-4xl font-black text-sky-600">10x</p>
              <p className="mt-1 text-xs sm:text-sm font-semibold text-slate-600">Faster AI Iterations</p>
            </div>
          </div>
        </section>

        {/* SHORT VIDEOS SHOWCASE SECTION */}
        <section id="video-demos" className="mb-28 pt-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-100/70 px-4 py-1.5 text-xs font-bold text-sky-800 mb-3">
              <Video className="w-4 h-4 text-sky-600" />
              <span>SPACE FOR SHORT VIDEOS & DEMOS</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900">
              Watch Prompt Mastery <span className="text-sky-600">In Action</span>
            </h2>
            <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
              Explore short 1-minute video walk-throughs demonstrating how engineering teams write prompts that generate production code.
            </p>
          </div>

          {/* Interactive Video Showcase Tabs */}
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Video Selector List */}
            <div className="lg:col-span-4 space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-sky-700 px-1">Featured Video Demos</p>
              {VIDEO_DEMOS.map((video, idx) => (
                <div
                  key={video.id}
                  onClick={() => setActiveVideoTab(idx)}
                  className={`cursor-pointer rounded-2xl p-5 border transition-all ${
                    activeVideoTab === idx
                      ? 'bg-white border-sky-400 shadow-xl ring-2 ring-sky-300/40 translate-x-1'
                      : 'bg-white/60 border-sky-100 hover:bg-white hover:border-sky-200 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="rounded-md bg-sky-100 px-2 py-0.5 text-[11px] font-bold text-sky-800">
                      {video.category}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-slate-500 font-semibold">
                      <Clock className="w-3.5 h-3.5 text-sky-600" />
                      <span>{video.duration}</span>
                    </div>
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{video.title}</h3>
                  <p className="mt-1 text-xs text-slate-600 line-clamp-2">{video.subtitle}</p>
                </div>
              ))}
            </div>

            {/* Right Column: Main Player Box */}
            <div className="lg:col-span-8">
              <div className="glass-panel-light rounded-3xl p-6 border border-sky-200 shadow-2xl">
                {/* Responsive Video Container */}
                <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-slate-950 shadow-md group">
                  {/* Gradient Background Poster */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${VIDEO_DEMOS[activeVideoTab].thumbnailColor} opacity-90 flex flex-col justify-between p-6 sm:p-8 text-white`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-md px-3 py-1 text-xs font-bold text-white border border-white/30">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Interactive Demo Video</span>
                      </div>
                      <span className="text-xs font-semibold bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm">
                        HD 1080p
                      </span>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-xl sm:text-3xl font-black leading-tight text-white">
                        {VIDEO_DEMOS[activeVideoTab].title}
                      </h3>
                      <p className="text-xs sm:text-sm text-sky-100 max-w-xl">
                        {VIDEO_DEMOS[activeVideoTab].subtitle}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-xs text-sky-100 font-semibold pt-2">
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        <span>{VIDEO_DEMOS[activeVideoTab].views}</span>
                      </div>
                      <span>Click Play to watch short demo</span>
                    </div>
                  </div>

                  {/* Pulsing Play Button Overlay */}
                  <button
                    onClick={() => setSelectedModalVideo(VIDEO_DEMOS[activeVideoTab])}
                    className="absolute inset-0 flex items-center justify-center bg-slate-950/20 group-hover:bg-slate-950/30 transition cursor-pointer"
                  >
                    <div className="relative flex items-center justify-center">
                      <div className="absolute w-20 h-20 rounded-full bg-white/40 animate-ping" />
                      <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-white text-sky-600 shadow-2xl transition group-hover:scale-110">
                        <Play className="w-7 h-7 fill-sky-600 ml-1" />
                      </div>
                    </div>
                  </button>
                </div>

                {/* Key Takeaways Bullets below Video */}
                <div className="mt-6 pt-4 border-t border-sky-100 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-700">
                    <span className="text-sky-700 font-bold">In this short video:</span>
                    {VIDEO_DEMOS[activeVideoTab].bullets.map((bullet, i) => (
                      <div key={i} className="flex items-center gap-1.5 bg-sky-50 px-3 py-1 rounded-lg border border-sky-100">
                        <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />
                        <span>{bullet}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => setSelectedModalVideo(VIDEO_DEMOS[activeVideoTab])}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-700 hover:text-sky-900 transition"
                  >
                    <span>Expand Video Lightbox</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES GRID SECTION */}
        <section id="features" className="mb-28">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white px-4 py-1.5 text-xs font-bold text-sky-700 mb-3 shadow-xs">
              <Layers className="w-4 h-4 text-sky-600" />
              <span>CORE CAPABILITIES</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900">
              Built For Modern <span className="text-sky-600">AI Engineers</span>
            </h2>
            <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
              Everything you need to formulate airtight prompts, enforce technical standards, and ship features without bug loops.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feat) => {
              const IconComp = feat.icon;
              return (
                <article
                  key={feat.title}
                  className="glass-panel-light rounded-3xl p-7 border border-sky-100/90 glass-card-hover relative flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-500 text-white shadow-md shadow-sky-400/30">
                        <IconComp className="w-6 h-6" />
                      </div>
                      <span className="rounded-full bg-sky-100/80 px-3 py-1 text-[11px] font-bold text-sky-800 border border-sky-200/60">
                        {feat.badge}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900">{feat.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{feat.description}</p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-sky-100/80 flex items-center justify-between text-xs font-bold text-sky-700">
                    <span>{feat.highlight}</span>
                    <ChevronRight className="w-4 h-4 text-sky-500" />
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* HOW IT WORKS WORKFLOW */}
        <section id="how-it-works" className="mb-28">
          <div className="glass-panel-light rounded-3xl p-8 sm:p-12 border border-sky-200/90 shadow-2xl">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-extrabold uppercase tracking-widest text-sky-700">Simple 4-Step Workflow</span>
              <h2 className="mt-2 text-3xl sm:text-4xl font-black text-slate-900">
                From Idea To Production In Minutes
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-4 relative">
              {STEPS.map((step) => {
                const IconComp = step.icon;
                return (
                  <div
                    key={step.step}
                    className="relative rounded-2xl bg-white p-6 border border-sky-100 shadow-sm flex flex-col justify-between hover:border-sky-300 transition"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-100 text-sm font-black text-sky-700">
                          {step.step}
                        </span>
                        <IconComp className="w-5 h-5 text-sky-500" />
                      </div>
                      <h4 className="text-base font-bold text-slate-900">{step.title}</h4>
                      <p className="mt-2 text-xs leading-relaxed text-slate-600">{step.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* TESTIMONIALS SECTION */}
        <section id="testimonials" className="mb-28">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white px-4 py-1.5 text-xs font-bold text-sky-700 mb-3 shadow-xs">
              <MessageSquareQuote className="w-4 h-4 text-sky-600" />
              <span>COMMUNITY FEEDBACK</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900">
              Loved By <span className="text-sky-600">Engineers & Founders</span>
            </h2>
            <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
              Discover how software teams build better AI prompts and ship applications in record time.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {TESTIMONIALS.map((testimonial) => (
              <div
                key={testimonial.name}
                className="glass-panel-light rounded-3xl p-7 border border-sky-100 glass-card-hover flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex text-amber-400 gap-0.5">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400" />
                      ))}
                    </div>
                    <span className="rounded-full bg-sky-100 px-3 py-0.5 text-[10px] font-bold text-sky-800">
                      {testimonial.tag}
                    </span>
                  </div>

                  <p className="text-sm italic leading-relaxed text-slate-700">&quot;{testimonial.quote}&quot;</p>
                </div>

                <div className="mt-6 pt-4 border-t border-sky-100 flex items-center gap-3">
                  <div className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-sky-300">
                    {/* Fallback avatar visual */}
                    <div className="flex h-full w-full items-center justify-center bg-sky-200 text-sky-800 font-bold text-sm">
                      {testimonial.name[0]}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{testimonial.name}</p>
                    <p className="text-xs text-slate-500">
                      {testimonial.role} • <span className="text-sky-700 font-semibold">{testimonial.company}</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FREQUENTLY ASKED QUESTIONS */}
        <section id="faq" className="mb-28 max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900">Frequently Asked Questions</h2>
            <p className="mt-2 text-sm text-slate-600">Everything you need to know about Prompt Mastery</p>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => (
              <div
                key={faq.question}
                className="glass-panel-light rounded-2xl border border-sky-100 overflow-hidden transition"
              >
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-5 text-left font-bold text-slate-900 hover:text-sky-600 transition cursor-pointer"
                >
                  <span className="text-base">{faq.question}</span>
                  {openFaqIndex === idx ? (
                    <ChevronUp className="w-5 h-5 text-sky-600 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
                  )}
                </button>

                {openFaqIndex === idx && (
                  <div className="px-5 pb-5 text-sm leading-relaxed text-slate-600 border-t border-sky-100/60 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* HERO CALL TO ACTION BANNER */}
        <section className="mb-24">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-sky-600 via-sky-500 to-cyan-500 p-8 sm:p-14 text-white shadow-2xl text-center">
            {/* Background glowing circles */}
            <div className="pointer-events-none absolute -top-24 -left-24 w-72 h-72 rounded-full bg-white/20 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-cyan-300/30 blur-2xl" />

            <div className="relative z-10 max-w-3xl mx-auto">
              <span className="inline-block rounded-full bg-white/20 backdrop-blur-md px-4 py-1 text-xs font-extrabold uppercase tracking-widest text-white mb-4 border border-white/30">
                Ready To Ship Code Faster?
              </span>
              <h2 className="text-3xl sm:text-5xl font-black leading-tight">
                Master Your AI Workflows Today
              </h2>
              <p className="mt-4 text-base sm:text-lg text-sky-100">
                Start generating high-precision prompt specifications in less than 2 minutes. Free forever to test.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
                <Link
                  href="/builder"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-8 py-4 text-base font-bold text-sky-700 shadow-xl transition hover:bg-sky-50 hover:scale-105"
                >
                  <Sparkles className="w-5 h-5 text-sky-600" />
                  <span>Launch Builder Now</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* VIDEO MODAL LIGHTBOX */}
      {selectedModalVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 sm:p-6 animate-fadeIn">
          <div className="relative w-full max-w-4xl rounded-3xl bg-slate-900 p-4 border border-slate-800 shadow-2xl">
            <div className="flex items-center justify-between pb-3 px-2">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Video className="w-4 h-4 text-sky-400" />
                <span>{selectedModalVideo.title}</span>
              </div>
              <button
                onClick={() => setSelectedModalVideo(null)}
                className="rounded-full bg-slate-800 p-2 text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black">
              <iframe
                src={selectedModalVideo.videoUrl}
                title={selectedModalVideo.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

      {/* COMPREHENSIVE PREMIUM FOOTER */}
      <footer className="relative z-10 border-t border-sky-200/80 bg-white pt-16 pb-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-200/80">
            {/* Column 1: Brand & Status */}
            <div className="lg:col-span-2 space-y-4">
              <Link href="/" className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-600 text-white font-bold">
                  <Sparkles className="w-5 h-5" />
                </div>
                <span className="text-xl font-black text-slate-900">
                  Prompt<span className="text-sky-600">Mastery</span>
                </span>
              </Link>
              <p className="text-sm text-slate-600 max-w-sm leading-relaxed">
                The premier prompt engineering platform for software teams. Generate high-precision, hallucination-free AI specs for Cursor, Claude, and ChatGPT.
              </p>
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 border border-emerald-200 text-xs font-semibold text-emerald-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>All Systems Operational • 99.9% Uptime</span>
              </div>
            </div>

            {/* Column 2: Product Links */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">Product</p>
              <ul className="space-y-2.5 text-sm text-slate-600 font-medium">
                <li>
                  <Link href="/builder" className="hover:text-sky-600 transition">
                    Prompt Builder
                  </Link>
                </li>
                <li>
                  <a href="#video-demos" className="hover:text-sky-600 transition">
                    Video Walkthroughs
                  </a>
                </li>
                <li>
                  <a href="#features" className="hover:text-sky-600 transition">
                    Architecture Rules
                  </a>
                </li>
                <li>
                  <a href="#demo-preview" className="hover:text-sky-600 transition">
                    Spec Templates
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3: Resources */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">Resources</p>
              <ul className="space-y-2.5 text-sm text-slate-600 font-medium">
                <li>
                  <a href="#how-it-works" className="hover:text-sky-600 transition">
                    Prompt Engineering Guide
                  </a>
                </li>
                <li>
                  <a href="#testimonials" className="hover:text-sky-600 transition">
                    Developer Reviews
                  </a>
                </li>
                <li>
                  <a href="#faq" className="hover:text-sky-600 transition">
                    FAQ & Documentation
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 4: Newsletter */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">Stay Updated</p>
              <p className="text-xs text-slate-600 mb-3">Get the latest AI prompt patterns delivered to your inbox.</p>
              {newsletterSubscribed ? (
                <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs font-bold text-emerald-700 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Subscribed! Thank you.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-2">
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      placeholder="Enter your work email"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-2 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:bg-white focus:outline-none transition"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-sky-600 px-4 py-2 text-xs font-bold text-white hover:bg-sky-500 transition cursor-pointer shadow-xs"
                  >
                    <span>Subscribe</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Footer Bottom Bar */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-slate-500">
            <p>© {new Date().getFullYear()} Prompt Mastery Inc. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-sky-600 transition">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-sky-600 transition">
                Terms of Service
              </a>
              <a href="#" className="hover:text-sky-600 transition">
                Security Policy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
