"use client";

import type { FormEvent } from "react";
import { useEffect, useState } from "react";

export function SyllabusTextInput() {
  const [text, setText] = useState("");
  const [savedText, setSavedText] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const storedText = localStorage.getItem("syllabus-source-text");

    if (storedText) {
      setText(storedText);
      setSavedText(storedText);
    }
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedText = text.trim();

    if (!trimmedText) {
      setError("Please paste syllabus content before continuing.");
      return;
    }

    localStorage.setItem("syllabus-source-text", trimmedText);
    setText(trimmedText);
    setSavedText(trimmedText);
    setError("");
  }

  return (
    <section className="mt-10 w-full rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-2xl font-semibold tracking-normal text-slate-950">
          Syllabus Text Input
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Paste syllabus text to keep it available for planning after refresh.
        </p>
      </div>

      <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
        <div>
          <label
            className="block text-sm font-medium text-slate-800"
            htmlFor="syllabus-text"
          >
            Paste syllabus text
          </label>
          <textarea
            className="mt-2 min-h-56 w-full resize-y rounded-md border border-slate-300 px-3 py-3 text-base leading-6 text-slate-950 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
            id="syllabus-text"
            name="syllabus-text"
            onChange={(event) => {
              setText(event.target.value);
              if (error) {
                setError("");
              }
            }}
            value={text}
          />
        </div>

        {error ? (
          <p className="text-sm font-medium text-red-700" role="alert">
            {error}
          </p>
        ) : null}

        <button
          className="rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
          type="submit"
        >
          Save syllabus
        </button>
      </form>

      {savedText ? (
        <div className="mt-6 border-t border-slate-200 pt-5">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Your saved syllabus
          </h3>
          <p className="mt-3 max-h-48 overflow-auto whitespace-pre-wrap rounded-md bg-slate-50 p-4 text-sm leading-6 text-slate-700">
            {savedText}
          </p>
        </div>
      ) : null}
    </section>
  );
}
