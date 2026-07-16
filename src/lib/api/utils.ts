import { NextResponse } from "next/server";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp"];

export async function parseImageFromFormData(request: Request) {
  const formData = await request.formData();
  const file = formData.get("image");

  if (!file || !(file instanceof File)) {
    return { error: NextResponse.json({ error: "이미지 파일이 필요합니다." }, { status: 400 }) };
  }

  if (!ACCEPTED_TYPES.includes(file.type)) {
    return {
      error: NextResponse.json(
        { error: "PNG, JPEG, WebP 이미지 파일만 지원합니다." },
        { status: 400 },
      ),
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      error: NextResponse.json({ error: "파일 크기는 10MB 이하여야 합니다." }, { status: 400 }),
    };
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const imageBase64 = buffer.toString("base64");

  return { imageBase64, mimeType: file.type };
}

export function handleApiError(error: unknown, step: string) {
  const message =
    error instanceof Error ? error.message : `${step} 중 알 수 없는 오류가 발생했습니다.`;

  const isTimeout = message.includes("시간 초과");
  const isConfig = message.includes("GEMINI_API_KEY");

  return NextResponse.json(
    { error: message, step, retryable: !isConfig },
    { status: isConfig ? 500 : isTimeout ? 504 : 500 },
  );
}
