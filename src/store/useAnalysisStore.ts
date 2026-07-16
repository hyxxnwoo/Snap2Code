import { create } from "zustand";
import type {
  AnalysisError,
  AnalysisStep,
  AnalysisStepId,
  CodeGenerationResult,
  DesignTokensResult,
  LayoutAnalysisResult,
} from "@/types";
import { INITIAL_ANALYSIS_STEPS as STEPS } from "@/types";

interface AnalysisState {
  steps: AnalysisStep[];
  layout: LayoutAnalysisResult | null;
  tokens: DesignTokensResult | null;
  code: CodeGenerationResult | null;
  error: AnalysisError | null;
  isRunning: boolean;
  setStepStatus: (id: AnalysisStepId, status: AnalysisStep["status"]) => void;
  setLayout: (layout: LayoutAnalysisResult) => void;
  setTokens: (tokens: DesignTokensResult) => void;
  setCode: (code: CodeGenerationResult) => void;
  setError: (error: AnalysisError | null) => void;
  setIsRunning: (running: boolean) => void;
  reset: () => void;
}

export const useAnalysisStore = create<AnalysisState>((set) => ({
  steps: STEPS.map((s) => ({ ...s })),
  layout: null,
  tokens: null,
  code: null,
  error: null,
  isRunning: false,
  setStepStatus: (id, status) =>
    set((state) => ({
      steps: state.steps.map((s) => (s.id === id ? { ...s, status } : s)),
    })),
  setLayout: (layout) => set({ layout }),
  setTokens: (tokens) => set({ tokens }),
  setCode: (code) => set({ code }),
  setError: (error) => set({ error }),
  setIsRunning: (isRunning) => set({ isRunning }),
  reset: () =>
    set({
      steps: STEPS.map((s) => ({ ...s })),
      layout: null,
      tokens: null,
      code: null,
      error: null,
      isRunning: false,
    }),
}));
