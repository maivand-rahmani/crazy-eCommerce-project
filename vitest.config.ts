import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "happy-dom",
    setupFiles: ["tests/setup.ts"],
    passWithNoTests: true,
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
    deps: {
      inline: ["@testing-library/react", "@testing-library/user-event"],
    },
  },
});
