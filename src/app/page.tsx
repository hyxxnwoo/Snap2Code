"use client";

import { useRouter } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { UploadDropzone } from "@/components/upload/UploadDropzone";
import { ImagePreview } from "@/components/upload/ImagePreview";
import { useUploadStore } from "@/store/useUploadStore";

export default function HomePage() {
  const router = useRouter();
  const image = useUploadStore((s) => s.image);

  return (
    <Container>
      <div className="mx-auto max-w-2xl py-12">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
            디자인 시안을 코드로 변환하세요
          </h1>
          <p className="mt-2 text-sm text-neutral-600">
            이미지를 업로드하면 레이아웃 구조와 스타일 토큰을 분석해 Tailwind 코드로 변환합니다.
          </p>
        </div>

        <div className="space-y-4">
          <UploadDropzone />
          <ImagePreview />

          <button
            type="button"
            disabled={!image}
            onClick={() => router.push("/result")}
            className="w-full rounded-lg bg-neutral-900 px-4 py-3 text-sm font-medium text-white transition-colors enabled:hover:bg-neutral-700 disabled:cursor-not-allowed disabled:bg-neutral-300"
          >
            분석하기
          </button>
        </div>
      </div>
    </Container>
  );
}
