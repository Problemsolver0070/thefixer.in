# Phase 2: Hero "Cosmic Emergence" + Logo — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the hero section where particles converge into The Fixer's logo mark, pulse gold, reveal the tagline, and dissolve on scroll — the site's jaw-drop first impression.

**Architecture:** A geometric SVG logo is sampled into a 3D point cloud. A `targetBuffer` (vec4, w=weight) is added to the particle system alongside a `uSeekStrength` uniform. When animated 0→1 via GSAP, particles spring toward their assigned target positions, forming the logo. A `uLogoGlow` uniform shifts particle color to gold and boosts alpha for the pulse. A module-level engine bridge (`cosmos-ref.ts`) connects the React hero component to the Three.js engine. ScrollTrigger dissolves the logo when the user scrolls past the hero.

**Tech Stack:** Three.js r183 TSL, GSAP 3.14.2 + ScrollTrigger, Next.js 16.2.2, React 19

---

## File Structure

```
NEW FILES:
  lib/cosmos-ref.ts                   -- Module-level engine bridge (singleton + onReady callback)
  lib/svg-to-points.ts                -- SVG path sampling → Float32Array point cloud
  public/logo/thefixer-mark.svg       -- The Fixer geometric logo mark
  components/sections/HeroSection.tsx  -- Hero with GSAP emergence timeline + scroll dissolve

MODIFIED FILES:
  components/canvas/cosmos-engine.ts         -- Expose `particles` getter
  components/canvas/CosmosCanvas.tsx          -- Register/unregister engine with cosmos-ref
  components/canvas/particle-system.ts        -- Add targetBuffer, setTargetPositions(), setSeekStrength(), setLogoGlow(), CPU seek fallback
  components/canvas/shaders/particle-compute.ts -- Add uSeekStrength, target storage, spring seek force
  components/canvas/shaders/particle-material.ts -- Add uLogoGlow, gold pulse color shift, alpha boost
  app/page.tsx                                -- Replace hero placeholder with HeroSection
  app/globals.css                             -- Hero layout + animation styles
```

---

### Task 1: Engine Bridge

**Files:**
- Create: `lib/cosmos-ref.ts`
- Modify: `components/canvas/cosmos-engine.ts`
- Modify: `components/canvas/CosmosCanvas.tsx`

- [ ] **Step 1: Create `lib/cosmos-ref.ts`**

```ts
/**
 * Module-level singleton bridge for accessing the CosmosEngine
 * from React components outside the canvas subtree.
 * Mirrors the pattern used by lib/scroll-state.ts.
 */
import type { CosmosEngine } from "@/components/canvas/cosmos-engine";

type EngineReadyCallback = (engine: CosmosEngine) => void;

let _engine: CosmosEngine | null = null;
const _callbacks: Set<EngineReadyCallback> = new Set();

export function setCosmosEngine(engine: CosmosEngine | null): void {
  _engine = engine;
  if (engine) {
    _callbacks.forEach((cb) => cb(engine));
    _callbacks.clear();
  }
}

export function getCosmosEngine(): CosmosEngine | null {
  return _engine;
}

/**
 * Register a callback that fires when the engine is ready.
 * If the engine is already initialized, fires immediately.
 * Returns an unsubscribe function.
 */
export function onEngineReady(cb: EngineReadyCallback): () => void {
  if (_engine) {
    cb(_engine);
  } else {
    _callbacks.add(cb);
  }
  return () => _callbacks.delete(cb);
}
```

- [ ] **Step 2: Add `particles` getter to `cosmos-engine.ts`**

Add this public getter to the `CosmosEngine` class, after the private field declarations (around line 50):

```ts
  /** Public access for animation controllers (e.g. HeroSection GSAP timeline) */
  get particles(): ParticleSystem {
    return this.particleSystem;
  }
```

- [ ] **Step 3: Register engine in `CosmosCanvas.tsx`**

Add import at the top of `CosmosCanvas.tsx`:

```ts
import { setCosmosEngine } from "@/lib/cosmos-ref";
```

In the `bootstrap` async function, after `engine.start()` (around line 100), add:

```ts
        engine.start();
        setCosmosEngine(engine);
```

In the cleanup return function (around line 116), add before `engine.dispose()`:

