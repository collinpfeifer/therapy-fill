import { defineConfig } from "@solidjs/start/config";

export default defineConfig({
  server: {
    preset: "bun",
  },
  vite: {
    ssr: { external: ["drizzle-orm"], noExternal: ["bun:sqlite"] },
  },
});
