import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";

const root = fileURLToPath(new URL(".", import.meta.url));

function listFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? listFiles(full) : [full];
  });
}

/**
 * Offline support: after the build, write `dist/sw.js` with a precache list of
 * every emitted file. The cache name is a hash of that list, so each deploy
 * gets a fresh cache and the old one is removed on activate.
 */
function precacheServiceWorker(): Plugin {
  return {
    name: "nihongobrain:precache-sw",
    apply: "build",
    closeBundle() {
      const dist = join(root, "dist");
      const files = listFiles(dist)
        .map((f) => "/" + relative(dist, f).split(sep).join("/"))
        .filter((f) => f !== "/sw.js" && !f.startsWith("/_") && !f.endsWith(".map"))
        .sort();
      const version = createHash("sha256").update(files.join("\n")).digest("hex").slice(0, 12);
      const template = readTemplate();
      writeFileSync(
        join(dist, "sw.js"),
        template
          .replace("__CACHE_VERSION__", version)
          .replace("__PRECACHE__", JSON.stringify(files)),
      );
    },
  };
}

function readTemplate() {
  // Kept as a plain JS file outside the bundle.
  return readFileSync(join(root, "sw-template.js"), "utf8");
}

export default defineConfig({
  resolve: {
    alias: { "@": join(root, "src") },
  },
  plugins: [
    tanstackRouter({ target: "react", autoCodeSplitting: true }),
    react(),
    tailwindcss(),
    precacheServiceWorker(),
  ],
});
