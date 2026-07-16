import type { AnalysisStep, AnalysisStepStatus } from "@/types";

const STATUS_STYLES: Record<AnalysisStepStatus, { circle: string; text: string; label?: string }> =
  {
    idle: {
      circle: "bg-neutral-200 text-neutral-500",
      text: "text-neutral-500",
    },
    running: {
      circle: "bg-blue-100 text-blue-600 ring-2 ring-blue-300",
      text: "text-blue-700 font-medium",
      label: "진행 중",
    },
    done: {
      circle: "bg-green-100 text-green-700",
      text: "text-green-700",
      label: "완료",
    },
    error: {
      circle: "bg-red-100 text-red-600",
      text: "text-red-600",
      label: "실패",
    },
  };

interface AnalysisStepsProps {
  steps: AnalysisStep[];
}

export function AnalysisSteps({ steps }: AnalysisStepsProps) {
  return (
    <ol className="flex flex-wrap items-center gap-4">
      {steps.map((step, index) => {
        const style = STATUS_STYLES[step.status];
        return (
          <li key={step.id} className="flex items-center gap-2">
            <span
              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium transition-colors ${style.circle}`}
            >
              {step.status === "done" ? "✓" : step.status === "error" ? "!" : index + 1}
            </span>
            <div className="flex flex-col">
              <span className={`text-sm ${style.text}`}>{step.label}</span>
              {style.label ? <span className={`text-xs ${style.text}`}>{style.label}</span> : null}
            </div>
            {index < steps.length - 1 ? (
              <span className="ml-2 hidden text-neutral-300 sm:inline">→</span>
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
