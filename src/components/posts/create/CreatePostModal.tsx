"use client";

import { useState, type SyntheticEvent } from "react";
import { getErrorMessage } from "@/lib/errors";
import { postsApi } from "@/lib/posts";
import CloseIcon from "../../icons/CloseIcon";
import { SolidButton } from "../../ui/Button";
import { SoftField, SoftTextArea } from "../../ui/fields/Field";
import { FormGroup } from "../../ui/fields/FormGroup";
import Modal from "../../ui/Modal";
import StatusText from "../../ui/StatusText";
import { useCreatedPosts } from "../CreatedPostsProvider";
import { useImageUpload } from "./useImageUpload";
import ImageDropzone from "@/components/ui/ImageDropzone";

const TITLE_MAX = 100;
const DESCRIPTION_MAX = 500;
const disabledStyle = "disabled:cursor-not-allowed disabled:opacity-50";

export default function CreatePostModal({ onClose }: { onClose: () => void }) {
  const { add } = useCreatedPosts();
  const image = useImageUpload();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [busy, setBusy] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Title and description unlock once the image has finished uploading
  const unlocked = image.uploadId !== null && !busy;
  const canPublish = unlocked && title.trim().length > 0;
  const error = image.error ?? submitError;

  async function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!canPublish || !image.uploadId) return;

    setBusy(true);
    setSubmitError(null);
    try {
      const post = await postsApi.create({
        uploadId: image.uploadId,
        title: title.trim(),
        ...(description.trim() && { description: description.trim() }),
      });
      add(post);
      onClose();
    } catch (err) {
      setSubmitError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal label="Create post" onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex max-h-[90vh] flex-col">
        <div className="flex items-center justify-between px-8 pb-2 pt-7">
          <h2 className="text-[22px] font-semibold tracking-tight">Create post</h2>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full text-neutral-600 transition-colors hover:bg-neutral-200/60 hover:text-neutral-900"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-8 pb-6 pt-3">
          <FormGroup label="Title" hint={`${title.length}/${TITLE_MAX}`}>
            <SoftField
              type="text"
              maxLength={TITLE_MAX}
              placeholder="Add a title"
              disabled={!unlocked}
              className={disabledStyle}
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setSubmitError(null);
              }}
            />
          </FormGroup>

          <ImageDropzone
            preview={image.preview}
            uploading={image.uploading}
            disabled={busy}
            onPick={image.pick}
            onClear={image.clear}
          />

          <FormGroup label="Description" hint={`${description.length}/${DESCRIPTION_MAX}`}>
            <SoftTextArea
              rows={3}
              maxLength={DESCRIPTION_MAX}
              placeholder="Tell people what this is about"
              disabled={!unlocked}
              className={disabledStyle}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setSubmitError(null);
              }}
            />
          </FormGroup>
        </div>

        <div className="flex flex-col gap-3 border-t border-neutral-200 px-8 py-4">
          <StatusText status={error ? { type: "error", text: error } : null} />
          <SolidButton disabled={!canPublish} className="w-full">
            {busy ? "Publishing…" : "Publish"}
          </SolidButton>
        </div>
      </form>
    </Modal>
  );
}