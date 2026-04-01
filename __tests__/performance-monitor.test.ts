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
    for (let i = 0; i < 5; i++) {
      monitor.recordFrame(i * 16.67);
    }
    expect(monitor.getParticleCount()).toBe(200_000);
  });

  it("reduces particles when FPS drops below minimum", () => {
    for (let i = 0; i < 5; i++) {
      monitor.recordFrame(i * 33.3);
    }
    expect(monitor.getParticleCount()).toBe(175_000);
  });

  it("increases particles when FPS is consistently above target", () => {
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
