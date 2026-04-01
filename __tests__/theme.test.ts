import { describe, it, expect } from "vitest";
import { COLORS, PARTICLE_CONFIG } from "@/lib/theme";

describe("theme", () => {
  it("exports all required color tokens", () => {
    expect(COLORS.cosmosVoid).toBe("#0A0E1A");
    expect(COLORS.cosmosDeep).toBe("#111833");
    expect(COLORS.cosmosNebula).toBe("#1A1F4D");
    expect(COLORS.celestialWhite).toBe("#E8ECF5");
    expect(COLORS.celestialDim).toBe("#8B95B0");
    expect(COLORS.etherealBlue).toBe("#4A7BF7");
    expect(COLORS.etherealGlow).toBe("#6BB8FF");
    expect(COLORS.goldWarm).toBe("#D4A853");
    expect(COLORS.goldBright).toBe("#F0C45A");
  });

  it("exports particle config with valid ranges", () => {
    expect(PARTICLE_CONFIG.maxParticles).toBeGreaterThanOrEqual(500000);
    expect(PARTICLE_CONFIG.mobileBaseline).toBeGreaterThanOrEqual(50000);
    expect(PARTICLE_CONFIG.desktopBaseline).toBeGreaterThanOrEqual(200000);
    expect(PARTICLE_CONFIG.minFps).toBeGreaterThanOrEqual(50);
  });
});
