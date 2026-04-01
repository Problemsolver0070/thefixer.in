/**
 * Particle material using SpriteNodeMaterial with TSL.
 *
 * Features:
 * - Additive blending for ethereal glow
 * - Per-particle color variation (ethereal blue to cyan range)
 * - Scroll-driven color temperature shift (toward gold)
 * - Breathing/pulsing scale animation
 * - Distance-based opacity fade
 */
import {
  SpriteNodeMaterial,
  AdditiveBlending,
  Color,
} from "three/webgpu";

import {
  uniform,
  float,
  vec3,
  vec4,
  color,
  sin,
  cos,
  mul,
  add,
  sub,
  mix,
  clamp,
  smoothstep,
  length,
  hash,
  instanceIndex,
  positionWorld,
  storage,
} from "three/tsl";

import { COLORS } from "@/lib/theme";

import type { StorageInstancedBufferAttribute } from "three/webgpu";

/* ------------------------------------------------------------------ */
/*  Shared uniforms                                                   */
/* ------------------------------------------------------------------ */

export const uMatTime = /* @__PURE__ */ uniform(float(0));
export const uMatScrollProgress = /* @__PURE__ */ uniform(float(0));
export const uMatParticleSize = /* @__PURE__ */ uniform(float(0.015));

/* ------------------------------------------------------------------ */
/*  Colors                                                            */
/* ------------------------------------------------------------------ */

const etherealBlue = new Color(COLORS.etherealBlue);
const etherealGlow = new Color(COLORS.etherealGlow);
const goldWarm = new Color(COLORS.goldWarm);
const celestialDim = new Color(COLORS.celestialDim);

/* ------------------------------------------------------------------ */
/*  Create material                                                   */
/* ------------------------------------------------------------------ */

export function createParticleMaterial(
  posBuffer: StorageInstancedBufferAttribute,
) {
  const material = new SpriteNodeMaterial();
  material.transparent = true;
  material.depthWrite = false;
  material.blending = AdditiveBlending;

  // Storage reference for reading positions in the fragment shader
  const posStorage = storage(posBuffer, "vec3", posBuffer.count);

  // Per-particle deterministic randomness
  const particleHash = hash(instanceIndex);
  const particleHash2 = hash(add(instanceIndex, float(7919))); // second random channel

  // ---- Color: blend between ethereal blue and cyan, shift to gold with scroll ----
  const baseColor = mix(
    color(etherealBlue),
    color(etherealGlow),
    particleHash, // per-particle variation
  );
  const scrollShiftedColor = mix(
    baseColor,
    color(goldWarm),
    clamp(uMatScrollProgress.mul(0.6), float(0), float(0.5)),
  );

  // ---- Breathing / pulsing brightness ----
  const breathPhase = add(uMatTime.mul(0.8), particleHash.mul(6.2831));
  const breathFactor = add(
    float(0.7),
    mul(sin(breathPhase), float(0.3)),
  );

  // ---- Distance-based opacity fade ----
  const pos = posStorage.element(instanceIndex);
  const dist = length(pos);
  // Fade particles that are very far from center
  const distanceFade = smoothstep(float(25), float(15), dist);
  // Slight boost for particles near center (but don't over-expose)
  const centerBoost = smoothstep(float(0), float(3), dist);

  // ---- Final opacity ----
  const baseAlpha = mul(
    float(0.6),
    breathFactor,
    distanceFade,
    mix(float(0.4), float(1.0), centerBoost),
  );
  // Dimmer particles via hash (variety)
  const alphaVariation = mix(float(0.3), float(1.0), particleHash2);
  const finalAlpha = clamp(mul(baseAlpha, alphaVariation), float(0.02), float(0.9));

  // ---- Pulsing scale ----
  const scaleBreath = add(
    float(1.0),
    mul(sin(add(uMatTime.mul(1.2), particleHash.mul(3.14))), float(0.15)),
  );
  const particleScale = mul(uMatParticleSize, scaleBreath);

  // Assign to material
  material.colorNode = vec4(
    scrollShiftedColor.mul(breathFactor),
    finalAlpha,
  );

  // Scale via sizeAttenuation (SpriteNodeMaterial uses scaleNode)
  material.scaleNode = vec3(particleScale, particleScale, particleScale);

  return material;
}
