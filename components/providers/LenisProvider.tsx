"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap-setup";
import { setScrollState } from "@/lib/scroll-state";
import type Lenis from "lenis";

function ScrollTriggerSync() {
  const lenisRef = useRef<Lenis | null>(null);

  useLenis((lenis) => {
    lenisRef.current = lenis;
    ScrollTrigger.update();

    const limit = lenis.limit || 1;
    const progress = lenis.scroll / limit;
    const velocity = lenis.velocity;
    setScrollState(progress, velocity);
  });

  useEffect(() => {
    const callback: gsap.TickerCallback = (time) => {
      if (lenisRef.current) {
        lenisRef.current.raf(time * 1000);
      }
    };

    gsap.ticker.add(callback);

    return () => {
      gsap.ticker.remove(callback);
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
        touchMultiplier: 1.5,
      }}
    >
      <ScrollTriggerSync />
      {children}
    </ReactLenis>
  );
}
