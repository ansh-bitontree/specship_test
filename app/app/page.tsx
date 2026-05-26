import { getCurrentUser } from "@/lib/auth";

export default async function AppShellPage() {
  const user = await getCurrentUser();

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col px-6 py-10">
      <header className="flex items-center justify-between border-b border-slate-200 pb-5">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
            Syllabus Snap
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-normal text-slate-950">
            Study workspace
          </h1>
        </div>
        <p className="text-sm text-slate-600">{user?.email}</p>
      </header>

      <section className="grid flex-1 place-items-center py-16">
        <div className="max-w-xl text-center">
          <h2 className="text-2xl font-semibold tracking-normal text-slate-950">
            Upload syllabus
          </h2>
          <p className="mt-3 text-base leading-7 text-slate-700">
            Your protected workspace is ready for syllabus uploads, extraction,
            and study planning.
          </p>
        </div>
      </section>
    </main>
  );
}
