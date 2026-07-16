/**
 * AI가 반환한 코드를 Sandpack에서 실행 가능한 형태로 정규화합니다.
 */
export function normalizeGeneratedCode(raw: string): string {
  let code = raw.trim();

  code = code.replace(/^```(?:tsx|jsx|typescript|javascript|react)?\s*\n?/i, "");
  code = code.replace(/\n?```\s*$/i, "");
  code = code.trim();

  if (code.includes("export default")) {
    return code;
  }

  if (/^export\s+function\s+\w+/.test(code)) {
    return code.replace(/^export\s+function/, "export default function");
  }

  if (/^function\s+\w+/.test(code)) {
    return `export default ${code}`;
  }

  if (/^const\s+(\w+)\s*=/.test(code)) {
    if (code.startsWith("export")) return code;
    const name = code.match(/^const\s+(\w+)/)?.[1] ?? "GeneratedComponent";
    return `${code}\nexport default ${name};`;
  }

  if (code.startsWith("(") || code.startsWith("<")) {
    return `export default function GeneratedComponent() {\n  return (\n    ${code}\n  );\n}`;
  }

  return `export default function GeneratedComponent() {\n  return (\n    ${code}\n  );\n}`;
}
