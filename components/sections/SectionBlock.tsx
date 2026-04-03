"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap-setup";
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

      // Scroll-triggered entry animation — fade up from below
      gsap.fromTo(
        sectionRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        },
      );

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
