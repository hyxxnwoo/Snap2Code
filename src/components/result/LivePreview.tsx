"use client";

import { useMemo } from "react";
import { SandpackLayout, SandpackPreview, SandpackProvider } from "@codesandbox/sandpack-react";
import { TAILWIND_CDN } from "@/lib/code/sandpack";

interface LivePreviewProps {
  code: string | null;
  isLoading?: boolean;
  validationError?: string;
}

export function LivePreview({ code, isLoading, validationError }: LivePreviewProps) {
  const files = useMemo(() => {
    if (!code) return undefined;
    return { "/App.tsx": { code, active: true } };
  }, [code]);

  if (isLoading) {
    return (
      <div className="flex h-full min-h-[400px] items-center justify-center text-sm text-neutral-400">
        프리뷰를 준비하고 있습니다...
      </div>
    );
  }

  if (!code) {
    return (
      <div className="flex h-full min-h-[400px] items-center justify-center text-sm text-neutral-400">
        프리뷰가 여기에 렌더링됩니다.
      </div>
    );
  }

  if (validationError) {
    return (
      <div className="flex h-full min-h-[400px] flex-col items-center justify-center gap-2 p-6 text-center">
        <p className="text-sm font-medium text-red-600">프리뷰를 렌더링할 수 없습니다</p>
        <p className="text-xs text-neutral-500">{validationError}</p>
      </div>
    );
  }

  return (
    <SandpackProvider
      template="react-ts"
      files={files}
      options={{
        externalResources: [TAILWIND_CDN],
        recompileMode: "immediate",
        recompileDelay: 300,
      }}
      theme="light"
    >
      <SandpackLayout style={{ border: "none", borderRadius: 0, minHeight: 400 }}>
        <SandpackPreview
          showNavigator={false}
          showRefreshButton
          style={{ height: "100%", minHeight: 400 }}
        />
      </SandpackLayout>
    </SandpackProvider>
  );
}
