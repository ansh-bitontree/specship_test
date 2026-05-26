import { TopicsDatesSection } from "./topics-dates-section";
import { SyllabusTextInput } from "./syllabus-text-input";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-4 py-10 sm:px-6 sm:py-12">
      <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
        Syllabus Study Planner
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-normal text-slate-950 sm:text-4xl">
        Build a study plan from your syllabus.
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-7 text-slate-700 sm:text-lg sm:leading-8">
        Paste your course syllabus to start organizing topics, assignments,
        exams, and study plan details.
      </p>
      <TopicsDatesSection />
      <SyllabusTextInput />
    </main>
  );
}
