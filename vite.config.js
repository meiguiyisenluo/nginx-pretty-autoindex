import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

import path from "path";

import { web_endpoint } from "./RouterConfig.json";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: web_endpoint,
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
