import type { ReactNode } from "react";

export default function LabeledAction({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex w-16 flex-col items-center gap-2">
      {children}
      <span className="text-[12px] font-semibold text-neutral-500">{label}</span>
    </div>
  );
}