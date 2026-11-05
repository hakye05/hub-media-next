type Props = {
  value: number;
  disabled?: boolean;
  onChange: (value: number) => void;
};

export default function ZoomSlider({ value, disabled = false, onChange }: Props) {
  return (
    <label className="flex items-center gap-3 px-1 text-[13px] text-neutral-500">
      Zoom
      <input
        type="range"
        min={1}
        max={3}
        step={0.01}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1 flex-1 cursor-pointer accent-[#111] disabled:cursor-not-allowed"
      />
    </label>
  );
}