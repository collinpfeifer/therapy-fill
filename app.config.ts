import { defineConfig } from "@solidjs/start/config";
import path from "path";

export default defineConfig({
  server: {
    preset: "bun",
  },
  vite: {
    resolve: {
      alias: {
        "~": path.resolve(__dirname, "./src"),
      },
    },
    ssr: {
      external: ["drizzle-orm", "bun:sqlite", "bun"],
    },
  },
});
