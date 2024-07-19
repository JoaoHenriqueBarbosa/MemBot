import path from "path"
import vercel from 'vite-plugin-vercel';
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [vercel()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true,
    port: 5173
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
        404: path.resolve(__dirname, "public/404.html"),
      },
    },
  },
})
