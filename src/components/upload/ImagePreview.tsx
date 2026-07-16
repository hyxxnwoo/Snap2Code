"use client";

/* eslint-disable @next/next/no-img-element */
import { useUploadStore } from "@/store/useUploadStore";

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function ImagePreview() {
  const image = useUploadStore((s) => s.image);
  const clearImage = useUploadStore((s) => s.clearImage);

  if (!image) return null;

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-neutral-800">{image.name}</p>
          <p className="text-xs text-neutral-500">{formatSize(image.size)}</p>
        </div>
        <button
          type="button"
          onClick={clearImage}
          className="rounded-md px-3 py-1.5 text-sm text-neutral-600 hover:bg-neutral-100"
        >
          제거
        </button>
      </div>
      <div className="mt-3 overflow-hidden rounded-lg border border-neutral-100">
        <img src={image.previewUrl} alt={image.name} className="max-h-96 w-full object-contain" />
      </div>
    </div>
  );
}
