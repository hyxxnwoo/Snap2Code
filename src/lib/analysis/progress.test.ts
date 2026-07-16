import { describe, expect, it } from "vitest";
import { getAnalysisProgress, getPanelLoadingMessage } from "@/lib/analysis/progress";
import type { AnalysisStep } from "@/types";

const baseSteps: AnalysisStep[] = [
  { id: "layout", label: "레이아웃 구조 분석", status: "idle" },
  { id: "tokens", label: "디자인 토큰 추출", status: "idle" },
  { id: "code", label: "코드 생성", status: "idle" },
];

describe("getAnalysisProgress", () => {
  it("분석 준비 중 메시지를 반환한다", () => {
    const result = getAnalysisProgress(baseSteps);

    expect(result.percent).toBe(0);
    expect(result.message).toBe("분석을 준비하고 있습니다");
    expect(result.isComplete).toBe(false);
  });

  it("진행 중 단계 메시지와 진행률을 반환한다", () => {
    const steps: AnalysisStep[] = [
      { ...baseSteps[0], status: "done" },
      { ...baseSteps[1], status: "running" },
      { ...baseSteps[2], status: "idle" },
    ];

    const result = getAnalysisProgress(steps);

    expect(result.percent).toBeGreaterThan(33);
    expect(result.message).toBe("색상·타이포·여백 토큰을 추출하고 있습니다");
    expect(result.stepIndex).toBe(2);
  });

  it("완료 상태를 반환한다", () => {
    const steps = baseSteps.map((step) => ({ ...step, status: "done" as const }));
    const result = getAnalysisProgress(steps);

    expect(result.percent).toBe(100);
    expect(result.message).toBe("분석이 완료되었습니다");
    expect(result.isComplete).toBe(true);
  });
});

describe("getPanelLoadingMessage", () => {
  it("실행 중이 아니면 null을 반환한다", () => {
    expect(getPanelLoadingMessage(baseSteps, false)).toBeNull();
  });

  it("코드 생성 단계 메시지를 반환한다", () => {
    const steps: AnalysisStep[] = [
      { ...baseSteps[0], status: "done" },
      { ...baseSteps[1], status: "done" },
      { ...baseSteps[2], status: "running" },
    ];

    expect(getPanelLoadingMessage(steps, true)).toBe("코드를 생성하고 있습니다");
  });
});
