import { NextResponse } from "next/server";
import { analyzeLayout } from "@/lib/gemini/pipeline";
import { handleApiError, parseImageFromFormData } from "@/lib/api/utils";

export async function POST(request: Request) {
  try {
    const parsed = await parseImageFromFormData(request);
    if ("error" in parsed) return parsed.error;

    const result = await analyzeLayout(parsed.imageBase64, parsed.mimeType);
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error, "layout");
  }
}
