import type { ReactNode } from "react";

type Props = {
  active: boolean;
  icon: ReactNode;
  onClick: () => void;
  children: ReactNode;
};

export default function EditNavItem({ active, icon, onClick, children }: Props) {
  return (
    <button
      type="button"
      aria-current={active ? "page" : undefined}
      onClick={onClick}
      className={`flex h-11 items-center gap-3 rounded-xl px-3 text-[15px] font-medium transition-colors md:w-full ${
        active
          ? "bg-neutral-200/60 text-neutral-900"
          : "text-neutral-700 hover:bg-neutral-100"
      }`}
    >
      <span className="flex h-6 w-6 shrink-0 items-center justify-center">{icon}</span>
      {children}
    </button>
  );
}