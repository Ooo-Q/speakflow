import { NextRequest, NextResponse } from "next/server";
import {
  createChatCompletion,
  type ChatCompletionMessage,
} from "@/lib/modelscope";
import { isScenarioId } from "@/types/scenario";

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
    const { messages, scenario } = body;

    if (!isValidMessages(messages)) {
      return NextResponse.json(
        { error: "Invalid messages payload" },
        { status: 400 },
      );
    }

    const scenarioId = isScenarioId(scenario) ? scenario : "daily";
    const content = await createChatCompletion(messages, scenarioId);
    return NextResponse.json({ content });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Chat request failed";
    console.error("[api/chat]", message);

    let hint = "Unable to get a reply. Please try again.";

    if (
      message.includes("MODELSCOPE_API_TOKEN") ||
      message.toLowerCase().includes("unauthorized") ||
      message.toLowerCase().includes("authentication")
    ) {
      hint = "Please check MODELSCOPE_API_TOKEN in .env.local";
    } else if (message.toLowerCase().includes("bind your alibaba cloud account")) {
      hint =
        "请先在魔搭社区绑定阿里云账号后再使用推理 API（免费，无需充值）。打开 modelscope.cn → 头像 → 账号设置 → 绑定阿里云。";
    }

    return NextResponse.json({ error: hint }, { status: 502 });
  }
}
