import { describe, expect, it } from "vitest";
import { normalizeGeneratedCode } from "@/lib/code/normalize";

describe("normalizeGeneratedCode", () => {
  it("마크다운 코드 펜스를 제거한다", () => {
    const raw = "```tsx\nexport default function App() { return <div />; }\n```";
    expect(normalizeGeneratedCode(raw)).toBe("export default function App() { return <div />; }");
  });

  it("export default가 있으면 그대로 반환한다", () => {
    const code = "export default function App() { return <div />; }";
    expect(normalizeGeneratedCode(code)).toBe(code);
  });

  it("export function을 export default function으로 변환한다", () => {
    const code = "export function App() { return <div />; }";
    expect(normalizeGeneratedCode(code)).toBe("export default function App() { return <div />; }");
  });

  it("일반 function에 export default를 추가한다", () => {
    const code = "function App() { return <div />; }";
    expect(normalizeGeneratedCode(code)).toBe("export default function App() { return <div />; }");
  });

  it("const 컴포넌트에 export default를 추가한다", () => {
    const code = "const App = () => <div />;";
    expect(normalizeGeneratedCode(code)).toBe("const App = () => <div />;\nexport default App;");
  });

  it("JSX만 있으면 컴포넌트로 감싼다", () => {
    const code = "<div className='p-4'>Hello</div>";
    const result = normalizeGeneratedCode(code);
    expect(result).toContain("export default function GeneratedComponent");
    expect(result).toContain("<div className='p-4'>Hello</div>");
  });
});
