export function LogoDots({ filled, total = 7 }: { filled: number; total?: number }) {
  const center = 20;
  const radius = 13;
  const half = 4;

  return (
    <div className="relative h-10 w-10" aria-hidden>
      {Array.from({ length: total }).map((_, i) => {
        const angle = (i / total) * Math.PI * 2 - Math.PI / 2;
        const x = (center + radius * Math.cos(angle) - half).toFixed(2);
        const y = (center + radius * Math.sin(angle) - half).toFixed(2);
        return (
          <span
            key={i}
            className={`absolute h-2 w-2 rounded-full transition-colors duration-300 ${
              i < filled ? "bg-[#111]" : "bg-neutral-300"
            }`}
            style={{ left: `${x}px`, top: `${y}px` }}
          />
        );
      })}
    </div>
  );
}