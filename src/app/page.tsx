import Link from "next/link";
import { SCENARIOS } from "@/types/scenario";

export default function Home() {
  return (
    <div className="flex min-h-full flex-col items-center justify-center bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 px-6 py-16 text-white">
      <main className="flex max-w-lg flex-col items-center gap-8 text-center">
        <div className="flex flex-col items-center gap-4">
          <p className="rounded-full bg-emerald-500/20 px-4 py-1 text-sm text-emerald-300">
            AI English Speaking Partner
          </p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            SpeakFlow
          </h1>
          <p className="text-lg leading-relaxed text-slate-300">
            Practice spoken English with AI. Type or speak — get natural replies
            and helpful corrections.
          </p>
        </div>

        <div className="flex w-full max-w-sm flex-col gap-3">
          <Link
            href="/chat"
            className="rounded-full bg-emerald-600 px-8 py-3.5 text-center text-base font-medium text-white shadow-lg shadow-emerald-900/30 transition hover:bg-emerald-500"
          >
            Start Practice
          </Link>

          <div className="grid gap-2 pt-2">
            {SCENARIOS.map((scenario) => (
              <Link
                key={scenario.id}
                href={`/chat?scenario=${scenario.id}`}
                className="rounded-2xl border border-slate-700 bg-slate-800/50 px-4 py-3 text-left transition hover:border-emerald-500/50 hover:bg-slate-800"
              >
                <p className="text-sm font-medium text-slate-100">
                  {scenario.label}
                </p>
                <p className="text-xs text-slate-400">{scenario.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
