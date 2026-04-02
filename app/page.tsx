import CosmosBackground from "@/components/canvas/CosmosBackground";
import SectionBlock from "@/components/sections/SectionBlock";

const SECTIONS = [
  { id: "hero", label: "Cosmic Emergence" },
  { id: "transition", label: "Descent Into Purpose" },
  { id: "services", label: "What We Do" },
  { id: "process", label: "How We Work" },
  { id: "proof", label: "Proof" },
  { id: "team", label: "The Unit" },
  { id: "gateway", label: "The Gateway" },
  { id: "coda", label: "The Coda" },
] as const;

export default function Home() {
  return (
    <>
      <CosmosBackground />
      <div className="content-layer">
        {SECTIONS.map((section, i) => (
          <SectionBlock key={section.id} id={section.id} index={i}>
            <div className="text-center">
              <p className="text-sm uppercase tracking-[0.3em] text-celestial-dim mb-4">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h2 className="text-5xl font-bold text-celestial-white/20">
                {section.label}
              </h2>
            </div>
          </SectionBlock>
        ))}
      </div>
    </>
  );
}
