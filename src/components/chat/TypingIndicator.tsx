export function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="rounded-2xl rounded-bl-md border border-[#2a3441] bg-[#141a22] px-4 py-3">
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#5b9fd4]" />
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#5b9fd4] [animation-delay:150ms]" />
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#5b9fd4] [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  );
}
