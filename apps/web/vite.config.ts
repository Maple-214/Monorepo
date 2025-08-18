import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(({ command }) => {
  const isDev = command === "serve"; // 开发时为 true，构建时为 false

  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@acme/ui": isDev
          ? path.resolve(__dirname, "../../packages/ui/src")
          : path.resolve(__dirname, "../../packages/ui/dist"),
        "@acme/utils": isDev
          ? path.resolve(__dirname, "../../packages/utils/src")
          : path.resolve(__dirname, "../../packages/utils/dist"),
      },
    },
    server: {
      port: 5173,
    },
    build: {
      outDir: "dist",
      sourcemap: isDev, // 开发调试方便
    },
  };
});
