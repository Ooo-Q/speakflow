import { Suspense } from "react";
import { ChatRoom } from "@/components/chat/ChatRoom";

export default function ChatPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-dvh items-center justify-center bg-slate-950 text-slate-400">
          Loading...
        </div>
      }
    >
      <ChatRoom />
    </Suspense>
  );
}
