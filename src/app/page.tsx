import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";

const FEATURES = [
  { title: "文字对话", desc: "随时输入，即时回复" },
  { title: "语音练习", desc: "开口说，听 AI 朗读" },
  { title: "场景切换", desc: "聊天页内一键切换" },
];

export default function Home() {
  return (
    <div className="relative flex min-h-dvh flex-col bg-[var(--sf-bg)] text-[var(--sf-text)]">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -10%, var(--sf-glow), transparent)",
        }}
      />

      <header className="relative z-10 flex justify-end px-6 pt-6 sm:px-8">
        <ThemeToggle />
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-8 sm:max-w-lg sm:px-8">
        <div className="mb-10 space-y-4">
          <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--sf-border)] bg-[var(--sf-surface)] text-lg font-semibold tracking-tight text-[var(--sf-accent)]">
            S
          </div>
          <div className="space-y-3">
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              SpeakFlow
            </h1>
            <p className="max-w-sm text-base leading-relaxed text-[var(--sf-muted)]">
              专注英语口语练习。说、听、改，在一个页面里完成。
            </p>
          </div>
        </div>

        <Link
          href="/chat"
          className="mb-10 flex min-h-12 touch-manipulation items-center justify-center rounded-xl bg-[var(--sf-accent)] text-base font-medium text-[var(--sf-accent-foreground)] transition hover:bg-[var(--sf-accent-hover)] active:scale-[0.99]"
        >
          开始练习
        </Link>

        <ul className="grid gap-3 sm:grid-cols-3 sm:gap-4">
          {FEATURES.map((item) => (
            <li
              key={item.title}
              className="rounded-xl border border-[var(--sf-border)] bg-[var(--sf-surface)]/80 px-4 py-3"
            >
              <p className="text-sm font-medium">{item.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-[var(--sf-muted)]">
                {item.desc}
              </p>
            </li>
          ))}
        </ul>
      </main>

      <footer className="relative z-10 px-6 pb-8 text-center text-xs text-[var(--sf-footer)]">
        进入对话后可在顶部切换练习场景
      </footer>
    </div>
  );
}
