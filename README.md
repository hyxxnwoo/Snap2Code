# Handoff — Design-to-Code Assistant

디자인 시안 이미지를 업로드하면 AI가 레이아웃 구조와 스타일 토큰을 분석하고, Tailwind CSS 기반 React 코드로 변환해 Sandpack 라이브 프리뷰로 즉시 확인할 수 있는 도구입니다.

## 주요 기능

- 이미지 업로드 (드래그앤드롭, PNG/JPEG/WebP)
- Gemini Vision API 기반 3단계 분석 파이프라인
  1. 레이아웃 구조 분석
  2. 디자인 토큰 추출 (색상, 타이포, 여백)
  3. Tailwind React 코드 생성
- 단계별 진행 상태 표시 및 실패 시 재시도
- Sandpack 라이브 프리뷰
- 코드 복사 / 다운로드

## 기술 스택

| 영역          | 기술                                     |
| ------------- | ---------------------------------------- |
| 프레임워크    | Next.js 14 (App Router)                  |
| 언어          | TypeScript                               |
| 스타일링      | Tailwind CSS                             |
| 상태관리      | Zustand + TanStack Query                 |
| AI            | Gemini API (Vision) — `@google/genai`    |
| 코드 표시     | react-syntax-highlighter                 |
| 라이브 프리뷰 | Sandpack (`@codesandbox/sandpack-react`) |
| 테스트        | Vitest + React Testing Library           |
| CI/CD         | GitHub Actions                           |
| 배포          | Vercel                                   |

## 시작하기

### 요구 사항

