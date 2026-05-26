import { AssignmentsExamsBreakdown } from "../assignments-exams-breakdown";
import { getCurrentUser } from "@/lib/auth";
import { StudyPlanGenerator } from "./study-plan-generator";
import { LoadingErrorHandlingWorkflow } from "./loading-error-handling-workflow";

export default async function AppShellPage() {
  const user = await getCurrentUser();

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col px-4 py-8 sm:px-6 sm:py-10">
      <header className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
            Syllabus Snap
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-normal text-slate-950">
            Study workspace
          </h1>
        </div>
        <p className="break-all text-sm text-slate-600">{user?.email}</p>
      </header>

      <nav className="mt-5">
        <a
          className="text-sm font-medium text-slate-700 underline underline-offset-4"
          href="#study-plan-generator"
        >
          Study Plan Generator
        </a>
      </nav>

      <section className="grid flex-1 place-items-center py-16">
      <section className="grid place-items-center py-12">
        <div className="max-w-xl text-center">
          <h2 className="text-2xl font-semibold tracking-normal text-slate-950">
            Upload syllabus
          </h2>
          <p className="mt-3 text-sm font-medium uppercase tracking-wide text-slate-500">
            Loading & Error Handling
          </p>
          <p className="mt-3 text-base leading-7 text-slate-700">
            No syllabus uploaded yet. Start by pasting your syllabus on the home
            page. Your workspace is ready for extraction and study planning once
            a syllabus is saved.
          </p>
        </div>
        <LoadingErrorHandlingWorkflow />
      </section>

      <StudyPlanGenerator />
      <AssignmentsExamsBreakdown />
    </main>
  );
}
