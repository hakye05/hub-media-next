type Props = { size?: number; filled?: boolean; className?: string };

export default function BookmarkIcon({ size = 18, filled = false, className }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M6 4h12v16l-6-4-6 4z" />
    </svg>
  );
}