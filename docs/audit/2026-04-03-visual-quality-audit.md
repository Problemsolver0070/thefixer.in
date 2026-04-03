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

- [x] **5. Bloom absence changes visual tuning** ✅ Fixed in `095eed4`
  `uNoBloom` uniform triggers 2.5x alpha boost and raised clamp ceilings (0.2→0.5, 0.35→0.7) when bloom fails. Engine detects absence at init and runtime, notifies material via `setNoBloom()`.

- [x] **6. `prefers-reduced-motion` is nearly ignored** ✅ Fixed in `cc63931`
  Full reduced-motion support: instant text+tagline formation via `teleportToTargets()`, zero drift, frozen particles. Scroll dissolve preserved (user-initiated). GSAP timeline skipped entirely.

---

## B. Visual Quality Gaps

- [x] **7. Text particles are flat — zero depth** ✅ Fixed in `b0de361`
  ±0.3 z-jitter added to both `svgToPointCloud` and `textToPointCloud`. Text formations now have subtle 3D volume. Jitter preserved through `rescaleCloud()`.

- [x] **8. Tagline particle density is likely too low to read** ✅ Fixed in `5683718`
  `TAGLINE_POINT_COUNT` increased from 5,000 to 8,000 (~154 particles/char). Combined phase floor now 16K (8K text + 8K tagline).

- [x] **9. No loading state — cold void on entry** ✅ Fixed in `51a7415`
  CSS-only cosmic shimmer pulse on `.hero-section::before` — radial gradient centered at logo formation point, breathing at 2.5s cycle. Fades out via `data-engine-ready` attribute when particles start rendering. Reduced-motion: static glow.

- [x] **10. Edge glow is decorative but static** ✅ Fixed in `6d771c5`
  CSS breathing animation (`edge-breathe` 5s cycle via scale/brightness). Scroll-driven opacity fade in both normal and reduced-motion paths. Disabled animation under `prefers-reduced-motion`.

- [x] **11. No particle trails** ✅ Fixed in `494ca41`
  Velocity-based trail effect in material shader. Fast particles scale 1.5x larger and get alpha boost. Visual streak during convergence, fades as particles settle. Vel buffer uploaded each CPU frame.

- [x] **12. Default cursor** ✅ Fixed in `04fd6cb`
  SVG crosshair cursor via data URI — center dot + cross lines in celestial-dim color. Desktop only via `@media (hover: hover) and (pointer: fine)`. Fallback: built-in `crosshair`.

- [x] **13. Scroll indicator is generic** ✅ Fixed in `04286e7`
  Flowing stream animation via `stroke-dasharray` — dashes stream downward simulating particle flow. Ethereal blue `drop-shadow` glow. Replaces basic opacity pulse.

- [x] **14. No transition between hero and content** ✅ Fixed in `9091bc4`
  Hero bottom gradient (::after) bridges into content. SectionBlock fade-up entry animation via GSAP ScrollTrigger. Full particle river deferred to content build phase.

---

## C. Mobile-Specific Concerns

- [x] **15. Touch interaction is basic** ✅ Fixed in `c6c52b4`
  Touch-hold (>300ms) creates gravitational well with ramping influence (1→3x over 2s). Touch-drag velocity scales influence (up to 2.5x) for cosmic wake. Pinch-zoom deferred (camera manipulation risk).

- [x] **16. Gyroscope mapping is a rough approximation** ✅ Fixed in `859d90b`
  Adaptive centering — first orientation reading becomes baseline. Baseline drifts 1% per reading to follow posture changes. Works at any holding angle.

- [x] **17. `hero-logo-space` sizing mismatch** ✅ Fixed in `b4d0bf0`
  Removed dead spacer entirely. No visible elements depended on it — all hero text is sr-only (absolutely positioned). CSS rule also removed.

- [x] **18. No haptic feedback** ✅ Fixed in `7af2229`
  `navigator.vibrate()` at 3 formation milestones: logo peak (15ms), text swap (10-30-10ms), tagline swap (8-40-8ms). Android only — optional chaining no-ops on iOS/desktop.

---

## D. Polish & Craft Details

- [x] **19. No favicon from the brand mark** ✅ Fixed in `c4ea38b`
  SVG favicon at `app/icon.svg` — crosshair brand mark with gold arc + warm crosshairs. Next.js auto-serves as favicon.

- [x] **20. Metadata is minimal** ✅ Fixed in `c4ea38b`
  Added Open Graph (title, description, url, siteName), Twitter card (summary_large_image), theme-color (#1a1625), Apple web app meta, metadataBase.

- [x] **21. No `contain` or compositing hints** ✅ Fixed in `4cb8498`
  `.cosmos-canvas`: `contain: strict` + `will-change: contents`. `.content-layer`: `contain: layout style`. Isolates compositing layers for GPU.

- [x] **22. `CosmosBackground` wrapper is thin** ✅ Fixed in `ffd78cd`
  React error boundary wraps CosmosCanvas — catches runtime WebGL crashes. Static fallback: cosmic gradient + faint brand mark SVG.

- [x] **23. No graceful degradation for very old devices** ✅ Fixed in `ffd78cd`
  CosmosCanvas catches init failures and renders branded fallback instead of black void. Error boundary catches runtime crashes too.

---

## E. Architecture Observations

- [ ] **24. `cpuAnimate` trig math is heavy per-frame**
  6 `Math.sin/cos` + 3 `Math.sqrt` per particle per frame. At 30K × 60fps = 1.8M sin/cos calls/second on main thread. Viable but leaves little headroom. Lookup tables or batching would help.

- [ ] **25. Position buffer uploaded fully every frame**
  `posBuffer.needsUpdate = true` every frame uploads ~360KB (30K particles) to GPU. Standard approach but could optimize with partial updates.

- [ ] **26. `textToPointCloud` sampling is non-deterministic**
  Fisher-Yates with `Math.random()` produces different distributions per call. If called again on resize, particles scatter and re-settle rather than smoothly adapting. Should seed the RNG or cache the result.
