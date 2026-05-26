"use client";

import type { FormEvent } from "react";
import { useEffect, useState } from "react";

type AiSummary = {
  courseOverview: string;
  topics: string[];
  dates: string[];
  assignments: string[];
  exams: string[];
  studyRecommendations: string[];
};

const EMPTY_INPUT_MESSAGE =
  "Paste syllabus text before generating an AI summary.";
const API_FAILURE_MESSAGE =
  "We could not generate an AI summary right now. Please try again.";

const emptySummary: AiSummary = {
  courseOverview: "",
  topics: [],
  dates: [],
  assignments: [],
  exams: [],
  studyRecommendations: [],
};

function SummaryList({ items }: { items: string[] }) {
  if (!items.length) {
    return <p className="text-sm text-slate-500">No items found.</p>;
  }

  return (
    <ul className="space-y-2 text-sm leading-6 text-slate-700">
      {items.map((item, index) => (
        <li className="rounded-md bg-slate-50 p-3" key={`${item}-${index}`}>
          {item}
        </li>
      ))}
    </ul>
  );
}

export function AiSummaryGeneration() {
  const [syllabusText, setSyllabusText] = useState("");
  const [summary, setSummary] = useState<AiSummary | null>(null);
  const [error, setError] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const storedSummary = localStorage.getItem("syllabus-study-planner:ai-summary");

    if (storedSummary) {
      setSummary(JSON.parse(storedSummary) as AiSummary);
    }
  }, []);

  async function generateSummary(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedText = syllabusText.trim();

    if (!trimmedText) {
      setError(EMPTY_INPUT_MESSAGE);
      return;
    }

    setError("");
    setIsGenerating(true);

    try {
      const response = await fetch("/api/syllabus-analysis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ syllabusText: trimmedText }),
      });

      if (!response.ok) {
        setError(API_FAILURE_MESSAGE);
        return;
      }

      const result = (await response.json()) as Partial<AiSummary>;
      const nextSummary: AiSummary = {
        ...emptySummary,
        ...result,
      };

      localStorage.setItem("syllabus-study-planner:ai-summary", JSON.stringify(nextSummary));
      setSummary(nextSummary);
      setSyllabusText(trimmedText);
    } catch {
      setError(API_FAILURE_MESSAGE);
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <section
      className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
      id="ai-summary-generation"
    >
      <div>
        <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
          AI Summary Generation
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-normal text-slate-950">
          Generate a structured syllabus summary.
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Paste syllabus text to extract the course overview, topics, dates,
          assignments, exams, and study recommendations.
        </p>
      </div>

      <form className="mt-5 space-y-4" onSubmit={generateSummary}>
        <div>
          <label
            className="block text-sm font-medium text-slate-800"
            htmlFor="ai-summary-syllabus-text"
          >
            Syllabus text
          </label>
          <textarea
            aria-describedby="ai-summary-state"
            aria-invalid={error ? "true" : "false"}
            className="mt-2 min-h-44 w-full resize-y rounded-md border border-slate-300 px-3 py-3 text-base leading-6 text-slate-950 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
            id="ai-summary-syllabus-text"
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
          <p
            className="text-sm font-medium text-red-700"
            id="ai-summary-state"
            role="alert"
          >
            {error}
          </p>
        ) : (
          <p className="text-sm text-slate-600" id="ai-summary-state">
            {summary
              ? "AI summary saved. Refresh the page to see it restored."
              : "No AI summary generated yet."}
          </p>
        )}

        <button
          className="rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-400"
          disabled={isGenerating}
          type="submit"
        >
          {isGenerating ? "Generating..." : "Generate AI summary"}
        </button>
      </form>

      {summary ? (
        <div className="mt-6 grid gap-5 border-t border-slate-200 pt-5 lg:grid-cols-2">
          <div className="lg:col-span-2">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Course overview
            </h3>
            <p className="mt-3 rounded-md bg-slate-50 p-4 text-sm leading-6 text-slate-700">
              {summary.courseOverview || "No overview found."}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Topics
            </h3>
            <div className="mt-3">
              <SummaryList items={summary.topics} />
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Important dates
            </h3>
            <div className="mt-3">
              <SummaryList items={summary.dates} />
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Assignments
            </h3>
            <div className="mt-3">
              <SummaryList items={summary.assignments} />
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Exams
            </h3>
            <div className="mt-3">
              <SummaryList items={summary.exams} />
            </div>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Study recommendations
            </h3>
            <div className="mt-3">
              <SummaryList items={summary.studyRecommendations} />
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
