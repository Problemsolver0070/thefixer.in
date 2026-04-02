/**
 * ParticleSystem — manages GPU storage buffers, compute dispatch,
 * and the renderable mesh for the cosmos particle field.
 */
import {
  StorageInstancedBufferAttribute,
  BufferGeometry,
  Sprite,
  Group,
} from "three/webgpu";

import { PARTICLE_CONFIG } from "@/lib/theme";

import {
  createParticleComputeShader,
  uTime,
  uDeltaTime,
  uMouseX,
  uMouseY,
  uMouseInfluence,
  uScrollProgress,
  uDriftSpeed,
  uBoundaryRadius,
} from "./shaders/particle-compute";

import {
  createParticleMaterial,
  uMatTime,
  uMatScrollProgress,
  uMatParticleSize,
} from "./shaders/particle-material";

/* ------------------------------------------------------------------ */
/*  Particle System                                                   */
/* ------------------------------------------------------------------ */

export class ParticleSystem {
  /** Maximum allocated buffer size */
  readonly maxParticles: number;

  /** Current active particle count */
  private _activeCount: number;

  /** GPU storage buffers */
  private posBuffer: StorageInstancedBufferAttribute;
  private velBuffer: StorageInstancedBufferAttribute;

  /** Compute kernel (returned by createParticleComputeShader) */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  computeNode: any;

  /** Renderable group containing sprites */
  readonly group: Group;

  /** Individual sprite instances (one per particle — managed by the engine) */
  private sprites: Sprite[] = [];

  /** The material shared by all sprites */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private material: any;

  private disposed = false;

  constructor(maxParticles?: number) {
    this.maxParticles = maxParticles ?? PARTICLE_CONFIG.maxParticles;
    this._activeCount = Math.min(
      PARTICLE_CONFIG.desktopBaseline,
      this.maxParticles,
    );

    // ---- Create GPU storage buffers ----
    this.posBuffer = new StorageInstancedBufferAttribute(
      this.maxParticles,
      3, // vec3 — x, y, z
    );
    this.velBuffer = new StorageInstancedBufferAttribute(
      this.maxParticles,
      3,
    );

    // ---- Initialise particle positions in a spherical distribution ----
    this.initPositions();

    // ---- Build compute shader ----
    this.computeNode = createParticleComputeShader(
      this.posBuffer,
      this.velBuffer,
    );

    // ---- Build material ----
    this.material = createParticleMaterial(this.posBuffer);

    // ---- Build renderable group with instanced sprites ----
    this.group = new Group();
    this.group.name = "ParticleSystem";

    // We use a single Sprite with the node material.
    // StorageInstancedBufferAttribute + SpriteNodeMaterial handles the instancing
    // on the GPU via instanceIndex in the shader.
    const sprite = new Sprite(this.material);
    sprite.count = this._activeCount;
    sprite.frustumCulled = false;
    this.group.add(sprite);
    this.sprites.push(sprite);

    // Set defaults
    uDriftSpeed.value = PARTICLE_CONFIG.driftSpeed;
    uMatParticleSize.value = PARTICLE_CONFIG.particleSize;
    uBoundaryRadius.value = 20;
  }

  /* ---------------------------------------------------------------- */
  /*  Initialise positions in a sphere                                */
  /* ---------------------------------------------------------------- */

  private initPositions(): void {
    const posArray = this.posBuffer.array as Float32Array;
    const velArray = this.velBuffer.array as Float32Array;
    const radius = 18; // sphere radius

    for (let i = 0; i < this.maxParticles; i++) {
      const i3 = i * 3;

      // Spherical distribution — uniform volume sampling
      const u = Math.random();
      const v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      const r = radius * Math.cbrt(Math.random()); // cbrt for uniform volume

      posArray[i3] = r * Math.sin(phi) * Math.cos(theta);
      posArray[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      posArray[i3 + 2] = r * Math.cos(phi);

      // Zero initial velocity with tiny random perturbation
      velArray[i3] = (Math.random() - 0.5) * 0.001;
      velArray[i3 + 1] = (Math.random() - 0.5) * 0.001;
      velArray[i3 + 2] = (Math.random() - 0.5) * 0.001;
    }
  }

  /* ---------------------------------------------------------------- */
  /*  Public API                                                       */
  /* ---------------------------------------------------------------- */

  setParticleCount(count: number): void {
    this._activeCount = Math.max(
      1000,
      Math.min(count, this.maxParticles),
    );
    // Update the sprite instance count
    if (this.sprites[0]) {
      this.sprites[0].count = this._activeCount;
    }
  }

  getParticleCount(): number {
    return this._activeCount;
  }

  setMousePosition(x: number, y: number, influence: number): void {
    uMouseX.value = x;
    uMouseY.value = y;
    uMouseInfluence.value = influence;
  }

  setScrollProgress(progress: number): void {
    uScrollProgress.value = progress;
    uMatScrollProgress.value = progress;
  }

  update(time: number, deltaTime: number): void {
    if (this.disposed) return;

    uTime.value = time;
    uDeltaTime.value = deltaTime;
    uMatTime.value = time;
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;

    this.material?.dispose();
    this.sprites.forEach((s) => {
      s.geometry?.dispose();
    });
    this.group.clear();
  }
}
