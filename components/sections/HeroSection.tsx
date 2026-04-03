"use client";

/**
 * HeroSection — "Cosmic Emergence"
 *
 * Multi-phase auto-play emergence timeline:
 *   Phase 1: void → particles drift → edge glow → convergence → crosshair logo → gold pulse
 *   Phase 2: target swap → particles rearrange into "THE FIXER" text → gold flash
 *   Phase 3: target swap → additional particles converge to form tagline below text
 *
 * Scroll-driven dissolve:
 *   As user scrolls past hero, seekStrength → 0 and particles dissolve back to drift.
 */

import { useRef, useEffect, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap-setup";
import { onEngineReady } from "@/lib/cosmos-ref";
import { svgToPointCloud } from "@/lib/svg-to-points";
import { textToPointCloud } from "@/lib/text-to-points";
import type { CosmosEngine } from "@/components/canvas/cosmos-engine";

const LOGO_SVG_URL = "/logo/thefixer-mark.svg";

/** Fixed particle counts — never change with viewport. More particles = denser text. */
const LOGO_POINT_COUNT = 8000;
const TEXT_POINT_COUNT = 8000;
const TAGLINE_POINT_COUNT = 8000;

/** Base positions stored before Y-offset, used for deterministic rescaling. */
interface BaseCloud {
  positions: Float32Array;
  count: number;
  worldScale: number; // the worldWidth or worldScale used to generate these
}

/** Compute viewport-aware world dimensions for all particle formations */
function getResponsiveDimensions() {
  const aspectRatio = window.innerWidth / window.innerHeight;

  // Camera FOV=60° at z=30 → visible height ≈ 34.64 units (constant)
  // Visible width = visibleHeight * aspectRatio
  const visibleHeight = 2 * 30 * Math.tan((60 * Math.PI) / 360);
  const visibleWidth = visibleHeight * aspectRatio;

  const isPortrait = aspectRatio < 1;

  // Crosshair logo — 0.23 preserves existing desktop look (was fixed at 14 ≈ 14/61.66)
  const logoWorldScale = visibleWidth * (isPortrait ? 0.55 : 0.23);

  // "THE FIXER" text — fills ~55% desktop, ~85% mobile portrait
  const textWorldWidth = visibleWidth * (isPortrait ? 0.85 : 0.55);
  const textYOffset = isPortrait ? 1.0 : 1.5;

  // Tagline — slightly wider than title
  const taglineWorldWidth = visibleWidth * (isPortrait ? 0.90 : 0.60);
  const taglineYOffset = isPortrait ? -1.8 : -2.5;

  return {
    logoWorldScale,
    textWorldWidth,
    textYOffset,
    taglineWorldWidth,
    taglineYOffset,
  };
}

/**
 * Rescale a base point cloud to new world dimensions.
 * Pure O(n) multiply+add — no network, no canvas, no random sampling.
 * Deterministic: same particle always maps to the same shape position.
 */
function rescaleCloud(
  base: BaseCloud,
  newWorldScale: number,
  yOffset: number,
): Float32Array {
  const ratio = newWorldScale / base.worldScale;
  const out = new Float32Array(base.count * 3);
  for (let i = 0; i < base.count; i++) {
    const i3 = i * 3;
    out[i3] = base.positions[i3] * ratio;
    out[i3 + 1] = base.positions[i3 + 1] * ratio + yOffset;
    out[i3 + 2] = base.positions[i3 + 2]; // z: preserve base jitter
  }
  return out;
}

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const edgeGlowRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<CosmosEngine | null>(null);

  // Base point clouds — computed once, never modified. Rescaled on viewport change.
  const logoBaseRef = useRef<BaseCloud | null>(null);
  const textBaseRef = useRef<BaseCloud | null>(null);
  const taglineBaseRef = useRef<BaseCloud | null>(null);
  const phaseRef = useRef<'logo' | 'text' | 'combined'>('logo');

  /**
   * Single source of truth for particle targets.
   * Reads current viewport dimensions fresh, rescales from stored base positions,
   * and sets the target buffer. Called by: initial setup, GSAP timeline, resize handler.
   */
  const setTargetsForPhase = (phase: 'logo' | 'text' | 'combined') => {
    const engine = engineRef.current;
    if (!engine) return;

    phaseRef.current = phase;
    const dims = getResponsiveDimensions();

    if (phase === 'logo') {
      const base = logoBaseRef.current;
      if (!base) return;
      const scaled = rescaleCloud(base, dims.logoWorldScale, 0);
      engine.particles.setTargetPositions(scaled, base.count);
    } else if (phase === 'text') {
      const base = textBaseRef.current;
      if (!base) return;
      const scaled = rescaleCloud(base, dims.textWorldWidth, dims.textYOffset);
      engine.particles.setTargetPositions(scaled, base.count);
    } else if (phase === 'combined') {
      const tBase = textBaseRef.current;
      const tlBase = taglineBaseRef.current;
      if (!tBase || !tlBase) return;
      const scaledText = rescaleCloud(tBase, dims.textWorldWidth, dims.textYOffset);
      const scaledTagline = rescaleCloud(tlBase, dims.taglineWorldWidth, dims.taglineYOffset);
      const totalCount = tBase.count + tlBase.count;
      // Combined buffer: text (0..tBase.count-1) + tagline (tBase.count..totalCount-1)
      const combined = new Float32Array(totalCount * 3);
      combined.set(scaledText);
      combined.set(scaledTagline, tBase.count * 3);
      engine.particles.setTargetPositions(combined, totalCount);
    }
  };

  const [ready, setReady] = useState(false);

  useEffect(() => {
    const unsubscribe = onEngineReady(async (engine) => {
      engineRef.current = engine;

      try {
        const dims = getResponsiveDimensions();

        // Ensure Inter font is loaded before rendering text to canvas
        await document.fonts.ready;

        // Phase 1: Crosshair logo — compute and store base
        const logoCloud = await svgToPointCloud(
          LOGO_SVG_URL,
          LOGO_POINT_COUNT,
          dims.logoWorldScale,
        );
        logoBaseRef.current = {
          positions: logoCloud.positions.slice(),
          count: logoCloud.count,
          worldScale: dims.logoWorldScale,
        };

        // Phase 2: "THE FIXER" text — compute and store base (before Y-offset)
        const textCloud = textToPointCloud(
          "THE FIXER",
          TEXT_POINT_COUNT,
          dims.textWorldWidth,
          {
            fontWeight: 700,
            fontSize: 200,
            letterSpacing: 24,
          },
        );
        textBaseRef.current = {
          positions: textCloud.positions.slice(),
          count: textCloud.count,
          worldScale: dims.textWorldWidth,
        };

        // Phase 3: Tagline — compute and store base (before Y-offset)
        const taglineCloud = textToPointCloud(
          "You've exhausted every option. That's why you're here.",
          TAGLINE_POINT_COUNT,
          dims.taglineWorldWidth,
          {
            fontWeight: 400,
            fontSize: 100,
            letterSpacing: 4,
          },
        );
        taglineBaseRef.current = {
          positions: taglineCloud.positions.slice(),
          count: taglineCloud.count,
          worldScale: dims.taglineWorldWidth,
        };

        // Set initial targets (crosshair logo) using current viewport
        setTargetsForPhase('logo');

        setReady(true);
      } catch (err) {
        console.error("[HeroSection] Failed to load point clouds:", err);
        setReady(true);
      }
    });

    return unsubscribe;
  }, []);

  useGSAP(
    () => {
      if (!ready || !engineRef.current || !sectionRef.current) return;

      const engine = engineRef.current;

      // ---- Reduced motion: instant static formation, no animation ----
      const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches;

      if (prefersReducedMotion) {
        setTargetsForPhase('combined');
        engine.particles.teleportToTargets();
        engine.particles.setSeekStrength(1);
        engine.particles.setDriftSpeed(0);
        engine.particles.setLogoGlow(0.08);

        if (edgeGlowRef.current) edgeGlowRef.current.style.opacity = '0.7';
        if (scrollIndicatorRef.current) scrollIndicatorRef.current.style.opacity = '1';

        // Scroll dissolve still works (user-initiated, accessibility-safe)
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom -20%",
          scrub: 0.5,
          onUpdate: (self) => {
            const p = self.progress;
            engine.particles.setSeekStrength(1 - p);
            engine.particles.setLogoGlow(Math.max(0, 0.08 * (1 - p * 2)));
            if (edgeGlowRef.current) {
              edgeGlowRef.current.style.opacity = String(0.7 * (1 - p));
            }
          },
          onLeave: () => {
            engine.particles.setSeekStrength(0);
            engine.particles.setLogoGlow(0);
            if (edgeGlowRef.current) edgeGlowRef.current.style.opacity = '0';
          },
        });

        return;
      }

      // ---- Normal animation path (unchanged below) ----
      const seekProxy = { value: 0 };
      const glowProxy = { value: 0 };

      let introComplete = false;
      let fastForwarded = false;

      const intro = gsap.timeline({
        delay: 0.8,
        onComplete: () => {
          introComplete = true;
        },
      });

      // ============================================================
      // PHASE 1: Crosshair Logo Convergence
      // ============================================================

      intro.to(edgeGlowRef.current, {
        opacity: 0.7,
        duration: 2,
        ease: "power1.in",
      });

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
        value: 0.15,
        duration: 1.5,
        ease: "power2.out",
        onUpdate: () => engine.particles.setLogoGlow(glowProxy.value),
      });

      // ============================================================
      // PHASE 2: "THE FIXER" Text Formation
      // ============================================================

      if (textBaseRef.current) {
        // Swap targets: crosshair → text (after 1s beat)
        intro.call(
          () => setTargetsForPhase('text'),
          [],
          ">1.0",
        );

        intro.to(
          glowProxy,
          {
            value: 0.5,
            duration: 0.6,
            ease: "power2.in",
            onUpdate: () => engine.particles.setLogoGlow(glowProxy.value),
          },
          "<",
        );
        intro.to(glowProxy, {
          value: 0.1,
          duration: 1.5,
          ease: "power2.out",
          onUpdate: () => engine.particles.setLogoGlow(glowProxy.value),
        });
      }

      // ============================================================
      // PHASE 3: Tagline Formation
      // ============================================================

      if (taglineBaseRef.current) {
        // Swap targets: text-only → text+tagline
        // Text particles keep same positions — tagline particles converge from ambient field
        intro.call(
          () => setTargetsForPhase('combined'),
          [],
          ">1.0",
        );

        intro.to(
          glowProxy,
          {
            value: 0.3,
            duration: 0.4,
            ease: "power2.in",
            onUpdate: () => engine.particles.setLogoGlow(glowProxy.value),
          },
          "<",
        );
        intro.to(glowProxy, {
          value: 0.08,
          duration: 1.2,
          ease: "power2.out",
          onUpdate: () => engine.particles.setLogoGlow(glowProxy.value),
        });
      }

      // ============================================================
      // SCROLL INDICATOR
      // ============================================================

      intro.fromTo(
        scrollIndicatorRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1.5, ease: "power1.in" },
        ">1.0",
      );

      // ---- SCROLL-DRIVEN DISSOLVE ----
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom -20%",
        scrub: 0.5,
        onUpdate: (self) => {
          const p = self.progress;

          if (!introComplete && p < 0.03) return;

          if (!introComplete && intro.isActive() && !fastForwarded) {
            intro.timeScale(5);
            fastForwarded = true;
            return;
          }

          if (!introComplete) return;

          engine.particles.setSeekStrength(1 - p);
          engine.particles.setLogoGlow(Math.max(0, 0.08 * (1 - p * 2)));
          if (edgeGlowRef.current) {
            edgeGlowRef.current.style.opacity = String(0.7 * (1 - p));
          }
        },
        onLeave: () => {
          if (!introComplete) {
            intro.progress(1).pause();
            introComplete = true;
          }
          engine.particles.setSeekStrength(0);
          engine.particles.setLogoGlow(0);
          if (edgeGlowRef.current) edgeGlowRef.current.style.opacity = '0';
        },
      });
    },
    { scope: sectionRef, dependencies: [ready] },
  );

  // ---- Viewport resize → rescale particle targets ----
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        if (!engineRef.current) return;
        setTargetsForPhase(phaseRef.current);
      }, 200);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="hero-section"
      data-section-index={0}
      data-engine-ready={ready ? "" : undefined}
    >
      <div ref={edgeGlowRef} className="hero-edge-glow" />

      <div className="hero-content">
        {/* Screen reader only — visual text is formed by particles */}
        <h1 className="sr-only">THE FIXER</h1>
        <p className="sr-only">
          You&apos;ve exhausted every option. That&apos;s why you&apos;re here.
        </p>
      </div>

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