```ts
      setCosmosEngine(null);
```

- [ ] **Step 4: Build and verify**

Run: `npx next build 2>&1 | tail -5`
Expected: `✓ Compiled successfully`

- [ ] **Step 5: Commit**

```bash
git add lib/cosmos-ref.ts components/canvas/cosmos-engine.ts components/canvas/CosmosCanvas.tsx
git commit -m "feat: add engine bridge for cross-component access to particle system"
```

---

### Task 2: Logo SVG Design

**Files:**
- Create: `public/logo/thefixer-mark.svg`

- [ ] **Step 1: Create the logo SVG**

Create directory and file `public/logo/thefixer-mark.svg`:

```svg
<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor">
  <!-- 3/4 circle arc (270°) — gap at upper-right. Suggests precision gauge, scope, focus. -->
  <path d="M169 140 A80 80 0 1 1 140 31" stroke-width="4" stroke-linecap="round"/>
  <!-- Vertical crosshair — precision, alignment -->
  <path d="M100 55 L100 145" stroke-width="3.5" stroke-linecap="round"/>
  <!-- Horizontal crosshair — balance, stability -->
  <path d="M55 100 L145 100" stroke-width="3.5" stroke-linecap="round"/>
  <!-- Accent diagonal in the gap — dynamism, the "fix" entering the system -->
  <path d="M152 42 L167 57" stroke-width="3" stroke-linecap="round"/>
</svg>
```

**Design rationale:** A precision crosshair inside an incomplete circle. The arc gap at the upper-right with a diagonal accent suggests an entry point — "the fix entering the system." Stroke-only paths sample cleanly into a particle point cloud. The mark is recognizable at favicon size and meaningful at full scale.

- [ ] **Step 2: Verify the SVG renders**

Open `public/logo/thefixer-mark.svg` in a browser to visually confirm the logo shape.

- [ ] **Step 3: Commit**

```bash
git add public/logo/thefixer-mark.svg
git commit -m "feat: add The Fixer geometric logo mark SVG"
```

---

### Task 3: SVG to Points Utility

**Files:**
- Create: `lib/svg-to-points.ts`

- [ ] **Step 1: Create `lib/svg-to-points.ts`**

```ts
/**
 * Converts an SVG file's stroke paths into a Float32Array of 3D points
 * suitable for use as particle target positions.
 *
 * Uses the browser's native SVG geometry APIs (getPointAtLength).
 * Must run client-side.
 */

export interface PointCloudResult {
  /** vec3 positions as flat Float32Array [x,y,z, x,y,z, ...] */
  positions: Float32Array;
  /** Number of points actually sampled */
  count: number;
}

/**
 * Load an SVG from a URL, sample points along its stroke paths,
 * and return centered+scaled 3D positions.
 *
 * @param svgUrl - URL to the SVG file (e.g. "/logo/thefixer-mark.svg")
 * @param targetCount - Desired number of sample points
 * @param worldScale - Max extent in world units (default 15)
 */
export async function svgToPointCloud(
  svgUrl: string,
  targetCount: number,
  worldScale = 15,
): Promise<PointCloudResult> {
  // Fetch and parse SVG
  const response = await fetch(svgUrl);
  const svgText = await response.text();

  // Insert into a hidden container so browser computes geometry
  const container = document.createElement("div");
  container.style.cssText = "position:absolute;left:-9999px;visibility:hidden;width:0;height:0;overflow:hidden";
  container.innerHTML = svgText;
  document.body.appendChild(container);

  const svg = container.querySelector("svg");
  if (!svg) {
    document.body.removeChild(container);
    throw new Error(`No <svg> element found in ${svgUrl}`);
  }

  // Get viewBox for coordinate mapping
  const vb = svg.viewBox.baseVal;
  const vbWidth = vb.width || 200;
  const vbHeight = vb.height || 200;
  const vbCenterX = vb.x + vbWidth / 2;
  const vbCenterY = vb.y + vbHeight / 2;

  // Collect all geometry elements and their path lengths
  const geometryEls = svg.querySelectorAll("path, line, circle, ellipse, rect, polygon, polyline");
  const pathData: { el: SVGGeometryElement; len: number }[] = [];
  let totalLength = 0;

  for (const el of geometryEls) {
    const geom = el as SVGGeometryElement;
    try {
      const len = geom.getTotalLength();
      if (len > 0) {
        pathData.push({ el: geom, len });
        totalLength += len;
      }
    } catch {
      // Skip elements that don't support getTotalLength
    }
  }

  if (totalLength === 0) {
    document.body.removeChild(container);
    throw new Error(`No valid geometry paths found in ${svgUrl}`);
  }

  // Scale factor: map SVG coords to world coords, centered at origin
  const maxDim = Math.max(vbWidth, vbHeight);
  const scale = worldScale / maxDim;

  // Sample points proportionally across all paths
  const positions = new Float32Array(targetCount * 3);
  let pointIdx = 0;

  for (const { el, len } of pathData) {
    const pathPointCount = Math.max(1, Math.round((len / totalLength) * targetCount));

    for (let i = 0; i < pathPointCount && pointIdx < targetCount; i++) {
      const t = pathPointCount === 1 ? 0 : (i / (pathPointCount - 1)) * len;
      const pt = el.getPointAtLength(t);

      // Center and scale to world coordinates
      // Negate Y because SVG Y-down, Three.js Y-up
      const i3 = pointIdx * 3;
      positions[i3] = (pt.x - vbCenterX) * scale;
      positions[i3 + 1] = -(pt.y - vbCenterY) * scale;
      positions[i3 + 2] = 0; // Logo lives on the z=0 plane

      pointIdx++;
    }
  }

  document.body.removeChild(container);

  return { positions, count: pointIdx };
}
```

