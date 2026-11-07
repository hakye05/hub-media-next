import type { ReactNode } from "react";
import CheckIcon from "@/components/icons/CheckIcon";

type Props = {
  thumb: ReactNode;
  title: string;
  subtitle: string;
  selected?: boolean;
  disabled?: boolean;
  onClick: () => void;
};

export default function PickerRow({ thumb, title, subtitle, selected, disabled, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected}
      className={`flex w-full items-center gap-3 rounded-2xl p-2 text-left transition-colors hover:bg-neutral-100 disabled:cursor-wait disabled:opacity-60 ${
        selected ? "bg-neutral-100" : ""
      }`}
    >
      {thumb}
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[16px] font-semibold text-neutral-900">{title}</span>
        <span className="block truncate text-[14px] text-neutral-400">{subtitle}</span>
      </span>
      {selected && (
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#111] text-white">
          <CheckIcon />
        </span>
      )}
    </button>
  );
}