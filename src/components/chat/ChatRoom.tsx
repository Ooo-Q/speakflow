"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { ChatMessage } from "@/types/chat";
import { MessageBubble } from "./MessageBubble";
import { ChatInput } from "./ChatInput";

const WELCOME_MESSAGE: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content:
    "Hi! I'm your English speaking partner. Tell me what you'd like to practice — daily chat, job interviews, or travel conversations.",
  createdAt: Date.now(),
};

export function ChatRoom() {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (text: string) => {
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
      createdAt: Date.now(),
    };
    setMessages((prev) => [...prev, userMessage]);
  };

  return (
    <div className="flex h-dvh flex-col bg-gradient-to-b from-slate-950 to-slate-900 text-white">
      <header className="flex items-center gap-3 border-b border-slate-700/80 px-4 py-3">
        <Link
          href="/"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-600 text-slate-300 transition hover:border-slate-500 hover:text-white"
          aria-label="Back to home"
        >
          <BackIcon />
        </Link>
        <div>
          <h1 className="text-base font-semibold">SpeakFlow</h1>
          <p className="text-xs text-slate-400">English speaking practice</p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="mx-auto flex max-w-2xl flex-col gap-4">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          <div ref={bottomRef} />
        </div>
      </div>

      <div className="mx-auto w-full max-w-2xl">
        <ChatInput onSend={handleSend} />
      </div>
    </div>
  );
}

function BackIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className="h-4 w-4"
      aria-hidden
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
    </svg>
  );
}
