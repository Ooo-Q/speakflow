export default function Home() {
  return (
    <div className="flex min-h-full flex-col items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800 px-6 py-16 text-white">
      <main className="flex max-w-lg flex-col items-center gap-6 text-center">
        <p className="rounded-full bg-emerald-500/20 px-4 py-1 text-sm text-emerald-300">
          AI English Speaking Partner
        </p>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          SpeakFlow
        </h1>
        <p className="text-lg leading-relaxed text-slate-300">
          Practice spoken English with AI. Type or speak — get natural replies and
          helpful corrections.
        </p>
      </main>
    </div>
  );
}
