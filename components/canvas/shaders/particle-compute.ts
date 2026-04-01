/**
 * GPU Compute Shader for particle physics using Three.js TSL (Three Shading Language).
 *
 * Handles:
 * - Ambient drift (slow organic sine-wave movement)
 * - Mouse/cursor influence (gentle attraction)
 * - Velocity damping
 * - Soft boundary (push particles back when they drift too far)
 */
import {
  Fn,
  instanceIndex,
  storage,
  uniform,
  float,
  vec3,
  sin,
  cos,
  mul,
  add,
  sub,
  length,
  normalize,
  max,
  min,
  clamp,
  mix,
  select,
  hash,
} from "three/tsl";

import type { StorageInstancedBufferAttribute } from "three/webgpu";

/* ------------------------------------------------------------------ */
/*  Uniform declarations (shared with the engine that updates them)   */
/* ------------------------------------------------------------------ */

export const uTime = /* @__PURE__ */ uniform(float(0));
export const uDeltaTime = /* @__PURE__ */ uniform(float(0.016));
export const uMouseX = /* @__PURE__ */ uniform(float(0));
export const uMouseY = /* @__PURE__ */ uniform(float(0));
export const uMouseInfluence = /* @__PURE__ */ uniform(float(0));
export const uScrollProgress = /* @__PURE__ */ uniform(float(0));
export const uDriftSpeed = /* @__PURE__ */ uniform(float(0.0003));
export const uBoundaryRadius = /* @__PURE__ */ uniform(float(20));
export const uDamping = /* @__PURE__ */ uniform(float(0.98));

/* ------------------------------------------------------------------ */
/*  Build compute kernel                                              */
/* ------------------------------------------------------------------ */

export function createParticleComputeShader(
  posBuffer: StorageInstancedBufferAttribute,
  velBuffer: StorageInstancedBufferAttribute,
) {
  const posStorage = storage(posBuffer, "vec3", posBuffer.count);
  const velStorage = storage(velBuffer, "vec3", velBuffer.count);

  const computeFn = Fn(() => {
    const idx = instanceIndex;

    // Current position & velocity
    const pos = posStorage.element(idx);
    const vel = velStorage.element(idx);

    // Per-particle phase offset derived from index (deterministic)
    const phase = hash(idx).mul(6.2831);

    // ---- Ambient drift (organic sine-wave movement) ----
    const driftX = sin(add(uTime.mul(0.4), phase)).mul(uDriftSpeed);
    const driftY = cos(add(uTime.mul(0.3), phase.mul(1.3))).mul(uDriftSpeed);
    const driftZ = sin(add(uTime.mul(0.2), phase.mul(0.7))).mul(
      uDriftSpeed.mul(0.5),
    );
    const driftForce = vec3(driftX, driftY, driftZ);

    // ---- Mouse influence (gentle attraction) ----
    const mousePos = vec3(uMouseX, uMouseY, float(0));
    const toMouse = sub(mousePos, pos);
    const mouseDist = max(length(toMouse), float(0.001));
    // Attraction falls off with distance squared, capped
    const mouseStrength = clamp(
      uMouseInfluence.mul(float(0.5)).div(add(mouseDist, float(1.0))),
      float(0),
      float(0.01),
    );
    const mouseForce = mul(normalize(toMouse), mouseStrength);

    // ---- Soft boundary (push particles back gently) ----
    const distFromCenter = max(length(pos), float(0.001));
    const overflow = sub(distFromCenter, uBoundaryRadius).div(
      uBoundaryRadius,
    );
    const boundaryStrength = clamp(overflow, float(0), float(1)).mul(0.005);
    const boundaryForce = mul(normalize(pos).negate(), boundaryStrength);

    // ---- Scroll influence (slight outward push + vertical drift) ----
    const scrollPush = mul(normalize(pos), uScrollProgress.mul(0.0002));
    const scrollLift = vec3(float(0), uScrollProgress.mul(0.0001), float(0));

    // ---- Integrate forces into velocity ----
    const totalForce = add(driftForce, mouseForce, boundaryForce, scrollPush, scrollLift);
    vel.assign(add(mul(vel, uDamping), totalForce));

    // ---- Clamp velocity magnitude ----
    const speed = max(length(vel), float(0.0001));
    const maxSpeed = float(0.05);
    const clampedVel = mul(
      normalize(vel),
      min(speed, maxSpeed),
    );
    vel.assign(clampedVel);

    // ---- Update position ----
    pos.addAssign(vel);
  });

  return computeFn().compute(posBuffer.count);
}
