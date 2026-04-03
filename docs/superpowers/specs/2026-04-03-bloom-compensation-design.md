# Bloom Absence Compensation — Design Spec

**Date:** 2026-04-03
**Audit Item:** #5 — Bloom absence changes visual tuning
**Status:** Approved

---

## Problem

`cosmos-engine.ts` silently drops bloom when `RenderPipeline` construction fails (common on some WebGL2 configs). The particle material's alpha values (0.008–0.2, additive blending) were tuned assuming bloom amplifies brightness with strength 0.25, radius 0.3, threshold 0.1. Without bloom, the particle field looks significantly dimmer and flatter — no soft glow halos, dim pinpoints instead of luminous nebula.

No compensation mechanism exists. The material has zero awareness of whether bloom is active.

## Solution

Add a `uNoBloom` uniform to the particle material. When bloom is absent, boost `baseAlpha` by 2.5x and raise the `finalAlpha` clamp ceiling from 0.2 to 0.5 (and logo glow ceiling from 0.35 to 0.7). The engine sets this uniform once after initialization.

## Changes — 3 files

### 1. `components/canvas/shaders/particle-material.ts`

**New uniform (add near other exports):**
```ts
export const uNoBloom = uniform(0.0); // 0 = bloom active, 1 = no bloom
```

**Alpha compensation — modify the alpha computation section:**

After `baseAlpha` is computed, add compensation:
```ts
const bloomCompensation = mix(float(1.0), float(2.5), uNoBloom);
const compensatedAlpha = mul(baseAlpha, bloomCompensation);
```

Change `finalAlpha` clamp to use dynamic ceiling:
```ts
const maxAlpha = mix(float(0.2), float(0.5), uNoBloom);
const finalAlpha = clamp(mul(compensatedAlpha, alphaVariation), 0.008, maxAlpha);
```

Change logo glow section to use dynamic ceiling:
```ts
const maxGlowAlpha = mix(float(0.35), float(0.7), uNoBloom);
```

Use `maxGlowAlpha` in the glow clamp instead of the hardcoded 0.35.

### 2. `components/canvas/particle-system.ts`

**Import `uNoBloom`:**
```ts
import { uNoBloom } from "./shaders/particle-material";
```

Add to existing import that already imports `uMatTime`, `uMatScrollProgress`, `uMatParticleSize`, `uMatLogoGlow`.

**New method:**
```ts
setNoBloom(): void {
  uNoBloom.value = 1.0;
}
```

### 3. `components/canvas/cosmos-engine.ts`

**New field:**
```ts
private _hasBloom = false;
```

**After `setupRenderPipeline()` in `init()`:**
```ts
this._hasBloom = !!this.renderPipeline;
if (!this._hasBloom) {
  this.particleSystem.setNoBloom();
}
```

**In the runtime fallback (tick loop catch block):**
After `this.renderPipeline = null;`, add:
```ts
if (this._hasBloom) {
  this._hasBloom = false;
  this.particleSystem.setNoBloom();
}
```

## Compensation Values

| Property | With Bloom | Without Bloom | Reasoning |
|----------|-----------|---------------|-----------|
| baseAlpha multiplier | 1.0x | 2.5x | Compensates for lost bloom additive composition (strength 0.25 ≈ 25% brightness boost) |
| finalAlpha ceiling | 0.2 | 0.5 | Allows brighter particles to simulate bloom's glow accumulation |
| Logo glow ceiling | 0.35 | 0.7 | Preserves gold pulse visibility without bloom amplification |
| Particle size | unchanged | unchanged | Bloom's soft spread approximated by brighter overlapping additive particles |

## Edge Cases

- **Bloom works fine:** `uNoBloom` stays at 0.0. `mix(1.0, 2.5, 0.0) = 1.0`. Zero visual change.
- **Bloom fails at init:** `setNoBloom()` called once before any rendering. Compensation active from first frame.
- **Bloom fails at runtime:** Catch block sets `uNoBloom = 1.0`. Next frame renders with compensation. One frame of dim particles — imperceptible.
- **`uNoBloom` is never unset:** Once bloom fails, compensation stays permanently. Bloom can't recover at runtime anyway.

## Files

- `components/canvas/shaders/particle-material.ts` — add uniform, modify alpha math
- `components/canvas/particle-system.ts` — add import and `setNoBloom()` method
- `components/canvas/cosmos-engine.ts` — add `_hasBloom` field, call `setNoBloom()` on fallback
