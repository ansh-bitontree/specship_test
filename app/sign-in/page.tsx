import { signIn } from "./actions";

export default function SignInPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-10 sm:px-6 sm:py-12">
      <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
        Syllabus Snap
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-normal text-slate-950 sm:text-4xl">
        Sign in to continue
      </h1>
      <p className="mt-4 text-base leading-7 text-slate-700">
        Use the phase-one demo session to reach your syllabus workspace.
      </p>
      <form action={signIn} className="mt-8">
        <button
          aria-label="Continue to the syllabus workspace"
          className="rounded-md bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
          type="submit"
        >
          Continue
        </button>
      </form>
    </main>
  );
}
