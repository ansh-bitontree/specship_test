"use client";

import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";

type BreakdownType = "Assignment" | "Exam";

type BreakdownItem = {
  type: BreakdownType;
  title: string;
  description: string;
  date: string;
};

type StoredBreakdown = {
  items: BreakdownItem[];
  sourceText: string;
};

const STORAGE_KEY = "syllabus-study-planner:assignments-exams";

const datePattern =
  /\b(?:\d{1,2}[/-]\d{1,2}(?:[/-]\d{2,4})?|\d{4}-\d{2}-\d{2}|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)[a-z]*\.?\s+\d{1,2}(?:,\s*\d{4})?)\b/i;

function getItemType(line: string): BreakdownType | null {
  if (/\b(exam|midterm|final|quiz|test)\b/i.test(line)) {
    return "Exam";
  }

  if (/\b(assignment|homework|paper|project|essay|problem set|lab)\b/i.test(line)) {
    return "Assignment";
  }

  return null;
}

function cleanTitle(line: string, date: string) {
  return line
    .replace(date, "")
    .replace(/\b(due|on|date|deadline)\b/gi, "")
    .replace(/[:;,.-]+$/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function parseAssignmentsAndExams(text: string): BreakdownItem[] {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const type = getItemType(line);
      const dateMatch = line.match(datePattern);

      if (!type || !dateMatch) {
        return null;
      }

      const date = dateMatch[0];
      const title = cleanTitle(line, date);

      return {
        type,
        title: title || type,
        description: line,
        date,
      };
    })
    .filter((item): item is BreakdownItem => item !== null);
}

export function AssignmentsExamsBreakdown() {
  const [sourceText, setSourceText] = useState("");
  const [breakdownItems, setBreakdownItems] = useState<BreakdownItem[]>([]);
  const [error, setError] = useState("");
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    const storedValue = localStorage.getItem(STORAGE_KEY);

    if (storedValue) {
      const parsed = JSON.parse(storedValue) as StoredBreakdown;
      setSourceText(parsed.sourceText ?? "");
      setBreakdownItems(parsed.items ?? []);
    }

    setHasLoaded(true);
  }, []);

  useEffect(() => {
    if (!hasLoaded) {
      return;
    }

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ items: breakdownItems, sourceText }),
    );
  }, [breakdownItems, hasLoaded, sourceText]);

  const sortedItems = useMemo(
    () =>
      [...breakdownItems].sort((first, second) =>
        first.date.localeCompare(second.date),
      ),
    [breakdownItems],
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedText = sourceText.trim();

    if (!trimmedText) {
      setError("Paste assignment or exam details before extracting.");
      return;
    }

    const nextItems = parseAssignmentsAndExams(trimmedText);

    if (nextItems.length === 0) {
      setError("Include at least one assignment or exam with a date.");
      return;
    }

    setSourceText(trimmedText);
    setBreakdownItems(nextItems);
    setError("");
  }

  return (
    <section
      id="assignments-exams"
      className="mt-10 border-t border-slate-200 pt-8"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
            Assignments & Exams Breakdown
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-normal text-slate-950">
            Extract coursework and test dates from your syllabus.
          </h2>
        </div>
        <a
          href="#assignments-exams"
          className="text-sm font-medium text-slate-700 underline underline-offset-4"
        >
          Open Assignments & Exams
        </a>
      </div>

      <form
        className="mt-6 rounded-lg border border-slate-200 bg-white p-5"
        onSubmit={handleSubmit}
      >
        <label
          htmlFor="assignments-exams-source"
          className="text-sm font-medium text-slate-800"
        >
          Syllabus assignment and exam text
        </label>
        <textarea
          id="assignments-exams-source"
          value={sourceText}
          onChange={(event) => {
            setSourceText(event.target.value);
            if (error) {
              setError("");
            }
          }}
          className="mt-2 min-h-36 w-full rounded-md border border-slate-300 p-3 text-sm text-slate-950"
          placeholder="Assignment 1: Research memo due March 8&#10;Midterm exam on April 12"
        />
        {error ? (
          <p className="mt-2 text-sm text-red-700" role="alert">
            {error}
          </p>
        ) : null}
        <button
          type="submit"
          className="mt-4 rounded-md bg-slate-950 px-4 py-2 text-sm font-medium text-white"
        >
          Extract assignments and exams
        </button>
      </form>

      {sortedItems.length > 0 ? (
        <div className="mt-6">
          <h3 className="text-base font-semibold text-slate-950">
            Saved assignments and exams
          </h3>
          <div className="mt-3 hidden grid-cols-[1fr_auto] gap-4 px-4 text-xs font-semibold uppercase tracking-wide text-slate-500 sm:grid">
            <span>Description</span>
            <span>Due date</span>
          </div>
          <ol className="mt-3 space-y-3 text-sm text-slate-700">
            {sortedItems.map((item, index) => (
              <li
                key={`${item.type}-${item.title}-${item.date}-${index}`}
                className="rounded-md bg-white p-4"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="font-semibold text-slate-950">
                      {item.title}
                    </p>
                    <p className="mt-1 leading-6">{item.description}</p>
                  </div>
                  <div className="shrink-0 text-left sm:text-right">
                    <p className="font-medium text-slate-950">{item.date}</p>
                    <p>{item.type}</p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      ) : null}
    </section>
  );
}
