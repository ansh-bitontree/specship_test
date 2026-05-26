"use client";

import type { FormEvent } from "react";
import { useEffect, useState } from "react";

export function SyllabusTextInput() {
  const [text, setText] = useState("");
  const [savedText, setSavedText] = useState("");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

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
      setError(
        "Please paste syllabus content before continuing. Try again after adding syllabus text.",
      );
      return;
    }

    setIsSaving(true);
    localStorage.setItem("syllabus-source-text", trimmedText);
    setText(trimmedText);
    setSavedText(trimmedText);
    setError("");
    window.setTimeout(() => setIsSaving(false), 250);
  }

  const statusMessage = error
    ? error
    : isSaving
      ? "Saving syllabus..."
      : savedText
        ? "Syllabus saved. Review it below or update the text and save again."
        : "No syllabus saved yet. Paste your syllabus above, then save it to start planning.";

  return (
    <section className="mt-10 w-full max-w-full rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div>
        <h2 className="text-xl font-semibold tracking-normal text-slate-950 sm:text-2xl">
          Syllabus Text Input
        </h2>
        <p
          className="mt-2 text-sm leading-6 text-slate-600"
          id="syllabus-text-help"
        >
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
            aria-describedby="syllabus-text-help syllabus-text-state"
            aria-invalid={error ? "true" : "false"}
            className="mt-2 min-h-56 w-full resize-y rounded-md border border-slate-300 px-3 py-3 text-base leading-6 text-slate-950 transition focus-visible:border-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
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
          <p
            className="text-sm font-medium text-red-700"
            id="syllabus-text-state"
            role="alert"
          >
            {statusMessage}
          </p>
        ) : (
          <p
            className="text-sm text-slate-600"
            id="syllabus-text-state"
            role="status"
          >
            {statusMessage}
          </p>
        )}

        <button
          className="w-full rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-500 sm:w-auto"
          disabled={isSaving}
          type="submit"
        >
          {isSaving ? "Saving syllabus..." : "Save syllabus"}
        </button>
      </form>

      {savedText ? (
        <div className="mt-6 border-t border-slate-200 pt-5">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Your saved syllabus
          </h3>
          <p className="mt-3 max-h-48 max-w-full overflow-auto break-words whitespace-pre-wrap rounded-md bg-slate-50 p-4 text-sm leading-6 text-slate-700">
            {savedText}
          </p>
        </div>
      ) : null}
    </section>
  );
}
