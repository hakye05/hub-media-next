const DOT_COLORS = [
  "bg-sky-400",
  "bg-amber-400",
  "bg-orange-500",
  "bg-fuchsia-500",
  "bg-indigo-500",
  "bg-teal-400",
] as const;

export default function ColorDots({
  dotClassName,
  radius,
}: {
  dotClassName: string;
  radius: number;
}) {
  return (
    <>
      {DOT_COLORS.map((color, i) => (
        <span
          key={color}
          className={`absolute left-1/2 top-1/2 rounded-full ${dotClassName} ${color}`}
          style={{
            transform: `translate(-50%, -50%) rotate(${i * 60}deg) translateY(-${radius}px)`,
          }}
        />
      ))}
    </>
  );
}