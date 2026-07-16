import { Spinner } from "@/components/ui/Spinner";
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
  progressPercent?: number;
}

export function AnalysisSteps({ steps, progressPercent }: AnalysisStepsProps) {
  return (
    <div className="space-y-4">
      <ol className="flex flex-wrap items-center gap-4">
        {steps.map((step, index) => {
          const style = STATUS_STYLES[step.status];
          return (
            <li key={step.id} className="flex items-center gap-2">
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium transition-colors ${style.circle}`}
              >
                {step.status === "running" ? (
                  <Spinner className="h-3.5 w-3.5" label={`${step.label} 진행 중`} />
                ) : step.status === "done" ? (
                  "✓"
                ) : step.status === "error" ? (
                  "!"
                ) : (
                  index + 1
                )}
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
      {typeof progressPercent === "number" ? (
        <div className="h-1 overflow-hidden rounded-full bg-neutral-100">
          <div
            className="h-full rounded-full bg-neutral-900 transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
            role="progressbar"
            aria-valuenow={progressPercent}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
      ) : null}
    </div>
  );
}
