"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type SpeechRecognitionInstance = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onresult: ((event: SpeechRecognitionResultEvent) => void) | null;
};

type SpeechRecognitionResultEvent = {
  resultIndex: number;
  results: SpeechRecognitionResultList;
};

type SpeechRecognitionResultList = {
  length: number;
  [index: number]: {
    isFinal: boolean;
    0: { transcript: string };
  };
};

function getSpeechRecognitionCtor():
  | (new () => SpeechRecognitionInstance)
  | undefined {
  if (typeof window === "undefined") return undefined;
  const win = window as Window & {
    SpeechRecognition?: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
  };
  return win.SpeechRecognition ?? win.webkitSpeechRecognition;
}

export function useSpeechRecognition() {
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const Ctor = getSpeechRecognitionCtor();
    if (!Ctor) return;

    const recognition = new Ctor();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      setIsListening(false);
      if (event.error === "not-allowed") {
        setError("请允许浏览器使用麦克风");
      } else if (event.error !== "aborted") {
        setError("语音识别失败，请重试");
      }
    };

    recognitionRef.current = recognition;
    setIsSupported(true);

    return () => {
      recognition.stop();
      recognitionRef.current = null;
    };
  }, []);

  const start = useCallback(
    (
      onResult: (transcript: string, isFinal: boolean) => void,
      onFinal?: (transcript: string) => void,
    ) => {
      const recognition = recognitionRef.current;
      if (!recognition || isListening) return;

      recognition.onresult = (event) => {
        let interim = "";
        let finalText = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          const transcript = result[0]?.transcript ?? "";
          if (result.isFinal) {
            finalText += transcript;
          } else {
            interim += transcript;
          }
        }

        if (interim) {
          onResult(interim.trim(), false);
        }

        if (finalText) {
          const trimmed = finalText.trim();
          onResult(trimmed, true);
          onFinal?.(trimmed);
        }
      };

      setError(null);
      recognition.start();
    },
    [isListening],
  );

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  const toggle = useCallback(
    (
      onResult: (transcript: string, isFinal: boolean) => void,
      onFinal?: (transcript: string) => void,
    ) => {
      if (isListening) {
        stop();
        return;
      }
      start(onResult, onFinal);
    },
    [isListening, start, stop],
  );

  return {
    isSupported,
    isListening,
    error,
    toggle,
    stop,
    clearError: () => setError(null),
  };
}
