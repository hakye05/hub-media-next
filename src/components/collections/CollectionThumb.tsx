import type { ReactNode } from "react";

type Props = { url?: string | null; className?: string; children?: ReactNode };

export default function CollectionThumb({
  url,
  className = "h-12 w-12 bg-neutral-200/70 text-neutral-500",
  children,
}: Props) {
  return (
    <span
      className={`flex shrink-0 items-center justify-center overflow-hidden rounded-xl ${className}`}
    >
      {url ? <img src={url} alt="" className="h-full w-full object-cover" /> : children}
    </span>
  );
}