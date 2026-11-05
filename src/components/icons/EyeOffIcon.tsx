import { useId } from "react";

type Props = { size?: number; className?: string };

export default function EyeOffIcon({ size = 24, className }: Props) {
  const clipId = useId();

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden
    >
      <g clipPath={`url(#${clipId})`}>
        <path
          d="M7.67842 18.4168C6.20588 17.5924 4.98312 16.4986 4.09134 15.5567C3.04148 14.4479 2.45033 13.5497 2.45033 13.5497M4.09134 15.5567L1.82401 17.824M20.2013 15.5783C19.3385 16.5068 18.1346 17.6032 16.6671 18.4288C15.3483 19.1708 13.8166 19.6941 12.1283 19.6803C10.4863 19.6669 8.98417 19.1478 7.67842 18.4168M12.1283 19.6803L12.1317 22.2573M7.67842 18.4168L6.00943 20.9948M16.6671 18.4288L18.1348 21.0111M20.2013 15.5783C21.1688 14.5372 21.7072 13.7072 21.7072 13.7072M20.2013 15.5783L22.3115 17.6885"
          strokeWidth="1.6"
          strokeLinecap="round"
          stroke="currentColor"
        />
      </g>
      <defs>
        <clipPath id={clipId}>
          <rect width="24" height="24" fill="currentColor" />
        </clipPath>
      </defs>
    </svg>
  );
}