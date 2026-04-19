'use client';

import Link from 'next/link';

const FEATURES = [
  {
    title: 'Guided Discovery',
    description: 'Progressive, focused questions capture exactly what your project needs.',
    icon: '🎯',
  },
  {
    title: 'Production-Ready Prompts',
    description: 'Generate structured prompts you can paste into your favorite AI assistant immediately.',
    icon: '⚡',
  },
  {
    title: 'Actionable Recommendations',
    description: 'Get categorized suggestions for architecture, quality, and launch readiness.',
    icon: '💡',
  },
];

const STEPS = [
  { title: 'Answer', description: 'Tell us what you are building and your technical preferences.' },
  { title: 'Review', description: 'Quickly validate your choices before generation.' },
  { title: 'Generate', description: 'Receive a complete prompt plus targeted recommendations.' },
  { title: 'Ship', description: 'Copy, paste, and start building faster with less guesswork.' },
];

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(56,189,248,0.16),transparent_38%),radial-gradient(circle_at_80%_20%,rgba(14,165,233,0.12),transparent_35%),radial-gradient(circle_at_40%_85%,rgba(16,185,129,0.08),transparent_42%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.09] [background:linear-gradient(to_right,transparent_0,transparent_23px,rgba(148,163,184,0.26)_24px),linear-gradient(to_bottom,transparent_0,transparent_23px,rgba(148,163,184,0.22)_24px)] [background-size:24px_24px]" />

      <div className="relative mx-auto flex w-full max-w-6xl flex-col px-6 pb-16 pt-8 md:px-10">
        <header className="mb-14 flex items-center justify-between">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-400/10 px-4 py-2 text-sm font-semibold text-sky-200">
            <span>✨</span>
            <span>Prompt Mastery</span>
          </div>
          <Link
            href="/builder"
            className="rounded-full border border-slate-700 bg-slate-900/70 px-5 py-2 text-sm font-semibold text-slate-100 transition hover:border-sky-400/60 hover:text-sky-200"
          >
            Launch Builder
          </Link>
        </header>

        <section className="mb-16 grid items-end gap-8 md:grid-cols-[1.15fr_0.85fr]">
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-sky-300/85">AI Prompt Engineering</p>
            <h1 className="max-w-2xl text-4xl font-black leading-tight text-white sm:text-5xl md:text-6xl">
              Turn Rough Ideas Into
              <span className="block bg-gradient-to-r from-sky-300 via-cyan-300 to-emerald-300 bg-clip-text text-transparent">
                Build-Ready Prompts
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
              Go from blank page to clear execution plan. Answer a guided set of questions and generate a high-signal prompt
              that helps AI tools produce better architecture, cleaner code, and faster iteration.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/builder"
                className="inline-flex items-center justify-center rounded-xl bg-sky-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-sky-400"
              >
                Start Building Prompt
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center rounded-xl border border-slate-700 bg-slate-900/60 px-6 py-3 font-semibold text-slate-100 transition hover:border-slate-500"
              >
                See How It Works
              </a>
            </div>
          </div>

          <aside className="rounded-2xl border border-slate-800 bg-slate-900/65 p-6 backdrop-blur-sm">
            <p className="text-sm font-semibold text-sky-200">Why teams use this</p>
            <ul className="mt-4 space-y-4 text-sm text-slate-300">
              <li className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
                Faster alignment between product idea and engineering implementation.
              </li>
              <li className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
                Better prompt quality with fewer ambiguous, low-value AI responses.
              </li>
              <li className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
                Actionable recommendations to improve security, scale, and launch readiness.
              </li>
            </ul>
          </aside>
        </section>

        <section className="mb-16 grid gap-4 md:grid-cols-3">
          {FEATURES.map((feature) => (
            <article key={feature.title} className="group rounded-2xl border border-slate-800 bg-slate-900/60 p-6 transition hover:border-sky-500/50">
              <p className="text-2xl">{feature.icon}</p>
              <h2 className="mt-3 text-xl font-bold text-white">{feature.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">{feature.description}</p>
            </article>
          ))}
        </section>

        <section id="how-it-works" className="rounded-2xl border border-slate-800 bg-slate-900/55 p-6 md:p-8">
          <h3 className="text-2xl font-bold text-white md:text-3xl">How It Works</h3>
          <div className="mt-6 grid gap-4 md:grid-cols-4">
            {STEPS.map((step, index) => (
              <div key={step.title} className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                <p className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-sky-500/20 text-sm font-bold text-sky-200">
                  {index + 1}
                </p>
                <h4 className="mt-3 text-base font-semibold text-white">{step.title}</h4>
                <p className="mt-1 text-sm text-slate-300">{step.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
