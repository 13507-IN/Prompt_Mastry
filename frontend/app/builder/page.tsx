'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import type {
  FormData,
  ApiEnvelope,
  Question,
  QuestionsApiResponse,
  RequiredByStep,
  PrimitiveOptionValue,
} from '@contract/contractTypes';

const STEPS = ['Basics', 'Frontend', 'Backend', 'Additional', 'Review'] as const;
const DRAFT_KEY = 'prompt_mastery_builder_draft_v2';

function isFilled(value: unknown): boolean {
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'string') return value.trim().length > 0;
  return value !== undefined && value !== null;
}

function shouldShowQuestion(question: Question, formData: FormData): boolean {
  if (!question.showWhen) return true;
  const parentValue = formData[question.showWhen.field as keyof FormData];
  if (parentValue === undefined || parentValue === null) return false;
  if (!question.showWhen.values || question.showWhen.values.length === 0) return true;
  return question.showWhen.values.includes(parentValue as PrimitiveOptionValue);
}

export default function BuilderPage() {
  const router = useRouter();
  const { isAuthenticated, loading: loadingAuth, authClient, login } = useAuth();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({ generationMode: 'balanced' });
  const [questions, setQuestions] = useState<Record<string, Question[]>>({});
  const [requiredByStep, setRequiredByStep] = useState<RequiredByStep>({ basics: [], frontend: [], backend: [], additional: [] });
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [resumeAvailable, setResumeAvailable] = useState(() => {
    if (typeof window === 'undefined') return false;
    return Boolean(window.sessionStorage.getItem(DRAFT_KEY));
  });
  const [stepErrors, setStepErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string>('');

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://prompt-mastry.vercel.app/_/backend';
        const response = await fetch(`${apiUrl}/api/questions`);
        const payload = (await response.json()) as ApiEnvelope<QuestionsApiResponse>;

        if (!response.ok || !payload.success || !payload.data) {
          throw new Error(payload.error?.message || 'Failed to load questions');
        }

        setQuestions(payload.data.questions || {});
        setRequiredByStep(payload.data.contract?.requiredByStep || {});
      } catch (error) {
        console.error('Failed to fetch questions:', error);
        setSubmitError(error instanceof Error ? error.message : 'Failed to load questions');
      } finally {
        setLoadingQuestions(false);
      }
    };

    fetchQuestions();
  }, []);

  useEffect(() => {
    if (loadingQuestions) return;
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ step, formData }));
  }, [formData, step, loadingQuestions]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  const stepMap = useMemo(
    () =>
      ({
        0: 'basics',
        1: 'frontend',
        2: 'backend',
        3: 'additional',
      }) as Record<number, string>,
    []
  );

  const currentQuestions = useMemo(() => {
    if (step === STEPS.length - 1) return [];
    const list = questions[stepMap[step]] || [];
    return list.filter((question) => shouldShowQuestion(question, formData));
  }, [questions, step, stepMap, formData]);

  const missingFieldsInCurrentStep = useMemo(() => {
    return currentQuestions
      .filter((question) => question.required)
      .filter((question) => !isFilled(formData[question.id as keyof FormData]))
      .map((question) => question.id);
  }, [currentQuestions, formData]);

  const allRequiredMissing = useMemo(() => {
    const requiredList = new Set<string>();
    Object.values(requiredByStep).forEach((list: string[]) => list.forEach((item: string) => requiredList.add(item)));

    return Array.from(requiredList).filter((field) => !isFilled(formData[field as keyof FormData]));
  }, [formData, requiredByStep]);

  const handleResumeDraft = () => {
    try {
      const raw = sessionStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed?.formData) setFormData(parsed.formData);
      if (typeof parsed?.step === 'number') setStep(parsed.step);
      setResumeAvailable(false);
    } catch (error) {
      console.error('Failed to restore draft:', error);
    }
  };

  const handleDiscardDraft = () => {
    sessionStorage.removeItem(DRAFT_KEY);
    setResumeAvailable(false);
  };

  const handleAnswer = (questionId: string, value: PrimitiveOptionValue) => {
    setStepErrors((prev) => ({ ...prev, [questionId]: '' }));
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

  const goNext = () => {
    if (missingFieldsInCurrentStep.length > 0) {
      const nextErrors: Record<string, string> = {};
      missingFieldsInCurrentStep.forEach((id) => {
        nextErrors[id] = 'This field is required.';
      });
      setStepErrors((prev) => ({ ...prev, ...nextErrors }));
      return;
    }

    setStep((prev) => Math.min(STEPS.length - 1, prev + 1));
  };

  const fetchApi = async <T,>(url: string, init: RequestInit): Promise<ApiEnvelope<T>> => {
    const headers = {
      ...init.headers,
    } as Record<string, string>;

    if (authClient?.tokens?.accessToken) {
      headers['Authorization'] = `Bearer ${authClient.tokens.accessToken}`;
    }

    const response = await fetch(url, {
      ...init,
      headers,
    });
    const payload = (await response.json()) as ApiEnvelope<T>;
    if (!response.ok || !payload.success) {
      throw new Error(payload.error?.message || 'Request failed');
    }
    return payload;
  };

  const handleSubmit = async () => {
    setSubmitError('');

    if (allRequiredMissing.length > 0) {
      setSubmitError('Please complete all required fields before generating.');
      return;
    }

    try {
      setSubmitting(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://prompt-mastry.vercel.app/_/backend';

      const createPayload = await fetchApi<{ id: string }>(`${apiUrl}/api/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.projectName || 'New Project',
          projectType: formData.projectType,
          useAI: formData.useAI,
          projectName: formData.projectName,
        }),
      });

      const project = createPayload.data;
      if (!project?.id) {
        throw new Error('Project creation did not return a valid id.');
      }

      const savePayload = await fetchApi<{
        status: string;
        statusReason?: string;
        prompt: string;
        recommendations: unknown[];
      }>(`${apiUrl}/api/generate/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: project.id,
          ...formData,
        }),
      });

      const status = savePayload.data?.status;
      if (status === 'preview_only') {
        sessionStorage.setItem(
          'prompt_mastery_preview',
          JSON.stringify({
            prompt: savePayload.data?.prompt || '',
            recommendations: savePayload.data?.recommendations || [],
            sourceData: formData,
            createdAt: Date.now(),
            status: 'preview_only',
            statusReason: savePayload.data?.statusReason || 'database_unavailable',
          })
        );
        router.push('/results/preview');
      } else {
        router.push(`/results/${project.id}`);
      }

      sessionStorage.removeItem(DRAFT_KEY);
    } catch (error) {
      console.warn('Create/save flow failed, attempting preview generation.', error);

      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://prompt-mastry.vercel.app/_/backend';
        const previewPayload = await fetchApi<{
          prompt: string;
          recommendations: unknown[];
        }>(`${apiUrl}/api/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        sessionStorage.setItem(
          'prompt_mastery_preview',
          JSON.stringify({
            prompt: previewPayload.data?.prompt || '',
            recommendations: previewPayload.data?.recommendations || [],
            sourceData: formData,
            createdAt: Date.now(),
            status: 'preview_only',
            statusReason: 'project_save_failed',
          })
        );

        router.push('/results/preview');
        sessionStorage.removeItem(DRAFT_KEY);
      } catch (previewError) {
        setSubmitError(previewError instanceof Error ? previewError.message : 'Failed to generate prompt');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingAuth || (loadingQuestions && Object.keys(questions).length === 0)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 px-6 py-4 text-slate-200">
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-sky-400 border-t-transparent mr-2 align-middle"></span>
          Loading builder...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-8 text-slate-100 sm:px-6 flex items-center justify-center">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(56,189,248,0.16),transparent_38%),radial-gradient(circle_at_85%_15%,rgba(14,165,233,0.10),transparent_32%)]" />
        
        <div className="relative mx-auto w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/60 p-6 md:p-8 text-center backdrop-blur-sm shadow-xl">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-sky-500/10 text-xl text-sky-400 mb-4">
            🔒
          </div>
          <h1 className="text-2xl font-black text-white">Sign In Required</h1>
          <p className="mt-3 text-sm text-slate-300 leading-relaxed">
            Create an account or sign in to build high-signal prompts, save projects, and get customized AI architecture recommendations.
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <button
              onClick={login}
              className="w-full rounded-xl bg-sky-500 py-3 font-semibold text-slate-950 transition hover:bg-sky-400 cursor-pointer animate-pulse"
            >
              Sign In / Sign Up
            </button>
            <Link
              href="/"
              className="w-full rounded-xl border border-slate-700 bg-slate-900/60 py-3 font-semibold text-slate-300 transition hover:border-slate-500"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-8 text-slate-100 sm:px-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(56,189,248,0.16),transparent_38%),radial-gradient(circle_at_85%_15%,rgba(14,165,233,0.10),transparent_32%)]" />

      <div className="relative mx-auto w-full max-w-5xl">
        <header className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <Link href="/" className="mb-3 inline-flex items-center gap-2 text-sm text-sky-300 transition hover:text-sky-200">
              <span>&larr;</span>
              <span>Back to Home</span>
            </Link>
            <h1 className="text-3xl font-black text-white md:text-4xl">Prompt Builder</h1>
            <p className="mt-1 text-slate-300">Step {step + 1} of {STEPS.length}</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/65 px-4 py-3 text-sm text-slate-300">
            Complete required fields for a high-signal prompt.
          </div>
        </header>

        {resumeAvailable && (
          <section className="mb-6 rounded-xl border border-amber-400/30 bg-amber-500/10 p-4 text-sm text-amber-200">
            <p className="font-semibold">Saved draft found.</p>
            <p className="mt-1">You can resume where you left off or start fresh.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleResumeDraft}
                className="rounded-lg bg-amber-300 px-3 py-1.5 font-semibold text-slate-900 transition hover:bg-amber-200"
              >
                Resume Draft
              </button>
              <button
                type="button"
                onClick={handleDiscardDraft}
                className="rounded-lg border border-amber-300/50 px-3 py-1.5 font-semibold text-amber-100 transition hover:border-amber-200"
              >
                Discard Draft
              </button>
            </div>
          </section>
        )}

        <section className="mb-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="grid gap-3 sm:grid-cols-5">
            {STEPS.map((label, index) => {
              const isDone = index < step;
              const isCurrent = index === step;
              return (
                <div key={label} className="space-y-2">
                  <div className={`h-2 rounded-full transition ${isCurrent ? 'bg-sky-400' : isDone ? 'bg-emerald-400' : 'bg-slate-800'}`} />
                  <p className={`text-xs font-semibold ${isCurrent ? 'text-sky-200' : isDone ? 'text-emerald-200' : 'text-slate-400'}`}>{label}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 sm:p-7">
          {step === STEPS.length - 1 ? (
            <ReviewStep formData={formData} missingFields={allRequiredMissing} />
          ) : (
            <>
              <h2 className="mb-6 text-2xl font-bold text-white">{STEPS[step]}</h2>
              <div className="space-y-6">
                {currentQuestions.map((question) => (
                  <div key={question.id} className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                    <label className="mb-3 block text-sm font-semibold text-slate-200">
                      {question.question}
                      {question.required ? <span className="ml-1 text-rose-300">*</span> : null}
                    </label>

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

                    {stepErrors[String(question.id)] ? (
                      <p className="mt-2 text-xs text-rose-300">{stepErrors[String(question.id)]}</p>
                    ) : null}
                  </div>
                ))}
              </div>
            </>
          )}

          <section className="mt-6 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <h3 className="text-sm font-semibold text-slate-200">Prompt Mode</h3>
            <p className="mt-1 text-xs text-slate-400">Choose how detailed the generated implementation prompt should be.</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              {[
                { value: 'quick', label: 'Quick', desc: 'Fast and concise' },
                { value: 'balanced', label: 'Balanced', desc: 'Default depth' },
                { value: 'strict-spec', label: 'Strict Spec', desc: 'Most detailed' },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleAnswer('generationMode', option.value as PrimitiveOptionValue)}
                  className={`rounded-lg border px-3 py-2 text-left text-sm transition ${
                    formData.generationMode === option.value
                      ? 'border-violet-400 bg-violet-500/15 text-violet-100'
                      : 'border-slate-700 bg-slate-900 text-slate-200 hover:border-slate-500'
                  }`}
                >
                  <p className="font-semibold">{option.label}</p>
                  <p className="text-xs text-slate-400">{option.desc}</p>
                </button>
              ))}
            </div>
          </section>

          {submitError ? <p className="mt-4 text-sm text-rose-300">{submitError}</p> : null}

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
                onClick={goNext}
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

function ReviewStep({ formData, missingFields }: { formData: FormData; missingFields: string[] }) {
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
    ['Prompt Mode', formData.generationMode],
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

      {missingFields.length > 0 ? (
        <div className="mt-6 rounded-xl border border-rose-400/40 bg-rose-500/10 p-4">
          <p className="text-sm font-semibold text-rose-200">Missing required fields</p>
          <p className="mt-1 text-xs text-rose-200/90">{missingFields.join(', ')}</p>
        </div>
      ) : (
        <p className="mt-6 rounded-xl border border-emerald-400/30 bg-emerald-500/10 p-4 text-sm text-emerald-200">
          All required fields are complete.
        </p>
      )}
    </div>
  );
}
