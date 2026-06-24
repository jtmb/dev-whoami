/**
 * Vitest configuration for Next.js + React Testing Library.
 * Uses jsdom environment for component rendering tests.
 * Resolves the @/* path alias matching tsconfig.json.
 */
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
    include: ["**/*.test.ts", "**/*.test.tsx"],
    alias: {
      "@": "/home/brajam/repos/dev-whoami/src",
    },
  },
});