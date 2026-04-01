"use client";

/**
 * CosmosCanvas — React component that hosts the full-viewport
 * Three.js WebGPU particle cosmos background.
 *
 * - Fixed behind all DOM content
 * - Handles mouse, touch, device orientation interaction
 * - Initializes and disposes the CosmosEngine lifecycle
 */

import { useEffect, useRef, useCallback } from "react";
import { CosmosEngine } from "./cosmos-engine";

/* ------------------------------------------------------------------ */
/*  iOS DeviceOrientation permission helper                           */
/* ------------------------------------------------------------------ */

interface DeviceOrientationEventiOS extends DeviceOrientationEvent {
  requestPermission?: () => Promise<"granted" | "denied">;
}

async function requestOrientationPermission(): Promise<boolean> {
  const DOE = DeviceOrientationEvent as unknown as DeviceOrientationEventiOS;
  if (typeof DOE.requestPermission === "function") {
    try {
      const permission = await DOE.requestPermission();
      return permission === "granted";
    } catch {
      return false;
    }
  }
  // Non-iOS — permission not needed
  return true;
}

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

export default function CosmosCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<CosmosEngine | null>(null);

  /* ---- Mouse handler (stable ref) ---- */
  const handleMouseMove = useCallback((e: MouseEvent) => {
    engineRef.current?.setMousePosition(e.clientX, e.clientY);
  }, []);

  const handleMouseLeave = useCallback(() => {
    engineRef.current?.clearMouseInfluence();
  }, []);

  /* ---- Device orientation handler for mobile gyro ---- */
  const handleOrientation = useCallback((e: DeviceOrientationEvent) => {
    if (e.gamma == null || e.beta == null) return;

    // gamma: left-right tilt [-90, 90]
    // beta: front-back tilt [-180, 180]
    const nx = (e.gamma / 90) * window.innerWidth * 0.5 + window.innerWidth / 2;
    const ny = ((e.beta - 45) / 90) * window.innerHeight * 0.5 + window.innerHeight / 2;

    engineRef.current?.setMousePosition(nx, ny);
  }, []);

  /* ---- Resize handler ---- */
  const handleResize = useCallback(() => {
    engineRef.current?.handleResize();
  }, []);

  /* ---- Init / teardown ---- */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let disposed = false;
    const engine = new CosmosEngine(canvas);
    engineRef.current = engine;

    const bootstrap = async () => {
      try {
        await engine.init();
        if (disposed) {
          engine.dispose();
          return;
        }
        engine.start();

        // Attach event listeners after successful init
        window.addEventListener("mousemove", handleMouseMove, { passive: true });
        window.addEventListener("mouseleave", handleMouseLeave, { passive: true });
        window.addEventListener("resize", handleResize, { passive: true });

        // Request device orientation on mobile
        const hasPermission = await requestOrientationPermission();
        if (hasPermission && !disposed) {
          window.addEventListener("deviceorientation", handleOrientation, {
            passive: true,
          });
        }
      } catch (err) {
        console.error("[CosmosCanvas] Failed to initialise engine:", err);
      }
    };

    bootstrap();

    return () => {
      disposed = true;

      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("deviceorientation", handleOrientation);

      engine.dispose();
      engineRef.current = null;
    };
  }, [handleMouseMove, handleMouseLeave, handleOrientation, handleResize]);

  return (
    <canvas
      ref={canvasRef}
      className="cosmos-canvas"
      aria-hidden="true"
    />
  );
}
