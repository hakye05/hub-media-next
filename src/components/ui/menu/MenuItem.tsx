import type { ReactNode } from "react";

type Props = {
  label: string;
  icon: ReactNode;
  tone?: "default" | "danger";
  onClick: () => void;
};

export default function MenuItem({ label, icon, tone = "default", onClick }: Props) {
  const color = tone === "danger" ? "text-red-600" : "text-neutral-900";

  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className={`flex h-12 w-full items-center justify-between rounded-2xl px-4 text-[15px] font-semibold tracking-tight transition-colors hover:bg-neutral-100 ${color}`}
    >
      <span>{label}</span>
      {icon}
    </button>
  );
}