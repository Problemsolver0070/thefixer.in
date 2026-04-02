# Visual Quality & Behavior Audit — 2026-04-03

**Status:** Active checklist. Work through each item one by one.

---

## A. Likely Misbehaviors

- [x] **1. Viewport resize breaks particle text layout** ✅ Fixed in `90d6f6a`
  Base positions stored immutably; `setTargetsForPhase()` rescales via ratio on resize/orientationchange (200ms debounce). All three formations (crosshair, text, tagline) adapt to current viewport.

- [x] **2. Performance scaling can break text legibility** ✅ Fixed in `c6d0d99`
  Dynamic `_targetFloor` in ParticleSystem ensures `_activeCount` never drops below the number of targeted particles. Floor updates per phase: 8K (logo/text), 13K (combined).

- [x] **3. Force-completing the intro on scroll is jarring** ✅ Fixed in `8eafaf8`
  Scroll during intro triggers `intro.timeScale(5)` instead of `intro.progress(1)`. All phases play at 5x speed (~2.4s) — no teleportation. Early returns prevent seek contention during fast-forward. `onLeave` kills any zombie timeline.

- [x] **4. Font race condition in `textToPointCloud`** ✅ Fixed in `8215df5`
  `await document.fonts.ready` added before text point cloud generation. Inter is guaranteed loaded before canvas rendering.

- [ ] **5. Bloom absence changes visual tuning**
  `cosmos-engine.ts:175-180` — if `RenderPipeline` construction fails (common on some WebGL2 configs), the engine silently drops bloom and falls back to direct rendering. But the particle material's alpha values (0.008-0.2, additive blending) were tuned assuming bloom amplifies brightness. Without bloom, the particle field looks dimmer and flatter. No compensation.

- [ ] **6. `prefers-reduced-motion` is nearly ignored**
  CSS handles the scroll indicator animation. But the particle system — hundreds of thousands of moving particles — runs identically. The spec says "disables particle animations, provides static alternatives with the same content." Someone with vestibular disorders gets the full particle storm.

---

## B. Visual Quality Gaps

- [ ] **7. Text particles are flat — zero depth**
  Both `svgToPointCloud` and `textToPointCloud` set `z = 0` for every point. The crosshair, "THE FIXER," and tagline are perfectly flat planes. In a cosmic 3D space, this looks paper-thin. A subtle z-jitter (±0.3 units) would give text formations volume without hurting legibility.

- [ ] **8. Tagline particle density is likely too low to read**
  "You've exhausted every option. That's why you're here." is 52 characters at 5,000 particles (desktop) or 4,000 (mobile). That's ~77-96 particles per character. "THE FIXER" gets ~889 per character. The tagline will look like a fuzzy smear rather than readable text, especially on mobile.

- [ ] **9. No loading state — cold void on entry**
  Engine init (GPU detection, renderer init, shader compile, SVG fetch, point cloud generation) takes 1-2 seconds. During this, the user stares at pitch-black with zero feedback. No shimmer, no hint that something is coming. Dead air on a first-impression site.

- [ ] **10. Edge glow is decorative but static**
  `hero-edge-glow` is a CSS radial gradient that fades in and sits. It doesn't breathe, react to particles, or shift with scroll. Undercooked relative to the particle system's craft.

- [ ] **11. No particle trails**
  The spec mentions "particle glow and trails." Currently particles are isolated points with no history. During convergence, trails would dramatically amplify the sense of velocity and purpose.

- [ ] **12. Default cursor**
  The standard arrow cursor breaks immersion. A custom cursor (subtle dot or crosshair matching the brand mark) would maintain atmosphere. Desktop only.

- [ ] **13. Scroll indicator is generic**
  The down-arrow SVG with pulse is functional but forgettable. Could be more integrated with the particle system — particles forming the arrow, or a subtle particle stream suggesting downward motion.

- [ ] **14. No transition between hero and content**
  Hero dissolve works, but then you hit blank placeholders. The spec describes a particle river guiding downward, parallax depth layers, color temperature shift. Currently the cinematic momentum crashes into nothing. Even before full section content, the transition needs work.

---

## C. Mobile-Specific Concerns

- [ ] **15. Touch interaction is basic**
  The spec defines: touch-hold for gravitational well, touch-drag for cosmic wake, pinch for depth zoom. Currently `touchmove` just maps finger position to particle attraction (same as mouse). All three spec interactions are missing.

- [ ] **16. Gyroscope mapping is a rough approximation**
  `CosmosCanvas.tsx:74-75` — beta offset of -45 assumes phone held at ~45°. Breaks when user is lying down or holding at steep angle. Needs calibration on first read or adaptive centering.

- [ ] **17. `hero-logo-space` sizing mismatch**
  `globals.css:95` — `min(200px, 50vw)` is a fixed spacer. But actual particle text spans a viewport-responsive width from `getResponsiveDimensions()`. Spacer doesn't correspond to where particles are in 3D space. On some devices, elements may overlap or drift from the visual particle formation.

- [ ] **18. No haptic feedback**
  For a premium mobile experience, subtle haptic pulses (one when particles lock into logo, another for text formation) would add a physical dimension. iOS and Android both support this.

---

## D. Polish & Craft Details

- [ ] **19. No favicon from the brand mark**
  `public/logo/thefixer-mark.svg` exists but the default Next.js `favicon.ico` is still in place. The crosshair mark should be the favicon.

- [ ] **20. Metadata is minimal**
  Missing: Open Graph tags (og:image, og:title, og:description), Twitter card, theme-color meta, Apple touch icon. Enterprise clients share links — the preview card matters.

- [ ] **21. No `contain` or compositing hints**
  `.cosmos-canvas` and `.content-layer` lack `contain: layout style paint` or `will-change` properties. Explicit hints help the GPU compositor, especially on mobile.

- [ ] **22. `CosmosBackground` wrapper is thin**
  Just a dynamic import wrapper. Could handle: fallback UI while engine loads, error boundary if WebGL2 fails, static image fallback for devices with no GPU.

- [ ] **23. No graceful degradation for very old devices**
  If both WebGPU and WebGL2 fail, the user sees a black void forever. No fallback content, static image, or message.

---

## E. Architecture Observations

- [ ] **24. `cpuAnimate` trig math is heavy per-frame**
  6 `Math.sin/cos` + 3 `Math.sqrt` per particle per frame. At 30K × 60fps = 1.8M sin/cos calls/second on main thread. Viable but leaves little headroom. Lookup tables or batching would help.

- [ ] **25. Position buffer uploaded fully every frame**
  `posBuffer.needsUpdate = true` every frame uploads ~360KB (30K particles) to GPU. Standard approach but could optimize with partial updates.

- [ ] **26. `textToPointCloud` sampling is non-deterministic**
  Fisher-Yates with `Math.random()` produces different distributions per call. If called again on resize, particles scatter and re-settle rather than smoothly adapting. Should seed the RNG or cache the result.
