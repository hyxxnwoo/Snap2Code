import type { DesignTokensResult, LayoutAnalysisResult } from "@/types";

interface AnalysisSummaryProps {
  layout: LayoutAnalysisResult | null;
  tokens: DesignTokensResult | null;
}

export function AnalysisSummary({ layout, tokens }: AnalysisSummaryProps) {
  if (!layout && !tokens) return null;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {layout ? (
        <div className="rounded-xl border border-neutral-200 bg-white p-4">
          <h3 className="text-sm font-medium text-neutral-800">레이아웃 분석</h3>
          <p className="mt-2 text-sm text-neutral-600">{layout.summary}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {layout.sections.map((section) => (
              <span
                key={section}
                className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs text-neutral-600"
              >
                {section}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      {tokens ? (
        <div className="rounded-xl border border-neutral-200 bg-white p-4">
          <h3 className="text-sm font-medium text-neutral-800">디자인 토큰</h3>
          <div className="mt-3 flex flex-wrap gap-3">
            {tokens.colors.map((color) => (
              <div key={color.name} className="flex items-center gap-2">
                <span
                  className="h-6 w-6 rounded-md border border-neutral-200"
                  style={{ backgroundColor: color.hex }}
                />
                <div>
                  <p className="text-xs font-medium text-neutral-700">{color.name}</p>
                  <p className="text-xs text-neutral-500">{color.hex}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
