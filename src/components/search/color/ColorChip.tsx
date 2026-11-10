import CloseIcon from "@/components/icons/CloseIcon";

type Props = { hex: string; onRemove: () => void; className?: string };

/** The whole circle is the remove button. Desktop shows an X on hover; mobile shows no X, tap drops the color. */
export default function ColorChip({ hex, onRemove, className = "h-8 w-8" }: Props) {
  return (
    <button
      type="button"
      onClick={onRemove}
      title={hex}
      aria-label={`Remove color ${hex}`}
      className={`group relative shrink-0 rounded-full border border-black/10 ${className}`}
      style={{ backgroundColor: hex }}
    >
      <span className="absolute inset-0 hidden items-center justify-center rounded-full bg-black/45 text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 sm:flex">
        <CloseIcon size={14} />
      </span>
    </button>
  );
}