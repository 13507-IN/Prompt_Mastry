'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type PrimitiveOptionValue = string | number | boolean;

interface FormData {
  projectType?: string;
  useAI?: boolean;
  projectName?: string;
  colorPalette?: string;
  navbarPosition?: string;
  pageCount?: number;
  framework?: string;
  uiLibrary?: string;
  dbProvider?: string;
  ormChoice?: string;
  authRequired?: boolean;
  apiType?: string;
  runtime?: string;
  deploymentPlatform?: string;
  additionalFeatures?: string[];
}

interface Question {
  id: keyof FormData | string;
  question: string;
  type: 'mcq' | 'text' | 'multi-select' | string;
  options?: Array<{ value: PrimitiveOptionValue; label: string }>;
  placeholder?: string;
}

const STEPS = ['Basics', 'Frontend', 'Backend', 'Additional', 'Review'] as const;

export default function BuilderPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({});
  const [questions, setQuestions] = useState<Record<string, Question[]>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const response = await fetch(`${apiUrl}/api/questions`);
        const data = await response.json();
        setQuestions(data);
      } catch (error) {
        console.error('Failed to fetch questions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  // Auto-scroll to top when step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  const currentQuestions = useMemo(() => {
    const stepMap: Record<number, string> = {
      0: 'basics',
      1: 'frontend',
      2: 'backend',
      3: 'additional',
      4: 'basics',
    };
    return questions[stepMap[step]] || [];
  }, [questions, step]);

  const handleAnswer = (questionId: string, value: PrimitiveOptionValue) => {
    setFormData((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleMultiSelect = (questionId: string, value: string) => {
    setFormData((prev) => {
      const current = (prev[questionId as keyof FormData] as string[]) || [];
      return {
        ...prev,
        [questionId]: current.includes(value) ? current.filter((item) => item !== value) : [...current, value],
      };
    });
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

      const createResponse = await fetch(`${apiUrl}/api/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.projectName || 'New Project',
          projectType: formData.projectType,
          useAI: formData.useAI,
        }),
      });

      if (createResponse.ok) {
        const project = await createResponse.json();
        const generateAndSaveResponse = await fetch(`${apiUrl}/api/generate/save`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            projectId: project.id,
            ...formData,
          }),
        });

        if (generateAndSaveResponse.ok) {
          router.push(`/results/${project.id}`);
          return;
        }

        const saveError = await generateAndSaveResponse.json().catch(() => ({}));
        console.warn('Generate/save failed, falling back to preview mode:', saveError);
      } else {
        const createError = await createResponse.json().catch(() => ({}));
        console.warn('Project create failed, falling back to preview mode:', createError);
      }

      const previewResponse = await fetch(`${apiUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!previewResponse.ok) {
        const previewError = await previewResponse.json().catch(() => ({}));
        throw new Error(previewError.error || 'Failed to generate prompt.');
      }

      const previewData = await previewResponse.json();
      sessionStorage.setItem(
        'prompt_mastery_preview',
        JSON.stringify({
          prompt: previewData.prompt || '',
          recommendations: previewData.recommendations || [],
          createdAt: Date.now(),
        })
      );

      router.push('/results/preview');
    } catch (error) {
      console.error('Failed to generate prompt:', error);
      alert(error instanceof Error ? error.message : 'Failed to generate prompt. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 px-6 py-4 text-slate-200">Loading questions...</div>
      </div>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-8 text-slate-100 sm:px-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(56,189,248,0.16),transparent_38%),radial-gradient(circle_at_85%_15%,rgba(14,165,233,0.10),transparent_32%)]" />

      <div className="relative mx-auto w-full max-w-5xl">
        <header className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <Link href="/" className="mb-3 inline-flex items-center gap-2 text-sm text-sky-300 transition hover:text-sky-200">
              <span>←</span>
              <span>Back to Home</span>
            </Link>
            <h1 className="text-3xl font-black text-white md:text-4xl">Prompt Builder</h1>
            <p className="mt-1 text-slate-300">Step {step + 1} of {STEPS.length}</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/65 px-4 py-3 text-sm text-slate-300">
            Complete all sections to generate the most accurate prompt.
          </div>
        </header>

        <section className="mb-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="grid gap-3 sm:grid-cols-5">
            {STEPS.map((label, index) => {
              const isDone = index < step;
              const isCurrent = index === step;
              return (
                <div key={label} className="space-y-2">
                  <div
                    className={`h-2 rounded-full transition ${
                      isCurrent ? 'bg-sky-400' : isDone ? 'bg-emerald-400' : 'bg-slate-800'
                    }`}
                  />
                  <p className={`text-xs font-semibold ${isCurrent ? 'text-sky-200' : isDone ? 'text-emerald-200' : 'text-slate-400'}`}>
                    {label}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 sm:p-7">
          {step === STEPS.length - 1 ? (
            <ReviewStep formData={formData} />
          ) : (
            <>
              <h2 className="mb-6 text-2xl font-bold text-white">{STEPS[step]}</h2>
              <div className="space-y-6">
                {currentQuestions.map((question) => (
                  <div key={question.id} className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                    <label className="mb-3 block text-sm font-semibold text-slate-200">{question.question}</label>

                    {question.type === 'mcq' && (
                      <div className="grid gap-2">
                        {question.options?.map((option) => {
                          const isSelected = formData[question.id as keyof FormData] === option.value;
                          return (
                            <button
                              key={String(option.value)}
                              type="button"
                              onClick={() => handleAnswer(String(question.id), option.value)}
                              className={`rounded-lg border px-4 py-3 text-left text-sm transition ${
                                isSelected
                                  ? 'border-sky-400 bg-sky-500/15 text-sky-100'
                                  : 'border-slate-700 bg-slate-900 text-slate-200 hover:border-slate-500'
                              }`}
                            >
                              {option.label}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {question.type === 'text' && (
                      <input
                        type="text"
                        placeholder={question.placeholder}
                        value={(formData[question.id as keyof FormData] as string) || ''}
                        onChange={(event) => handleAnswer(String(question.id), event.target.value)}
                        className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-sky-400 focus:outline-none"
                      />
                    )}

                    {question.type === 'multi-select' && (
                      <div className="grid gap-2">
                        {question.options?.map((option) => {
                          const selectedItems = (formData[question.id as keyof FormData] as string[]) || [];
                          const isSelected = selectedItems.includes(String(option.value));
                          return (
                            <button
                              key={String(option.value)}
                              type="button"
                              onClick={() => handleMultiSelect(String(question.id), String(option.value))}
                              className={`rounded-lg border px-4 py-3 text-left text-sm transition ${
                                isSelected
                                  ? 'border-emerald-400 bg-emerald-500/15 text-emerald-100'
                                  : 'border-slate-700 bg-slate-900 text-slate-200 hover:border-slate-500'
                              }`}
                            >
                              {isSelected ? '✓ ' : ''}
                              {option.label}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="mt-8 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setStep((prev) => Math.max(0, prev - 1))}
              disabled={step === 0 || submitting}
              className="rounded-lg border border-slate-700 bg-slate-900 px-5 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-slate-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>

            {step < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={() => setStep((prev) => Math.min(STEPS.length - 1, prev + 1))}
                className="rounded-lg bg-sky-500 px-6 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-sky-400"
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="rounded-lg bg-emerald-500 px-6 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? 'Generating...' : 'Generate Prompt'}
              </button>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function ReviewStep({ formData }: { formData: FormData }) {
  const items = [
    ['Project Type', formData.projectType],
    ['AI Usage', formData.useAI === undefined ? undefined : formData.useAI ? 'Yes' : 'No'],
    ['Project Name', formData.projectName],
    ['Color Palette', formData.colorPalette],
    ['Navbar Position', formData.navbarPosition],
    ['Page Count', formData.pageCount?.toString()],
    ['Framework', formData.framework],
    ['UI Library', formData.uiLibrary],
    ['Database', formData.dbProvider],
    ['ORM', formData.ormChoice],
    ['Authentication', formData.authRequired === undefined ? undefined : formData.authRequired ? 'Yes' : 'No'],
    ['API Type', formData.apiType],
    ['Runtime', formData.runtime],
    ['Deployment', formData.deploymentPlatform],
    ['Additional Features', formData.additionalFeatures?.join(', ')],
  ] as const;

  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold text-white">Review Your Inputs</h2>
      <div className="grid gap-3">
        {items
          .filter(([, value]) => value && String(value).trim().length > 0)
          .map(([label, value]) => (
            <div key={label} className="flex flex-col gap-1 rounded-xl border border-slate-800 bg-slate-950/60 p-4 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-sm font-semibold text-slate-300">{label}</span>
              <span className="text-sm text-white">{value}</span>
            </div>
          ))}
      </div>
    </div>
  );
}
