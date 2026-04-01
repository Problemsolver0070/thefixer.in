export default function Home() {
  return (
    <div className="content-layer">
      {Array.from({ length: 8 }, (_, i) => (
        <section
          key={i}
          className="section-block border-b border-celestial-dim/10"
        >
          <h2 className="text-4xl font-bold text-celestial-white/50">
            Section {i + 1}
          </h2>
        </section>
      ))}
    </div>
  );
}
