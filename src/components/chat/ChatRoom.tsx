"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { ChatMessage } from "@/types/chat";
import {
  SCENARIOS,
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
  const welcomeByScenario: Record<ScenarioId, string> = {
    daily:
      "Hi! Let's practice everyday English — hobbies, weather, food, or anything on your mind.",
    interview:
      'Hi! Tell me the role you are preparing for, or we can start with "Tell me about yourself."',
    travel:
      "Hi! Let's practice travel English — hotels, directions, or ordering at a café.",
  };

  return {
    id: `welcome-${scenarioId}`,
    role: "assistant",
    content: welcomeByScenario[scenarioId],
    createdAt: Date.now(),
  };
}

function createInitialMessagesMap(): Record<ScenarioId, ChatMessage[]> {
  return {
    daily: [createWelcomeMessage("daily")],
    interview: [createWelcomeMessage("interview")],
    travel: [createWelcomeMessage("travel")],
  };
}

function resolveInitialScenario(
  searchParams: URLSearchParams | null,
): ScenarioId {
  const fromUrl = searchParams?.get("scenario");
  return isScenarioId(fromUrl) ? fromUrl : "daily";
}

export function ChatRoom() {
  const searchParams = useSearchParams();
  const initialScenario = resolveInitialScenario(searchParams);
  const [scenario, setScenario] = useState<ScenarioId>(initialScenario);
  const [messagesByScenario, setMessagesByScenario] = useState<
    Record<ScenarioId, ChatMessage[]>
  >(createInitialMessagesMap);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(
    null,
  );
  const bottomRef = useRef<HTMLDivElement>(null);
  const { isSupported, isSpeaking, speak, stop } = useSpeechSynthesis();

  const messages = messagesByScenario[scenario];

  const updateScenarioMessages = (
    targetScenario: ScenarioId,
    updater: (prev: ChatMessage[]) => ChatMessage[],
  ) => {
    setMessagesByScenario((prev) => ({
      ...prev,
      [targetScenario]: updater(prev[targetScenario]),
    }));
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading, error, scenario]);

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
    setError(null);
  };

  const handleSend = async (text: string) => {
    const activeScenario = scenario;
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
      createdAt: Date.now(),
    };

    const nextMessages = [...messagesByScenario[activeScenario], userMessage];
    updateScenarioMessages(activeScenario, () => nextMessages);
    setIsLoading(true);
    setError(null);
    stop();

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenario: activeScenario,
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

      updateScenarioMessages(activeScenario, (prev) => [
        ...prev,
        assistantMessage,
      ]);

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
      <header className="z-10 shrink-0 space-y-3 border-b border-[var(--sf-border)] px-4 py-3">
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="flex h-9 w-9 shrink-0 touch-manipulation items-center justify-center rounded-lg border border-[var(--sf-border)] bg-[var(--sf-surface)] text-[var(--sf-muted)] transition active:scale-[0.98] hover:text-[var(--sf-text)]"
            aria-label="返回首页"
          >
            <BackIcon />
          </Link>

          <h1 className="min-w-0 flex-1 text-base font-semibold tracking-tight">
            SpeakFlow
          </h1>

          <ThemeToggle />

          {isSupported && (
            <button
              type="button"
              onClick={toggleAutoSpeak}
              title={autoSpeak ? "关闭自动朗读" : "开启自动朗读"}
              aria-label={autoSpeak ? "关闭自动朗读" : "开启自动朗读"}
              aria-pressed={autoSpeak}
              className={`flex h-9 w-9 touch-manipulation items-center justify-center rounded-lg border transition active:scale-[0.98] ${
                autoSpeak
                  ? "border-[var(--sf-accent)] bg-[var(--sf-accent-soft)] text-[var(--sf-accent)]"
                  : "border-[var(--sf-border)] bg-[var(--sf-surface)] text-[var(--sf-muted)]"
              }`}
            >
              <SpeakerIcon />
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
        <div className="mx-auto flex max-w-2xl flex-col gap-3">
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              canSpeak={isSupported && message.role === "assistant"}
              isSpeaking={isSpeaking && speakingMessageId === message.id}
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

function SpeakerIcon() {
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
      <path strokeLinecap="round" d="M11 5 6 9H3v6h3l5 4V5z" />
      <path strokeLinecap="round" d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    </svg>
  );
}
