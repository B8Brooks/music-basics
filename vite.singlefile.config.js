// Build variant that inlines all JS/CSS into one self-contained index.html,
// for hosting setups where uploading a single file is easiest.
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";

export default defineConfig({
  plugins: [react(), viteSingleFile()],
  base: "./",
  build: { outDir: "dist-single" },
});
