"use client";

import { useState, type SyntheticEvent } from "react";
import { CropError } from "@/lib/cropImage";
import { getErrorMessage } from "@/lib/errors";
import { uploadsApi } from "@/lib/upload";
import { usersApi } from "@/lib/users";
import { SolidButton } from "../../ui/Button";
import ImageDropzone from "../../ui/ImageDropzone";
import Modal from "../../ui/modals/Modal";
import StatusText from "../../ui/StatusText";
import BannerCropper from "./BannerCropper";
import { useBannerEditor } from "./useBannerEditor";
import ModalHeader from "@/components/ui/modals/ModalHeader";

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
    if (!editor.canSave || busy) return;

    setBusy(true);
    setSubmitError(null);
    try {
      if (editor.hasNewImage) {
        const cropped = await editor.cropFile();
        // The backend attaches the finished BANNER upload to the user
        await uploadsApi.uploadImage("BANNER", cropped);
      } else {
        await usersApi.removeBanner();
      }
      onChanged();
      onClose();
    } catch (err) {
      setSubmitError(err instanceof CropError ? err.message : getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal label="Upload banner" onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex max-h-[90vh] flex-col">
        <ModalHeader title="Upload banner" onClose={onClose} />

        <div className="min-h-0 flex-1 overflow-y-auto px-8 pb-6 pt-3">
          {editor.preview ? (
            <BannerCropper
              src={editor.preview}
              position={editor.position}
              zoom={editor.zoom}
              disabled={busy}
              onPositionChange={editor.setPosition}
              onZoomChange={editor.setZoom}
              onAreaChange={editor.setArea}
              onRemove={editor.clear}
            />
          ) : (
            <ImageDropzone
              preview={editor.existingUrl}
              uploading={busy}
              busyLabel="Saving…"
              previewClassName="block aspect-4/1 w-full object-cover"
              placeholderClassName="h-40"
              onPick={editor.pick}
              onClear={editor.clear}
            />
          )}
        </div>

        <div className="flex flex-col gap-3 border-t border-neutral-200 px-8 py-4">
          <StatusText status={error ? { type: "error", text: error } : null} />
          <SolidButton disabled={!editor.canSave || busy} className="w-full">
            {busy ? "Saving…" : "Accept"}
          </SolidButton>
        </div>
      </form>
    </Modal>
  );
}