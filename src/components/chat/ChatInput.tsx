"use client";

import { FormEvent, KeyboardEvent, useState } from "react";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";

interface ChatInputProps {
  onSend: (text: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [text, setText] = useState("");
  const {
    isSupported,
    isListening,
    error: speechError,
    unsupportedReason,
    toggle,
    clearError,
  } = useSpeechRecognition();

  const submit = (value?: string) => {
    const trimmed = (value ?? text).trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setText("");
    clearError();
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    submit();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submit();
    }
  };

  const handleMicClick = () => {
    if (!isSupported || disabled) return;

    toggle((transcript, isFinal) => {
      setText(transcript);
      if (isFinal && transcript) {
        submit(transcript);
      }
    });
  };

  const statusMessage =
    speechError ??
    (isListening ? "正在聆听，请说英语…" : unsupportedReason);

  return (
    <div className="relative z-20 shrink-0 border-t border-[#2a3441] bg-[#0b0f14]/95 pb-[env(safe-area-inset-bottom)] backdrop-blur">
      {statusMessage && (
        <p
          className={`px-4 pt-2 text-center text-xs ${
            speechError ? "text-[#f0a8a8]" : "text-[#8b98a8]"
          }`}
        >
          {statusMessage}
        </p>
      )}

      <form
        onSubmit={handleSubmit}
        className="flex items-end gap-2 px-4 py-3"
      >
        <button
          type="button"
          disabled={disabled || !isSupported}
          onClick={handleMicClick}
          title={isSupported ? "语音输入" : (unsupportedReason ?? "不支持语音")}
          aria-label={isListening ? "停止录音" : "语音输入"}
          aria-pressed={isListening}
          className={`flex min-h-12 shrink-0 touch-manipulation items-center justify-center gap-1 rounded-xl border px-3 transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 ${
            isListening
              ? "border-[#d48484] bg-[rgba(212,132,132,0.12)] text-[#f0a8a8]"
              : "border-[#2a3441] bg-[#141a22] text-[#8b98a8] hover:border-[#3a4654] hover:text-[#c5cdd6]"
          }`}
        >
          <MicIcon />
          <span className="text-xs font-medium">语音</span>
        </button>

        <textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          rows={1}
          enterKeyHint="send"
          placeholder={isListening ? "正在识别…" : "用英语输入..."}
          className="max-h-32 min-h-12 flex-1 resize-none rounded-xl border border-[#2a3441] bg-[#141a22] px-4 py-3 text-base text-[#e8edf2] placeholder:text-[#5c6878] focus:border-[#5b9fd4] focus:outline-none disabled:opacity-50"
        />

        <button
          type="submit"
          disabled={disabled || !text.trim()}
          className="flex min-h-12 min-w-16 shrink-0 touch-manipulation items-center justify-center rounded-xl bg-[#5b9fd4] px-5 text-sm font-medium text-[#0b0f14] transition hover:bg-[#6eb0e0] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
        >
          发送
        </button>
      </form>
    </div>
  );
}

function MicIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-5 w-5"
      aria-hidden
    >
      <path d="M12 14a3 3 0 0 0 3-3V5a3 3 0 1 0-6 0v6a3 3 0 0 0 3 3Zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.92V21h2v-3.08A7 7 0 0 0 19 11h-2Z" />
    </svg>
  );
}
