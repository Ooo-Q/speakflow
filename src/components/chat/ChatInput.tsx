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

    toggle(
      (transcript, isFinal) => {
        if (!isFinal) {
          setText(transcript);
        }
      },
      (transcript) => {
        if (transcript) {
          submit(transcript);
        }
      },
    );
  };

  return (
    <div className="border-t border-slate-700/80 bg-slate-900/90 backdrop-blur">
      {(speechError || isListening) && (
        <p
          className={`px-4 pt-2 text-center text-xs ${
            speechError ? "text-red-300" : "text-emerald-300"
          }`}
        >
          {speechError ?? (isListening ? "正在聆听，请说英语…" : "")}
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
          title={
            isSupported
              ? isListening
                ? "点击停止录音"
                : "语音输入"
              : "当前浏览器不支持语音输入"
          }
          aria-label={isListening ? "停止录音" : "语音输入"}
          aria-pressed={isListening}
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition disabled:cursor-not-allowed disabled:opacity-40 ${
            isListening
              ? "border-red-500 bg-red-500/20 text-red-400 animate-pulse"
              : "border-slate-600 text-slate-300 hover:border-emerald-500 hover:text-emerald-300"
          }`}
        >
          <MicIcon />
        </button>

        <textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled || isListening}
          rows={1}
          placeholder={isListening ? "正在识别…" : "用英语输入..."}
          className="max-h-32 min-h-[44px] flex-1 resize-none rounded-2xl border border-slate-600 bg-slate-800 px-4 py-2.5 text-[15px] text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-50"
        />

        <button
          type="submit"
          disabled={disabled || isListening || !text.trim()}
          className="flex h-11 shrink-0 items-center justify-center rounded-full bg-emerald-600 px-5 text-sm font-medium text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-40"
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
