/**
 * Converts a text string into a Float32Array of 3D points
 * by rendering onto a hidden canvas and sampling filled pixels.
 *
 * Returns the same PointCloudResult interface as svgToPointCloud().
 * Must run client-side (needs Canvas 2D API).
 */

import type { PointCloudResult } from "./svg-to-points";

/**
 * Render text on a canvas, sample pixel positions where text is drawn,
 * and return centered + scaled 3D positions.
 *
 * @param text - The text string to render (e.g. "THE FIXER")
 * @param targetCount - Desired number of sample points
 * @param worldWidth - Width in world units the text should span
 * @param options - Font configuration
 */
export function textToPointCloud(
  text: string,
  targetCount: number,
  worldWidth: number,
  options?: {
    fontFamily?: string;
    fontWeight?: number | string;
    fontSize?: number; // canvas pixel size (higher = more detail), default 200
    letterSpacing?: number; // extra px between characters, default 0
  },
): PointCloudResult {
  const {
    fontFamily = "Inter, Arial, Helvetica, sans-serif",
    fontWeight = 700,
    fontSize = 200,
    letterSpacing = 0,
  } = options ?? {};

  // ---- 1. Create canvas and render text ----
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("Canvas 2D context unavailable");

  const font = `${fontWeight} ${fontSize}px ${fontFamily}`;
  ctx.font = font;

  // Measure text width (with manual letter spacing if needed)
  let textWidth: number;
  if (letterSpacing > 0) {
    textWidth = Array.from(text).reduce(
      (w, ch) => w + ctx.measureText(ch).width + letterSpacing,
      -letterSpacing, // remove trailing spacing
    );
  } else {
    textWidth = ctx.measureText(text).width;
  }

  const padding = 20;
  const canvasWidth = Math.ceil(textWidth) + padding * 2;
  const canvasHeight = Math.ceil(fontSize * 1.4) + padding * 2;
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  // Re-set font after resize (canvas reset clears state)
  ctx.font = font;
  ctx.fillStyle = "white";
  ctx.textBaseline = "middle";

  // Draw text (with letter spacing if specified)
  const startY = canvasHeight / 2;
  if (letterSpacing > 0) {
    let cursorX = padding;
    for (const ch of text) {
      ctx.fillText(ch, cursorX, startY);
      cursorX += ctx.measureText(ch).width + letterSpacing;
    }
  } else {
    ctx.textAlign = "center";
    ctx.fillText(text, canvasWidth / 2, startY);
  }

  // ---- 2. Read pixels and collect text positions ----
  const imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
  const pixels = imageData.data;

  const filledPositions: [number, number][] = [];
  for (let y = 0; y < canvasHeight; y++) {
    for (let x = 0; x < canvasWidth; x++) {
      const alpha = pixels[(y * canvasWidth + x) * 4 + 3];
      if (alpha > 128) {
        filledPositions.push([x, y]);
      }
    }
  }

  if (filledPositions.length === 0) {
    throw new Error(`textToPointCloud: no visible pixels for "${text}"`);
  }

  // ---- 3. Sample targetCount positions ----
  const actualCount = Math.min(targetCount, filledPositions.length);
  const positions = new Float32Array(actualCount * 3);

  // Scale: map canvas pixel width to worldWidth
  const scale = worldWidth / textWidth;

  // Center offsets (canvas coords → centered world coords)
  const centerX = canvasWidth / 2;
  const centerY = canvasHeight / 2;

  // Fisher-Yates partial shuffle for random sampling without replacement
  const indices = filledPositions.map((_, i) => i);
  for (let i = 0; i < actualCount; i++) {
    const j = i + Math.floor(Math.random() * (indices.length - i));
    [indices[i], indices[j]] = [indices[j], indices[i]];

    const [px, py] = filledPositions[indices[i]];
    const i3 = i * 3;
    positions[i3] = (px - centerX) * scale;       // x: centered
    positions[i3 + 1] = -(py - centerY) * scale;  // y: negate (canvas Y-down → Three.js Y-up)
    positions[i3 + 2] = 0;                         // z: text on z=0 plane
  }

  return { positions, count: actualCount };
}
