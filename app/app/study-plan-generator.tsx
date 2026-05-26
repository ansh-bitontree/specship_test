"use client";

import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";

type GeneratedPlan = {
  notes: string[];
  weeks: string[];
};

type StoredStudyPlan = {
  syllabusStructure: string;
  weeklyHours: string;
  studyWeeks: string;
  generatedPlan: GeneratedPlan | null;
};

const STORAGE_KEY = "syllabus-study-planner:study-plan-generator";

function splitSyllabusItems(syllabusStructure: string) {
  return syllabusStructure
    .split(/\n|,|;/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function buildGeneratedPlan(
  syllabusStructure: string,
  weeklyHours: number,
  studyWeeks: number,
): GeneratedPlan {
  const items = splitSyllabusItems(syllabusStructure);
  const focusItems = items.length > 0 ? items : [syllabusStructure.trim()];
  const hoursPerItem = Math.max(1, Math.floor(weeklyHours / 2));

  return {
    notes: focusItems.slice(0, 5).map((item) => {
      return `Review ${item}, summarize the key ideas, and write practice questions before the next class.`;
    }),
    weeks: Array.from({ length: studyWeeks }, (_, index) => {
      const focus = focusItems[index % focusItems.length];
      return `Week ${index + 1}: spend ${weeklyHours} hours on ${focus}, with ${hoursPerItem} hours reserved for recall and practice.`;
    }),
  };
}

export function StudyPlanGenerator() {
  const [syllabusStructure, setSyllabusStructure] = useState("");
  const [weeklyHours, setWeeklyHours] = useState("6");
  const [studyWeeks, setStudyWeeks] = useState("4");
  const [generatedPlan, setGeneratedPlan] = useState<GeneratedPlan | null>(
    null,
  );
  const [error, setError] = useState("");

  useEffect(() => {
    const storedValue = localStorage.getItem(STORAGE_KEY);

    if (!storedValue) {
      return;
    }

    const parsed = JSON.parse(storedValue) as StoredStudyPlan;
    setSyllabusStructure(parsed.syllabusStructure ?? "");
    setWeeklyHours(parsed.weeklyHours ?? "6");
    setStudyWeeks(parsed.studyWeeks ?? "4");
    setGeneratedPlan(parsed.generatedPlan ?? null);
  }, []);

  const statusMessage = useMemo(() => {
    if (error) {
      return error;
    }

    if (generatedPlan) {
      return "Generated study plan saved. It will be visible after refresh.";
    }

    return "Add syllabus structure and study time to generate a personalized plan.";
  }, [error, generatedPlan]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedStructure = syllabusStructure.trim();
    const parsedWeeklyHours = Number(weeklyHours);
    const parsedStudyWeeks = Number(studyWeeks);
    const hasValidTime =
      Number.isFinite(parsedWeeklyHours) &&
      Number.isFinite(parsedStudyWeeks) &&
      parsedWeeklyHours > 0 &&
      parsedStudyWeeks > 0;

    if (!trimmedStructure || !hasValidTime) {
      setError(
        "Add syllabus structure and valid study time before generating a plan.",
      );
      return;
    }

    const nextPlan = buildGeneratedPlan(
      trimmedStructure,
      parsedWeeklyHours,
      parsedStudyWeeks,
    );

    setSyllabusStructure(trimmedStructure);
    setGeneratedPlan(nextPlan);
    setError("");
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      syllabusStructure: trimmedStructure,
      weeklyHours,
      studyWeeks,
      generatedPlan: nextPlan,
    }));
  }

  return (
    <section
      className="mt-10 border-t border-slate-200 pt-8"
      id="study-plan-generator"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
            Study Plan Generator
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-normal text-slate-950">
            Generate personalized study notes and weekly plan suggestions.
          </h2>
        </div>
        <a
          className="text-sm font-medium text-slate-700 underline underline-offset-4"
          href="#study-plan-generator"
        >
          Open Study Plan Generator
        </a>
      </div>

      <form
        className="mt-6 rounded-lg border border-slate-200 bg-white p-5"
        onSubmit={handleSubmit}
      >
        <div>
          <label
            className="text-sm font-medium text-slate-800"
            htmlFor="syllabus-structure"
          >
            Syllabus structure
          </label>
          <textarea
            aria-describedby="study-plan-state"
            aria-invalid={error ? "true" : "false"}
            className="mt-2 min-h-32 w-full rounded-md border border-slate-300 p-3 text-sm leading-6 text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
            id="syllabus-structure"
            onChange={(event) => {
              setSyllabusStructure(event.target.value);
              if (error) {
                setError("");
              }
            }}
            placeholder="Week 1: Foundations&#10;Week 2: Research methods&#10;Midterm, project, final exam"
            value={syllabusStructure}
          />
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label
              className="text-sm font-medium text-slate-800"
              htmlFor="weekly-hours"
            >
              Available study hours per week
            </label>
            <input
              className="mt-2 w-full rounded-md border border-slate-300 p-3 text-sm text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
              id="weekly-hours"
              min="1"
              onChange={(event) => setWeeklyHours(event.target.value)}
              type="number"
              value={weeklyHours}
            />
          </div>
          <div>
            <label
              className="text-sm font-medium text-slate-800"
              htmlFor="study-weeks"
            >
              Number of study weeks
            </label>
            <input
              className="mt-2 w-full rounded-md border border-slate-300 p-3 text-sm text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
              id="study-weeks"
              min="1"
              onChange={(event) => setStudyWeeks(event.target.value)}
              type="number"
              value={studyWeeks}
            />
          </div>
        </div>

        {error ? (
          <p
            className="mt-3 text-sm font-medium text-red-700"
            id="study-plan-state"
            role="alert"
          >
            {statusMessage}
          </p>
        ) : (
          <p className="mt-3 text-sm text-slate-600" id="study-plan-state">
            {statusMessage}
          </p>
        )}

        <button
          className="mt-4 w-full rounded-md bg-slate-950 px-4 py-2 text-sm font-medium text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 sm:w-auto"
          type="submit"
        >
          Generate study plan
        </button>
      </form>

      {generatedPlan ? (
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <section>
            <h3 className="text-base font-semibold text-slate-950">
              Personalized study notes
            </h3>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
              {generatedPlan.notes.map((note, index) => (
                <li className="rounded-md bg-white p-3" key={`${note}-${index}`}>
                  {note}
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h3 className="text-base font-semibold text-slate-950">
              Week-by-week plan
            </h3>
            <ol className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
              {generatedPlan.weeks.map((week) => (
                <li className="rounded-md bg-white p-3" key={week}>
                  {week}
                </li>
              ))}
            </ol>
          </section>
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500 lg:col-span-2">
            Generated study plan
          </p>
        </div>
      ) : null}
    </section>
  );
}
