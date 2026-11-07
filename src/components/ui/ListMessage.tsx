import type { ReactNode } from "react";

type Props = {
  actionLabel?: string;
  onAction?: () => void;
  children: ReactNode;
};

export default function ListMessage({ actionLabel, onAction, children }: Props) {
  return (
    <div className="flex flex-col items-center gap-3 py-16 text-center text-[15px] text-neutral-500">
      <p>{children}</p>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="font-semibold text-neutral-900 hover:underline"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}