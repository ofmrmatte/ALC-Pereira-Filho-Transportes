import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";
import { build } from "esbuild";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const modelDir = resolve(root, "assets/experience/models");
await mkdir(modelDir, { recursive: true });
// Preserve the exact articulated, meshopt-compressed model from the supplied preview.
const model = await readFile(resolve(root, "assets/experience/source/alc-truck.glb"));
const compressed = gzipSync(model, { level: 9 });
await writeFile(resolve(modelDir, "alc-tractor-trailer.glb.gz"), compressed);
await build({
  entryPoints: [resolve(root, "assets/experience/entry.js")],
  outfile: resolve(root, "assets/experience/runtime.js"),
  bundle: true,
  minify: true,
  platform: "browser",
  format: "iife",
  target: ["es2022"],
  legalComments: "eof",
  sourcemap: false
});
console.log(`Built supplied ALC animation and original articulated model (${compressed.byteLength} bytes).`);
