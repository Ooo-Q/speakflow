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
        className={`max-w-[85%] rounded-2xl px-4 py-3 text-[15px] leading-relaxed shadow-sm sm:max-w-[70%] ${
          isUser
            ? "rounded-br-md bg-emerald-600 text-white"
            : "rounded-bl-md border border-slate-700/80 bg-slate-800 text-slate-100"
        }`}
      >
        {!isUser && (
          <div className="mb-1 flex items-center justify-between gap-2">
            <p className="text-xs font-medium text-emerald-400">SpeakFlow</p>
            {canSpeak && onSpeak && (
              <button
                type="button"
                onClick={() => onSpeak(message.content)}
                disabled={isSpeaking}
                aria-label="朗读这条消息"
                className="touch-manipulation rounded-full px-2 py-0.5 text-xs text-slate-400 transition hover:text-emerald-300 disabled:opacity-50"
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
