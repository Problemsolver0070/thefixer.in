/**
 * CosmosEngine — orchestrates the Three.js WebGPU rendering pipeline.
 *
 * Creates scene, camera, renderer, post-processing with bloom,
 * particle system, performance monitor. Drives the animation loop.
 */
import {
  Scene,
  PerspectiveCamera,
  WebGPURenderer,
  RenderPipeline,
  Color,
} from "three/webgpu";

import { pass } from "three/tsl";
import { bloom } from "three/addons/tsl/display/BloomNode.js";

import { COLORS, PARTICLE_CONFIG } from "@/lib/theme";
import { onScrollUpdate } from "@/lib/scroll-state";
import { detectGPUTier, type GPUTier } from "@/components/canvas/webgpu-utils";
import {
  PerformanceMonitor,
  type PerformanceMonitorConfig,
} from "@/components/canvas/performance-monitor";

import { ParticleSystem } from "./particle-system";

/* ------------------------------------------------------------------ */
/*  Engine                                                            */
/* ------------------------------------------------------------------ */

export class CosmosEngine {
  private renderer!: WebGPURenderer;
  private scene!: Scene;
  private camera!: PerspectiveCamera;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private renderPipeline!: any;
  private particleSystem!: ParticleSystem;
  private performanceMonitor!: PerformanceMonitor;
  private gpuTier!: GPUTier;

  private canvas: HTMLCanvasElement;
  private width = 0;
  private height = 0;
  private animationId = 0;
  private running = false;
  private startTime = 0;
  private lastTime = 0;
  private disposed = false;

