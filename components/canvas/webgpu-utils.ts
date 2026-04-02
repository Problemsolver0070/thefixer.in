export type ShaderComplexity = "full" | "reduced" | "minimal";

export interface GPUTier {
  tier: "high" | "medium" | "low" | "none";
  renderer: "webgpu" | "webgl2";
  maxParticles: number;
  shaderComplexity: ShaderComplexity;
}

const TIER_CONFIG: Record<GPUTier["tier"], Omit<GPUTier, "tier" | "renderer">> = {
  high: { maxParticles: 500_000, shaderComplexity: "full" },
  medium: { maxParticles: 200_000, shaderComplexity: "reduced" },
  low: { maxParticles: 100_000, shaderComplexity: "reduced" },
  none: { maxParticles: 30_000, shaderComplexity: "minimal" },
};

export async function detectGPUTier(): Promise<GPUTier> {
  if (typeof navigator === "undefined" || !("gpu" in navigator)) {
    return { tier: "none", renderer: "webgl2", ...TIER_CONFIG.none };
  }

  try {
    const adapter = await navigator.gpu.requestAdapter();
    if (!adapter) {
      return { tier: "none", renderer: "webgl2", ...TIER_CONFIG.none };
    }

    const limits = adapter.limits;
    const maxBufferSize = limits.maxStorageBufferBindingSize;
    const maxComputeInvocations = limits.maxComputeInvocationsPerWorkgroup;

    if (maxBufferSize >= 256 * 1024 * 1024 && maxComputeInvocations >= 256) {
      return { tier: "high", renderer: "webgpu", ...TIER_CONFIG.high };
    }

    if (maxBufferSize >= 128 * 1024 * 1024) {
      return { tier: "medium", renderer: "webgpu", ...TIER_CONFIG.medium };
    }

    return { tier: "low", renderer: "webgpu", ...TIER_CONFIG.low };
  } catch {
    return { tier: "none", renderer: "webgl2", ...TIER_CONFIG.none };
  }
}
