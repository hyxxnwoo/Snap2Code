import { LivePreview } from "@/components/result/LivePreview";

interface PreviewPanelProps {
  code: string | null;
  isLoading?: boolean;
  validationError?: string;
}

export function PreviewPanel({ code, isLoading, validationError }: PreviewPanelProps) {
  return (
    <section className="flex h-full min-h-[400px] flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white">
      <div className="border-b border-neutral-200 px-4 py-3">
        <h2 className="text-sm font-medium text-neutral-800">라이브 프리뷰</h2>
      </div>
      <div className="flex-1 overflow-hidden">
        <LivePreview code={code} isLoading={isLoading} validationError={validationError} />
      </div>
    </section>
  );
}
