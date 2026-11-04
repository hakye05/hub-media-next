type Props = { size?: number; className?: string };

export default function ImageIcon({ size = 36, className }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <rect x="3.5" y="4.5" width="17" height="15" rx="3" />
      <circle cx="9" cy="10" r="1.6" />
      <path d="M4 17l4.5-4.5a1.5 1.5 0 0 1 2.1 0L14 16l2-2a1.5 1.5 0 0 1 2.1 0L20 16" />
    </svg>
  );
}