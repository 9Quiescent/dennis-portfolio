import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: ["tests/setup.ts"],
    passWithNoTests: true,
    include: ["tests/unit/**/*.{test,spec}.ts?(x)", "src/**/*.{test,spec}.ts?(x)"],
    exclude: ["tests/e2e/**", "node_modules/**", "dist/**"],
    reporters: "basic",
  },
});
