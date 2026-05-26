"use client";

import type { FormEvent } from "react";
import { useEffect, useState } from "react";

type AnalysisResult = {
  summary: string;
  nextStep: string;
};

const API_FAILURE_MESSAGE =
  "We could not analyze your syllabus right now. Please try again.";
const RATE_LIMIT_MESSAGE =
  "Too many analysis attempts. Please wait a minute and try again.";

export function LoadingErrorHandlingWorkflow() {
  const [syllabusText, setSyllabusText] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const storedResult = localStorage.getItem("syllabus-study-planner:analysis-result");

    if (storedResult) {
      setResult(JSON.parse(storedResult) as AnalysisResult);
    }
  }, []);

  async function analyzeSyllabus(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedText = syllabusText.trim();

    if (!trimmedText) {
      setError("Enter syllabus content before running analysis.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/syllabus-analysis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ syllabusText: trimmedText }),
      });

      if (response.status === 429) {
        setError(RATE_LIMIT_MESSAGE);
        return;
      }

      if (!response.ok) {
        setError(API_FAILURE_MESSAGE);
        return;
      }

      const nextResult = (await response.json()) as AnalysisResult;
      localStorage.setItem("syllabus-study-planner:analysis-result", JSON.stringify(nextResult));
      setResult(nextResult);
      setSyllabusText(trimmedText);
    } catch {
      setError(API_FAILURE_MESSAGE);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
          Loading & Error Handling
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-normal text-slate-950">
          Analyze syllabus availability
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Run a quick syllabus analysis with visible loading and friendly
          recovery messages.
        </p>
      </div>

      <form className="mt-5 space-y-4" onSubmit={analyzeSyllabus}>
        <div>
          <label
            className="block text-sm font-medium text-slate-800"
            htmlFor="analysis-syllabus-text"
          >
            Syllabus content
          </label>
          <textarea
            className="mt-2 min-h-40 w-full resize-y rounded-md border border-slate-300 px-3 py-3 text-base leading-6 text-slate-950 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
            id="analysis-syllabus-text"
            onChange={(event) => {
              setSyllabusText(event.target.value);
              if (error) {
                setError("");
              }
            }}
            value={syllabusText}
          />
        </div>

        {error ? (
          <p className="text-sm font-medium text-red-700" role="alert">
            {error}
          </p>
        ) : null}

        <button
          className="rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-400"
          disabled={isLoading}
          type="submit"
        >
          {isLoading ? "Analyzing..." : "Analyze syllabus"}
        </button>
      </form>

      <div aria-busy={isLoading} className="mt-6">
        {isLoading ? (
          <div className="space-y-3" aria-label="Loading analysis result">
            <div className="h-4 w-1/3 animate-pulse rounded bg-slate-200" />
            <div className="h-20 animate-pulse rounded bg-slate-100" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200" />
          </div>
        ) : null}

        {!isLoading && result ? (
          <div className="border-t border-slate-200 pt-5">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Analysis result
            </h3>
            <p className="mt-3 rounded-md bg-slate-50 p-4 text-sm leading-6 text-slate-700">
              {result.summary}
            </p>
            <p className="mt-3 text-sm font-medium text-slate-800">
              {result.nextStep}
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
