import type { CodeGenerationResult, DesignTokensResult, LayoutAnalysisResult } from "@/types";
import { generateWithGemini } from "@/lib/gemini/client";
import {
  LAYOUT_PROMPT,
  LAYOUT_SCHEMA,
  TOKENS_PROMPT,
  TOKENS_SCHEMA,
  buildCodePrompt,
  CODE_SCHEMA,
} from "@/lib/gemini/prompts";

function parseJson<T>(text: string, step: string): T {
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error(`${step} 단계 응답을 JSON으로 파싱할 수 없습니다.`);
  }
}

export async function analyzeLayout(
  imageBase64: string,
  mimeType: string,
): Promise<LayoutAnalysisResult> {
  const text = await generateWithGemini({
    prompt: LAYOUT_PROMPT,
    imageBase64,
    mimeType,
    responseJsonSchema: LAYOUT_SCHEMA,
  });
  return parseJson<LayoutAnalysisResult>(text, "레이아웃 분석");
}

export async function extractTokens(
  imageBase64: string,
  mimeType: string,
): Promise<DesignTokensResult> {
  const text = await generateWithGemini({
    prompt: TOKENS_PROMPT,
    imageBase64,
    mimeType,
    responseJsonSchema: TOKENS_SCHEMA,
  });
  return parseJson<DesignTokensResult>(text, "토큰 추출");
}

export async function generateCode(
  layout: LayoutAnalysisResult,
  tokens: DesignTokensResult,
): Promise<CodeGenerationResult> {
  const text = await generateWithGemini({
    prompt: buildCodePrompt(layout, tokens),
    responseJsonSchema: CODE_SCHEMA,
  });
  const result = parseJson<CodeGenerationResult>(text, "코드 생성");
  return { ...result, language: "tsx" };
}
