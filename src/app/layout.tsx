import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/lib/providers";
import { Header } from "@/components/layout/Header";
import { SandpackStyles } from "@/components/layout/SandpackStyles";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Handoff — Design-to-Code Assistant",
  description:
    "디자인 시안 이미지를 분석해 레이아웃 구조와 스타일 토큰을 추출하고 Tailwind 기반 코드로 변환하는 도구",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <Providers>
          <SandpackStyles />
          <div className="flex min-h-screen flex-col bg-neutral-50">
            <Header />
            <main className="flex-1">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