- [ ] **Step 2: Build and verify**

Run: `npx next build 2>&1 | tail -5`
Expected: `✓ Compiled successfully`

- [ ] **Step 3: Commit**

```bash
git add lib/svg-to-points.ts
git commit -m "feat: add SVG-to-point-cloud utility for particle logo formation"
```

---

### Task 4: Particle Target System + Seek Force + Gold Pulse

This is the core task — adds target position tracking, seek force to both GPU compute and CPU fallback, and gold pulse to the material.

**Files:**
- Modify: `components/canvas/shaders/particle-compute.ts`
- Modify: `components/canvas/shaders/particle-material.ts`
- Modify: `components/canvas/particle-system.ts`

#### Step-by-step:

- [ ] **Step 1: Add seek uniforms and target storage to `particle-compute.ts`**

Add these new uniform exports after `uBoundaryRadius` (line 44):

```ts
export const uSeekStrength = /* @__PURE__ */ uniform(float(0));
```

Change the function signature to accept a target buffer:

```ts
export function createParticleComputeShader(
  posBuffer: StorageInstancedBufferAttribute,
  velBuffer: StorageInstancedBufferAttribute,
  targetBuffer: StorageInstancedBufferAttribute,
) {
```

Add target storage creation after `velStorage` (around line 55):

```ts
  const targetStorage = storage(targetBuffer, "vec4", targetBuffer.count);
```

Add the seek force section inside the `computeUpdate` Fn, just before the velocity integration comment `// ================================================================ // VELOCITY INTEGRATION`. Insert this block:

```ts
    // ================================================================
    // SEEK TARGET (logo convergence)
    // ================================================================
    // targetStorage is vec4: xyz = target position, w = weight (0 or 1).
    // When uSeekStrength > 0 and w > 0, spring force pulls toward target.
    const target = targetStorage.element(instanceIndex);
    const targetWeight = target.w;
    const targetPos = vec3(target.x, target.y, target.z);
    const toTarget = sub(targetPos, pos);
    const seekMagnitude = float(3.0);
    const seekForce = mul(toTarget, uSeekStrength.mul(seekMagnitude).mul(targetWeight));
```

