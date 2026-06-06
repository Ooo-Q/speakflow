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
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";
import { MessageBubble } from "./MessageBubble";
import { ChatInput } from "./ChatInput";
import { TypingIndicator } from "./TypingIndicator";
import { ThemeToggle } from "@/components/ThemeToggle";
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
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(
    null,
  );
  const bottomRef = useRef<HTMLDivElement>(null);
  const { isSupported, isSpeaking, speak, stop } = useSpeechSynthesis();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading, error]);

  useEffect(() => {
    return () => stop();
  }, [stop]);

  const handleSpeak = (messageId: string, text: string) => {
    if (!isSupported) return;
    setSpeakingMessageId(messageId);
    speak(text);
  };

  useEffect(() => {
    if (!isSpeaking) {
      setSpeakingMessageId(null);
    }
  }, [isSpeaking]);

  const handleScenarioChange = (nextScenario: ScenarioId) => {
    if (nextScenario === scenario || isLoading) return;
    stop();
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
    stop();

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

      if (autoSpeak && isSupported) {
        handleSpeak(assistantMessage.id, assistantMessage.content);
      }
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

  const toggleAutoSpeak = () => {
    if (autoSpeak) {
      stop();
    }
    setAutoSpeak((prev) => !prev);
  };

  return (
    <div className="flex h-dvh max-h-dvh flex-col overflow-hidden bg-[var(--sf-bg)] text-[var(--sf-text)]">
      <header className="z-10 shrink-0 border-b border-[var(--sf-border)] bg-[var(--sf-bg)]">
        <div className="flex items-center gap-2 px-4 py-3 sm:gap-3">
          <Link
            href="/"
            className="flex h-10 w-10 touch-manipulation items-center justify-center rounded-lg border border-[var(--sf-border)] bg-[var(--sf-surface)] text-[var(--sf-muted)] transition active:scale-[0.98] hover:border-[var(--sf-scroll-hover)] hover:text-[var(--sf-text)]"
            aria-label="返回首页"
          >
            <BackIcon />
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="text-base font-semibold tracking-tight">SpeakFlow</h1>
            <p className="text-xs text-[var(--sf-muted)]">
              {getScenario(scenario).label}
            </p>
          </div>
          <ThemeToggle />
          {isSupported && (
            <button
              type="button"
              onClick={toggleAutoSpeak}
              className={`touch-manipulation shrink-0 rounded-lg border px-3 py-1.5 text-xs font-medium transition active:scale-[0.98] ${
                autoSpeak
                  ? "border-[var(--sf-accent)] bg-[var(--sf-accent-soft)] text-[var(--sf-accent)]"
                  : "border-[var(--sf-border)] bg-[var(--sf-surface)] text-[var(--sf-muted)]"
              }`}
            >
              {autoSpeak ? "朗读开" : "朗读关"}
            </button>
          )}
        </div>
        <ScenarioPicker
          value={scenario}
          scenarios={SCENARIOS}
          onChange={handleScenarioChange}
          disabled={isLoading}
        />
      </header>

      <div className="sf-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4">
        <div className="mx-auto flex max-w-2xl flex-col gap-4">
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              canSpeak={isSupported && message.role === "assistant"}
              isSpeaking={
                isSpeaking && speakingMessageId === message.id
              }
              onSpeak={(text) => handleSpeak(message.id, text)}
            />
          ))}
          {isLoading && <TypingIndicator />}
          {error && (
            <p className="rounded-xl border border-[var(--sf-error-border)] bg-[var(--sf-error-bg)] px-4 py-2 text-center text-sm text-[var(--sf-error)]">
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
