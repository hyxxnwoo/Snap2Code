export const LAYOUT_PROMPT = `You are a frontend layout analyst. Analyze this design mockup image and extract its layout structure.

Rules:
- Focus on major sections (header, nav, main, footer, sidebar, etc.)
- Identify layout types: flex, grid, or block
- Describe component regions, not pixel-perfect positions
- Single viewport only — do NOT generate responsive breakpoints
- Return valid JSON matching the schema`;

export const TOKENS_PROMPT = `You are a design token extractor. Analyze this design mockup image and extract reusable design tokens.

Rules:
- Extract dominant colors as hex values with semantic names
- Estimate typography (font sizes, weights) for headings, body, labels
- Identify common spacing patterns
- Single viewport only
- Return valid JSON matching the schema`;

export function buildCodePrompt(layout: unknown, tokens: unknown): string {
  return `You are a React + Tailwind CSS code generator. Generate a single React component based on the provided layout structure and design tokens.

Layout structure:
${JSON.stringify(layout, null, 2)}

Design tokens:
${JSON.stringify(tokens, null, 2)}

Rules:
- Use Tailwind CSS utility classes only
- Single viewport, no responsive breakpoints (no sm:, md:, lg: prefixes)
- Output a self-contained functional React component
- Use semantic HTML elements
- Do NOT include imports or exports — just the component function body as TSX
- Return valid JSON matching the schema`;
}

export const LAYOUT_SCHEMA = {
  type: "object",
  properties: {
    summary: { type: "string", description: "Brief description of the overall layout" },
    sections: {
      type: "array",
      items: { type: "string" },
      description: "List of major page sections",
    },
    structure: {
      type: "object",
      properties: {
        type: { type: "string" },
        role: { type: "string" },
        layout: { type: "string", enum: ["flex", "grid", "block"] },
        direction: { type: "string", enum: ["row", "column"] },
        columns: { type: "integer" },
        children: {
          type: "array",
          items: { type: "object" },
        },
      },
      required: ["type"],
    },
  },
  required: ["summary", "sections", "structure"],
};

export const TOKENS_SCHEMA = {
  type: "object",
  properties: {
    colors: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          hex: { type: "string" },
          usage: { type: "string" },
        },
        required: ["name", "hex"],
      },
    },
    typography: {
      type: "array",
      items: {
        type: "object",
        properties: {
          element: { type: "string" },
          fontSize: { type: "string" },
          fontWeight: { type: "string" },
        },
        required: ["element", "fontSize", "fontWeight"],
      },
    },
    spacing: {
      type: "array",
      items: {
        type: "object",
        properties: {
          pattern: { type: "string" },
          value: { type: "string" },
        },
        required: ["pattern", "value"],
      },
    },
  },
  required: ["colors", "typography", "spacing"],
};

export const CODE_SCHEMA = {
  type: "object",
  properties: {
    code: { type: "string", description: "Generated React TSX component code" },
    language: { type: "string", enum: ["tsx"] },
  },
  required: ["code", "language"],
};
