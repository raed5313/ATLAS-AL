// Integration status. Real AI generation and deployment must run server-side
// (createServerFn) with keys stored as server secrets — never in the browser.
export const integrations = {
  ai: { configured: false },
  deploy: { configured: false },
} as const;