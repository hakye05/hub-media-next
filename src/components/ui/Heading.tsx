import type { ReactNode } from "react";

export function Heading({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: ReactNode;
}) {
  return (
    <div className="text-center">
      <h2 className="text-[22px] font-semibold tracking-tight">{title}</h2>
      {subtitle && (
        <p className="mt-1.5 text-[13px] leading-snug text-neutral-500">
          {subtitle}
        </p>
      )}
    </div>
  );
}