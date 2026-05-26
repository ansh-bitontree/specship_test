"use client";

import type { FormEvent } from "react";
import { useEffect, useState } from "react";

type CourseSummary = {
  overview: string;
  objectives: string[];
};

const EMPTY_INPUT_MESSAGE =
  "Add a course overview and at least one learning objective before generating summary cards.";

export function CourseSummaryDisplay() {
  const [overviewInput, setOverviewInput] = useState("");
  const [objectivesInput, setObjectivesInput] = useState("");
  const [courseSummary, setCourseSummary] = useState<CourseSummary | null>(
    null,
  );
  const [error, setError] = useState("");

  useEffect(() => {
    const storedSummary = localStorage.getItem(
      "syllabus-study-planner:course-summary",
    );

    if (storedSummary) {
      setCourseSummary(JSON.parse(storedSummary) as CourseSummary);
    }
  }, []);

  function generateSummaryCards(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const overview = overviewInput.trim();
    const objectiveLines = objectivesInput
      .split("\n")
      .map((objective) => objective.trim())
      .filter(Boolean);

    if (!overview || objectiveLines.length === 0) {
      setError(EMPTY_INPUT_MESSAGE);
      return;
    }

    const nextSummary = {
      overview,
      objectives: objectiveLines,
    };

    localStorage.setItem("syllabus-study-planner:course-summary", JSON.stringify(nextSummary));
    setCourseSummary(nextSummary);
    setOverviewInput(overview);
    setObjectivesInput(objectiveLines.join("\n"));
    setError("");
  }

  return (
    <section
      id="course-summary-display"
      className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
            Course Summary Display
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-normal text-slate-950">
            Course overview and learning objectives
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Turn AI-generated course details into cards that stay available
            after refresh.
          </p>
        </div>
        <a
          className="text-sm font-medium text-slate-700 underline underline-offset-4"
          href="#course-summary-display"
        >
          Open Course Summary
        </a>
      </div>

      <form className="mt-6 grid gap-4" onSubmit={generateSummaryCards}>
        <div>
          <label
            className="block text-sm font-medium text-slate-800"
            htmlFor="course-overview"
          >
            Course overview
          </label>
          <textarea
            className="mt-2 min-h-28 w-full resize-y rounded-md border border-slate-300 px-3 py-3 text-sm leading-6 text-slate-950 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
            id="course-overview"
            onChange={(event) => {
              setOverviewInput(event.target.value);
              if (error) {
                setError("");
              }
            }}
            placeholder="This course introduces foundational concepts and weekly practice."
            value={overviewInput}
          />
        </div>

        <div>
          <label
            className="block text-sm font-medium text-slate-800"
            htmlFor="learning-objectives"
          >
            Learning objectives
          </label>
          <textarea
            className="mt-2 min-h-28 w-full resize-y rounded-md border border-slate-300 px-3 py-3 text-sm leading-6 text-slate-950 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
            id="learning-objectives"
            onChange={(event) => {
              setObjectivesInput(event.target.value);
              if (error) {
                setError("");
              }
            }}
            placeholder="Analyze primary sources&#10;Build weekly study routines"
            value={objectivesInput}
          />
        </div>

        {error ? (
          <p className="text-sm font-medium text-red-700" role="alert">
            {error}
          </p>
        ) : null}

        <button
          className="w-fit rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
          type="submit"
        >
          Generate summary cards
        </button>
      </form>

      {courseSummary ? (
        <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_1.1fr]">
          <article className="rounded-lg border border-slate-200 bg-slate-50 p-5">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Course overview
            </h3>
            <p className="mt-3 text-sm leading-6 text-slate-700">
              {courseSummary.overview}
            </p>
          </article>

          <article className="rounded-lg border border-slate-200 bg-slate-50 p-5">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Learning objectives
            </h3>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
              {courseSummary.objectives.map((objective) => (
                <li key={objective} className="rounded-md bg-white px-3 py-2">
                  {objective}
                </li>
              ))}
            </ul>
          </article>
        </div>
      ) : null}
    </section>
  );
}
