import { Spinner } from "@/components/ui/Spinner";

interface AnalysisStatusBannerProps {
  message: string;
  percent: number;
  stepIndex: number;
  totalSteps: number;
}

export function AnalysisStatusBanner({
  message,
  percent,
  stepIndex,
  totalSteps,
}: AnalysisStatusBannerProps) {
  return (
    <div
      className="rounded-xl border border-blue-200 bg-blue-50 p-4"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-start gap-3">
        <Spinner className="mt-0.5 h-4 w-4 text-blue-600" label="분석 진행 중" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-medium text-blue-900">{message}</p>
            <span className="text-xs text-blue-700">
              {stepIndex > 0 ? `${stepIndex}/${totalSteps}단계` : "준비 중"}
            </span>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-blue-100">
            <div
              className="h-full rounded-full bg-blue-500 transition-all duration-500 ease-out"
              style={{ width: `${percent}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-blue-700">
            AI 분석에는 보통 30초~2분 정도 걸릴 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  );
}
