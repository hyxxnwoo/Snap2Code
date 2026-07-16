import type {
  AnalysisStepId,
  CodeGenerationResult,
  DesignTokensResult,
  LayoutAnalysisResult,
} from "@/types";

const REQUEST_TIMEOUT_MS = 60_000;

interface ApiErrorBody {
  error?: string;
  step?: AnalysisStepId;
  retryable?: boolean;
}

async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeoutMs = REQUEST_TIMEOUT_MS,
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error(`요청이 시간 초과되었습니다. (${timeoutMs / 1000}초)`);
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

async function postImageStep(
  endpoint: string,
  file: File,
): Promise<LayoutAnalysisResult | DesignTokensResult> {
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetchWithTimeout(endpoint, { method: "POST", body: formData });

  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as ApiErrorBody;
    throw new Error(body.error ?? `API 요청 실패 (${response.status})`);
  }

  return response.json();
}

async function postCodeStep(
  layout: LayoutAnalysisResult,
  tokens: DesignTokensResult,
): Promise<CodeGenerationResult> {
  const response = await fetchWithTimeout("/api/analyze/code", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ layout, tokens }),
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as ApiErrorBody;
    throw new Error(body.error ?? `API 요청 실패 (${response.status})`);
  }

  return response.json();
}

export async function runAnalysisPipeline(
  file: File,
  callbacks: {
    onStepStart: (step: AnalysisStepId) => void;
    onStepDone: (step: AnalysisStepId) => void;
    onStepError: (step: AnalysisStepId, message: string) => void;
    onLayout: (layout: LayoutAnalysisResult) => void;
    onTokens: (tokens: DesignTokensResult) => void;
    onCode: (code: CodeGenerationResult) => void;
  },
  startFrom: AnalysisStepId = "layout",
  existing?: {
    layout?: LayoutAnalysisResult | null;
    tokens?: DesignTokensResult | null;
  },
): Promise<void> {
  let layout = existing?.layout ?? null;
  let tokens = existing?.tokens ?? null;

  const steps: AnalysisStepId[] = ["layout", "tokens", "code"];
  const startIndex = steps.indexOf(startFrom);

  for (let i = startIndex; i < steps.length; i++) {
    const step = steps[i];
    callbacks.onStepStart(step);

    try {
      if (step === "layout") {
        layout = (await postImageStep("/api/analyze/layout", file)) as LayoutAnalysisResult;
        callbacks.onLayout(layout);
      } else if (step === "tokens") {
        tokens = (await postImageStep("/api/analyze/tokens", file)) as DesignTokensResult;
        callbacks.onTokens(tokens);
      } else if (step === "code") {
        if (!layout || !tokens) {
          throw new Error("코드 생성에 필요한 레이아웃/토큰 데이터가 없습니다.");
        }
        const code = await postCodeStep(layout, tokens);
        callbacks.onCode(code);
      }
      callbacks.onStepDone(step);
    } catch (error) {
      const message = error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.";
      callbacks.onStepError(step, message);
      throw error;
    }
  }
}
