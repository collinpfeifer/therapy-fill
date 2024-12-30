import { defineConfig } from "@solidjs/start/config";

const __dirname = import.meta.dir;
const resolve = import.meta.resolve;

export default defineConfig({
  server: {
    preset: "bun",
  },
  vite: {
    resolve: {
      alias: {
        "~": resolve(__dirname, "./src"),
      },
    },
    ssr: { external: ["drizzle-orm"], noExternal: ["bun:sqlite"] },
  },
});
