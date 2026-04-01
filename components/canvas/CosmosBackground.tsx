"use client";

import dynamic from "next/dynamic";

const CosmosCanvas = dynamic(
  () => import("@/components/canvas/CosmosCanvas"),
  { ssr: false },
);

/**
 * Client-side wrapper that dynamically imports the CosmosCanvas
 * with SSR disabled (Three.js requires browser APIs).
 */
export default function CosmosBackground() {
  return <CosmosCanvas />;
}
