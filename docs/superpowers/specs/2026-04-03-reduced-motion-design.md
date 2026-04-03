# Reduced Motion Support — Design Spec

**Date:** 2026-04-03
**Audit Item:** #6 — `prefers-reduced-motion` is nearly ignored
**Status:** Approved

---

## Problem

CSS handles the scroll indicator animation for reduced-motion users, but the particle system — hundreds of thousands of moving particles — runs identically. Someone with vestibular disorders gets the full particle storm. The spec says "disables particle animations, provides static alternatives with the same content."

## Solution

Detect `prefers-reduced-motion: reduce` and provide a completely static particle scene: text+tagline formed instantly, zero drift, zero breathing, no convergence animation. The cosmic field is frozen in its final state from the first frame.

## Changes — 3 files

### 1. `components/canvas/particle-system.ts`

**New method: `teleportToTargets()`**

Copies target XYZ positions directly into the position buffer. Particles with active targets snap to their text positions. Untargeted particles stay at spawn positions. Zeroes all velocities.

```ts
teleportToTargets(): void {
  const pos = this.posBuffer.array as Float32Array;
  const vel = this.velBuffer.array as Float32Array;
  const target = this.targetBuffer.array as Float32Array;
  for (let i = 0; i < this.maxParticles; i++) {
    const i3 = i * 3;
    const i4 = i * 4;
    if (target[i4 + 3] > 0) {
      pos[i3] = target[i4];
      pos[i3 + 1] = target[i4 + 1];
      pos[i3 + 2] = target[i4 + 2];
    }
    // Zero all velocities — frozen stillness
    vel[i3] = 0;
    vel[i3 + 1] = 0;
    vel[i3 + 2] = 0;
  }
  this.posBuffer.needsUpdate = true;
  this.velBuffer.needsUpdate = true;
}
```

**New method: `setDriftSpeed(speed: number)`**

Mutates both the GPU uniform and a new instance field that `cpuAnimate` reads:

```ts
private _driftSpeed: number = PARTICLE_CONFIG.driftSpeed;

setDriftSpeed(speed: number): void {
  this._driftSpeed = speed;
  uDriftSpeed.value = speed;
}
```

Update `cpuAnimate` to read `this._driftSpeed` instead of `PARTICLE_CONFIG.driftSpeed` (line 167).

### 2. `components/sections/HeroSection.tsx`

In the `useGSAP` hook, before building the timeline, detect reduced-motion:

```ts
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
```

If `true`:
- `setTargetsForPhase('combined')` — set text+tagline targets
- `engine.particles.teleportToTargets()` — snap particles to text positions
- `engine.particles.setSeekStrength(1)` — lock particles at targets
- `engine.particles.setDriftSpeed(0)` — zero drift, frozen stillness
- Set edge glow visible: `edgeGlowRef.current!.style.opacity = '0.7'`
- Set scroll indicator visible: `scrollIndicatorRef.current!.style.opacity = '1'`
- Set `introComplete = true`
- **Do not create the GSAP intro timeline**
- **Still create the ScrollTrigger** for scroll dissolve (user-initiated, accessibility-safe)
- `return` early from the `useGSAP` callback after setting up the ScrollTrigger

### 3. `app/globals.css`

Extend the existing `@media (prefers-reduced-motion: reduce)` block to also disable the breathing animation on particles (though this is mostly handled by zeroing drift in JS, the CSS reinforcement is good practice):

```css
@media (prefers-reduced-motion: reduce) {
  .hero-scroll-line {
    animation: none;
  }
  .hero-edge-glow {
    transition: none;
  }
  .cosmos-canvas {
    animation: none;
  }
}
```

## Behavior Summary

| Aspect | Normal User | Reduced-Motion User |
|--------|------------|-------------------|
| Particle convergence | 14s cinematic emergence | Instant — text formed from first frame |
| Drift/swirl | Active curl-noise field | Frozen — zero drift |
| Alpha breathing | Subtle pulsing | Still runs (opacity only, not spatial) |
| Mouse/touch interaction | Particles attracted to cursor | Still works (user-initiated) |
| Scroll dissolve | Particles spread on scroll | Still works (user-initiated) |
| Edge glow | Fades in during Phase 1 | Visible immediately |
| Scroll indicator | Fades in after Phase 3 | Visible immediately |
| Text content | Spelled by particles after ~10s | Spelled by particles instantly |

Note: Alpha breathing is retained because it's a subtle opacity oscillation, not spatial motion. WCAG 2.3.3 targets motion that could trigger vestibular responses — opacity pulsing does not.

## Edge Cases

- **Preference changes mid-session:** Not handled. User would need to reload. This is standard practice — most sites don't listen for `change` events on the media query.
- **Scroll dissolve with frozen particles:** When seekStrength drops to 0 on scroll, particles have zero velocity and zero drift. They stay where they are (frozen). The text simply fades away as the hero section scrolls out of view. This is clean.
- **`teleportToTargets()` before targets set:** Would be a no-op (all target weights are 0). Safe.

## Files

- `components/canvas/particle-system.ts` — add `teleportToTargets()`, `setDriftSpeed()`, mutable `_driftSpeed` field
- `components/sections/HeroSection.tsx` — detect preference, skip timeline, instant formation
- `app/globals.css` — extend reduced-motion media query
