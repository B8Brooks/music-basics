import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base must match the GitHub Pages path: b8brooks.github.io/music-basics/
export default defineConfig({
  plugins: [react()],
  base: "/music-basics/",
});
