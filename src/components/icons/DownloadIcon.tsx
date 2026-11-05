type Props = { size?: number; className?: string };

export default function DownloadIcon({ size = 18, className }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M12 4v11m0 0-4-4m4 4 4-4M5 19h14" />
    </svg>
  );
}