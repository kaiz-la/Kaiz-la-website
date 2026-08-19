import { defineConfig } from "vitest/config"

export default defineConfig({
  resolve: {
    // Resolves the "@/*" paths from tsconfig.json natively.
    tsconfigPaths: true,
  },
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
    // Tests must not depend on a developer's .env — every suite sets what it needs.
    env: {},
  },
})
