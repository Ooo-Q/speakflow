"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { ChatMessage } from "@/types/chat";
import {
  SCENARIOS,
  getScenario,
  isScenarioId,
  type ScenarioId,
} from "@/types/scenario";
import { MessageBubble } from "./MessageBubble";
import { ChatInput } from "./ChatInput";
import { TypingIndicator } from "./TypingIndicator";
import { ScenarioPicker } from "./ScenarioPicker";

function createWelcomeMessage(scenarioId: ScenarioId): ChatMessage {
  const scenario = getScenario(scenarioId);
  return {
    id: `welcome-${scenarioId}`,
    role: "assistant",
    content: scenario.welcome,
    createdAt: Date.now(),
  };
}

function resolveInitialScenario(searchParams: URLSearchParams | null): ScenarioId {
  const fromUrl = searchParams?.get("scenario");
  return isScenarioId(fromUrl) ? fromUrl : "daily";
}

export function ChatRoom() {
  const searchParams = useSearchParams();
  const [scenario, setScenario] = useState<ScenarioId>(() =>
    resolveInitialScenario(searchParams),
  );
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    createWelcomeMessage(resolveInitialScenario(searchParams)),
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading, error]);

  const handleScenarioChange = (nextScenario: ScenarioId) => {
    if (nextScenario === scenario || isLoading) return;
    setScenario(nextScenario);
    setMessages([createWelcomeMessage(nextScenario)]);
    setError(null);
  };

  const handleSend = async (text: string) => {
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
      createdAt: Date.now(),
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenario,
          messages: nextMessages.map((message) => ({
            role: message.role,
            content: message.content,
          })),
        }),
      });

      const data = (await response.json()) as {
        content?: string;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(data.error ?? "Request failed");
      }

      if (!data.content) {
        throw new Error("Empty response");
      }

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: data.content,
        createdAt: Date.now(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (requestError) {
      const fallback = "暂时无法获取回复，请检查网络后重试。";
      if (requestError instanceof Error && requestError.message) {
        setError(requestError.message);
      } else {
        setError(fallback);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-dvh max-h-dvh flex-col overflow-hidden bg-gradient-to-b from-slate-950 to-slate-900 text-white">
      <header className="z-10 shrink-0 border-b border-slate-700/80 bg-slate-950/90">
        <div className="flex items-center gap-3 px-4 py-3">
          <Link
            href="/"
            className="flex h-11 w-11 touch-manipulation items-center justify-center rounded-full border border-slate-600 text-slate-300 transition active:scale-95 hover:border-slate-500 hover:text-white"
            aria-label="返回首页"
          >
            <BackIcon />
          </Link>
          <div>
            <h1 className="text-base font-semibold">SpeakFlow</h1>
            <p className="text-xs text-slate-400">
              {getScenario(scenario).label}
            </p>
          </div>
        </div>
        <ScenarioPicker
          value={scenario}
          scenarios={SCENARIOS}
          onChange={handleScenarioChange}
          disabled={isLoading}
        />
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4">
        <div className="mx-auto flex max-w-2xl flex-col gap-4">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          {isLoading && <TypingIndicator />}
          {error && (
            <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-center text-sm text-red-300">
              {error}
            </p>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      <div className="mx-auto w-full max-w-2xl">
        <ChatInput onSend={handleSend} disabled={isLoading} />
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
