# Phase 1: Foundation & Particle Engine — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Establish the project foundation, smooth scroll infrastructure, and a working WebGPU particle engine with adaptive performance — the core on which all visual sections will be built.

**Architecture:** Next.js 16 single-page app with a full-viewport Three.js WebGPU canvas as a fixed background layer. DOM content scrolls over the canvas. Lenis provides smooth scrolling, GSAP ScrollTrigger bridges scroll position to the 3D engine, and an adaptive performance system maintains 60fps across devices. Direct Three.js (not React Three Fiber) is used because R3F v9 lacks native WebGPU support — the entire 3D experience runs on a single WebGPU render pipeline.

**Tech Stack:** Next.js 16.2.2, React 19.2.4, TypeScript 6.0.2, Tailwind CSS 4.2.2, Three.js r183 (WebGPU), GSAP 3.14.2 + @gsap/react 2.1.2, Lenis 1.3.21, Vitest

---

## File Structure

```
app/
├── globals.css                  -- Tailwind @import, @theme color tokens, base styles
├── layout.tsx                   -- Root layout with providers
├── page.tsx                     -- Main page with canvas + sections
components/
├── providers/
│   ├── LenisProvider.tsx        -- 'use client' Lenis + GSAP ScrollTrigger sync
│   └── SmoothScrollProvider.tsx -- Combines Lenis + GSAP into single provider
├── canvas/
│   ├── CosmosCanvas.tsx         -- 'use client' React wrapper for Three.js (dynamic, ssr: false)
│   ├── cosmos-engine.ts         -- Scene, WebGPU renderer, RenderPipeline, animation loop
│   ├── particle-system.ts       -- GPU particle buffers, compute dispatch, sprite mesh
│   ├── shaders/
│   │   ├── particle-compute.ts  -- TSL compute shader for particle physics
│   │   └── particle-material.ts -- TSL SpriteNodeMaterial with glow and color
│   ├── performance-monitor.ts   -- FPS tracking + adaptive quality tiers
│   └── webgpu-utils.ts          -- WebGPU/WebGL2 detection + GPU capability tiers
├── sections/
│   └── SectionBlock.tsx         -- Scroll-tracked section wrapper component
lib/
├── theme.ts                     -- Color tokens as JS/TS constants (mirrors CSS tokens)
├── gsap-setup.ts                -- GSAP plugin registration (ScrollTrigger, useGSAP)
└── scroll-state.ts              -- Shared scroll state between DOM and 3D engine
__tests__/
├── performance-monitor.test.ts
├── webgpu-utils.test.ts
└── theme.test.ts
```

**Key architectural decision:** No React Three Fiber. R3F v9.5.0 types `state.gl` as `WebGLRenderer` and breaks with WebGPU compute shaders, `RenderPipeline`, and TSL node materials. R3F v10 alpha is unstable. Direct Three.js gives us full control over the WebGPU pipeline with zero abstraction overhead.

---

### Task 1: Project Scaffolding & Dependencies

**Files:**
- Create: entire project via `create-next-app`
- Modify: `package.json` (add dependencies)

- [ ] **Step 1: Create Next.js 16 project**

```bash
cd /home/venu/Desktop/NEW-SITE
npx create-next-app@latest . --typescript --tailwind --eslint --app --turbopack --yes
```

This scaffolds: App Router, TypeScript 6, Tailwind CSS v4, ESLint, Turbopack (default bundler). The `--yes` flag accepts all defaults. The `.` installs in the current directory.

Expected: Project created with `app/`, `public/`, `next.config.ts`, `tsconfig.json`, `package.json`.

- [ ] **Step 2: Install 3D, animation, and testing dependencies**

```bash
npm install three@0.183.2 gsap@3.14.2 @gsap/react@2.1.2 motion@12.38.0 lenis@1.3.21
npm install -D @types/three vitest @testing-library/react @testing-library/jest-dom jsdom
```

- [ ] **Step 3: Create Vitest config**

Create `vitest.config.ts` at project root:

```ts
import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: [],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});
```

- [ ] **Step 4: Add test script to package.json**

In `package.json`, add to `"scripts"`:

```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 5: Verify dev server starts**

```bash
npm run dev
```

Expected: Dev server starts on `http://localhost:3000` with no errors. Turbopack compiles successfully.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: scaffold Next.js 16 project with 3D and animation dependencies"
```

---

### Task 2: Theme & Color System

**Files:**
- Modify: `app/globals.css`
- Create: `lib/theme.ts`
- Create: `__tests__/theme.test.ts`

- [ ] **Step 1: Write the failing test for theme constants**

Create `__tests__/theme.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { COLORS, PARTICLE_CONFIG } from "@/lib/theme";

