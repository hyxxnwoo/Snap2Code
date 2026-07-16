"use client";

import { useCallback, useRef } from "react";
import { runAnalysisPipeline } from "@/lib/analysis/pipeline-client";
import { useAnalysisStore } from "@/store/useAnalysisStore";
import type { AnalysisStepId } from "@/types";

export function useAnalysisPipeline() {
  const steps = useAnalysisStore((s) => s.steps);
  const layout = useAnalysisStore((s) => s.layout);
  const tokens = useAnalysisStore((s) => s.tokens);
  const code = useAnalysisStore((s) => s.code);
  const error = useAnalysisStore((s) => s.error);
  const isRunning = useAnalysisStore((s) => s.isRunning);
  const runningRef = useRef(false);

  const run = useCallback(async (file: File, startFrom: AnalysisStepId = "layout") => {
    if (runningRef.current) return;
    runningRef.current = true;

    const {
      setIsRunning,
      setError,
      reset,
      setStepStatus,
      setLayout,
      setTokens,
      setCode,
      steps: currentSteps,
      layout: currentLayout,
      tokens: currentTokens,
    } = useAnalysisStore.getState();

    setIsRunning(true);
    setError(null);

    if (startFrom === "layout") {
      reset();
      setIsRunning(true);
    } else {
      const failedIndex = currentSteps.findIndex((s) => s.id === startFrom);
      currentSteps.forEach((s, i) => {
        if (i >= failedIndex) setStepStatus(s.id, "idle");
      });
    }

    try {
      await runAnalysisPipeline(
        file,
        {
          onStepStart: (step) => useAnalysisStore.getState().setStepStatus(step, "running"),
          onStepDone: (step) => useAnalysisStore.getState().setStepStatus(step, "done"),
          onStepError: (step, message) => {
            useAnalysisStore.getState().setStepStatus(step, "error");
            useAnalysisStore.getState().setError({ step, message });
          },
          onLayout: (result) => useAnalysisStore.getState().setLayout(result),
          onTokens: (result) => useAnalysisStore.getState().setTokens(result),
          onCode: (result) => useAnalysisStore.getState().setCode(result),
        },
        startFrom,
        { layout: currentLayout, tokens: currentTokens },
      );
    } catch {
      // error handled in onStepError
    } finally {
      useAnalysisStore.getState().setIsRunning(false);
      runningRef.current = false;
    }
  }, []);

  const retry = useCallback(
    (file: File) => {
      const { error: currentError, steps: currentSteps } = useAnalysisStore.getState();
      const failedStep =
        currentError?.step ?? currentSteps.find((s) => s.status === "error")?.id ?? "layout";
      run(file, failedStep);
    },
    [run],
  );

  const reset = useCallback(() => useAnalysisStore.getState().reset(), []);

  return { steps, layout, tokens, code, error, isRunning, run, retry, reset };
}
