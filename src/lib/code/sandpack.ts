import type { DesignTokensResult, LayoutAnalysisResult } from "@/types";
import { normalizeGeneratedCode } from "@/lib/code/normalize";
import { validateCode } from "@/lib/code/validate";

export interface PreparedCode {
  code: string;
  sandpackFiles: Record<string, { code: string; active?: boolean }>;
  validation: ReturnType<typeof validateCode>;
}

const TAILWIND_CDN = "https://cdn.tailwindcss.com";

/**
 * AI 생성 코드를 정규화하고 Sandpack 파일 구조로 변환합니다.
 */
export function prepareCodeForPreview(rawCode: string): PreparedCode {
  const code = normalizeGeneratedCode(rawCode);
  const validation = validateCode(code);

  return {
    code,
    validation,
    sandpackFiles: {
      "/App.tsx": { code, active: true },
    },
  };
}

/**
 * 레이아웃 + 토큰 JSON으로 기본 스캐폴딩 코드를 생성합니다 (폴백/디버깅용).
 */
export function buildScaffoldFromJson(
  layout: LayoutAnalysisResult,
  tokens: DesignTokensResult,
): string {
  const primaryColor = tokens.colors[0]?.hex ?? "#1a1a1a";
  const bgColor = tokens.colors.find((c) => c.usage?.includes("background"))?.hex ?? "#ffffff";

  const sections = layout.sections
    .map(
      (section) =>
        `      <section className="rounded-lg border border-neutral-200 p-6">\n        <h2 className="text-lg font-semibold text-neutral-800">${section}</h2>\n        <p className="mt-2 text-sm text-neutral-500">${section} 영역</p>\n      </section>`,
    )
    .join("\n");

  return `export default function GeneratedComponent() {
  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: "${bgColor}" }}>
      <header className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: "${primaryColor}" }}>
          ${layout.summary}
        </h1>
      </header>
      <main className="flex flex-col gap-4">
${sections}
      </main>
    </div>
  );
}`;
}

export { TAILWIND_CDN };
