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
