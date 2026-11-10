import ColorDots from "@/components/ui/ColorDots";

type Props = {
  open: boolean;
  onClick: () => void;
  className: string;
  dotClassName: string;
  radius: number;
};

export default function ColorTrigger({ open, onClick, className, dotClassName, radius }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Search by color"
      aria-haspopup="dialog"
      aria-expanded={open}
      className={`relative shrink-0 rounded-full transition-transform hover:scale-105 ${className}`}
    >
      <ColorDots dotClassName={dotClassName} radius={radius} />
    </button>
  );
}