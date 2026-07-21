import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

// Test harness for LearnTheStack.
// - jsdom by default so component/RTL tests work out of the box.
// - node-land logic tests opt out per-file with `// @vitest-environment node`.
// - `@/*` resolves to `src/*`, mirroring tsconfig paths.
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
