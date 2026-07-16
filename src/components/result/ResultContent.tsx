"use client";

import { useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { AnalysisSteps } from "@/components/result/AnalysisSteps";
import { AnalysisErrorBanner } from "@/components/result/AnalysisErrorBanner";
import { AnalysisSummary } from "@/components/result/AnalysisSummary";
import { AnalysisStatusBanner } from "@/components/result/AnalysisStatusBanner";
import { CodePanel } from "@/components/result/CodePanel";
import { PreviewPanel } from "@/components/result/PreviewPanel";
import { UploadedImagePreview } from "@/components/result/UploadedImagePreview";
import { useAnalysisPipeline } from "@/hooks/useAnalysisPipeline";
import { getAnalysisProgress, getPanelLoadingMessage } from "@/lib/analysis/progress";
import { buildScaffoldFromJson, prepareCodeForPreview } from "@/lib/code/sandpack";
import { useUploadStore } from "@/store/useUploadStore";

export function ResultContent() {
  const router = useRouter();
  const image = useUploadStore((s) => s.image);
  const { steps, layout, tokens, code, error, isRunning, run, retry } = useAnalysisPipeline();
  const hasStarted = useRef(false);
  const progress = useMemo(() => getAnalysisProgress(steps), [steps]);
  const panelLoadingMessage = useMemo(
    () => getPanelLoadingMessage(steps, isRunning),
    [steps, isRunning],
  );

  useEffect(() => {
    if (!image) {
      router.replace("/");
      return;
    }

    if (!hasStarted.current) {
      hasStarted.current = true;
      run(image.file);
    }
  }, [image, router, run]);

  const preparedCode = useMemo(() => {
    if (!code?.code) return null;

    const prepared = prepareCodeForPreview(code.code);
    if (!prepared.validation.valid && layout && tokens) {
      const scaffold = buildScaffoldFromJson(layout, tokens);
      return prepareCodeForPreview(scaffold);
    }
    return prepared;
  }, [code, layout, tokens]);

  if (!image) return null;

  const isAnalysisLoading = isRunning;
  const isCodeLoading = isAnalysisLoading;
  const isAnalysisDone = progress.isComplete;

  const showSummary = layout || tokens;

  return (
    <Container>
      <div className="py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-semibold tracking-tight text-neutral-900">분석 결과</h1>
          <Link
            href="/"
            className="rounded-md px-3 py-1.5 text-sm text-neutral-600 hover:bg-neutral-100"
          >
            새 이미지 업로드
          </Link>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <UploadedImagePreview previewUrl={image.previewUrl} name={image.name} />
          </div>
          <div className="space-y-4 lg:col-span-3">
            {isRunning ? (
              <AnalysisStatusBanner
                message={progress.message}
                percent={progress.percent}
                stepIndex={progress.stepIndex}
                totalSteps={progress.totalSteps}
              />
            ) : null}
            <div className="rounded-xl border border-neutral-200 bg-white p-4">
              <AnalysisSteps steps={steps} progressPercent={isRunning ? progress.percent : undefined} />
            </div>
            {error ? (
              <AnalysisErrorBanner
                error={error}
                onRetry={() => retry(image.file)}
                isRetrying={isRunning}
              />
            ) : null}
          </div>
        </div>

        {showSummary ? (
          <div className="mb-6">
            <AnalysisSummary layout={layout} tokens={tokens} />
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-6 lg:min-h-[70vh] lg:grid-cols-2">
          <CodePanel
            code={preparedCode?.code ?? null}
            isLoading={isCodeLoading}
            loadingMessage={panelLoadingMessage}
          />
          <PreviewPanel
            code={preparedCode?.validation.valid ? (preparedCode?.code ?? null) : null}
            isLoading={isCodeLoading}
            loadingMessage={panelLoadingMessage}
            validationError={
              isAnalysisDone && preparedCode && !preparedCode.validation.valid
                ? preparedCode.validation.error
                : undefined
            }
          />
        </div>
      </div>
    </Container>
  );
}
