import { NextResponse } from "next/server";
import { generateCode } from "@/lib/gemini/pipeline";
import { handleApiError } from "@/lib/api/utils";
import type { DesignTokensResult, LayoutAnalysisResult } from "@/types";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.layout || !body.tokens) {
      return NextResponse.json({ error: "layout과 tokens 데이터가 필요합니다." }, { status: 400 });
    }

    const result = await generateCode(
      body.layout as LayoutAnalysisResult,
      body.tokens as DesignTokensResult,
    );
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error, "code");
  }
}