  private unsubscribeScroll: (() => void) | null = null;
  private _computeWarned = false;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
  }

  /* ---------------------------------------------------------------- */
  /*  Async initialisation                                            */
  /* ---------------------------------------------------------------- */

  async init(): Promise<void> {
    // Detect GPU capabilities
    this.gpuTier = await detectGPUTier();

    // ---- Scene ----
    this.scene = new Scene();
    this.scene.background = new Color(COLORS.cosmosVoid);

    // ---- Camera ----
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.camera = new PerspectiveCamera(
      60,
      this.width / this.height,
      0.1,
      100,
    );
    this.camera.position.set(0, 0, 30);
    this.camera.lookAt(0, 0, 0);

    // ---- Renderer ----
    this.renderer = new WebGPURenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: false,
      // Fall back to WebGL2 if WebGPU unavailable
      forceWebGL: this.gpuTier.renderer === "webgl2",
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(this.width, this.height);

    // WebGPURenderer requires async init
    await this.renderer.init();

    // ---- Particle System ----
    const maxParticles = this.gpuTier.maxParticles;
    this.particleSystem = new ParticleSystem(maxParticles);
    this.scene.add(this.particleSystem.group);

    // Set initial particle count based on GPU tier
    const initialCount = this.gpuTier.tier === "high"
      ? PARTICLE_CONFIG.desktopBaseline
      : this.gpuTier.tier === "medium"
        ? PARTICLE_CONFIG.desktopBaseline
        : PARTICLE_CONFIG.mobileBaseline;
    this.particleSystem.setParticleCount(initialCount);

    // ---- Render Pipeline with Bloom ----
    this.setupRenderPipeline();

    console.log("[CosmosEngine] Initialized:", {
      gpuTier: this.gpuTier,
      initialParticles: initialCount,
      maxParticles,
      hasBloom: !!this.renderPipeline,
      rendererType: this.renderer.constructor.name,
    });

    // ---- Performance Monitor ----
    const perfConfig: PerformanceMonitorConfig = {
      targetFps: PARTICLE_CONFIG.targetFps,
      minFps: PARTICLE_CONFIG.minFps,
      adjustmentInterval: PARTICLE_CONFIG.adjustmentInterval,
      initialParticles: initialCount,
      minParticles: 10_000,
      maxParticles: maxParticles,
      stepSize: Math.floor(maxParticles * 0.05), // 5% steps
    };
    this.performanceMonitor = new PerformanceMonitor(perfConfig);

    // ---- Scroll subscription ----
    this.unsubscribeScroll = onScrollUpdate((progress) => {
      this.particleSystem.setScrollProgress(progress);
    });
  }

  /* ---------------------------------------------------------------- */
  /*  Render pipeline (bloom post-processing)                         */
  /* ---------------------------------------------------------------- */

  private setupRenderPipeline(): void {
    try {
      const scenePass = pass(this.scene, this.camera);
      const bloomPass = bloom(scenePass, 0.8, 0.4, 0.2);
      const outputNode = scenePass.add(bloomPass);

      this.renderPipeline = new RenderPipeline(this.renderer, outputNode);
    } catch (e) {
      // Bloom/RenderPipeline may fail on some configurations.
      // Fall back to direct rendering.
      console.warn(
        "[CosmosEngine] RenderPipeline/Bloom setup failed, using direct rendering:",
        e,
      );
      this.renderPipeline = null;
    }
  }

  /* ---------------------------------------------------------------- */
  /*  Animation loop                                                  */
  /* ---------------------------------------------------------------- */

  start(): void {
    if (this.running) return;
    this.running = true;
    this.startTime = performance.now() / 1000;
    this.lastTime = this.startTime;
    this.tick();
  }

  stop(): void {
    this.running = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = 0;
    }
  }

  private tick = (): void => {
    if (!this.running || this.disposed) return;

    const now = performance.now();
    const time = now / 1000 - this.startTime;
    const deltaTime = Math.min(time - (this.lastTime - this.startTime), 0.05); // cap at 50ms
    this.lastTime = now / 1000;

    // ---- Performance monitoring & adaptive quality ----
    this.performanceMonitor.recordFrame(now);
    const targetCount = this.performanceMonitor.getParticleCount();
    if (targetCount !== this.particleSystem.getParticleCount()) {
      this.particleSystem.setParticleCount(targetCount);
    }

    // ---- Update particle uniforms ----
    this.particleSystem.update(time, deltaTime);

    // ---- Run GPU compute ----
    try {
      this.renderer.compute(this.particleSystem.computeNode);
    } catch (e) {
      // compute may not be available on WebGL fallback
      if (!this._computeWarned) {
        console.warn("[CosmosEngine] Compute failed:", e);
        this._computeWarned = true;
      }
    }

    // ---- Render ----
    if (this.renderPipeline) {
      try {
        this.renderPipeline.render();
      } catch {
        // Fall back to direct rendering on pipeline error
        this.renderPipeline = null;
        this.renderer.render(this.scene, this.camera);
      }
    } else {
      this.renderer.render(this.scene, this.camera);
    }

    this.animationId = requestAnimationFrame(this.tick);
  };

  /* ---------------------------------------------------------------- */
  /*  Mouse interaction                                               */
  /* ---------------------------------------------------------------- */

  setMousePosition(clientX: number, clientY: number): void {
    if (!this.camera) return;

    // Convert screen coords to normalized device coords then to world space (z=0 plane)
    const ndcX = (clientX / this.width) * 2 - 1;
    const ndcY = -(clientY / this.height) * 2 + 1;

    // Simple perspective projection to world coords at z=0
    const fovRad = (this.camera.fov * Math.PI) / 180;
    const halfHeight = Math.tan(fovRad / 2) * this.camera.position.z;
    const halfWidth = halfHeight * this.camera.aspect;

    const worldX = ndcX * halfWidth;
    const worldY = ndcY * halfHeight;

    this.particleSystem.setMousePosition(worldX, worldY, 1.0);
  }

  clearMouseInfluence(): void {
    this.particleSystem.setMousePosition(0, 0, 0);
  }

  /* ---------------------------------------------------------------- */
  /*  Resize                                                          */
  /* ---------------------------------------------------------------- */

  handleResize(): void {
    if (this.disposed) return;

    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(this.width, this.height);

    // RenderPipeline needs update after resize
    if (this.renderPipeline) {
      this.renderPipeline.needsUpdate = true;
    }
  }

  /* ---------------------------------------------------------------- */
  /*  Stats                                                           */
  /* ---------------------------------------------------------------- */

  getStats(): {
    fps: number;
    particleCount: number;
    gpuTier: string;
    renderer: string;
  } {
    return {
      fps: Math.round(this.performanceMonitor?.getCurrentFps() ?? 0),
      particleCount: this.particleSystem?.getParticleCount() ?? 0,
      gpuTier: this.gpuTier?.tier ?? "unknown",
      renderer: this.gpuTier?.renderer ?? "unknown",
    };
  }

  /* ---------------------------------------------------------------- */
  /*  Cleanup                                                         */
  /* ---------------------------------------------------------------- */

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;

    this.stop();
    this.unsubscribeScroll?.();

    this.particleSystem?.dispose();
    this.renderPipeline?.dispose?.();
    this.renderer?.dispose();
  }
}
