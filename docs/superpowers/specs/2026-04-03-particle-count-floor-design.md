# Dynamic Particle Count Floor — Design Spec

**Date:** 2026-04-03
**Audit Item:** #2 — Performance scaling can break text legibility
**Status:** Approved

---

## Problem

`PerformanceMonitor` can scale `_activeCount` down to 10,000 (its configured `minParticles`). But the combined text+tagline formation requires 13,000 targeted particles (8K text + 5K tagline). `sprite.count` is set to `_activeCount` — only particles with `index < sprite.count` render. Targets are assigned sequentially: text at indices 0–7999, tagline at indices 8000–12999. If the monitor scales below 13K, the tagline's tail vanishes. Below 8K, title characters disappear.

No floor protects targeted particles from performance scaling.

## Solution — Dynamic Floor (Approach A)

A private `_targetFloor` field in `ParticleSystem` tracks how many particles currently have active targets. `setParticleCount()` uses this as its lower bound instead of a hardcoded `1000`.

## Changes — confined to `components/canvas/particle-system.ts`

### 1. New private field

```ts
private _targetFloor: number = 0;
```

Initialized to 0. No targets set yet → monitor has full freedom.

### 2. `setTargetPositions()` — store the floor

After assigning target weights, add:

```ts
this._targetFloor = logoPointCount;
```

`logoPointCount` is the `count` parameter — the number of particles assigned `weight = 1.0`. This updates the floor every time targets change.

### 3. `setParticleCount()` — respect the floor

Current (line 294):
```ts
this._activeCount = Math.max(1000, Math.min(count, this.maxParticles));
```

Becomes:
```ts
this._activeCount = Math.max(this._targetFloor, Math.min(count, this.maxParticles));
```

The hardcoded 1000 is replaced by `_targetFloor`. When no targets are set, `_targetFloor` is 0 and `Math.min(count, this.maxParticles)` provides the lower bound naturally (count from PerformanceMonitor is always >= 10,000).

### 4. Public getter

```ts
getTargetFloor(): number {
  return this._targetFloor;
}
```

For engine debug/observability. Optional but low-cost.

## Behavior Per Phase

| Phase | Target Count | Floor | Monitor Range |
|-------|-------------|-------|---------------|
| Pre-init (no targets) | 0 | 0 | 10,000 – maxParticles |
| Logo | 8,000 | 8,000 | 8,000 – maxParticles |
| Text | 8,000 | 8,000 | 8,000 – maxParticles |
| Combined (text+tagline) | 13,000 | 13,000 | 13,000 – maxParticles |
| Dissolved (scroll away) | 0* | 0* | 10,000 – maxParticles |

*Dissolved: targets remain set but `seekStrength = 0` means particles drift. The floor stays at the last `setTargetPositions` count. This is fine — it doesn't hurt to keep extra particles alive when they're just drifting.

## Edge Cases

- **Floor > current `_activeCount`:** If `setTargetPositions` is called while the monitor has already scaled below the new floor, `_activeCount` is not immediately changed. On the next animation frame, the engine polls `getParticleCount()` and calls `setParticleCount()`, which clamps upward to the new floor. One-frame delay, imperceptible.

- **Phase transitions downward:** Going from combined (floor=13K) to logo (floor=8K) immediately lowers the floor. The monitor can reclaim those 5K particles on its next scale-down evaluation if FPS warrants it.

- **Rapid phase transitions:** Each `setTargetPositions` call overwrites the floor. No accumulation, no stale state.

- **`_targetFloor` of 0 with no targets:** Before any targets are set (engine initializing), the floor is 0. `setParticleCount` receives values from the monitor (>= 10,000), so `Math.max(0, ...)` has no effect. Correct behavior.

## Files

- **Only** `components/canvas/particle-system.ts` is modified.
- No changes to: PerformanceMonitor, CosmosEngine, HeroSection, compute shaders, or any other file.

## Testing

- Verify build passes with `npx next build`.
- Manual: In devtools, call `engine.particles.setParticleCount(5000)` during combined phase → should clamp to 13,000 (the floor), not 5,000.
- Manual: During logo phase, same call → should clamp to 8,000.
- Manual: Before any targets set → should accept 5,000 (floor is 0, monitor min is the only bound).
