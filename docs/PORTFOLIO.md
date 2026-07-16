# Handoff — 포트폴리오 작성 가이드

> 디자인 시안 이미지를 AI로 분석해 Tailwind React 코드로 변환하는 프로토타입.  
> 포트폴리오·이력서·면접용으로 바로 복사해 쓸 수 있는 문구 모음입니다.

---

## 한 줄 소개 (카드 / 목록용)

디자인 시안 이미지를 업로드하면 AI가 레이아웃·토큰을 분석하고 Tailwind React 코드로 변환해, Sandpack으로 바로 미리보기까지 보여주는 프로토타입

**키워드:** Design-to-Code · Gemini Vision · 3-step pipeline · Next.js · Sandpack

---

## 프로젝트 개요 (2~4문장)

### 복사 초안

> 디자인 시안 이미지를 분석해 Tailwind 기반 코드로 변환하는 AI 어시스턴트(Handoff)를 개발했습니다. 단일 프롬프트 방식 대비 안정성을 높이기 위해 레이아웃 분석–토큰 추출–코드 생성 3단계 파이프라인을 설계했고, Sandpack 라이브 프리뷰로 생성 결과를 즉시 검증할 수 있게 했습니다. Next.js 14 App Router, TypeScript, Zustand, TanStack Query, Gemini Vision API를 사용했고, 핵심 로직 단위 테스트 커버리지 95%를 확보했습니다.

### 포함할 요소

| 항목 | 내용 |
|------|------|
| 무엇을 | 시안 이미지 → Tailwind 기반 React 코드 + 라이브 프리뷰 |
| 왜 | 디자인 핸드오프를 빠르게 시작하게 돕는 도구 (완벽한 변환이 목표 아님) |
| 어떻게 | 단일 프롬프트 대신 **레이아웃 → 토큰 → 코드** 3단계로 분해 |
| 스택 | Next.js 14, TypeScript, Zustand, TanStack Query, Gemini Vision, Sandpack |

---

## 문제 정의 → 범위 (상세 페이지 / 면접용)

| 구분 | 내용 |
|------|------|
| 문제 | 이미지→코드를 한 번에 시키면 출력이 불안정하고 실패 지점을 알기 어려움 |
| In scope | 업로드, 3단계 분석, 코드 생성, 프리뷰, 복사/다운로드 (단일 뷰포트) |
| Out of scope | 픽셀 퍼펙트, 멀티 페이지, 복잡한 인터랙션, 인증/저장 |

**"간단하게 구현했다"는 표현 대신:**

> 기능을 줄인 게 아니라, **되는 부분(구조 분석 + 토큰 + 기본 코드 + 검증 UX)에 집중**했다.

---

## 핵심 기능

1. 드래그앤드롭 이미지 업로드 (PNG / JPEG / WebP)
2. Gemini Vision 3단계 파이프라인 (레이아웃 → 토큰 → 코드)
3. 단계별 진행 상태 표시 + 실패 시 해당 단계부터 재시도
4. Sandpack 라이브 프리뷰 + 코드 하이라이트
5. 코드 복사 / 다운로드

### 스크린샷 추천 순서

1. 업로드 화면 (`/`)
2. 분석 중 — 단계별 진행 UI (`/result`)
3. 결과 — 코드 패널 + Sandpack 프리뷰 (`/result`)

---

## 기술 스택

Next.js 14 (App Router) · TypeScript · Tailwind CSS · Zustand + TanStack Query · Gemini (`@google/genai`) · Sandpack · Vitest · Vercel

| 영역 | 기술 |
|------|------|
| 프레임워크 | Next.js 14 (App Router) |
| 언어 | TypeScript |
| 스타일링 | Tailwind CSS |
| 상태관리 | Zustand + TanStack Query |
| AI | Gemini Vision API |
| 라이브 프리뷰 | Sandpack |
| 테스트 | Vitest + React Testing Library |
| 배포 | Vercel |

---

## 기술적으로 강조할 포인트

포트폴리오에서 "뭘 만들었나"보다 **"왜 이렇게 나눴나"**를 짧게 쓰는 것이 차별점입니다.

### 파이프라인 흐름

```
이미지 업로드 → 레이아웃 JSON → 디자인 토큰 → Tailwind React 코드
                                                      ↓
                                            정규화 · 검증
                                                      ↓
                              Sandpack 프리뷰  /  JSON scaffold 폴백
```

### 1. 3단계 파이프라인

단일 프롬프트로 "이미지 → 완성 코드"를 요청하면 출력 품질이 불안정합니다. 레이아웃 분석 → 토큰 추출 → 코드 생성으로 분리하면:

- 각 단계의 출력 형식을 JSON Schema로 강제할 수 있음
- 실패 지점을 특정하고 해당 단계만 재시도 가능
- 디버깅과 재시도 UX를 단순하게 유지할 수 있음

