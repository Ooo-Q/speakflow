import { NextRequest, NextResponse } from "next/server";
import {
  createChatCompletion,
  type ChatCompletionMessage,
} from "@/lib/modelscope";

function isValidMessages(value: unknown): value is ChatCompletionMessage[] {
  if (!Array.isArray(value) || value.length === 0) return false;
  return value.every(
    (item) =>
      item &&
      typeof item === "object" &&
      (item.role === "user" || item.role === "assistant") &&
      typeof item.content === "string" &&
      item.content.trim().length > 0,
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages } = body;

    if (!isValidMessages(messages)) {
      return NextResponse.json(
        { error: "Invalid messages payload" },
        { status: 400 },
      );
    }

    const content = await createChatCompletion(messages);
    return NextResponse.json({ content });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Chat request failed";
    console.error("[api/chat]", message);

    const hint =
      message.includes("MODELSCOPE_API_TOKEN") ||
      message.toLowerCase().includes("unauthorized") ||
      message.toLowerCase().includes("authentication")
        ? "Please check MODELSCOPE_API_TOKEN in .env.local"
        : "Unable to get a reply. Please try again.";

    return NextResponse.json({ error: hint }, { status: 502 });
  }
}
