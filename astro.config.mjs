import { defineConfig } from "astro/config";

// GitHub Pages serves this repo under a path
// (comp4020-agentic-coding-studio.github.io/comp4020-crit4-CongyuLiu09/), so
// every internal link and asset URL needs that path baked in via `base`.
export default defineConfig({
  base: "/comp4020-crit4-CongyuLiu09/",
  outDir: "dist",
});
