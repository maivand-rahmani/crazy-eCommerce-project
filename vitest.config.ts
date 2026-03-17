/// <reference types="vitest/config" />
import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "happy-dom",
    setupFiles: ["tests/setup.ts"],
    passWithNoTests: true,
    server: {
      deps: {
        inline: ["@testing-library/react", "@testing-library/user-event"],
      },
    },
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
