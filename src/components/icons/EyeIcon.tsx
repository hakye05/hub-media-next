type Props = { size?: number; className?: string };

export default function EyeIcon({ size = 24, className }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden
    >
      <path
        d="M23 12.1738C23 12.1738 18.7443 4.43891 11.948 4.39243C5.1516 4.34596 0.999923 12.1737 0.999923 12.1737"
        strokeWidth="1.6"
        strokeLinecap="round"
        stroke="currentColor"
      />
      <circle cx="12" cy="13" r="5" fill="currentColor" />
    </svg>
  );
}