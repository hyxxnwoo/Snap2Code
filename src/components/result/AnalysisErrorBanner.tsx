import type { AnalysisError } from "@/types";

interface AnalysisErrorBannerProps {
  error: AnalysisError;
  onRetry: () => void;
  isRetrying: boolean;
}

export function AnalysisErrorBanner({ error, onRetry, isRetrying }: AnalysisErrorBannerProps) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-red-800">분석 중 오류가 발생했습니다</p>
          <p className="mt-1 text-sm text-red-600">{error.message}</p>
        </div>
        <button
          type="button"
          onClick={onRetry}
          disabled={isRetrying}
          className="shrink-0 rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-300"
        >
          {isRetrying ? "재시도 중..." : "재시도"}
        </button>
      </div>
    </div>
  );
}
