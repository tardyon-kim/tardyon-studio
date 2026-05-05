import { Button } from "@/shared/ui/button";

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <section className="mx-auto max-w-4xl space-y-6">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-slate-500">Offline-ready starter</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-950">Enterprise product baseline</h1>
          <p className="mt-3 max-w-2xl text-slate-600">
            Next.js, NestJS, PostgreSQL, Docker Compose, and operational gates are wired as the reference path.
          </p>
        </div>
        <Button>Ready</Button>
      </section>
    </main>
  );
}

