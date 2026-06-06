import type { ChatMessage } from "@/types/chat";

interface MessageBubbleProps {
  message: ChatMessage;
  onSpeak?: (text: string) => void;
  isSpeaking?: boolean;
  canSpeak?: boolean;
}

export function MessageBubble({
  message,
  onSpeak,
  isSpeaking,
  canSpeak,
}: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[88%] rounded-2xl px-4 py-3 text-[15px] leading-relaxed sm:max-w-[75%] ${
          isUser
            ? "rounded-br-md bg-[var(--sf-user-bubble)] text-[var(--sf-user-text)]"
            : "rounded-bl-md border border-[var(--sf-border)] bg-[var(--sf-surface)] text-[var(--sf-text)]"
        }`}
      >
        {!isUser && (
          <div className="mb-2 flex items-center justify-between gap-3">
            <span className="text-xs text-[var(--sf-muted)]">回复</span>
            {canSpeak && onSpeak && (
              <button
                type="button"
                onClick={() => onSpeak(message.content)}
                disabled={isSpeaking}
                aria-label="朗读这条消息"
                className="touch-manipulation text-xs text-[var(--sf-accent)] transition hover:opacity-80 disabled:opacity-50"
              >
                {isSpeaking ? "朗读中" : "朗读"}
              </button>
            )}
          </div>
        )}
        <p className="whitespace-pre-wrap break-words">{message.content}</p>
      </div>
    </div>
  );
}