describe("theme", () => {
  it("exports all required color tokens", () => {
    expect(COLORS.cosmosVoid).toBe("#0A0E1A");
    expect(COLORS.cosmosDeep).toBe("#111833");
    expect(COLORS.cosmosNebula).toBe("#1A1F4D");
    expect(COLORS.celestialWhite).toBe("#E8ECF5");
    expect(COLORS.celestialDim).toBe("#8B95B0");
    expect(COLORS.etherealBlue).toBe("#4A7BF7");
    expect(COLORS.etherealGlow).toBe("#6BB8FF");
    expect(COLORS.goldWarm).toBe("#D4A853");
    expect(COLORS.goldBright).toBe("#F0C45A");
  });

  it("exports particle config with valid ranges", () => {
    expect(PARTICLE_CONFIG.maxParticles).toBeGreaterThanOrEqual(500000);
    expect(PARTICLE_CONFIG.mobileBaseline).toBeGreaterThanOrEqual(50000);
    expect(PARTICLE_CONFIG.desktopBaseline).toBeGreaterThanOrEqual(200000);
    expect(PARTICLE_CONFIG.minFps).toBeGreaterThanOrEqual(50);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run __tests__/theme.test.ts
```

Expected: FAIL — `Cannot find module '@/lib/theme'`

- [ ] **Step 3: Implement theme constants**

Create `lib/theme.ts`:

```ts
export const COLORS = {
  cosmosVoid: "#0A0E1A",
  cosmosDeep: "#111833",
  cosmosNebula: "#1A1F4D",
  celestialWhite: "#E8ECF5",
  celestialDim: "#8B95B0",
  etherealBlue: "#4A7BF7",
  etherealGlow: "#6BB8FF",
  goldWarm: "#D4A853",
  goldBright: "#F0C45A",
} as const;

export const PARTICLE_CONFIG = {
  maxParticles: 500_000,
  mobileBaseline: 100_000,
  desktopBaseline: 200_000,
  minFps: 55,
  targetFps: 60,
  adjustmentInterval: 30, // frames between quality adjustments
  particleSize: 0.015,
  driftSpeed: 0.0003,
} as const;

export const SCROLL_CONFIG = {
  totalSections: 8,
  smoothness: 0.1,
  lerp: 0.1,
} as const;
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run __tests__/theme.test.ts
```

Expected: PASS

- [ ] **Step 5: Set up Tailwind CSS @theme with color tokens**

Replace the contents of `app/globals.css` with:

```css
@import "tailwindcss";

@theme {
  --color-cosmos-void: oklch(0.13 0.03 265);
  --color-cosmos-deep: oklch(0.17 0.05 268);
  --color-cosmos-nebula: oklch(0.22 0.08 272);
  --color-celestial-white: oklch(0.94 0.01 265);
  --color-celestial-dim: oklch(0.65 0.03 265);
  --color-ethereal-blue: oklch(0.58 0.18 265);
  --color-ethereal-glow: oklch(0.73 0.12 240);
  --color-gold-warm: oklch(0.73 0.12 80);
  --color-gold-bright: oklch(0.81 0.14 85);

  --font-display: "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-body: "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, monospace;
}

html {
  background-color: var(--color-cosmos-void);
  color: var(--color-celestial-white);
  font-family: var(--font-body);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  min-height: 100vh;
  overflow-x: hidden;
}

::selection {
  background-color: var(--color-ethereal-blue);
  color: var(--color-celestial-white);
}

/* Canvas sits behind everything */
.cosmos-canvas {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

/* Content scrolls over canvas */
.content-layer {
  position: relative;
  z-index: 1;
}

/* Section defaults */
.section-block {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

- [ ] **Step 6: Update layout.tsx with base structure**

Replace `app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "The Fixer — AI & Software Consultancy",
  description:
    "Elite AI agentic solutions and software development consultancy. We solve what others can't.",
  keywords: [
    "AI consultancy",
    "software development",
    "systems design",
    "agentic AI",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 7: Verify the theme renders**

```bash
npm run dev
```

Open `http://localhost:3000`. Expected: deep navy background, soft white text, no layout issues.

- [ ] **Step 8: Commit**

```bash
git add lib/theme.ts __tests__/theme.test.ts app/globals.css app/layout.tsx
git commit -m "feat: add Deep Cosmos color system and theme constants"
```

---

### Task 3: GSAP Setup Module

**Files:**
- Create: `lib/gsap-setup.ts`

- [ ] **Step 1: Create GSAP registration module**

Create `lib/gsap-setup.ts`:

```ts
"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
  gsap.ticker.lagSmoothing(0);
}

export { gsap, ScrollTrigger, useGSAP };
```

This module is the single import point for all GSAP functionality. `lagSmoothing(0)` is critical for Lenis sync — prevents GSAP from smoothing out frame drops, letting Lenis handle timing.

- [ ] **Step 2: Verify module compiles**

```bash
npm run dev
```

No errors in terminal. The module is imported lazily when needed.

- [ ] **Step 3: Commit**

```bash
git add lib/gsap-setup.ts
git commit -m "feat: add GSAP setup module with ScrollTrigger and useGSAP"
```

---

### Task 4: Lenis Smooth Scroll Provider

**Files:**
- Create: `components/providers/LenisProvider.tsx`
- Create: `lib/scroll-state.ts`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Create shared scroll state**

Create `lib/scroll-state.ts`:

```ts
type ScrollListener = (progress: number, velocity: number) => void;

const listeners: Set<ScrollListener> = new Set();

let currentProgress = 0;
let currentVelocity = 0;

export function getScrollProgress(): number {
  return currentProgress;
}

export function getScrollVelocity(): number {
  return currentVelocity;
}

export function setScrollState(progress: number, velocity: number): void {
  currentProgress = progress;
  currentVelocity = velocity;
  listeners.forEach((fn) => fn(progress, velocity));
}

export function onScrollUpdate(fn: ScrollListener): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
```

- [ ] **Step 2: Create LenisProvider component**

Create `components/providers/LenisProvider.tsx`:

```tsx
"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap-setup";
import { setScrollState } from "@/lib/scroll-state";

function ScrollTriggerSync() {
  const lenisRef = useRef<ReturnType<typeof useLenis> | null>(null);

  useLenis((lenis) => {
    lenisRef.current = lenis;
    ScrollTrigger.update();

    const limit = lenis.limit || 1;
    const progress = lenis.scroll / limit;
    const velocity = lenis.velocity;
    setScrollState(progress, velocity);
  });

  useEffect(() => {
    const remove = gsap.ticker.add((time: number) => {
      if (lenisRef.current && typeof lenisRef.current === "object") {
        // Lenis raf expects milliseconds, GSAP ticker provides seconds
        (lenisRef.current as { raf: (t: number) => void }).raf(time * 1000);
      }
    });

    return () => {
      gsap.ticker.remove(remove as unknown as gsap.TickerCallback);
    };
  }, []);

  return null;
}

export default function LenisProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReactLenis
      root
      options={{
        autoRaf: false,
        lerp: 0.1,
        duration: 1.2,
        smoothWheel: true,
      }}
    >
      <ScrollTriggerSync />
      {children}
    </ReactLenis>
  );
}
```

- [ ] **Step 3: Add Lenis CSS import to globals.css**

Add at the top of `app/globals.css`, before the Tailwind import:

```css
@import "lenis/dist/lenis.css";
@import "tailwindcss";
```

- [ ] **Step 4: Wire LenisProvider into layout.tsx**

Update `app/layout.tsx` — add the import and wrap children:

```tsx
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import LenisProvider from "@/components/providers/LenisProvider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "The Fixer — AI & Software Consultancy",
  description:
    "Elite AI agentic solutions and software development consultancy. We solve what others can't.",
  keywords: [
    "AI consultancy",
    "software development",
    "systems design",
    "agentic AI",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body>
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 5: Create a temporary tall page to test scrolling**

Replace `app/page.tsx` temporarily:

```tsx
export default function Home() {
  return (
    <div className="content-layer">
      {Array.from({ length: 8 }, (_, i) => (
        <section
          key={i}
          className="section-block border-b border-celestial-dim/10"
        >
          <h2 className="text-4xl font-bold text-celestial-white/50">
            Section {i + 1}
          </h2>
        </section>
      ))}
    </div>
  );
}
```

- [ ] **Step 6: Verify smooth scrolling works**

```bash
npm run dev
```

Open `http://localhost:3000`. Scroll up and down. Expected: silky smooth scrolling with slight momentum/easing. The scroll should feel distinctly different from native browser scroll — more fluid and controlled. Check there are no console errors.

- [ ] **Step 7: Commit**

```bash
git add lib/scroll-state.ts components/providers/LenisProvider.tsx app/globals.css app/layout.tsx app/page.tsx
git commit -m "feat: add Lenis smooth scroll with GSAP ScrollTrigger sync"
```

---

### Task 5: WebGPU Detection Utility

**Files:**
- Create: `components/canvas/webgpu-utils.ts`
- Create: `__tests__/webgpu-utils.test.ts`

- [ ] **Step 1: Write the failing test**

Create `__tests__/webgpu-utils.test.ts`:

```ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { detectGPUTier, type GPUTier } from "@/components/canvas/webgpu-utils";

describe("detectGPUTier", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("returns 'none' when navigator.gpu is unavailable", async () => {
    const result = await detectGPUTier();
    // jsdom has no navigator.gpu
    expect(result.tier).toBe("none");
    expect(result.renderer).toBe("webgl2");
    expect(result.maxParticles).toBeGreaterThan(0);
  });

  it("returns correct particle counts per tier", async () => {
    const result = await detectGPUTier();
    expect(typeof result.maxParticles).toBe("number");
    expect(typeof result.renderer).toBe("string");
    expect(["high", "medium", "low", "none"]).toContain(result.tier);
  });

  it("GPUTier type has required fields", () => {
    const tier: GPUTier = {
      tier: "high",
      renderer: "webgpu",
      maxParticles: 500_000,
      shaderComplexity: "full",
    };
    expect(tier.tier).toBe("high");
    expect(tier.renderer).toBe("webgpu");
    expect(tier.maxParticles).toBe(500_000);
    expect(tier.shaderComplexity).toBe("full");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run __tests__/webgpu-utils.test.ts
```

Expected: FAIL — `Cannot find module '@/components/canvas/webgpu-utils'`

- [ ] **Step 3: Implement WebGPU detection**

Create `components/canvas/webgpu-utils.ts`:

```ts
export type ShaderComplexity = "full" | "reduced" | "minimal";

export interface GPUTier {
  tier: "high" | "medium" | "low" | "none";
  renderer: "webgpu" | "webgl2";
  maxParticles: number;
  shaderComplexity: ShaderComplexity;
}

const TIER_CONFIG: Record<GPUTier["tier"], Omit<GPUTier, "tier" | "renderer">> =
  {
    high: { maxParticles: 500_000, shaderComplexity: "full" },
    medium: { maxParticles: 200_000, shaderComplexity: "reduced" },
    low: { maxParticles: 100_000, shaderComplexity: "reduced" },
    none: { maxParticles: 50_000, shaderComplexity: "minimal" },
  };

export async function detectGPUTier(): Promise<GPUTier> {
  // Check WebGPU availability
  if (typeof navigator === "undefined" || !("gpu" in navigator)) {
    return { tier: "none", renderer: "webgl2", ...TIER_CONFIG.none };
  }

  try {
    const adapter = await navigator.gpu.requestAdapter();
    if (!adapter) {
      return { tier: "none", renderer: "webgl2", ...TIER_CONFIG.none };
    }

    const limits = adapter.limits;
    const maxBufferSize = limits.maxStorageBufferBindingSize;
    const maxComputeInvocations = limits.maxComputeInvocationsPerWorkgroup;

    // Classify based on GPU capabilities
    if (maxBufferSize >= 256 * 1024 * 1024 && maxComputeInvocations >= 256) {
      return { tier: "high", renderer: "webgpu", ...TIER_CONFIG.high };
    }

    if (maxBufferSize >= 128 * 1024 * 1024) {
      return { tier: "medium", renderer: "webgpu", ...TIER_CONFIG.medium };
    }

    return { tier: "low", renderer: "webgpu", ...TIER_CONFIG.low };
  } catch {
    return { tier: "none", renderer: "webgl2", ...TIER_CONFIG.none };
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run __tests__/webgpu-utils.test.ts
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add components/canvas/webgpu-utils.ts __tests__/webgpu-utils.test.ts
git commit -m "feat: add WebGPU detection with GPU capability tiers"
```

---

### Task 6: Performance Monitor

**Files:**
- Create: `components/canvas/performance-monitor.ts`
- Create: `__tests__/performance-monitor.test.ts`

- [ ] **Step 1: Write the failing tests**

Create `__tests__/performance-monitor.test.ts`:

```ts
import { describe, it, expect, beforeEach } from "vitest";
import { PerformanceMonitor } from "@/components/canvas/performance-monitor";

describe("PerformanceMonitor", () => {
  let monitor: PerformanceMonitor;

  beforeEach(() => {
    monitor = new PerformanceMonitor({
      targetFps: 60,
      minFps: 55,
      adjustmentInterval: 5,
      initialParticles: 200_000,
      minParticles: 50_000,
      maxParticles: 500_000,
      stepSize: 25_000,
    });
  });

  it("starts with initial particle count", () => {
    expect(monitor.getParticleCount()).toBe(200_000);
  });

  it("maintains count when FPS is above target", () => {
    // Simulate 5 frames at 60fps (16.67ms apart)
    for (let i = 0; i < 5; i++) {
      monitor.recordFrame(i * 16.67);
    }
    expect(monitor.getParticleCount()).toBe(200_000);
  });

  it("reduces particles when FPS drops below minimum", () => {
    // Simulate 5 frames at ~30fps (33.3ms apart)
    for (let i = 0; i < 5; i++) {
      monitor.recordFrame(i * 33.3);
    }
    expect(monitor.getParticleCount()).toBe(175_000);
  });

  it("increases particles when FPS is consistently above target", () => {
    // Simulate 10 intervals of great FPS to trigger increase
    for (let interval = 0; interval < 10; interval++) {
      for (let i = 0; i < 5; i++) {
        monitor.recordFrame(interval * 5 * 16 + i * 16);
      }
    }
    expect(monitor.getParticleCount()).toBeGreaterThan(200_000);
  });

  it("never goes below minParticles", () => {
    monitor = new PerformanceMonitor({
      targetFps: 60,
      minFps: 55,
      adjustmentInterval: 5,
      initialParticles: 75_000,
      minParticles: 50_000,
      maxParticles: 500_000,
      stepSize: 25_000,
    });

    // Simulate terrible FPS many times
    for (let round = 0; round < 10; round++) {
      for (let i = 0; i < 5; i++) {
        monitor.recordFrame(round * 5 * 50 + i * 50);
      }
    }
    expect(monitor.getParticleCount()).toBeGreaterThanOrEqual(50_000);
  });

  it("never exceeds maxParticles", () => {
    monitor = new PerformanceMonitor({
      targetFps: 60,
      minFps: 55,
      adjustmentInterval: 5,
      initialParticles: 475_000,
      minParticles: 50_000,
      maxParticles: 500_000,
      stepSize: 25_000,
    });

    // Simulate great FPS many times
    for (let round = 0; round < 20; round++) {
      for (let i = 0; i < 5; i++) {
        monitor.recordFrame(round * 5 * 16 + i * 16);
      }
    }
    expect(monitor.getParticleCount()).toBeLessThanOrEqual(500_000);
  });

  it("reports current FPS", () => {
    for (let i = 0; i < 5; i++) {
      monitor.recordFrame(i * 16.67);
    }
    const fps = monitor.getCurrentFps();
    expect(fps).toBeGreaterThan(50);
    expect(fps).toBeLessThan(70);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run __tests__/performance-monitor.test.ts
```

Expected: FAIL — `Cannot find module '@/components/canvas/performance-monitor'`

- [ ] **Step 3: Implement PerformanceMonitor**

Create `components/canvas/performance-monitor.ts`:

```ts
export interface PerformanceMonitorConfig {
  targetFps: number;
  minFps: number;
  adjustmentInterval: number; // frames between adjustments
  initialParticles: number;
  minParticles: number;
  maxParticles: number;
  stepSize: number;
}

export class PerformanceMonitor {
  private config: PerformanceMonitorConfig;
  private particleCount: number;
  private frameTimes: number[] = [];
  private frameCount = 0;
  private consecutiveGoodIntervals = 0;

  constructor(config: PerformanceMonitorConfig) {
    this.config = config;
    this.particleCount = config.initialParticles;
  }

  recordFrame(timestamp: number): void {
    this.frameTimes.push(timestamp);
    this.frameCount++;

    if (this.frameCount >= this.config.adjustmentInterval) {
      this.evaluate();
      this.frameCount = 0;
    }
  }

  private evaluate(): void {
    const fps = this.calculateFps();
    if (fps <= 0) return;

    if (fps < this.config.minFps) {
      // FPS too low — reduce particles
      this.particleCount = Math.max(
        this.config.minParticles,
        this.particleCount - this.config.stepSize
      );
      this.consecutiveGoodIntervals = 0;
    } else if (fps >= this.config.targetFps) {
      // FPS is great — after sustained good performance, try increasing
      this.consecutiveGoodIntervals++;
      if (this.consecutiveGoodIntervals >= 3) {
        this.particleCount = Math.min(
          this.config.maxParticles,
          this.particleCount + this.config.stepSize
        );
        this.consecutiveGoodIntervals = 0;
      }
    } else {
      // FPS is acceptable but not great — hold steady
      this.consecutiveGoodIntervals = 0;
    }
  }

  private calculateFps(): number {
    if (this.frameTimes.length < 2) return 0;

    const recent = this.frameTimes.slice(-this.config.adjustmentInterval);
    if (recent.length < 2) return 0;

    const totalTime = recent[recent.length - 1] - recent[0];
    if (totalTime <= 0) return 0;

    const fps = ((recent.length - 1) / totalTime) * 1000;

    // Keep only recent frames to prevent memory growth
    if (this.frameTimes.length > this.config.adjustmentInterval * 2) {
      this.frameTimes = this.frameTimes.slice(-this.config.adjustmentInterval);
    }

    return fps;
  }

  getCurrentFps(): number {
    return this.calculateFps();
  }

  getParticleCount(): number {
    return this.particleCount;
  }

  reset(particleCount?: number): void {
    this.particleCount = particleCount ?? this.config.initialParticles;
    this.frameTimes = [];
    this.frameCount = 0;
    this.consecutiveGoodIntervals = 0;
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run __tests__/performance-monitor.test.ts
```

Expected: PASS (all 7 tests)

- [ ] **Step 5: Commit**

```bash
git add components/canvas/performance-monitor.ts __tests__/performance-monitor.test.ts
git commit -m "feat: add adaptive performance monitor with FPS-based particle adjustment"
```

---

### Task 7: Particle Shaders (TSL)

**Files:**
- Create: `components/canvas/shaders/particle-compute.ts`
- Create: `components/canvas/shaders/particle-material.ts`

- [ ] **Step 1: Create particle compute shader**

Create `components/canvas/shaders/particle-compute.ts`:

```ts
import {
  Fn,
  instanceIndex,
  uniform,
  float,
  vec3,
  hash,
  sin,
  cos,
  floor,
  mix,
  storage,
  StorageInstancedBufferAttribute,
} from "three/tsl";

export interface ParticleComputeBuffers {
  positions: ReturnType<typeof storage>;
  velocities: ReturnType<typeof storage>;
}

export interface ParticleComputeUniforms {
  time: ReturnType<typeof uniform>;
  deltaTime: ReturnType<typeof uniform>;
  particleCount: ReturnType<typeof uniform>;
  driftSpeed: ReturnType<typeof uniform>;
  boundaryRadius: ReturnType<typeof uniform>;
  scrollProgress: ReturnType<typeof uniform>;
  mouseX: ReturnType<typeof uniform>;
  mouseY: ReturnType<typeof uniform>;
  mouseInfluence: ReturnType<typeof uniform>;
}

export function createParticleUniforms(): ParticleComputeUniforms {
  return {
    time: uniform(float(0)),
    deltaTime: uniform(float(0.016)),
    particleCount: uniform(float(500_000)),
    driftSpeed: uniform(float(0.0003)),
    boundaryRadius: uniform(float(5.0)),
    scrollProgress: uniform(float(0)),
    mouseX: uniform(float(0)),
    mouseY: uniform(float(0)),
    mouseInfluence: uniform(float(0)),
  };
}

export function createParticleComputeShader(
  positionsBuffer: StorageInstancedBufferAttribute,
  velocitiesBuffer: StorageInstancedBufferAttribute,
  uniforms: ParticleComputeUniforms
) {
  const positions = storage(positionsBuffer, "vec3", positionsBuffer.count);
  const velocities = storage(velocitiesBuffer, "vec3", velocitiesBuffer.count);

  const computeShader = Fn(() => {
    const idx = instanceIndex;
    const pos = positions.element(idx);
    const vel = velocities.element(idx);

    const t = uniforms.time;
    const dt = uniforms.deltaTime;
    const drift = uniforms.driftSpeed;
    const boundary = uniforms.boundaryRadius;

    // Unique seed per particle for deterministic randomness
    const seed = float(idx).mul(0.001);

    // Ambient drift: slow, organic movement using sine waves
    const driftX = sin(t.mul(0.3).add(seed.mul(6.28))).mul(drift);
    const driftY = cos(t.mul(0.2).add(seed.mul(3.14))).mul(drift);
    const driftZ = sin(t.mul(0.25).add(seed.mul(4.71))).mul(drift.mul(0.5));

    // Apply drift to velocity
    vel.x.addAssign(driftX.mul(dt));
    vel.y.addAssign(driftY.mul(dt));
    vel.z.addAssign(driftZ.mul(dt));

    // Damping — particles slow down naturally
    vel.mulAssign(0.995);

    // Mouse influence: gentle attraction/repulsion
    const mousePos = vec3(uniforms.mouseX, uniforms.mouseY, float(0));
    const toMouse = mousePos.sub(pos);
    const mouseDist = toMouse.length();
    const mouseForce = toMouse
      .normalize()
      .mul(uniforms.mouseInfluence.div(mouseDist.add(0.5)));
    vel.addAssign(mouseForce.mul(dt));

    // Update position
    pos.addAssign(vel);

    // Soft boundary: push particles back toward center when they drift too far
    const distFromCenter = pos.length();
    const overflow = distFromCenter.sub(boundary).max(0);
    const pushBack = pos.normalize().mul(overflow.mul(-0.01));
    pos.addAssign(pushBack);
  });

  return computeShader().compute(positionsBuffer.count);
}
```

- [ ] **Step 2: Create particle material shader**

Create `components/canvas/shaders/particle-material.ts`:

```ts
import {
  uniform,
  float,
  vec3,
  vec4,
  color,
  mix,
  smoothstep,
  positionLocal,
  instanceIndex,
  sin,
  storage,
  StorageInstancedBufferAttribute,
} from "three/tsl";
import * as THREE from "three/webgpu";
import { COLORS } from "@/lib/theme";

export interface ParticleMaterialUniforms {
  time: ReturnType<typeof uniform>;
  scrollProgress: ReturnType<typeof uniform>;
  particleSize: ReturnType<typeof uniform>;
  glowIntensity: ReturnType<typeof uniform>;
}

export function createParticleMaterialUniforms(): ParticleMaterialUniforms {
  return {
    time: uniform(float(0)),
    scrollProgress: uniform(float(0)),
    particleSize: uniform(float(0.015)),
    glowIntensity: uniform(float(1.0)),
  };
}

export function createParticleMaterial(
  positionsBuffer: StorageInstancedBufferAttribute,
  materialUniforms: ParticleMaterialUniforms
): THREE.SpriteNodeMaterial {
  const positions = storage(positionsBuffer, "vec3", positionsBuffer.count);

  const material = new THREE.SpriteNodeMaterial();
  material.transparent = true;
  material.depthWrite = false;
  material.blending = THREE.AdditiveBlending;

  // Position each sprite instance at its buffer position
  material.positionNode = positions.toAttribute();

  // Scale: slight variation per particle + breathing animation
  const idx = float(instanceIndex);
  const breathe = sin(materialUniforms.time.mul(0.5).add(idx.mul(0.01)))
    .mul(0.3)
    .add(1.0);
  material.scaleNode = vec3(
    materialUniforms.particleSize.mul(breathe),
    materialUniforms.particleSize.mul(breathe),
    float(1)
  );

  // Color: blend between ethereal blue and gold based on scroll + per-particle variation
  const coldColor = color(new THREE.Color(COLORS.etherealGlow));
  const warmColor = color(new THREE.Color(COLORS.goldWarm));
  const baseColor = color(new THREE.Color(COLORS.etherealBlue));

  // Each particle has a slightly different hue
  const hueShift = sin(idx.mul(0.0001)).mul(0.5).add(0.5);
  const particleColor = mix(baseColor, coldColor, hueShift);

  // Scroll progress warms the palette
  const scrollBlend = smoothstep(float(0), float(1), materialUniforms.scrollProgress);
  const finalColor = mix(particleColor, warmColor, scrollBlend.mul(0.3));

  material.colorNode = vec4(finalColor, float(1));

  // Opacity: distance-based fade + glow intensity
  const distFromCenter = positionLocal.length();
  const fade = smoothstep(float(0.5), float(0.0), distFromCenter);
  material.opacityNode = fade.mul(materialUniforms.glowIntensity).mul(0.8);

  return material;
}
```

- [ ] **Step 3: Verify shaders compile (no import errors)**

```bash
npm run dev
```

No build errors. These modules are not yet imported by any page component, but Turbopack should still check their syntax.

- [ ] **Step 4: Commit**

```bash
git add components/canvas/shaders/
git commit -m "feat: add TSL particle compute and material shaders"
```

---

### Task 8: Particle System Class

**Files:**
- Create: `components/canvas/particle-system.ts`

- [ ] **Step 1: Implement ParticleSystem**

Create `components/canvas/particle-system.ts`:

```ts
import * as THREE from "three/webgpu";
import { StorageInstancedBufferAttribute } from "three/tsl";
import {
  createParticleComputeShader,
  createParticleUniforms,
  type ParticleComputeUniforms,
} from "./shaders/particle-compute";
import {
  createParticleMaterial,
  createParticleMaterialUniforms,
  type ParticleMaterialUniforms,
} from "./shaders/particle-material";
import { PARTICLE_CONFIG } from "@/lib/theme";

export class ParticleSystem {
  readonly mesh: THREE.Sprite;
  readonly computeNode: ReturnType<typeof createParticleComputeShader>;
  readonly computeUniforms: ParticleComputeUniforms;
  readonly materialUniforms: ParticleMaterialUniforms;

  private positionsBuffer: StorageInstancedBufferAttribute;
  private velocitiesBuffer: StorageInstancedBufferAttribute;
  private maxParticles: number;
  private activeParticles: number;

  constructor(initialParticles: number, maxParticles: number) {
    this.maxParticles = maxParticles;
    this.activeParticles = initialParticles;

    // Create GPU storage buffers at max capacity
    this.positionsBuffer = new StorageInstancedBufferAttribute(
      new Float32Array(maxParticles * 3),
      3
    );
    this.velocitiesBuffer = new StorageInstancedBufferAttribute(
      new Float32Array(maxParticles * 3),
      3
    );

    // Initialize positions: random distribution in a sphere
    const posData = this.positionsBuffer.array as Float32Array;
    const velData = this.velocitiesBuffer.array as Float32Array;
    for (let i = 0; i < maxParticles; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = Math.pow(Math.random(), 1 / 3) * PARTICLE_CONFIG.driftSpeed * 10000;

      posData[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      posData[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      posData[i * 3 + 2] = r * Math.cos(phi) * 0.5; // Flatten Z

      // Tiny random initial velocity
      velData[i * 3] = (Math.random() - 0.5) * 0.001;
      velData[i * 3 + 1] = (Math.random() - 0.5) * 0.001;
      velData[i * 3 + 2] = (Math.random() - 0.5) * 0.0005;
    }

    // Create uniforms
    this.computeUniforms = createParticleUniforms();
    this.materialUniforms = createParticleMaterialUniforms();

    // Create compute shader
    this.computeNode = createParticleComputeShader(
      this.positionsBuffer,
      this.velocitiesBuffer,
      this.computeUniforms
    );

    // Create sprite mesh
    const material = createParticleMaterial(
      this.positionsBuffer,
      this.materialUniforms
    );
    this.mesh = new THREE.Sprite(material);
    this.mesh.count = initialParticles;
    this.mesh.frustumCulled = false;
  }

  setParticleCount(count: number): void {
    this.activeParticles = Math.min(count, this.maxParticles);
    this.mesh.count = this.activeParticles;
    this.computeUniforms.particleCount.value = this.activeParticles;
  }

  setMousePosition(x: number, y: number, influence: number): void {
    this.computeUniforms.mouseX.value = x;
    this.computeUniforms.mouseY.value = y;
    this.computeUniforms.mouseInfluence.value = influence;
  }

  setScrollProgress(progress: number): void {
    this.computeUniforms.scrollProgress.value = progress;
    this.materialUniforms.scrollProgress.value = progress;
  }

  update(time: number, deltaTime: number): void {
    this.computeUniforms.time.value = time;
    this.computeUniforms.deltaTime.value = deltaTime;
    this.materialUniforms.time.value = time;
  }

  dispose(): void {
    this.mesh.material.dispose();
    this.positionsBuffer.array = new Float32Array(0);
    this.velocitiesBuffer.array = new Float32Array(0);
  }
}
```

- [ ] **Step 2: Verify no type errors**

```bash
npx tsc --noEmit
```

Expected: No errors (or only pre-existing Next.js type warnings).

- [ ] **Step 3: Commit**

```bash
git add components/canvas/particle-system.ts
git commit -m "feat: add ParticleSystem class with GPU compute and sprite rendering"
```

---

### Task 9: Cosmos Engine (Scene, Renderer, Pipeline)

**Files:**
- Create: `components/canvas/cosmos-engine.ts`

- [ ] **Step 1: Implement CosmosEngine**

Create `components/canvas/cosmos-engine.ts`:

```ts
import * as THREE from "three/webgpu";
import { pass } from "three/tsl";
import { bloom } from "three/addons/tsl/display/BloomNode.js";
import { ParticleSystem } from "./particle-system";
import { PerformanceMonitor } from "./performance-monitor";
import { detectGPUTier, type GPUTier } from "./webgpu-utils";
import { PARTICLE_CONFIG, COLORS } from "@/lib/theme";
import { onScrollUpdate } from "@/lib/scroll-state";

export class CosmosEngine {
  private renderer!: THREE.WebGPURenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private pipeline!: THREE.RenderPipeline;
  private particles!: ParticleSystem;
  private perfMonitor!: PerformanceMonitor;
  private gpuTier!: GPUTier;
  private canvas: HTMLCanvasElement;
  private animationId: number | null = null;
  private lastTime = 0;
  private mouseNDC = { x: 0, y: 0 };
  private unsubscribeScroll: (() => void) | null = null;
  private isInitialized = false;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(COLORS.cosmosVoid);

    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    this.camera.position.z = 4;
  }

  async init(): Promise<void> {
    // Detect GPU capabilities
    this.gpuTier = await detectGPUTier();

    // Create renderer
    this.renderer = new THREE.WebGPURenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: false,
    });
    await this.renderer.init();
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;

    // Create particle system
    const initialParticles = this.gpuTier.maxParticles;
    this.particles = new ParticleSystem(
      initialParticles,
      PARTICLE_CONFIG.maxParticles
    );
    this.scene.add(this.particles.mesh);

    // Create render pipeline with bloom
    this.pipeline = new THREE.RenderPipeline(this.renderer);
    const scenePass = pass(this.scene, this.camera);
    const colorNode = scenePass.getTextureNode("output");
    const bloomEffect = bloom(colorNode, 0.6, 0.4, 0.1);
    this.pipeline.outputNode = colorNode.add(bloomEffect);

    // Create performance monitor
    this.perfMonitor = new PerformanceMonitor({
      targetFps: PARTICLE_CONFIG.targetFps,
      minFps: PARTICLE_CONFIG.minFps,
      adjustmentInterval: PARTICLE_CONFIG.adjustmentInterval,
      initialParticles,
      minParticles: 50_000,
      maxParticles: this.gpuTier.maxParticles,
      stepSize: 25_000,
    });

    // Subscribe to scroll updates
    this.unsubscribeScroll = onScrollUpdate((progress) => {
      this.particles.setScrollProgress(progress);
    });

    this.isInitialized = true;
  }

  start(): void {
    if (!this.isInitialized) return;
    this.lastTime = performance.now();
    this.animate();
  }

  private animate = (): void => {
    this.animationId = requestAnimationFrame(this.animate);

    const now = performance.now();
    const deltaTime = Math.min((now - this.lastTime) / 1000, 0.05); // Cap delta
    this.lastTime = now;

    // Record frame for performance monitoring
    this.perfMonitor.recordFrame(now);
    const targetCount = this.perfMonitor.getParticleCount();
    this.particles.setParticleCount(targetCount);

    // Update particle system
    this.particles.update(now / 1000, deltaTime);

    // Dispatch compute shader
    this.renderer.compute(this.particles.computeNode);

    // Render with bloom pipeline
    this.pipeline.render();
  };

  setMousePosition(clientX: number, clientY: number): void {
    // Convert screen coords to NDC (-1 to 1)
    this.mouseNDC.x = (clientX / window.innerWidth) * 2 - 1;
    this.mouseNDC.y = -(clientY / window.innerHeight) * 2 + 1;

    // Project to world space at z=0
    const worldX = this.mouseNDC.x * this.camera.aspect * 2;
    const worldY = this.mouseNDC.y * 2;

    this.particles.setMousePosition(worldX, worldY, 0.002);
  }

  clearMouseInfluence(): void {
    this.particles.setMousePosition(0, 0, 0);
  }

  handleResize(): void {
    if (!this.isInitialized) return;
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  getStats(): { fps: number; particles: number; tier: string } {
    return {
      fps: Math.round(this.perfMonitor.getCurrentFps()),
      particles: this.perfMonitor.getParticleCount(),
      tier: this.gpuTier.tier,
    };
  }

  dispose(): void {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
    }
    if (this.unsubscribeScroll) {
      this.unsubscribeScroll();
    }
    this.particles.dispose();
    this.renderer.dispose();
    this.isInitialized = false;
  }
}
```

- [ ] **Step 2: Verify no type errors**

```bash
npx tsc --noEmit
```

Expected: No errors related to cosmos-engine.ts.

- [ ] **Step 3: Commit**

```bash
git add components/canvas/cosmos-engine.ts
git commit -m "feat: add CosmosEngine with WebGPU renderer, bloom pipeline, and adaptive particles"
```

---

### Task 10: Canvas React Component

**Files:**
- Create: `components/canvas/CosmosCanvas.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Create the React canvas wrapper**

Create `components/canvas/CosmosCanvas.tsx`:

```tsx
"use client";

import { useRef, useEffect, useCallback } from "react";
import { CosmosEngine } from "./cosmos-engine";

export default function CosmosCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<CosmosEngine | null>(null);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    engineRef.current?.setMousePosition(e.clientX, e.clientY);
  }, []);

  const handleMouseLeave = useCallback(() => {
    engineRef.current?.clearMouseInfluence();
  }, []);

  const handleResize = useCallback(() => {
    engineRef.current?.handleResize();
  }, []);

  // Handle device orientation (mobile gyroscope)
  const handleOrientation = useCallback((e: DeviceOrientationEvent) => {
    if (e.gamma === null || e.beta === null) return;
    // Map tilt to mouse-like coordinates
    const x = (e.gamma / 45) * (window.innerWidth / 2) + window.innerWidth / 2;
    const y = (e.beta / 45) * (window.innerHeight / 2) + window.innerHeight / 2;
    engineRef.current?.setMousePosition(x, y);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const engine = new CosmosEngine(canvas);
    engineRef.current = engine;

    let mounted = true;

    async function start() {
      try {
        await engine.init();
        if (mounted) {
          engine.start();
        }
      } catch (err) {
        console.error("CosmosEngine failed to initialize:", err);
      }
    }

    start();

    // Mouse interaction
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("resize", handleResize);

    // Request gyroscope permission on first touch (iOS)
    const requestGyroscope = async () => {
      if (
        typeof DeviceOrientationEvent !== "undefined" &&
        "requestPermission" in DeviceOrientationEvent
      ) {
        try {
          const permission =
            await (DeviceOrientationEvent as unknown as {
              requestPermission: () => Promise<string>;
            }).requestPermission();
          if (permission === "granted") {
            window.addEventListener("deviceorientation", handleOrientation);
          }
        } catch {
          // Permission denied or unavailable
        }
      } else if (typeof DeviceOrientationEvent !== "undefined") {
        // Non-iOS: no permission needed
        window.addEventListener("deviceorientation", handleOrientation);
      }
      window.removeEventListener("touchstart", requestGyroscope);
    };
    window.addEventListener("touchstart", requestGyroscope, { once: true });

    return () => {
      mounted = false;
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("deviceorientation", handleOrientation);
      window.removeEventListener("touchstart", requestGyroscope);
      engine.dispose();
      engineRef.current = null;
    };
  }, [handleMouseMove, handleMouseLeave, handleResize, handleOrientation]);

  return (
    <canvas
      ref={canvasRef}
      className="cosmos-canvas"
      aria-hidden="true"
    />
  );
}
```

- [ ] **Step 2: Create dynamic import wrapper in page.tsx**

Replace `app/page.tsx`:

```tsx
import dynamic from "next/dynamic";

const CosmosCanvas = dynamic(
  () => import("@/components/canvas/CosmosCanvas"),
  { ssr: false }
);

export default function Home() {
  return (
    <>
      <CosmosCanvas />
      <div className="content-layer">
        {Array.from({ length: 8 }, (_, i) => (
          <section
            key={i}
            className="section-block border-b border-celestial-dim/10"
          >
            <h2 className="text-4xl font-bold text-celestial-white/30">
              Section {i + 1}
            </h2>
          </section>
        ))}
      </div>
    </>
  );
}
```

- [ ] **Step 3: Verify the particle canvas renders**

```bash
npm run dev
```

Open `http://localhost:3000`. Expected:
- Deep navy background fills the viewport
- Hundreds of thousands of luminous particles drift slowly in a spherical distribution
- Particles glow with soft blue/cyan light and have a bloom effect
- Moving the mouse subtly influences nearby particles
- Scrolling through the sections shows content overlaying the particles
- The particle field is always visible behind the content
- No console errors
- FPS stays at or near 60fps

- [ ] **Step 4: Test on mobile (or mobile emulation)**

Open Chrome DevTools → Toggle device toolbar → Select a phone. Expected:
- Particles render (WebGL2 fallback if needed)
- Touch scrolling works smoothly
- No layout breaks

- [ ] **Step 5: Commit**

```bash
git add components/canvas/CosmosCanvas.tsx app/page.tsx
git commit -m "feat: add CosmosCanvas with WebGPU particles, mouse interaction, and mobile gyroscope"
```

---

### Task 11: Section Wrapper with ScrollTrigger

**Files:**
- Create: `components/sections/SectionBlock.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Create SectionBlock component**

Create `components/sections/SectionBlock.tsx`:

```tsx
"use client";

import { useRef } from "react";
import { useGSAP } from "@/lib/gsap-setup";
import { ScrollTrigger } from "@/lib/gsap-setup";

interface SectionBlockProps {
  id: string;
  index: number;
  children: React.ReactNode;
  className?: string;
  onEnter?: () => void;
  onLeave?: () => void;
  onProgress?: (progress: number) => void;
}

export default function SectionBlock({
  id,
  index,
  children,
  className = "",
  onEnter,
  onLeave,
  onProgress,
}: SectionBlockProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current) return;

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top bottom",
        end: "bottom top",
        onEnter: () => onEnter?.(),
        onLeave: () => onLeave?.(),
        onUpdate: (self) => onProgress?.(self.progress),
      });
    },
    { scope: sectionRef, dependencies: [onEnter, onLeave, onProgress] }
  );

  return (
    <section
      ref={sectionRef}
      id={id}
      className={`section-block ${className}`}
      data-section-index={index}
    >
      {children}
    </section>
  );
}
```

- [ ] **Step 2: Update page.tsx to use SectionBlock**

Replace `app/page.tsx`:

```tsx
import dynamic from "next/dynamic";
import SectionBlock from "@/components/sections/SectionBlock";

