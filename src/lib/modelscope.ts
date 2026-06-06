import { getSystemPrompt } from "./prompts";
import type { ScenarioId } from "@/types/scenario";

const MODELSCOPE_BASE_URL = "https://api-inference.modelscope.cn/v1";
const DEFAULT_MODEL = "Qwen/Qwen3-32B";

export interface ChatCompletionMessage {
  role: "user" | "assistant";
  content: string;
}

interface ModelScopeChatResponse {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
  error?: {
    message?: string;
    code?: string;
  };
  message?: string;
}

function getApiToken(): string {
  const token = process.env.MODELSCOPE_API_TOKEN?.trim();
  if (!token) {
    throw new Error("MODELSCOPE_API_TOKEN is not configured");
  }
  return token;
}

export async function createChatCompletion(
  messages: ChatCompletionMessage[],
  scenario: ScenarioId = "daily",
): Promise<string> {
  const token = getApiToken();
  const model = (process.env.MODELSCOPE_MODEL ?? DEFAULT_MODEL).trim();

  const response = await fetch(`${MODELSCOPE_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: getSystemPrompt(scenario) },
        ...messages,
      ],
      temperature: 0.7,
      max_tokens: 512,
      enable_thinking: false,
    }),
  });

  const raw = await response.text();
  let data: ModelScopeChatResponse = {};

  try {
    data = JSON.parse(raw) as ModelScopeChatResponse;
  } catch {
    throw new Error(`Invalid API response: ${raw.slice(0, 120)}`);
  }

  if (!response.ok) {
    const detail =
      data.error?.message ?? data.message ?? raw.slice(0, 200) ?? response.statusText;
    throw new Error(detail || "ModelScope API request failed");
  }

  const content = data.choices?.[0]?.message?.content?.trim();
  if (!content) {
    throw new Error("Empty response from model");
  }

  return content;
}
