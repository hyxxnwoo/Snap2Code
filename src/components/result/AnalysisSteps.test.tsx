import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AnalysisSteps } from "@/components/result/AnalysisSteps";
import type { AnalysisStep } from "@/types";

const mockSteps: AnalysisStep[] = [
  { id: "layout", label: "레이아웃 구조 분석", status: "done" },
  { id: "tokens", label: "디자인 토큰 추출", status: "running" },
  { id: "code", label: "코드 생성", status: "idle" },
];

describe("AnalysisSteps", () => {
  it("모든 단계 라벨을 렌더링한다", () => {
    render(<AnalysisSteps steps={mockSteps} />);

    expect(screen.getByText("레이아웃 구조 분석")).toBeInTheDocument();
    expect(screen.getByText("디자인 토큰 추출")).toBeInTheDocument();
    expect(screen.getByText("코드 생성")).toBeInTheDocument();
  });

  it("완료된 단계에 체크 표시를 보여준다", () => {
    render(<AnalysisSteps steps={mockSteps} />);
    expect(screen.getByText("✓")).toBeInTheDocument();
  });

  it("진행 중인 단계에 상태 라벨을 보여준다", () => {
    render(<AnalysisSteps steps={mockSteps} />);
    expect(screen.getByText("진행 중")).toBeInTheDocument();
  });
});
