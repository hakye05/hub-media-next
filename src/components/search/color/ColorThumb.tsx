type Props = { color: string; active: boolean; left: string; top: string };

export default function ColorThumb({ color, active, left, top }: Props) {
  return (
    <span
      className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left, top }}
    >
      <span
        className={`block h-4.5 w-4.5 rounded-full border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.3),0_2px_8px_rgba(0,0,0,0.35)] transition-transform duration-150 ease-out motion-reduce:transition-none ${
          active ? "scale-[1.7]" : "scale-100"
        }`}
        style={{ backgroundColor: color }}
      />
    </span>
  );
}