export interface CodeValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Sandpack 프리뷰 전 코드 유효성을 기본 검증합니다.
 */
export function validateCode(code: string): CodeValidationResult {
  const trimmed = code.trim();

  if (!trimmed) {
    return { valid: false, error: "코드가 비어 있습니다." };
  }

  if (!trimmed.includes("return") && !/=>/.test(trimmed)) {
    return { valid: false, error: "유효한 JSX 반환문이 없습니다." };
  }

  const openBraces = (trimmed.match(/{/g) ?? []).length;
  const closeBraces = (trimmed.match(/}/g) ?? []).length;
  if (openBraces !== closeBraces) {
    return { valid: false, error: "중괄호가 짝이 맞지 않습니다." };
  }

  const openParens = (trimmed.match(/\(/g) ?? []).length;
  const closeParens = (trimmed.match(/\)/g) ?? []).length;
  if (openParens !== closeParens) {
    return { valid: false, error: "괄호가 짝이 맞지 않습니다." };
  }

  return { valid: true };
}
