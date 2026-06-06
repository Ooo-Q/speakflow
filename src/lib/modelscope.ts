import { ENGLISH_TUTOR_SYSTEM_PROMPT } from "./prompts";

const MODELSCOPE_BASE_URL = "https://api-inference.modelscope.cn/v1";
const DEFAULT_MODEL = "Qwen/Qwen2.5-7B-Instruct";

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
  };
}

export async function createChatCompletion(
  messages: ChatCompletionMessage[],
): Promise<string> {
  const token = process.env.MODELSCOPE_API_TOKEN;
  if (!token) {
    throw new Error("MODELSCOPE_API_TOKEN is not configured");
  }

  const model = process.env.MODELSCOPE_MODEL ?? DEFAULT_MODEL;

  const response = await fetch(`${MODELSCOPE_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: ENGLISH_TUTOR_SYSTEM_PROMPT },
        ...messages,
      ],
      temperature: 0.7,
      max_tokens: 512,
    }),
  });

  const data = (await response.json()) as ModelScopeChatResponse;

  if (!response.ok) {
    const detail = data.error?.message ?? response.statusText;
    throw new Error(detail || "ModelScope API request failed");
  }

  const content = data.choices?.[0]?.message?.content?.trim();
  if (!content) {
    throw new Error("Empty response from model");
  }

  return content;
}