Modify the drift force to fade with seek strength (so drift doesn't fight convergence). Change the `driftForce` assignment to:

```ts
    // Reduce drift during convergence so it doesn't fight the seek
    const driftScale = sub(float(1.0), uSeekStrength.mul(0.85));
    const driftForce = vec3(
      curlX.mul(uDriftSpeed).mul(speedMul).mul(driftScale),
      curlY.mul(uDriftSpeed).mul(speedMul).mul(driftScale),
      curlZ.mul(uDriftSpeed).mul(speedMul).mul(driftScale),
    );
```

Update `totalForce` to include `seekForce`:

```ts
    const totalForce = add(
      add(add(add(add(driftForce, mouseForce), boundaryForce), centerPull), seekForce),
      add(scrollPush, scrollLift),
    );
```

Make damping increase during convergence (prevents overshoot). Replace the fixed `const damping = float(0.992);` with:

```ts
    // Higher damping during convergence prevents overshoot
    const damping = mix(float(0.992), float(0.94), uSeekStrength);
```

Add `mix` to the imports from `"three/tsl"`:

```ts
import {
  // ... existing imports ...
  mix,
} from "three/tsl";
```

- [ ] **Step 2: Add gold pulse to `particle-material.ts`**

Add new uniform export after `uMatParticleSize`:

```ts
export const uMatLogoGlow = /* @__PURE__*/ uniform(float(0));
```

Add `goldBright` color constant after the `goldWarm` line:

```ts
const goldBright = new Color(COLORS.goldBright);
```

After the `scrollShiftedColor` definition, add the logo glow color mix:

```ts
  // ---- Logo glow pulse (gold shift during convergence) ----
  const logoColor = mix(
    scrollShiftedColor,
    color(goldBright),
    clamp(uMatLogoGlow, float(0), float(1)),
  );
```

Replace `material.colorNode = vec4(scrollShiftedColor, finalAlpha);` with:

```ts
  // Boost alpha during logo glow for brighter convergence
  const glowAlpha = clamp(
    add(finalAlpha, uMatLogoGlow.mul(float(0.15))),
    float(0.008),
    float(0.35),
  );
  material.colorNode = vec4(logoColor, glowAlpha);
```

- [ ] **Step 3: Add target system to `particle-system.ts`**

Add new import for the seek uniform:

```ts
import {
  createParticleComputeShader,
  uTime,
  uDeltaTime,
  uMouseX,
  uMouseY,
  uMouseInfluence,
  uScrollProgress,
  uDriftSpeed,
  uBoundaryRadius,
  uSeekStrength,
} from "./shaders/particle-compute";
```

Add import for material glow uniform:

```ts
import {
  createParticleMaterial,
  uMatTime,
  uMatScrollProgress,
  uMatParticleSize,
  uMatLogoGlow,
} from "./shaders/particle-material";
```

Add `StorageInstancedBufferAttribute` back to imports if needed (it should already be there).

Add new private field after `velBuffer`:

```ts
  private targetBuffer: StorageInstancedBufferAttribute;
```

Add new private fields for seek/glow state:

```ts
  private _seekStrength = 0;
  private _logoGlow = 0;
```

In the constructor, create the target buffer after `velBuffer` creation:

```ts
    // vec4: xyz = target position, w = weight (0 = no target, 1 = logo particle)
    this.targetBuffer = new StorageInstancedBufferAttribute(
      this.maxParticles,
      4, // vec4
    );
```

Update the `createParticleComputeShader` call to pass the target buffer:

```ts
    const { computeUpdate } = createParticleComputeShader(
      this.posBuffer,
      this.velBuffer,
      this.targetBuffer,
    );
```

Add these new public methods after `setScrollProgress`:

```ts
  /**
   * Load logo point cloud as target positions for the first `count` particles.
   * Remaining particles get weight 0 (unaffected by seek).
   */
  setTargetPositions(logoPoints: Float32Array, logoPointCount: number): void {
    const targetArray = this.targetBuffer.array as Float32Array;

    // First logoPointCount particles: assign logo positions with weight 1
    for (let i = 0; i < logoPointCount && i < this.maxParticles; i++) {
      const i4 = i * 4;
      const i3 = i * 3;
      targetArray[i4] = logoPoints[i3];      // x
      targetArray[i4 + 1] = logoPoints[i3 + 1]; // y
      targetArray[i4 + 2] = logoPoints[i3 + 2]; // z
      targetArray[i4 + 3] = 1.0;                // weight = active
    }

    // Remaining particles: weight 0 (no seek target)
    for (let i = logoPointCount; i < this.maxParticles; i++) {
      const i4 = i * 4;
      targetArray[i4] = 0;
      targetArray[i4 + 1] = 0;
      targetArray[i4 + 2] = 0;
      targetArray[i4 + 3] = 0; // weight = inactive
    }

    this.targetBuffer.needsUpdate = true;
  }

  setSeekStrength(strength: number): void {
    this._seekStrength = strength;
    uSeekStrength.value = strength;
  }

  setLogoGlow(intensity: number): void {
    this._logoGlow = intensity;
    uMatLogoGlow.value = intensity;
  }
```

- [ ] **Step 4: Add seek force to CPU fallback `cpuAnimate`**

In the `cpuAnimate` method of `particle-system.ts`, add these local variables at the top of the method (after existing locals):

```ts
    const seekStr = this._seekStrength;
    const targetArray = this.targetBuffer.array as Float32Array;
    const seekMag = 3.0;
    // Higher damping during convergence
    const damping = seekStr > 0.01 ? 0.992 - seekStr * 0.052 : 0.992; // lerp 0.992 → 0.94
    const driftMul = 1.0 - seekStr * 0.85;
```

Replace the existing `const damping = 0.992;` with the dynamic one above.

After the curl-noise drift calculation (after `let fz = ...`), multiply by driftMul:

```ts
      fx *= driftMul;
      fy *= driftMul;
      fz *= driftMul;
```

Add the seek force section, after the scroll influence and before velocity integration:

```ts
      // ---- Seek target (logo convergence) ----
      if (seekStr > 0.01) {
        const i4 = i * 4;
        const tw = targetArray[i4 + 3]; // weight
        if (tw > 0.5) {
          const tx = targetArray[i4];
          const ty = targetArray[i4 + 1];
          const tz = targetArray[i4 + 2];
          const seekX = (tx - px) * seekStr * seekMag;
          const seekY = (ty - py) * seekStr * seekMag;
          const seekZ = (tz - pz) * seekStr * seekMag;
          fx += seekX;
          fy += seekY;
          fz += seekZ;
        }
      }
```

- [ ] **Step 5: Build and verify**

Run: `npx next build 2>&1 | tail -5`
Expected: `✓ Compiled successfully`

- [ ] **Step 6: Commit**

```bash
git add components/canvas/shaders/particle-compute.ts components/canvas/shaders/particle-material.ts components/canvas/particle-system.ts
git commit -m "feat: add particle target system with seek force and gold pulse"
```

---

### Task 5: Hero Section Component

**Files:**
- Create: `components/sections/HeroSection.tsx`

- [ ] **Step 1: Create `components/sections/HeroSection.tsx`**

```tsx
"use client";

/**
 * HeroSection — "Cosmic Emergence"
 *
 * Auto-play emergence timeline:
 *   void → particles drift → edge glow → convergence → logo → gold pulse → tagline
 *
 * Scroll-driven dissolve:
 *   As user scrolls past hero, seekStrength → 0 and logo dissolves back to particles.
 */

import { useRef, useEffect, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap-setup";
import { onEngineReady } from "@/lib/cosmos-ref";
import { svgToPointCloud } from "@/lib/svg-to-points";
import type { CosmosEngine } from "@/components/canvas/cosmos-engine";

const LOGO_SVG_URL = "/logo/thefixer-mark.svg";
const LOGO_POINT_COUNT = 5000;

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const edgeGlowRef = useRef<HTMLDivElement>(null);
  const brandNameRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<CosmosEngine | null>(null);
  const [ready, setReady] = useState(false);

  // Load logo and initialize target positions when engine is ready
  useEffect(() => {
    const unsubscribe = onEngineReady(async (engine) => {
      engineRef.current = engine;

      try {
        const { positions, count } = await svgToPointCloud(
          LOGO_SVG_URL,
          LOGO_POINT_COUNT,
          14, // world-space scale (logo ~14 units wide)
        );
        engine.particles.setTargetPositions(positions, count);
        setReady(true);
      } catch (err) {
        console.error("[HeroSection] Failed to load logo point cloud:", err);
        // Degrade gracefully — show text without logo animation
        setReady(true);
      }
    });

    return unsubscribe;
  }, []);

  // Auto-play emergence timeline + scroll dissolve
  useGSAP(
    () => {
      if (!ready || !engineRef.current || !sectionRef.current) return;

      const engine = engineRef.current;

      // ---- Proxy objects for GSAP to tween ----
      const seekProxy = { value: 0 };
      const glowProxy = { value: 0 };

      // ---- AUTO-PLAY EMERGENCE TIMELINE ----
      const intro = gsap.timeline({ delay: 0.8 });

      // 1. Edge glow fades in
      intro.to(edgeGlowRef.current, {
        opacity: 0.7,
        duration: 2,
        ease: "power1.in",
      });

      // 2. Particles converge into logo (overlapping with glow)
      intro.to(
        seekProxy,
        {
          value: 1,
          duration: 3.5,
          ease: "power2.inOut",
          onUpdate: () => engine.particles.setSeekStrength(seekProxy.value),
        },
        "<0.5",
      );

      // 3. Gold pulse
      intro.to(
        glowProxy,
        {
          value: 1,
          duration: 0.8,
          ease: "power2.in",
          onUpdate: () => engine.particles.setLogoGlow(glowProxy.value),
        },
        ">-0.3",
      );
      intro.to(glowProxy, {
        value: 0.15, // settle to subtle warm glow
        duration: 1.5,
        ease: "power2.out",
        onUpdate: () => engine.particles.setLogoGlow(glowProxy.value),
      });

      // 4. Brand name + tagline fade in
      intro.fromTo(
        brandNameRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1.2, ease: "power2.out" },
        "<0.2",
      );
      intro.fromTo(
        taglineRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 1.2, ease: "power2.out" },
        "<0.3",
      );

      // 5. Scroll indicator appears
      intro.fromTo(
        scrollIndicatorRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1, ease: "power1.in" },
        ">0.5",
      );

      // ---- SCROLL-DRIVEN DISSOLVE ----
      // When user scrolls the hero out of view, dissolve the logo
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom -20%",
        scrub: 0.5,
        onUpdate: (self) => {
          const p = self.progress;

          // If intro is still playing, finish it
          if (intro.isActive()) {
            intro.progress(1);
          }

          // Dissolve: seekStrength 1 → 0
          engine.particles.setSeekStrength(1 - p);
          // Fade glow out
          engine.particles.setLogoGlow(Math.max(0, 0.15 * (1 - p * 2)));
        },
        onLeave: () => {
          engine.particles.setSeekStrength(0);
          engine.particles.setLogoGlow(0);
        },
      });
    },
    { scope: sectionRef, dependencies: [ready] },
  );

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="hero-section"
      data-section-index={0}
    >
      {/* Edge glow overlay */}
      <div ref={edgeGlowRef} className="hero-edge-glow" />

      {/* Center content */}
      <div className="hero-content">
        {/* Logo area — particles form here (transparent, no DOM element needed) */}
        <div className="hero-logo-space" aria-hidden="true" />

        <h1
          ref={brandNameRef}
          className="hero-brand-name"
          style={{ opacity: 0 }}
        >
          THE FIXER
        </h1>

        <p
          ref={taglineRef}
          className="hero-tagline"
          style={{ opacity: 0 }}
        >
          You&apos;ve exhausted every option. That&apos;s why you&apos;re here.
        </p>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollIndicatorRef}
        className="hero-scroll-indicator"
        style={{ opacity: 0 }}
      >
        <svg
          viewBox="0 0 24 40"
          width="24"
          height="40"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 4 L12 28" className="hero-scroll-line" />
          <path d="M6 22 L12 28 L18 22" />
        </svg>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Build and verify**

Run: `npx next build 2>&1 | tail -5`
Expected: `✓ Compiled successfully`

- [ ] **Step 3: Commit**

```bash
git add components/sections/HeroSection.tsx
git commit -m "feat: add HeroSection with emergence timeline and scroll dissolve"
```

---

### Task 6: Page Integration

**Files:**
- Modify: `app/page.tsx`
- Modify: `app/globals.css`

- [ ] **Step 1: Update `app/globals.css` with hero styles**

Add these styles at the end of `globals.css`:

```css
/* ------------------------------------------------------------------ */
/*  Hero Section                                                      */
/* ------------------------------------------------------------------ */

.hero-section {
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.hero-edge-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse at center,
    transparent 30%,
    oklch(0.58 0.18 265 / 0.04) 60%,
    oklch(0.58 0.18 265 / 0.08) 100%
  );
  pointer-events: none;
  opacity: 0;
}

