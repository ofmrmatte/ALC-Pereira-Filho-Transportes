# ALC experience assets

All authored scene geometry and fallback illustrations in this project are maintained as source in the repository. The truck GLB and browser runtime are generated at build time; the server exposes only the built public assets, not the JavaScript source modules.

| Asset | Source / build | Current use |
| --- | --- | --- |
| `alc-tractor-trailer.glb.gz` | `assets/experience/models.js` → `scripts/build-experience.mjs` | Articulated tractor-trailer with separated rear doors, lock bars, wheel pivots, trailer, cargo, and chassis. The server maps its public `.glb` URL to this gzip-encoded file. |
| `runtime.js` | `assets/experience/entry.js`, `state.js`, Three.js, GSAP → esbuild | Single-page browser runtime; one renderer is created per route. |
| `truck-rear.svg` | Project-authored SVG | Static first-frame fallback for the Home hero. |
| `empresa.svg`, `solucoes.svg`, `operacao.svg`, `equipe.svg` | Project-authored SVGs | Internal-page fallback illustrations. |
| `cotacao.svg`, `contato.svg`, `trabalhe-conosco.svg`, `privacidade.svg`, `404.svg` | Project-authored SVGs | Form, contact, reading, and not-found scene fallbacks. |
| `experience.css` | Project source | Layout, scene hosts, responsive treatment, and reduced-motion styles. |

## Build snapshot

The most recent successful optimized model build reported 719,147 compressed bytes, 68 mesh objects, and 98,244 triangles. The uncompressed GLB parsed successfully with Three.js and was 7,203,496 bytes. Re-run `npm run build` before relying on these figures after changing model source.

The model is original project geometry; no third-party truck model or texture is bundled. Dependency versions are pinned in `package-lock.json`: Three.js `0.186.1`, GSAP `3.15.0`, and esbuild `0.28.2`. Bundling retains dependency legal comments. Confirm applicable upstream license terms when redistributing the generated runtime.

## Public asset boundary

`server.mjs` explicitly allows the runtime bundle, experience CSS, poster SVGs, and public GLB URL. `entry.js`, `models.js`, `state.js`, build scripts, tests, and project configuration are not served by the local server.
