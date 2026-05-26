import { SyllabusTextInput } from "./syllabus-text-input";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-6 py-12">
      <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
        Syllabus Study Planner
      </p>
      <h1 className="mt-3 text-4xl font-semibold tracking-normal text-slate-950">
        Build a study plan from your syllabus.
      </h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-700">
        Paste your course syllabus to start organizing topics, assignments,
        exams, and study plan details.
      </p>
      <SyllabusTextInput />
    </main>
  );
}
