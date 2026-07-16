"use client";

/* eslint-disable @next/next/no-img-element */
interface UploadedImagePreviewProps {
  previewUrl: string;
  name: string;
}

export function UploadedImagePreview({ previewUrl, name }: UploadedImagePreviewProps) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-4">
      <h3 className="mb-3 text-sm font-medium text-neutral-800">원본 시안</h3>
      <div className="overflow-hidden rounded-lg border border-neutral-100">
        <img src={previewUrl} alt={name} className="max-h-48 w-full object-contain" />
      </div>
      <p className="mt-2 truncate text-xs text-neutral-500">{name}</p>
    </div>
  );
}