.hero-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1rem;
  z-index: 1;
  pointer-events: none;
}

.hero-logo-space {
  width: 200px;
  height: 200px;
  /* No visual — particles form the logo in 3D space at this approximate position */
}

.hero-brand-name {
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  font-weight: 300;
  letter-spacing: 0.35em;
  color: var(--color-celestial-white);
  margin-top: 1rem;
}

.hero-tagline {
  font-family: var(--font-body);
  font-size: clamp(0.9rem, 2vw, 1.15rem);
  font-weight: 300;
  line-height: 1.7;
  color: var(--color-celestial-dim);
  max-width: 32rem;
  margin-top: 0.5rem;
}

.hero-scroll-indicator {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  color: var(--color-celestial-dim);
  z-index: 1;
}

.hero-scroll-line {
  animation: scroll-pulse 2.5s ease-in-out infinite;
}

@keyframes scroll-pulse {
  0%, 100% {
    opacity: 0.3;
    stroke-dashoffset: 0;
  }
  50% {
    opacity: 0.9;
    stroke-dashoffset: -8;
  }
}
```

- [ ] **Step 2: Update `app/page.tsx` to use HeroSection**

Replace the full content of `app/page.tsx`:

```tsx
import CosmosBackground from "@/components/canvas/CosmosBackground";
import SectionBlock from "@/components/sections/SectionBlock";
import HeroSection from "@/components/sections/HeroSection";

