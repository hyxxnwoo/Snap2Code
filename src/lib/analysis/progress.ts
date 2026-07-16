import type { AnalysisStep, AnalysisStepId } from "@/types";

const STEP_MESSAGES: Record<AnalysisStepId, string> = {
  layout: "레이아웃 구조를 분석하고 있습니다",
  tokens: "색상·타이포·여백 토큰을 추출하고 있습니다",
  code: "Tailwind React 코드를 생성하고 있습니다",
};

const PANEL_WAIT_MESSAGES: Record<AnalysisStepId, string> = {
  layout: "레이아웃 분석이 끝나면 코드가 생성됩니다",
  tokens: "디자인 토큰 추출이 끝나면 코드가 생성됩니다",
  code: "코드를 생성하고 있습니다",
};

export function getRunningStep(steps: AnalysisStep[]) {
  return steps.find((step) => step.status === "running") ?? null;
}

export function getAnalysisProgress(steps: AnalysisStep[]) {
  const runningStep = getRunningStep(steps);
  const doneCount = steps.filter((step) => step.status === "done").length;
  const percent = Math.min(
    100,
    Math.round(((doneCount + (runningStep ? 0.4 : 0)) / steps.length) * 100),
  );

  const message = runningStep
    ? STEP_MESSAGES[runningStep.id]
    : doneCount === steps.length
      ? "분석이 완료되었습니다"
      : "분석을 준비하고 있습니다";

  return {
    percent,
    runningStep,
    message,
    stepIndex: runningStep ? steps.findIndex((step) => step.id === runningStep.id) + 1 : doneCount,
    totalSteps: steps.length,
    isComplete: doneCount === steps.length,
  };
}

export function getPanelLoadingMessage(steps: AnalysisStep[], isRunning: boolean) {
  if (!isRunning) return null;

  const runningStep = getRunningStep(steps);
  if (runningStep) {
    return PANEL_WAIT_MESSAGES[runningStep.id];
  }

  return "분석을 시작하고 있습니다";
}
