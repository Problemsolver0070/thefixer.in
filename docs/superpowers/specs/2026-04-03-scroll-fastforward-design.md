# Fast-Forward Intro on Scroll — Design Spec

**Date:** 2026-04-03
**Audit Item:** #3 — Force-completing the intro on scroll is jarring
**Status:** Approved

---

## Problem

`HeroSection.tsx` ScrollTrigger `onUpdate` fires `intro.progress(1)` when the user scrolls during the intro animation (`progress > 0.03`). This instant-completes a multi-second, 3-phase cinematic animation in a single frame. Particles teleport to final positions. Text snaps into existence. The entire cinematic moment is destroyed.

## Solution — Fast-Forward with `timeScale(5)`

Replace the instant `intro.progress(1)` with `intro.timeScale(5)`. The remaining animation plays at 5x speed (~2.4s to complete from the start, less if mid-animation). Every phase still fires — logo convergence, text formation, tagline formation — just accelerated. Particles physically converge via the seek force each frame, so there is no teleportation.

## Changes — confined to `components/sections/HeroSection.tsx`

### 1. Replace the scroll-interrupt block

Current code in the ScrollTrigger `onUpdate` callback:

```ts
if (!introComplete && intro.isActive()) {
  intro.progress(1);
  introComplete = true;
}
```

Becomes:

```ts
if (!introComplete && intro.isActive() && intro.timeScale() === 1) {
  intro.timeScale(5);
}
```

Three changes in one block:
- `intro.progress(1)` → `intro.timeScale(5)` — accelerate instead of teleport
- `introComplete = true;` removed — the timeline's `onComplete` callback already sets this flag when the timeline finishes naturally
- `intro.timeScale() === 1` guard added — prevents repeated `timeScale()` calls on subsequent scroll events

### 2. No other changes

The `progress < 0.03` early-return guard (line 342) stays as-is. It prevents Lenis micro-scrolls from triggering acceleration on page load.

The timeline's `onComplete` callback (line 218-220) already sets `introComplete = true`. No modification needed.

## Behavior

| Scenario | Before | After |
|----------|--------|-------|
| Scroll during Phase 1 | Entire animation snaps to end | Remaining ~12s plays in ~2.4s at 5x |
| Scroll during Phase 3 | Snaps to end | Remaining <2s plays in <0.4s at 5x |
| No scroll during intro | Normal playback | Normal playback (timeScale stays at 1) |
| Lenis micro-scroll at load | Blocked by p < 0.03 | Blocked by p < 0.03 (unchanged) |

## Edge Cases

- **`onComplete` fires naturally:** `intro.timeScale(5)` lets the timeline play to its end, which triggers `onComplete`. The `introComplete` flag is set correctly without manual intervention.
- **Scroll dissolve handoff:** After `introComplete = true`, the `onUpdate` callback falls through to `engine.particles.setSeekStrength(1 - p)` — the dissolve begins smoothly.
- **Multiple scroll events:** The `intro.timeScale() === 1` guard ensures only the first scroll triggers acceleration. Subsequent events are no-ops until the timeline completes.

## Files

- **Only** `components/sections/HeroSection.tsx` is modified.
- 3 lines changed within the ScrollTrigger `onUpdate` callback.
