import { Suspense } from "react";
import { ChatRoom } from "@/components/chat/ChatRoom";

export default function ChatPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-dvh items-center justify-center bg-[#0b0f14] text-[#8b98a8]">
          加载中...
        </div>
      }
    >
      <ChatRoom />
    </Suspense>
  );
}
