export function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="rounded-2xl rounded-bl-md border border-[var(--sf-border)] bg-[var(--sf-surface)] px-4 py-3">
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--sf-accent)]" />
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--sf-accent)] [animation-delay:150ms]" />
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--sf-accent)] [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  );
}
