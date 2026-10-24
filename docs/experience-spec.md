# ALC 3D experience

## Local preview

Use Node.js 22–24, then run:

```powershell
npm install
npm start
```

`npm start` builds the local Three.js runtime and compressed truck model before serving the site on port 3000. `npm run check` builds the same assets and runs syntax, state, model, and route tests. Generated bundles and GLB files are intentionally ignored by Git.

## Implementation map

- `assets/experience/state.js` evaluates the Home chapter and page progress from absolute, clamped scroll progress. It does not use elapsed time or scroll direction.
- `assets/experience/models.js` is the source for the articulated tractor-trailer GLB.
- `assets/experience/entry.js` creates one WebGL renderer per page, applies page/chapter state, and schedules rendering only when the state or viewport changes.
- `assets/experience/experience.css` contains the scene, fallback, reduced-motion, and responsive presentation rules.
- `assets/experience/posters/` contains project-authored SVG fallbacks.
- `scripts/build-experience.mjs` merges static truck geometry while retaining independent door, lock, and wheel pivots, exports the GLB, and bundles the browser runtime.
- `server.mjs` serves the public routes and named experience assets; source modules and build files are not exposed.

## Scroll-state contract

`evaluateHomeState(progress)` clamps progress to `[0, 1]` and returns a complete pose for the active chapter. Chapter camera checkpoints are shared at boundaries. Truck translation, wheel angle, and door/lock poses are derived from the current progress, so reversing or jumping to a position does not depend on prior frames. `pageProgress(scrollY, top, height)` also rejects invalid geometry and clamps its result.

The browser uses ScrollTrigger only to report scroll progress. A render request is coalesced to at most one pending animation frame; no render loop, timer-driven scene animation, or automatic camera rotation is used. The Home motion toggle and the system reduced-motion preference expose the chapter text in normal document flow.

## Routes

The implementation supplies a scene host for `/`, `/empresa/`, `/solucoes/`, `/operacao/`, `/equipe/`, `/cotacao/`, `/contato/`, `/trabalhe-conosco/`, `/privacidade/`, and the 404 document. The 404 response retains HTTP status 404 and identifies its scene through `data-experience-page`.

## Remaining storyboard work

This checkout is a functional, locally reviewable implementation, not a claim that every storyboard detail in `ALC_Comando_Completo_3D.md` is complete. The current Home experience has six progress-driven chapters and an articulated vehicle, but still needs the full C2 curved route and trailer articulation, complete C3→C4 and C4→C5→C6 spatial handoffs, all specified process/door/cargo choreography, and detailed mobile-specific framing. The Company scene currently has three illustrative markers rather than the required seven-event camera sequence. Internal scenes are reusable conceptual environments, not yet the full per-page storyboards; in particular, the six solution-specific actions, operations coordination/process scenes, and dedicated privacy/404/contact architecture need further modeling and scroll choreography.

These gaps are tracked explicitly in `validation-report.md`; keep them visible when reviewing or publishing the experience.
