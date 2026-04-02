# Font Race Condition Fix — Design Spec

**Date:** 2026-04-03
**Audit Item:** #4 — Font race condition in `textToPointCloud`
**Status:** Approved

---

## Problem

`textToPointCloud()` renders text on a hidden canvas using `"Inter, Arial, Helvetica, sans-serif"`. Inter is loaded asynchronously via `next/font/google` with `display: "swap"`. If the font hasn't finished downloading when point clouds are generated, the canvas falls back to Arial — producing subtly wrong letter widths, spacing, and glyph shapes. The particle text formation looks different from the intended design.

## Solution

Add `await document.fonts.ready` in `HeroSection.tsx`'s engine-ready `useEffect`, before any `textToPointCloud` calls. This is a built-in browser API that returns a Promise resolving when all declared fonts have finished loading.

## Changes — confined to `components/sections/HeroSection.tsx`

### 1. Add font-ready guard

In the `onEngineReady` callback, after `const dims = getResponsiveDimensions();` and before the first `textToPointCloud` call, add:

```ts
await document.fonts.ready;
```

This is a single line. The callback is already async (`async (engine) => { ... }`), so no signature changes needed.

## Why this placement

- The `useEffect` callback is already async — zero refactoring
- One `await` protects both `textToPointCloud` calls (text + tagline)
- `svgToPointCloud` (logo) doesn't use fonts — it can run before or after, doesn't matter
- The utility function `textToPointCloud` stays synchronous — no API change
- After the first page load, `document.fonts.ready` resolves immediately on subsequent calls

## Edge cases

- **Fonts already loaded:** `document.fonts.ready` resolves immediately (< 1ms). No delay.
- **Font load failure:** `document.fonts.ready` still resolves — the browser has finished attempting to load. Canvas falls back to the next font in the stack (Arial). This is the same behavior as before, but now it's deterministic — we know the font either loaded or failed.
- **Slow network:** Point cloud generation is delayed until fonts arrive. The particle field drifts freely in the meantime (no targets set yet), which is the intended Phase 0 behavior.

## Files

- **Only** `components/sections/HeroSection.tsx` is modified.
- One line added.
