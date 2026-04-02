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
const SHARED_POINT_COUNT = 8000;
const TAGLINE_POINT_COUNT = 5000;
const TEXT_WORLD_WIDTH = 20;
const TAGLINE_WORLD_WIDTH = 22;
const TEXT_Y_OFFSET = 1.5;
const TAGLINE_Y_OFFSET = -2.5;

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const edgeGlowRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<CosmosEngine | null>(null);

  // Store point clouds for each phase
  const textCloudRef = useRef<{ positions: Float32Array; count: number } | null>(null);
  const combinedCloudRef = useRef<{ positions: Float32Array; count: number } | null>(null);

  const [ready, setReady] = useState(false);

  useEffect(() => {
    const unsubscribe = onEngineReady(async (engine) => {
      engineRef.current = engine;

      try {
        // Phase 1: Crosshair logo point cloud
        const logoCloud = await svgToPointCloud(
          LOGO_SVG_URL,
          SHARED_POINT_COUNT,
          14,
        );
        engine.particles.setTargetPositions(logoCloud.positions, logoCloud.count);

        // Phase 2: "THE FIXER" text point cloud
        const textCloud = textToPointCloud(
          "THE FIXER",
          SHARED_POINT_COUNT,
          TEXT_WORLD_WIDTH,
          {
            fontWeight: 700,
            fontSize: 200,
            letterSpacing: 24,
          },
        );

        // Offset text positions UP (y + TEXT_Y_OFFSET)
        for (let i = 0; i < textCloud.count; i++) {
          textCloud.positions[i * 3 + 1] += TEXT_Y_OFFSET;
        }
        textCloudRef.current = textCloud;

        // Phase 3: Tagline point cloud
        const taglineCloud = textToPointCloud(
          "You've exhausted every option. That's why you're here.",
          TAGLINE_POINT_COUNT,
          TAGLINE_WORLD_WIDTH,
          {
            fontWeight: 400,
            fontSize: 100,
            letterSpacing: 4,
          },
        );

        // Offset tagline positions DOWN (y + TAGLINE_Y_OFFSET)
        for (let i = 0; i < taglineCloud.count; i++) {
          taglineCloud.positions[i * 3 + 1] += TAGLINE_Y_OFFSET;
        }

        // Combined buffer: text (0..textCount-1) + tagline (textCount..totalCount-1)
        const totalCount = textCloud.count + taglineCloud.count;
        const combinedPositions = new Float32Array(totalCount * 3);
        combinedPositions.set(textCloud.positions);
        combinedPositions.set(taglineCloud.positions, textCloud.count * 3);
        combinedCloudRef.current = { positions: combinedPositions, count: totalCount };

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
      const textCloud = textCloudRef.current;
      const combinedCloud = combinedCloudRef.current;

      const seekProxy = { value: 0 };
      const glowProxy = { value: 0 };

      let introComplete = false;

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

      if (textCloud) {
        // Swap targets: crosshair → text (after 1s beat)
        intro.call(
          () => {
            engine.particles.setTargetPositions(
              textCloud.positions,
              textCloud.count,
            );
          },
          [],
          ">1.0",
        );

        // Gold flash during rearrangement
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

      if (combinedCloud) {
        // Swap targets: text-only → text+tagline (after text settles)
        // Text particles (0-7999) keep same positions — won't move
        // Tagline particles (8000-12999) converge from ambient field
        intro.call(
          () => {
            engine.particles.setTargetPositions(
              combinedCloud.positions,
              combinedCloud.count,
            );
          },
          [],
          ">1.0",
        );

        // Subtle gold flash for tagline formation
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

          if (!introComplete && intro.isActive()) {
            intro.progress(1);
            introComplete = true;
          }

          engine.particles.setSeekStrength(1 - p);
          engine.particles.setLogoGlow(Math.max(0, 0.08 * (1 - p * 2)));
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
      <div ref={edgeGlowRef} className="hero-edge-glow" />

      <div className="hero-content">
        <div className="hero-logo-space" aria-hidden="true" />

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
