# ALC experience validation

## Current state

The working tree contains a runnable preview implementation. It is **not yet validated as complete against the full storyboard** in `ALC_Comando_Completo_3D.md`. The technical checks below cover implementation contracts and local delivery; they do not certify all visual, responsive, or operational acceptance criteria.

## Offline checks

| Check | Result |
| --- | --- |
| `npm run build` after static-mesh merging | Passed; generated gzip GLB reported 719,147 bytes, 68 meshes, and 98,244 triangles. |
| Three.js `GLTFLoader.parseAsync` on the decompressed build output | Passed; 68 mesh objects and 98,244 triangles. |
| `npm run check` after the final model/state/test edits | Pending final rerun. |
| Route and security smoke tests | Passed before the final model optimization; rerun with `npm run check`. |

## Required review still pending

- Open the local preview in a browser and inspect console/network failures, all ten routes, and the Home scroll checkpoints.
- Review the viewport sizes 1440, 1024, 768, 390, 360, and 320 px, including portrait/landscape and keyboard-open form layouts.
- Exercise reduced motion, no-WebGL fallback, poster loading, menu keyboard/focus behavior, history navigation, and direct chapter jumps.
- Confirm no old photos, embedded map, legacy parallax, or autoplay remain in the rendered pages.
- Complete the seven-event Company sequence, six solution-specific scroll poses, operations coordination/process sequences, and the detailed C1–C6 choreography/handoffs.
- Do not submit contact, quote, or career forms during validation. Verify form validation and generated links without claiming an external message was sent.

## Scope boundary

No production deployment, domain change, form submission, or Railway action is part of this local-preview validation.
