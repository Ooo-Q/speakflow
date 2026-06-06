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
  const listeningRef = useRef(false);
  const [isSupported, setIsSupported] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setListening = useCallback((value: boolean) => {
    listeningRef.current = value;
    setIsListening(value);
  }, []);

  useEffect(() => {
    const Ctor = getSpeechRecognitionCtor();
    if (!Ctor) return;

    const recognition = new Ctor();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setListening(true);
      setError(null);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.onerror = (event) => {
      setListening(false);
      if (event.error === "not-allowed") {
        setError("请允许浏览器使用麦克风");
      } else if (event.error !== "aborted") {
        setError("语音识别失败，请重试");
      }
    };

    recognitionRef.current = recognition;
    setIsSupported(true);

    return () => {
      try {
        recognition.stop();
      } catch {
        // ignore cleanup errors
      }
      recognitionRef.current = null;
      listeningRef.current = false;
    };
  }, [setListening]);

  const stop = useCallback(() => {
    const recognition = recognitionRef.current;
    if (!recognition || !listeningRef.current) return;

    try {
      recognition.stop();
    } catch {
      setListening(false);
    }
  }, [setListening]);

  const start = useCallback(
    (
      onResult: (transcript: string, isFinal: boolean) => void,
      onFinal?: (transcript: string) => void,
    ) => {
      const recognition = recognitionRef.current;
      if (!recognition || listeningRef.current) return;

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

      try {
        recognition.start();
      } catch (startError) {
        setListening(false);
        if (
          startError instanceof DOMException &&
          startError.name === "InvalidStateError"
        ) {
          setError("语音识别正在启动，请稍候再试");
          return;
        }
        setError("语音识别启动失败，请重试");
      }
    },
    [setListening],
  );

  const toggle = useCallback(
    (
      onResult: (transcript: string, isFinal: boolean) => void,
      onFinal?: (transcript: string) => void,
    ) => {
      if (listeningRef.current) {
        stop();
        return;
      }
      start(onResult, onFinal);
    },
    [start, stop],
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