const CosmosCanvas = dynamic(
  () => import("@/components/canvas/CosmosCanvas"),
  { ssr: false }
);

const SECTIONS = [
  { id: "hero", label: "Cosmic Emergence" },
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
      <CosmosCanvas />
      <div className="content-layer">
        {SECTIONS.map((section, i) => (
          <SectionBlock key={section.id} id={section.id} index={i}>
            <div className="text-center">
              <p className="text-sm uppercase tracking-[0.3em] text-celestial-dim mb-4">
                {String(i + 1).padStart(2, "0")}
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

- [ ] **Step 3: Verify sections with ScrollTrigger**

```bash
npm run dev
```

Open `http://localhost:3000`. Expected:
- 8 full-viewport sections with labels and numbers
- Smooth scrolling through all sections (Lenis)
- Particles visible behind all sections
- Particle color temperature subtly shifts warmer as you scroll down (scroll progress drives the material shader)
- Smooth, no jank, no layout shifts

- [ ] **Step 4: Run all tests to verify nothing is broken**

```bash
npx vitest run
```

Expected: All tests pass.

- [ ] **Step 5: Commit**

```bash
git add components/sections/SectionBlock.tsx app/page.tsx
git commit -m "feat: add SectionBlock with ScrollTrigger and complete page skeleton"
```

---

## Phase 1 Deliverable

At the end of Phase 1, you have:

1. **A running Next.js 16 app** with the latest verified stack
2. **Deep Cosmos color system** in both CSS (Tailwind @theme) and JS constants
3. **Smooth scrolling** via Lenis synced with GSAP ScrollTrigger
4. **A full-viewport WebGPU particle canvas** with:
   - Hundreds of thousands of glowing particles drifting in deep space
   - Bloom post-processing for ethereal glow
   - Mouse interaction (desktop) and gyroscope readiness (mobile)
   - Scroll-driven color temperature shift
   - Adaptive performance: auto-adjusts particle count to maintain 60fps
   - WebGPU with automatic WebGL2 fallback
5. **8 placeholder sections** with ScrollTrigger tracking, ready for Phase 2 and 3 content
6. **Unit tests** for performance monitor, GPU detection, and theme constants
7. **Clean git history** with atomic commits

**Next:** Phase 2 — Logo design (SVG optimized for particle assembly) and Hero "Cosmic Emergence" section with full particle convergence animation.
