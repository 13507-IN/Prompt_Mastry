'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

interface Recommendation {
  category: string;
  title: string;
  description: string;
  priority: string;
  reason: string;
}

interface RecommendationWithKey extends Recommendation {
  key: string;
}

export default function ResultsPage() {
  const params = useParams();
  const projectId = params.id as string;
  const isPreviewMode = projectId === 'preview';

  const [prompt, setPrompt] = useState('');
  const [basePrompt, setBasePrompt] = useState('');
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [selectedRecommendations, setSelectedRecommendations] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [promptEnhanced, setPromptEnhanced] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      if (isPreviewMode) {
        try {
          const cachedPreview = sessionStorage.getItem('prompt_mastery_preview');
          if (cachedPreview) {
            const parsed = JSON.parse(cachedPreview);
            const loadedPrompt = parsed.prompt || '';
            const loadedRecommendations = Array.isArray(parsed.recommendations) ? parsed.recommendations : [];
            setPrompt(loadedPrompt);
            setBasePrompt(loadedPrompt);
            setRecommendations(loadedRecommendations);
          }
        } catch (error) {
          console.error('Failed to load preview result:', error);
        } finally {
          setLoading(false);
        }
        return;
      }

      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const response = await fetch(`${apiUrl}/api/generate/${projectId}`);
        const data = await response.json();
        const loadedPrompt = data.prompt || '';
        const loadedRecommendations = Array.isArray(data.recommendations) ? data.recommendations : [];
        setPrompt(loadedPrompt);
        setBasePrompt(loadedPrompt);
        setRecommendations(loadedRecommendations);
      } catch (error) {
        console.error('Failed to fetch results:', error);
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchResults();
    }
  }, [projectId, isPreviewMode]);

  const flattenedRecommendations = useMemo<RecommendationWithKey[]>(
    () =>
      recommendations.map((rec, index) => ({
        ...rec,
        key: `${rec.category}-${rec.title}-${index}`,
      })),
    [recommendations]
  );

  const groupedRecommendations = useMemo(() => {
    const grouped: Record<string, RecommendationWithKey[]> = {};
    for (const rec of flattenedRecommendations) {
      if (!grouped[rec.category]) grouped[rec.category] = [];
      grouped[rec.category].push(rec);
    }
    return grouped;
  }, [flattenedRecommendations]);

  const selectedRecommendationList = useMemo(
    () => flattenedRecommendations.filter((rec) => selectedRecommendations[rec.key]),
    [flattenedRecommendations, selectedRecommendations]
  );

  const toggleRecommendation = (key: string) => {
    setSelectedRecommendations((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (error) {
      console.error('Failed to copy prompt:', error);
    }
  };

  const updatePromptWithRecommendations = () => {
    if (!selectedRecommendationList.length) return;

    const recommendationBlockLines = selectedRecommendationList.map(
      (rec) =>
        `- [${rec.category}] (${rec.priority.toUpperCase()}) ${rec.title}: ${rec.description}. Why: ${rec.reason}`
    );

    const enhancementBlock = [
      '## Additional Implementation Requirements',
      'Please revise your output to include these recommendations:',
      ...recommendationBlockLines,
      '',
      'When applying these, keep the existing project requirements and improve the architecture, quality, and delivery plan.',
    ].join('\n');

    setPrompt(`${basePrompt}\n\n${enhancementBlock}`);
    setPromptEnhanced(true);
  };

  const resetPrompt = () => {
    setPrompt(basePrompt);
    setPromptEnhanced(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-200">
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 px-6 py-4">Loading your generated prompt...</div>
      </div>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-8 text-slate-100 sm:px-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_10%,rgba(56,189,248,0.16),transparent_38%),radial-gradient(circle_at_86%_18%,rgba(14,165,233,0.10),transparent_32%)]" />

      <div className="relative mx-auto w-full max-w-5xl">
        <header className="mb-8">
          <Link href="/" className="mb-3 inline-flex items-center gap-2 text-sm text-sky-300 transition hover:text-sky-200">
            <span>←</span>
            <span>Back to Home</span>
          </Link>
          <h1 className="text-3xl font-black text-white md:text-4xl">Your Prompt Is Ready</h1>
          <p className="mt-2 text-slate-300">Use this in any AI tool. You can also merge selected recommendations into the prompt.</p>
          {isPreviewMode && (
            <p className="mt-3 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">
              Preview mode: generation worked, but database storage was not available.
            </p>
          )}
        </header>

        <section className="mb-7 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 sm:p-7">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-2xl font-bold text-white">Generated Prompt</h2>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={copyToClipboard}
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                  copied ? 'bg-emerald-500 text-slate-950' : 'bg-sky-500 text-slate-950 hover:bg-sky-400'
                }`}
              >
                {copied ? 'Copied' : 'Copy Prompt'}
              </button>
              <button
                type="button"
                onClick={updatePromptWithRecommendations}
                disabled={!selectedRecommendationList.length}
                className="rounded-lg bg-violet-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Update with Selected Recommendations
              </button>
              <button
                type="button"
                onClick={resetPrompt}
                disabled={!promptEnhanced}
                className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-slate-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Reset Prompt
              </button>
            </div>
          </div>

          <pre className="max-h-[420px] overflow-y-auto rounded-xl border border-slate-800 bg-slate-950/70 p-4 font-mono text-sm leading-relaxed text-slate-200 whitespace-pre-wrap">
            {prompt || 'No prompt available. Please return to the builder and generate again.'}
          </pre>

          <div className="mt-3 text-xs text-slate-400">
            {selectedRecommendationList.length} recommendation(s) selected.
            {promptEnhanced ? ' Prompt has been enhanced with selected recommendations.' : ' Select recommendations below to enhance the prompt.'}
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-4">
            <ExternalButton href="https://chat.openai.com" label="Open ChatGPT" />
            <ExternalButton href="https://claude.ai" label="Open Claude" />
            <ExternalButton href="https://gemini.google.com" label="Open Gemini" />
            <ExternalButton href="https://poe.com" label="Use Any AI" />
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 sm:p-7">
          <h3 className="text-2xl font-bold text-white">Recommendations</h3>
          <p className="mt-1 text-sm text-slate-300">Select recommendations to include directly in the prompt update.</p>

          {Object.keys(groupedRecommendations).length === 0 ? (
            <p className="mt-6 rounded-xl border border-slate-800 bg-slate-950/60 p-4 text-sm text-slate-300">
              No recommendations available for this result.
            </p>
          ) : (
            <div className="mt-6 space-y-6">
              {Object.entries(groupedRecommendations).map(([category, recs]) => (
                <div key={category}>
                  <h4 className="mb-3 text-lg font-semibold text-sky-200">{category}</h4>
                  <div className="grid gap-3">
                    {recs.map((rec) => (
                      <article key={rec.key} className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                        <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                          <label className="flex cursor-pointer items-start gap-2">
                            <input
                              type="checkbox"
                              checked={!!selectedRecommendations[rec.key]}
                              onChange={() => toggleRecommendation(rec.key)}
                              className="mt-1 h-4 w-4 rounded border-slate-600 bg-slate-900 text-sky-400"
                            />
                            <span className="font-semibold text-white">{rec.title}</span>
                          </label>
                          <PriorityBadge priority={rec.priority} />
                        </div>
                        <p className="text-sm text-slate-300">{rec.description}</p>
                        <p className="mt-2 text-xs text-slate-400">Why it matters: {rec.reason}</p>
                      </article>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <footer className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/builder"
            className="rounded-lg bg-sky-500 px-6 py-2.5 text-center text-sm font-semibold text-slate-950 transition hover:bg-sky-400"
          >
            Create Another Prompt
          </Link>
          <Link
            href="/"
            className="rounded-lg border border-slate-700 bg-slate-900 px-6 py-2.5 text-center text-sm font-semibold text-slate-100 transition hover:border-slate-500"
          >
            Back Home
          </Link>
        </footer>
      </div>
    </main>
  );
}

function ExternalButton({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-center text-sm font-semibold text-slate-200 transition hover:border-slate-500"
    >
      {label}
    </a>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  const normalized = priority.toLowerCase();
  const classes =
    normalized === 'high'
      ? 'border-red-400/40 bg-red-500/15 text-red-200'
      : normalized === 'medium'
      ? 'border-amber-400/40 bg-amber-500/15 text-amber-200'
      : 'border-sky-400/40 bg-sky-500/15 text-sky-200';

  return (
    <span className={`rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${classes}`}>
      {priority}
    </span>
  );
}
