import type { ReactNode } from "react";

type Props = {
  label: string;
  hint?: ReactNode;
  as?: "label" | "div";
  children: ReactNode;
};

export function FormGroup({ label, hint, as: Tag = "label", children }: Props) {
  return (
    <Tag className="flex flex-col gap-1.5">
      <span className="flex items-baseline justify-between px-1">
        <span className="text-[12px] font-medium text-neutral-500">{label}</span>
        {hint && <span className="text-[12px] text-neutral-400">{hint}</span>}
      </span>
      {children}
    </Tag>
  );
}