import type { ReactNode } from "react";
import { FormGroup } from "./FormGroup";
import PencilIcon from "../../icons/PencilIcon";

type Props = {
  label: string;
  editLabel: string;
  onEdit: () => void;
  children: ReactNode;
};

export default function ReadonlyRow({ label, editLabel, onEdit, children }: Props) {
  return (
    <FormGroup label={label} as="div">
      <div className="flex h-14 w-full items-center rounded-2xl border border-neutral-200 bg-[#faf9f8] pl-5 pr-4">
        <span className="min-w-0 flex-1 truncate text-[16px] text-neutral-900">
          {children}
        </span>
        <button
          type="button"
          aria-label={editLabel}
          onClick={onEdit}
          className="ml-3 flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-neutral-600 transition-colors hover:bg-neutral-200/60 hover:text-neutral-900"
        >
          <PencilIcon />
        </button>
      </div>
    </FormGroup>
  );
}