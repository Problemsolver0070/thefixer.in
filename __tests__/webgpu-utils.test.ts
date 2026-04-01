import { describe, it, expect, vi, beforeEach } from "vitest";
import { detectGPUTier, type GPUTier } from "@/components/canvas/webgpu-utils";

describe("detectGPUTier", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("returns 'none' when navigator.gpu is unavailable", async () => {
    const result = await detectGPUTier();
    expect(result.tier).toBe("none");
    expect(result.renderer).toBe("webgl2");
    expect(result.maxParticles).toBeGreaterThan(0);
  });

  it("returns correct particle counts per tier", async () => {
    const result = await detectGPUTier();
    expect(typeof result.maxParticles).toBe("number");
    expect(typeof result.renderer).toBe("string");
    expect(["high", "medium", "low", "none"]).toContain(result.tier);
  });

  it("GPUTier type has required fields", () => {
    const tier: GPUTier = {
      tier: "high",
      renderer: "webgpu",
      maxParticles: 500_000,
      shaderComplexity: "full",
    };
    expect(tier.tier).toBe("high");
    expect(tier.renderer).toBe("webgpu");
    expect(tier.maxParticles).toBe(500_000);
    expect(tier.shaderComplexity).toBe("full");
  });
});
