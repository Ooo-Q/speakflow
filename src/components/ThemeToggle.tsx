"use client";

import { useTheme } from "@/components/ThemeProvider";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className = "" }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "切换到浅色模式" : "切换到深色模式"}
      className={`touch-manipulation rounded-lg border border-[var(--sf-border)] bg-[var(--sf-surface)] px-3 py-1.5 text-xs font-medium text-[var(--sf-muted)] transition hover:border-[var(--sf-scroll-hover)] hover:text-[var(--sf-text)] active:scale-[0.98] ${className}`}
    >
      {theme === "dark" ? "浅色" : "深色"}
    </button>
  );
}
