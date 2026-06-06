"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type SpeechRecognitionInstance = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  abort: () => void;
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

function isIosDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

export function useSpeechRecognition() {
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const listeningRef = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unsupportedReason, setUnsupportedReason] = useState<string | null>(
    null,
  );

  const setListening = useCallback((value: boolean) => {
    listeningRef.current = value;
    setIsListening(value);
  }, []);

  const clearListenTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const cleanupRecognition = useCallback(() => {
    const recognition = recognitionRef.current;
    if (!recognition) return;

    recognition.onstart = null;
    recognition.onend = null;
    recognition.onerror = null;
    recognition.onresult = null;

    try {
      recognition.abort();
    } catch {
      try {
        recognition.stop();
      } catch {
        // ignore
      }
    }

    recognitionRef.current = null;
  }, []);

  useEffect(() => {
    const Ctor = getSpeechRecognitionCtor();

    if (!Ctor) {
      setUnsupportedReason(
        isIosDevice()
          ? "iPhone/iPad 浏览器暂不支持网页语音识别，请用电脑 Chrome 访问"
          : "当前浏览器不支持语音识别，请使用 Chrome 或 Edge",
      );
      return;
    }

    if (typeof window !== "undefined" && !window.isSecureContext) {
      setUnsupportedReason(
        "语音功能需要 HTTPS 或 localhost，手机请等部署后再试",
      );
      return;
    }

    setIsSupported(true);

    return () => {
      clearListenTimeout();
      cleanupRecognition();
      setListening(false);
    };
  }, [cleanupRecognition, clearListenTimeout, setListening]);

  const stop = useCallback(() => {
    clearListenTimeout();
    cleanupRecognition();
    setListening(false);
  }, [cleanupRecognition, clearListenTimeout, setListening]);

  const start = useCallback(
    (
      onResult: (transcript: string, isFinal: boolean) => void,
      onFinal?: (transcript: string) => void,
    ) => {
      if (!isSupported || listeningRef.current) return;

      const Ctor = getSpeechRecognitionCtor();
      if (!Ctor) return;

      cleanupRecognition();

      const recognition = new Ctor();
      recognition.lang = "en-US";
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setListening(true);
        setError(null);
      };

      recognition.onend = () => {
        clearListenTimeout();
        setListening(false);
        recognitionRef.current = null;
      };

      recognition.onerror = (event) => {
        clearListenTimeout();
        setListening(false);
        recognitionRef.current = null;

        if (event.error === "not-allowed") {
          setError("请允许浏览器使用麦克风");
        } else if (event.error === "no-speech") {
          setError("没有检测到语音，请靠近麦克风再试");
        } else if (event.error === "network") {
          setError("语音识别需要网络，请检查连接");
        } else if (event.error !== "aborted") {
          setError("语音识别失败，请重试");
        }
      };

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

      recognitionRef.current = recognition;
      setError(null);

      try {
        recognition.start();
        timeoutRef.current = setTimeout(() => {
          if (listeningRef.current) {
            stop();
            setError("录音超时，请再试一次");
          }
        }, 15000);
      } catch (startError) {
        cleanupRecognition();
        setListening(false);
        if (
          startError instanceof DOMException &&
          startError.name === "InvalidStateError"
        ) {
          setError("请稍候再点击语音按钮");
          return;
        }
        setError("语音识别启动失败，请重试");
      }
    },
    [
      cleanupRecognition,
      clearListenTimeout,
      isSupported,
      setListening,
      stop,
    ],
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
    unsupportedReason,
    toggle,
    stop,
    clearError: () => setError(null),
  };
}