- Node.js 22+
- [Gemini API Key](https://aistudio.google.com/apikey)

### 설치 및 실행

```bash
git clone <repository-url>
cd Snap2Code
npm ci

cp .env.example .env.local
# .env.local에 GEMINI_API_KEY 설정

npm run dev
```

http://localhost:3000 에서 확인합니다.

### 환경 변수

| 변수             | 필수 | 설명                                     |
| ---------------- | ---- | ---------------------------------------- |
| `GEMINI_API_KEY` | O    | Gemini API 키                            |
| `GEMINI_MODEL`   | X    | 우선 사용할 모델 (기본: `gemini-3.5-flash`, 실패 시 자동 폴백) |

### 스크립트

| 명령                    | 설명              |
| ----------------------- | ----------------- |
| `npm run dev`           | 개발 서버         |
| `npm run build`         | 프로덕션 빌드     |
| `npm run lint`          | ESLint            |
| `npm run typecheck`     | TypeScript 검사   |
| `npm run test`          | 단위 테스트       |
| `npm run test:coverage` | 테스트 + 커버리지 |

## 프로젝트 구조

```
src/
  app/
    page.tsx              # 업로드 화면
    result/page.tsx       # 분석 결과 화면
    api/analyze/          # 3단계 분석 API
  components/
    upload/               # 업로드 UI
    result/               # 결과 UI (코드, 프리뷰, 단계 표시)
  lib/
    gemini/               # Gemini 클라이언트, 프롬프트, 파이프라인
    code/                 # 코드 정규화, 검증, Sandpack 변환
    analysis/             # 클라이언트 분석 오케스트레이션
  store/                  # Zustand 스토어
  hooks/                  # 커스텀 훅
```

## 범위 (Scope)

### In Scope

- 이미지 업로드, AI 레이아웃/토큰 분석, Tailwind 코드 생성
- Sandpack 라이브 프리뷰, 코드 복사/다운로드
- 단일 뷰포트 기준

### Out of Scope

- 복잡한 인터랙션(애니메이션, 상태 전환) 복원
- 픽셀 퍼펙트 변환, 다중 페이지 변환
- 반응형 브레이크포인트 자동 생성
- 사용자 인증, 멀티 프로젝트 저장

## 성능 점검

### 번들 사이즈 (프로덕션 빌드 기준)

| 라우트                | First Load JS |
| --------------------- | ------------- |
| `/` (업로드)          | 90.5 kB       |
| `/result` (분석 결과) | 445 kB        |

`/result` 페이지는 Sandpack + syntax highlighter 포함으로 번들이 큽니다. 프리뷰 기능이 필요한 페이지에만 로드되도록 라우트 단위로 분리되어 있습니다.

### Lighthouse (로컬 프로덕션, `/` 기준)

| 지표                     | 값              |
| ------------------------ | --------------- |
| First Contentful Paint   | 1.2s (score 99) |
| Largest Contentful Paint | 2.7s (score 86) |
| Speed Index              | 2.2s (score 99) |

## 테스트

핵심 로직(코드 정규화, 검증, Sandpack 변환, AnalysisSteps UI)에 대해 18개 단위 테스트를 작성했습니다.

```
Statements: 95.65% | Branches: 84.78% | Functions: 100% | Lines: 97.72%
```

```bash
npm run test
npm run test:coverage
```

## Vercel 배포

1. [Vercel](https://vercel.com)에 GitHub 저장소 연결
2. Framework Preset: **Next.js** (자동 감지)
3. Environment Variables 설정:
   - `GEMINI_API_KEY` = your API key
   - `GEMINI_MODEL` = `gemini-3.5-flash` (선택)
4. Deploy

CLI 배포:

```bash
npx vercel
# 프로덕션 배포
npx vercel --prod
```

`vercel.json`에 빌드 설정이 포함되어 있습니다.

## 기술적 의사결정 기록

### 왜 3단계 파이프라인으로 나눴는가

단일 프롬프트로 "이미지 → 완성 코드"를 요청하면 출력 품질이 불안정합니다. 레이아웃 분석 → 토큰 추출 → 코드 생성으로 분리하면:

- 각 단계의 출력 형식을 JSON Schema로 강제할 수 있음
- 실패 지점을 특정하고 해당 단계만 재시도 가능
- 면접에서 "문제를 분해해서 설계했다"는 근거가 됨

### 왜 Gemini API를 선택했는가

기획 초안은 Claude API였으나, Gemini API로 변경했습니다. `@google/genai` SDK를 사용하며 Vision + Structured Output(JSON Schema)을 단일 제공자에서 처리할 수 있습니다.

### 왜 Sandpack을 선택했는가

| 방식             | 장점                                 | 단점                                              |
| ---------------- | ------------------------------------ | ------------------------------------------------- |
| iframe 직접 구현 | 완전한 제어                          | 번들러, 에러 핸들링, 보안 샌드박스 직접 구현 필요 |
| **Sandpack**     | 즉시 렌더링, 내장 번들러, React 통합 | 번들 사이즈 증가 (~355kB 추가)                    |

생성 코드의 **즉시 시각적 검증**이 핵심 UX이므로 Sandpack을 선택했습니다. Tailwind는 `externalResources` CDN 방식으로 적용해 Sandpack 내부 PostCSS 설정을 피했습니다.

### 왜 Zustand + TanStack Query 조합인가

- **Zustand**: 업로드 이미지, 분석 단계 상태 등 클라이언트 UI 상태 (보일러플레이트 최소)
- **TanStack Query**: 서버(AI) 상태 캐싱, 재시도, 로딩 관리 (2주차 Provider 세팅, 향후 확장 여지)

클라이언트 상태와 서버 상태를 명확히 분리합니다.

### 범위를 어떻게, 왜 좁혔는가

"완벽한 디자인→코드 변환"은 현재 AI 기술로도 불안정합니다. 대신 **구조 분석 + 토큰 추출 + 기본 코드 생성 + 라이브 프리뷰**에 집중해, 되는 부분을 확실하게 보여주는 방향을 택했습니다.

### 가장 어려웠던 기술적 문제와 해결

**문제**: AI가 반환하는 코드 형식이 매번 다름 (마크다운 펜스, export 누락, JSX만 반환 등) → Sandpack 렌더링 실패

**해결**:

1. `normalizeGeneratedCode()` — 출력 형식 통일
2. `validateCode()` — 프리뷰 전 기본 검증
3. `buildScaffoldFromJson()` — 검증 실패 시 layout/tokens JSON 기반 폴백 UI 생성

## 포트폴리오 / 이력서용 설명

> 디자인 시안 이미지를 분석해 Tailwind 기반 코드로 변환하는 AI 어시스턴트(Handoff)를 개발했습니다. 단일 프롬프트 방식 대비 정확도를 높이기 위해 레이아웃 분석-토큰 추출-코드 생성 3단계 파이프라인을 설계했으며, Sandpack을 활용한 라이브 프리뷰로 생성 결과를 즉시 검증할 수 있도록 구현했습니다. Next.js 14 App Router, TypeScript, Zustand, TanStack Query, Gemini Vision API를 사용했고, 핵심 로직 단위 테스트 커버리지 95%를 확보했습니다.

## 라이선스

Private — 포트폴리오 용도
