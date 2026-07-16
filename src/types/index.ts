export type AnalysisStepId = "layout" | "tokens" | "code";

export type AnalysisStepStatus = "idle" | "running" | "done" | "error";

export interface AnalysisStep {
  id: AnalysisStepId;
  label: string;
  status: AnalysisStepStatus;
}

export interface UploadedImage {
  file: File;
  previewUrl: string;
  name: string;
  size: number;
}

export interface LayoutNode {
  type: string;
  role?: string;
  layout?: "flex" | "grid" | "block";
  direction?: "row" | "column";
  columns?: number;
  children?: LayoutNode[];
}

export interface LayoutAnalysisResult {
  summary: string;
  sections: string[];
  structure: LayoutNode;
}

export interface ColorToken {
  name: string;
  hex: string;
  usage?: string;
}

export interface TypographyToken {
  element: string;
  fontSize: string;
  fontWeight: string;
}

export interface SpacingToken {
  pattern: string;
  value: string;
}

export interface DesignTokensResult {
  colors: ColorToken[];
  typography: TypographyToken[];
  spacing: SpacingToken[];
}

export interface CodeGenerationResult {
  code: string;
  language: "tsx";
}

export interface AnalysisError {
  step: AnalysisStepId;
  message: string;
}

export const INITIAL_ANALYSIS_STEPS: AnalysisStep[] = [
  { id: "layout", label: "레이아웃 구조 분석", status: "idle" },
  { id: "tokens", label: "디자인 토큰 추출", status: "idle" },
  { id: "code", label: "코드 생성", status: "idle" },
];
