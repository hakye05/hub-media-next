"use client";

import { useState, type SyntheticEvent } from "react";
import { getErrorMessage } from "@/lib/errors";
import { uploadsApi } from "@/lib/upload";
import { usersApi } from "@/lib/users";
import CloseIcon from "../../icons/CloseIcon";
import { SolidButton } from "../../ui/Button";
import ImageDropzone from "../../ui/ImageDropzone";
import Modal from "../../ui/Modal";
import StatusText from "../../ui/StatusText";
import { useBannerEditor } from "./useBannerEditor";

type Props = {
  currentUrl: string | null;
  onClose: () => void;
  onChanged: () => void;
};

export default function BannerModal({ currentUrl, onClose, onChanged }: Props) {
  const editor = useBannerEditor(currentUrl);
  const [busy, setBusy] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const error = editor.error ?? submitError;

  async function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editor.hasChange || busy) return;

    setBusy(true);
    setSubmitError(null);
    try {
      if (editor.file) {
        // The backend attaches the finished BANNER upload to the user
        await uploadsApi.uploadImage("BANNER", editor.file);
      } else {
        await usersApi.removeBanner();
      }
      onChanged();
      onClose();
    } catch (err) {
      setSubmitError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal label="Upload banner" onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex max-h-[90vh] flex-col">
        <div className="flex items-center justify-between px-8 pb-2 pt-7">
          <h2 className="text-[22px] font-semibold tracking-tight">Upload banner</h2>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full text-neutral-600 transition-colors hover:bg-neutral-200/60 hover:text-neutral-900"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-8 pb-6 pt-3">
          <ImageDropzone
            preview={editor.shown}
            uploading={busy}
            busyLabel="Saving…"
            previewClassName="block aspect-3/1 w-full object-cover"
            placeholderClassName="h-40"
            onPick={editor.pick}
            onClear={editor.clear}
          />
        </div>

        <div className="flex flex-col gap-3 border-t border-neutral-200 px-8 py-4">
          <StatusText status={error ? { type: "error", text: error } : null} />
          <SolidButton disabled={!editor.hasChange || busy} className="w-full">
            {busy ? "Saving…" : "Accept"}
          </SolidButton>
        </div>
      </form>
    </Modal>
  );
}