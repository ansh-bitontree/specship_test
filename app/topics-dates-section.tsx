"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type ImportantDate = {
  title: string;
  date: string;
  category: string;
};

type StoredTopicsDates = {
  topics: string[];
  importantDates: ImportantDate[];
};

const STORAGE_KEY = "syllabus-study-planner:topics-dates";

const emptyState: StoredTopicsDates = {
  topics: [],
  importantDates: [],
};

export function TopicsDatesSection() {
  const [topics, setTopics] = useState<string[]>(emptyState.topics);
  const [importantDates, setImportantDates] = useState<ImportantDate[]>(
    emptyState.importantDates,
  );
  const [topicInput, setTopicInput] = useState("");
  const [dateTitle, setDateTitle] = useState("");
  const [dateValue, setDateValue] = useState("");
  const [dateCategory, setDateCategory] = useState("Deadline");
  const [topicError, setTopicError] = useState("");
  const [dateError, setDateError] = useState("");
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    const storedValue = localStorage.getItem(STORAGE_KEY);

    if (storedValue) {
      const parsed = JSON.parse(storedValue) as StoredTopicsDates;
      setTopics(parsed.topics ?? []);
      setImportantDates(parsed.importantDates ?? []);
    }

    setHasLoaded(true);
  }, []);

  useEffect(() => {
    if (!hasLoaded) {
      return;
    }

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ topics, importantDates }),
    );
  }, [hasLoaded, importantDates, topics]);

  const sortedDates = useMemo(
    () =>
      [...importantDates].sort((first, second) =>
        first.date.localeCompare(second.date),
      ),
    [importantDates],
  );

  function addTopic(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextTopic = topicInput.trim();

    if (!nextTopic) {
      setTopicError("Enter at least one topic before adding it.");
      return;
    }

    setTopics((currentTopics) => [...currentTopics, nextTopic]);
    setTopicInput("");
    setTopicError("");
  }

  function addImportantDate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextTitle = dateTitle.trim();

    if (!nextTitle || !dateValue) {
      setDateError("Add a title and date before saving this item.");
      return;
    }

    setImportantDates((currentDates) => [
      ...currentDates,
      {
        title: nextTitle,
        date: dateValue,
        category: dateCategory,
      },
    ]);
    setDateTitle("");
    setDateValue("");
    setDateCategory("Deadline");
    setDateError("");
  }

  return (
    <section id="topics-dates" className="mt-10 border-t border-slate-200 pt-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
            Topics & Dates
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-normal text-slate-950">
            Extract key topics and important schedule items.
          </h2>
        </div>
        <a
          href="#topics-dates"
          className="text-sm font-medium text-slate-700 underline underline-offset-4"
        >
          Open Topics & Dates
        </a>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <form onSubmit={addTopic} className="rounded-lg border border-slate-200 bg-white p-5">
          <label
            htmlFor="key-topics"
            className="text-sm font-medium text-slate-800"
          >
            Key topics
          </label>
          <textarea
            id="key-topics"
            value={topicInput}
            onChange={(event) => setTopicInput(event.target.value)}
            className="mt-2 min-h-28 w-full rounded-md border border-slate-300 p-3 text-sm text-slate-950"
            placeholder="Machine learning foundations"
          />
          {topicError ? (
            <p className="mt-2 text-sm text-red-700" role="alert">
              {topicError}
            </p>
          ) : null}
          <button
            type="submit"
            className="mt-4 rounded-md bg-slate-950 px-4 py-2 text-sm font-medium text-white"
          >
            Add topic
          </button>
        </form>

        <form
          onSubmit={addImportantDate}
          className="rounded-lg border border-slate-200 bg-white p-5"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="date-title"
                className="text-sm font-medium text-slate-800"
              >
                Date title
              </label>
              <input
                id="date-title"
                value={dateTitle}
                onChange={(event) => setDateTitle(event.target.value)}
                className="mt-2 w-full rounded-md border border-slate-300 p-3 text-sm text-slate-950"
                placeholder="Midterm exam"
              />
            </div>
            <div>
              <label
                htmlFor="important-date"
                className="text-sm font-medium text-slate-800"
              >
                Date
              </label>
              <input
                id="important-date"
                type="date"
                value={dateValue}
                onChange={(event) => setDateValue(event.target.value)}
                className="mt-2 w-full rounded-md border border-slate-300 p-3 text-sm text-slate-950"
              />
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="date-category"
                className="text-sm font-medium text-slate-800"
              >
                Category
              </label>
              <select
                id="date-category"
                value={dateCategory}
                onChange={(event) => setDateCategory(event.target.value)}
                className="mt-2 w-full rounded-md border border-slate-300 p-3 text-sm text-slate-950"
              >
                <option>Deadline</option>
                <option>Exam</option>
                <option>Lecture</option>
                <option>Holiday</option>
                <option>Other</option>
              </select>
            </div>
          </div>
          {dateError ? (
            <p className="mt-2 text-sm text-red-700" role="alert">
              {dateError}
            </p>
          ) : null}
          <button
            type="submit"
            className="mt-4 rounded-md bg-slate-950 px-4 py-2 text-sm font-medium text-white"
          >
            Add important date
          </button>
        </form>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div>
          <h3 className="text-base font-semibold text-slate-950">Saved topics</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            {topics.map((topic, index) => (
              <li key={`${topic}-${index}`} className="rounded-md bg-white p-3">
                {topic}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-base font-semibold text-slate-950">
            Chronological dates
          </h3>
          <ol className="mt-3 space-y-2 text-sm text-slate-700">
            {sortedDates.map((item, index) => (
              <li
                key={`${item.title}-${item.date}-${index}`}
                className="rounded-md bg-white p-3"
              >
                <span className="font-medium text-slate-950">{item.date}</span>{" "}
                {item.title} · {item.category}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
