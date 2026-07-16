import { describe, expect, it } from "vitest";
import { buildScaffoldFromJson, prepareCodeForPreview } from "@/lib/code/sandpack";
import type { DesignTokensResult, LayoutAnalysisResult } from "@/types";

const mockLayout: LayoutAnalysisResult = {
  summary: "랜딩 페이지",
  sections: ["Header", "Hero"],
  structure: { type: "div", role: "root" },
};

const mockTokens: DesignTokensResult = {
  colors: [
    { name: "primary", hex: "#1a1a1a" },
    { name: "background", hex: "#f5f5f5", usage: "page background" },
  ],
  typography: [{ element: "h1", fontSize: "24px", fontWeight: "700" }],
  spacing: [{ pattern: "section-gap", value: "16px" }],
};

describe("prepareCodeForPreview", () => {
  it("코드를 정규화하고 Sandpack 파일 구조를 생성한다", () => {
    const raw = "function App() { return <div />; }";
    const result = prepareCodeForPreview(raw);

    expect(result.code).toContain("export default");
    expect(result.validation.valid).toBe(true);
    expect(result.sandpackFiles["/App.tsx"].code).toBe(result.code);
    expect(result.sandpackFiles["/App.tsx"].active).toBe(true);
  });
});

describe("buildScaffoldFromJson", () => {
  it("레이아웃과 토큰으로 스캐폴딩 코드를 생성한다", () => {
    const code = buildScaffoldFromJson(mockLayout, mockTokens);

    expect(code).toContain("export default function GeneratedComponent");
    expect(code).toContain("랜딩 페이지");
    expect(code).toContain("Header");
    expect(code).toContain("Hero");
    expect(code).toContain("#1a1a1a");
    expect(code).toContain("#f5f5f5");
  });

  it("생성된 스캐폴딩 코드는 유효성 검증을 통과한다", () => {
    const code = buildScaffoldFromJson(mockLayout, mockTokens);
    const result = prepareCodeForPreview(code);
    expect(result.validation.valid).toBe(true);
  });
});