관련 코드: [`src/lib/gemini/pipeline.ts`](../src/lib/gemini/pipeline.ts), [`src/app/api/analyze/`](../src/app/api/analyze/)

### 2. AI 출력 방어 (normalize → validate → fallback)

AI가 반환하는 코드 형식이 매번 다릅니다 (마크다운 펜스, export 누락, JSX만 반환 등). Sandpack 렌더링 실패를 막기 위해:

1. `normalizeGeneratedCode()` — 출력 형식 통일
2. `validateCode()` — 프리뷰 전 기본 검증
3. `buildScaffoldFromJson()` — 검증 실패 시 layout/tokens JSON 기반 폴백 UI 생성

관련 코드: [`src/lib/code/`](../src/lib/code/)

### 3. Gemini 클라이언트 복원력

- 우선 모델 + 폴백 모델 체인
- 60초 타임아웃
- 404/503 등 API 오류 시 재시도

관련 코드: [`src/lib/gemini/client.ts`](../src/lib/gemini/client.ts)

### 4. 상태 분리

- **Zustand** — 업로드 이미지, 분석 단계 등 클라이언트 UI 상태
- **TanStack Query** — 서버(AI) 상태 캐싱, 재시도, 로딩 관리

### 5. 번들 분리

무거운 Sandpack + syntax highlighter는 `/result`에만 로드됩니다.

| 라우트 | First Load JS |
|--------|---------------|
| `/` (업로드) | ~90 kB |
| `/result` (분석 결과) | ~445 kB |

### 테스트

핵심 로직(코드 정규화, 검증, Sandpack 변환, AnalysisSteps UI) 단위 테스트:

```
Statements: 95.65% | Branches: 84.78% | Functions: 100% | Lines: 97.72%
```

---

## 역할 / 기간 / 링크 (메타)

| 항목 | 내용 |
|------|------|
| 역할 | 개인 프로젝트 (기획 · 설계 · 구현) |
| 기간 | _(본인이 채움)_ |
| 데모 | _(Vercel URL — 배포했다면)_ |
| 레포 | Private — 요청 시 코드 리뷰 가능 |

---

## 회고 / Learnings

- AI 생성물은 형식이 들쑥날쑥해서 **정규화 · 검증 · 폴백**이 제품화의 핵심이었다.
- "완벽한 변환"보다 **좁은 스코프 + 검증 가능한 UX**가 프로토타입 완성도를 높였다.
- 파이프라인을 단계로 나눈 덕분에 디버깅과 재시도 UX를 단순하게 만들 수 있었다.

---

## 쓰지 말 것 (과대 포장 방지)

- "픽셀 퍼펙트 design-to-code" / "프로덕션급 SaaS"
- 멀티 페이지 · 반응형 자동 생성 · 협업 기능처럼 Out of scope인 것
- 스택만 나열하고 의사결정(3단계, Sandpack, 폴백)을 빼는 구성

---

## 분량별 복사 초안

### A. 카드용 (1~2문장)

> Handoff — 디자인 시안을 Tailwind React 코드로 변환하는 AI 프로토타입. 3단계 파이프라인과 Sandpack 라이브 프리뷰로 생성 결과를 즉시 검증합니다.

### B. 이력서 bullet (2~3줄)

- 디자인 시안 이미지를 Tailwind React 코드로 변환하는 AI 어시스턴트 개발 (Next.js 14, TypeScript, Gemini Vision)
- 레이아웃·토큰·코드 3단계 파이프라인 설계로 단일 프롬프트 대비 출력 안정성 개선, 단계별 재시도 UX 구현
- AI 출력 정규화/검증/폴백 로직과 Sandpack 라이브 프리뷰로 생성 코드 즉시 검증, 핵심 로직 테스트 커버리지 95%

### C. 상세 페이지 (권장 구성)

1. 한 줄 소개 + 스택 뱃지
2. 스크린샷 2~3장
3. 개요 3~4문장 (위 "복사 초안" 사용)
4. 핵심 기능 4~5개 불릿
5. 기술 결정 2~3개 (3단계 파이프라인, AI 출력 방어, Sandpack)
6. 회고 2문장 + 데모/레포 링크

### D. 면접 답변용 (30초)

> 디자이너-개발자 핸드오프에서 시안을 코드로 옮기는 수작업이 반복되는 문제를 보고, AI로 구조 분석과 코드 초안을 빠르게 뽑는 프로토타입을 만들었습니다. 한 번에 코드를 생성하면 품질이 불안정해서 레이아웃, 토큰, 코드 3단계로 나눴고, JSON Schema로 출력을 고정했습니다. AI가 이상한 형식으로 코드를 주는 경우가 많아서 정규화와 검증, 폴백 UI까지 넣었고, Sandpack으로 바로 미리보기까지 확인하게 했습니다.

---

## 관련 문서

- [README](../README.md) — 설치, 구조, 기술적 의사결정 기록(ADR)
- [plan.md](../plan.md) — 초기 기획서
