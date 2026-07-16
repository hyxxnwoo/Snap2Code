import { describe, expect, it } from "vitest";
import { validateCode } from "@/lib/code/validate";

describe("validateCode", () => {
  it("빈 코드를 거부한다", () => {
    expect(validateCode("")).toEqual({ valid: false, error: "코드가 비어 있습니다." });
  });

  it("return이 없는 코드를 거부한다", () => {
    const result = validateCode("const x = 1;");
    expect(result.valid).toBe(false);
    expect(result.error).toBe("유효한 JSX 반환문이 없습니다.");
  });

  it("화살표 함수 컴포넌트를 허용한다", () => {
    const code = "export default const App = () => <div />;";
    expect(validateCode(code)).toEqual({ valid: true });
  });

  it("중괄호 불일치를 감지한다", () => {
    const code = "export default function App() { return <div />; ";
    const result = validateCode(code);
    expect(result.valid).toBe(false);
    expect(result.error).toBe("중괄호가 짝이 맞지 않습니다.");
  });

  it("괄호 불일치를 감지한다", () => {
    const code = "export default function App() { return <div />; }";
    const broken = code.replace(")", "");
    const result = validateCode(broken);
    expect(result.valid).toBe(false);
    expect(result.error).toBe("괄호가 짝이 맞지 않습니다.");
  });

  it("유효한 컴포넌트를 허용한다", () => {
    const code = `export default function App() {
  return <div className="p-4">Hello</div>;
}`;
    expect(validateCode(code)).toEqual({ valid: true });
  });
});
