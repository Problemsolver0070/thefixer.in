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

      // Track whether intro has finished — prevents ScrollTrigger
      // from force-completing the intro due to Lenis micro-scroll events.
      let introComplete = false;

      // ---- AUTO-PLAY EMERGENCE TIMELINE ----
      const intro = gsap.timeline({
        delay: 0.8,
        onComplete: () => {
          introComplete = true;
        },
      });

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

      // 4. Brand name — deliberate pause after gold pulse, then slow rise
      intro.fromTo(
        brandNameRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 2.0, ease: "power3.out" },
        ">1.0", // 1s beat after glow settles — let the logo breathe
      );

      // 5. Tagline — staggered, starts while brand name is mid-reveal
      intro.fromTo(
        taglineRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1.5, ease: "power3.out" },
        "<1.0", // 1s into brand name animation
      );

      // 6. Scroll indicator — gentle fade after tagline lands
      intro.fromTo(
        scrollIndicatorRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1.5, ease: "power1.in" },
        ">0.8",
      );

      // ---- SCROLL-DRIVEN DISSOLVE ----
      // When user scrolls the hero out of view, dissolve the logo.
      // The progress threshold (0.03) prevents Lenis smooth scroll
      // micro-events from triggering the dissolve during the intro.
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom -20%",
        scrub: 0.5,
        onUpdate: (self) => {
          const p = self.progress;

          // Ignore micro-scroll noise during intro
          // (Lenis init and browser layout produce tiny progress values)
          if (!introComplete && p < 0.03) return;

          // If user scrolls meaningfully during intro, finish it
          if (!introComplete && intro.isActive()) {
            intro.progress(1);
            introComplete = true;
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
