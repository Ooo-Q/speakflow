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
    <div className="relative z-20 shrink-0 border-t border-[var(--sf-border)] bg-[var(--sf-bg)]/95 pb-[env(safe-area-inset-bottom)] backdrop-blur">
      {statusMessage && (
        <p
          className={`px-4 pt-2 text-center text-xs ${
            speechError ? "text-[var(--sf-error)]" : "text-[var(--sf-muted)]"
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
              ? "border-[var(--sf-listening-border)] bg-[var(--sf-listening-bg)] text-[var(--sf-listening-text)]"
              : "border-[var(--sf-border)] bg-[var(--sf-surface)] text-[var(--sf-muted)] hover:border-[var(--sf-scroll-hover)] hover:text-[var(--sf-text)]"
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
          className="max-h-32 min-h-12 flex-1 resize-none rounded-xl border border-[var(--sf-border)] bg-[var(--sf-surface)] px-4 py-3 text-base text-[var(--sf-text)] placeholder:text-[var(--sf-muted-2)] focus:border-[var(--sf-accent)] focus:outline-none disabled:opacity-50"
        />

        <button
          type="submit"
          disabled={disabled || !text.trim()}
          className="flex min-h-12 min-w-16 shrink-0 touch-manipulation items-center justify-center rounded-xl bg-[var(--sf-accent)] px-5 text-sm font-medium text-[var(--sf-accent-foreground)] transition hover:bg-[var(--sf-accent-hover)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
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
