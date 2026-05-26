import { signIn } from "./actions";

export default function SignInPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-12">
      <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
        Syllabus Snap
      </p>
      <h1 className="mt-3 text-4xl font-semibold tracking-normal text-slate-950">
        Sign in to continue
      </h1>
      <p className="mt-4 text-base leading-7 text-slate-700">
        Use the phase-one demo session to reach your syllabus workspace.
      </p>
      <form action={signIn} className="mt-8">
        <button
          className="rounded-md bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
          type="submit"
        >
          Continue
        </button>
      </form>
    </main>
  );
}
