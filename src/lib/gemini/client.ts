import { GoogleGenAI } from "@google/genai";

/** 신규 API 키에서 사용 가능한 모델 우선순위 */
const DEFAULT_MODEL = "gemini-3.5-flash";
const FALLBACK_MODELS = [
  "gemini-3.5-flash",
  "gemini-3.1-flash-lite",
  "gemini-2.0-flash",
  "gemini-3-flash-preview",
] as const;

const REQUEST_TIMEOUT_MS = 60_000;

function getClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY가 설정되지 않았습니다.");
  }
  return new GoogleGenAI({ apiKey });
}

function getModelCandidates(): string[] {
  const preferred = process.env.GEMINI_MODEL;
  const candidates = preferred ? [preferred, ...FALLBACK_MODELS] : [...FALLBACK_MODELS];
  return [...new Set(candidates)];
}

function isRetryableModelError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return (
    message.includes("404") ||
    message.includes("NOT_FOUND") ||
    message.includes("503") ||
    message.includes("UNAVAILABLE") ||
    message.includes("no longer available") ||
    message.includes("high demand")
  );
}

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) => {
      setTimeout(
        () => reject(new Error(`${label} 요청이 시간 초과되었습니다. (${ms / 1000}초)`)),
        ms,
      );
    }),
  ]);
}

interface GenerateOptions {
  prompt: string;
  imageBase64?: string;
  mimeType?: string;
  responseJsonSchema?: Record<string, unknown>;
}

async function callModel(
  ai: GoogleGenAI,
  model: string,
  { prompt, imageBase64, mimeType, responseJsonSchema }: GenerateOptions,
) {
  const contents =
    imageBase64 && mimeType ? [{ inlineData: { data: imageBase64, mimeType } }, prompt] : prompt;

  return withTimeout(
    ai.models.generateContent({
      model,
      contents,
      config: responseJsonSchema
        ? {
            responseMimeType: "application/json",
            responseJsonSchema,
          }
        : undefined,
    }),
    REQUEST_TIMEOUT_MS,
    "Gemini API",
  );
}

export async function generateWithGemini(options: GenerateOptions): Promise<string> {
  const ai = getClient();
  const models = getModelCandidates();
  const errors: string[] = [];

  for (const model of models) {
    try {
      const response = await callModel(ai, model, options);
      const text = response.text;
      if (!text) {
        throw new Error("Gemini API가 빈 응답을 반환했습니다.");
      }
      return text;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      errors.push(`[${model}] ${message}`);

      if (!isRetryableModelError(error)) {
        throw error instanceof Error ? error : new Error(message);
      }
    }
  }

  throw new Error(
    `사용 가능한 Gemini 모델이 없습니다. 잠시 후 다시 시도해 주세요.\n${errors.join("\n")}`,
  );
}
