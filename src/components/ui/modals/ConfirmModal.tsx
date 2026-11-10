"use client";

import { useCallback } from "react";
import { createPortal } from "react-dom";
import { ChoiceButton } from "../Button";
import Modal from "./Modal";

type Props = {
  title: string;
  message: string;
  confirmLabel: string;
  busyLabel?: string;
  busy?: boolean;
  error?: string | null;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmModal({
  title,
  message,
  confirmLabel,
  busyLabel = "Deleting…",
  busy = false,
  error,
  onConfirm,
  onCancel,
}: Props) {
  const close = useCallback(() => {
    if (!busy) onCancel();
  }, [busy, onCancel]);

  return createPortal(
    <Modal label={title} onClose={close} className="max-w-105">
      <div className="p-10 text-center">
        <h2 className="text-xl font-bold tracking-tight">{title}</h2>
        <p className="mt-2 text-sm text-neutral-400">{message}</p>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        <div className="mt-8 flex gap-3">
          <ChoiceButton className="flex-1" onClick={onCancel} disabled={busy}>
            Cancel
          </ChoiceButton>
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className="h-12 flex-1 rounded-full bg-neutral-100 text-[15px] font-semibold text-red-600 transition-colors hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-60 sm:h-16"
          >
            {busy ? busyLabel : confirmLabel}
          </button>
        </div>
      </div>
    </Modal>,
    document.body
  );
}