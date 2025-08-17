import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@acme/ui": path.resolve(__dirname, "../../packages/ui/src"),
      "@acme/utils": path.resolve(__dirname, "../../packages/utils/src"),
    }
  },
  server: { port: 5173 }
});
