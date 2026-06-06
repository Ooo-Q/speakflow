import { Suspense } from "react";
import { ChatRoom } from "@/components/chat/ChatRoom";

export default function ChatPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-dvh items-center justify-center bg-[var(--sf-bg)] text-[var(--sf-muted)]">
          加载中...
        </div>
      }
    >
      <ChatRoom />
    </Suspense>
  );
}
