"use client";

import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { copyCodeToClipboard, downloadCode } from "@/lib/code/clipboard";

interface CodePanelProps {
  code: string | null;
  isLoading?: boolean;
  loadingMessage?: string | null;
}

function CodeSkeleton() {
  return (
    <div className="space-y-3 p-4" aria-hidden="true">
      {["w-4/5", "w-full", "w-3/5", "w-full", "w-2/3", "w-5/6", "w-1/2"].map((width) => (
        <div key={width} className={`h-3 animate-pulse rounded bg-neutral-100 ${width}`} />
      ))}
    </div>
  );
}

export function CodePanel({ code, isLoading, loadingMessage }: CodePanelProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!code) return;
    const success = await copyCodeToClipboard(code);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (!code) return;
    downloadCode(code);
  };

  const hasCode = Boolean(code);

  return (
    <section className="flex h-full min-h-[400px] flex-col rounded-xl border border-neutral-200 bg-white">
      <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3">
        <h2 className="text-sm font-medium text-neutral-800">생성된 코드</h2>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={!hasCode}
            onClick={handleCopy}
            className="rounded-md border border-neutral-200 px-3 py-1.5 text-xs transition-colors enabled:hover:bg-neutral-50 disabled:text-neutral-400"
          >
            {copied ? "복사됨" : "복사"}
          </button>
          <button
            type="button"
            disabled={!hasCode}
            onClick={handleDownload}
            className="rounded-md border border-neutral-200 px-3 py-1.5 text-xs transition-colors enabled:hover:bg-neutral-50 disabled:text-neutral-400"
          >
            다운로드
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        {isLoading ? (
          <div className="flex h-full flex-col">
            <div className="border-b border-neutral-100 px-4 py-3 text-sm text-neutral-500">
              {loadingMessage ?? "코드를 생성하고 있습니다..."}
            </div>
            <CodeSkeleton />
          </div>
        ) : code ? (
          <SyntaxHighlighter
            language="tsx"
            style={oneLight}
            customStyle={{
              margin: 0,
              padding: "1rem",
              background: "transparent",
              fontSize: "0.75rem",
              lineHeight: "1.6",
            }}
            showLineNumbers
          >
            {code}
          </SyntaxHighlighter>
        ) : (
          <div className="flex h-full items-center justify-center p-6 text-sm text-neutral-400">
            코드가 여기에 표시됩니다.
          </div>
        )}
      </div>
    </section>
  );
}