const SECTIONS = [
  { id: "transition", label: "Descent Into Purpose" },
  { id: "services", label: "What We Do" },
  { id: "process", label: "How We Work" },
  { id: "proof", label: "Proof" },
  { id: "team", label: "The Unit" },
  { id: "gateway", label: "The Gateway" },
  { id: "coda", label: "The Coda" },
] as const;

export default function Home() {
  return (
    <>
      <CosmosBackground />
      <div className="content-layer">
        {/* Hero — custom component with emergence animation */}
        <HeroSection />

        {/* Remaining sections — placeholder content */}
        {SECTIONS.map((section, i) => (
          <SectionBlock key={section.id} id={section.id} index={i + 1}>
            <div className="text-center">
              <p className="text-sm uppercase tracking-[0.3em] text-celestial-dim mb-4">
                {String(i + 2).padStart(2, "0")}
              </p>
              <h2 className="text-5xl font-bold text-celestial-white/20">
                {section.label}
              </h2>
            </div>
          </SectionBlock>
        ))}
      </div>
    </>
  );
}
```

- [ ] **Step 3: Build and verify**

Run: `npx next build 2>&1 | tail -5`
Expected: `✓ Compiled successfully`

- [ ] **Step 4: Visual verification**

Run: `npx next dev --turbopack`

Open `http://localhost:3000` and verify:
1. Particles drift on load (existing behavior)
2. Edge glow fades in ~0.8s after load
3. Particles converge into the logo shape over ~3.5 seconds
4. Gold pulse flashes through the logo
5. "THE FIXER" and tagline text fade in
6. Scroll indicator appears at bottom
7. Scrolling down dissolves the logo back into particles
8. Console shows no errors

- [ ] **Step 5: Commit**

```bash
git add app/page.tsx app/globals.css
git commit -m "feat: integrate hero emergence section into page layout"
```

---

## Self-Review

**Spec coverage check:**
- ✅ Section 1 emergence sequence (void → drift → converge → pulse → tagline → scroll indicator)
- ✅ Logo designed from scratch, SVG-based, stroke paths for particle reconstruction
- ✅ Mouse/gyroscope interaction (existing from Phase 1)
- ✅ Scroll-driven dissolve (seekStrength → 0 on scroll)
- ✅ Adaptive particle count (existing from Phase 1)
- ⏭️ Section 2 "Descent Into Purpose" full river/descent/parallax — Phase 3
- ⏭️ Logo used as favicon — can be added separately

**Placeholder scan:** No TBD, TODO, or vague steps. All code is complete.

**Type consistency:** `setTargetPositions(positions: Float32Array, count: number)`, `setSeekStrength(strength: number)`, `setLogoGlow(intensity: number)` — consistent across particle-system.ts, HeroSection.tsx, and compute shader.
