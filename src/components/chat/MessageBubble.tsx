import type { ChatMessage } from "@/types/chat";

interface MessageBubbleProps {
  message: ChatMessage;
}

export function MessageBubble({ message }: MessageBubbleProps) {
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
          <p className="mb-1 text-xs font-medium text-emerald-400">SpeakFlow</p>
        )}
        <p className="whitespace-pre-wrap break-words">{message.content}</p>
      </div>
    </div>
  );
}
