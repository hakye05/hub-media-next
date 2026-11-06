"use client";

import { useState, type SyntheticEvent } from "react";
import { getErrorMessage } from "@/lib/errors";
import { POST_DESCRIPTION_MAX, POST_TITLE_MAX } from "@/lib/postLimits";
import { postsApi, type Post, type PostDetail } from "@/lib/posts";
import CloseIcon from "../icons/CloseIcon";
import { SolidButton } from "../ui/Button";
import { SoftField, SoftTextArea } from "../ui/fields/Field";
import { FormGroup } from "../ui/fields/FormGroup";
import Modal from "../ui/Modal";
import StatusText from "../ui/StatusText";

type Props = {
  post: PostDetail;
  onClose: () => void;
  onSaved: (post: Post) => void;
};

export default function EditPostModal({ post, onClose, onSaved }: Props) {
  const [title, setTitle] = useState(post.title);
  const [description, setDescription] = useState(post.description ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const titleChanged = title.trim() !== post.title;
  const descriptionChanged = description.trim() !== (post.description ?? "");
  const canSave = (titleChanged || descriptionChanged) && title.trim().length > 0 && !busy;

  async function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!canSave) return;

    setBusy(true);
    setError(null);
    try {
      const updated = await postsApi.update(post.id, {
        ...(titleChanged && { title: title.trim() }),
        // An empty string clears the description
        ...(descriptionChanged && { description: description.trim() }),
      });
      onSaved(updated);
      onClose();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal label="Edit post" onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex max-h-[90vh] flex-col">
        <div className="flex items-center justify-between px-8 pb-2 pt-7">
          <h2 className="text-[22px] font-semibold tracking-tight">Edit post</h2>
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
          <FormGroup label="Title" hint={`${title.length}/${POST_TITLE_MAX}`}>
            <SoftField
              type="text"
              maxLength={POST_TITLE_MAX}
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setError(null);
              }}
            />
          </FormGroup>

          <FormGroup label="Description" hint={`${description.length}/${POST_DESCRIPTION_MAX}`}>
            <SoftTextArea
              rows={4}
              maxLength={POST_DESCRIPTION_MAX}
              placeholder="Tell people what this is about"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setError(null);
              }}
            />
          </FormGroup>
        </div>

        <div className="flex flex-col gap-3 border-t border-neutral-200 px-8 pt-6 pb-8">
          <StatusText status={error ? { type: "error", text: error } : null} />
          <SolidButton disabled={!canSave} className="w-full">
            {busy ? "Saving…" : "Save changes"}
          </SolidButton>
        </div>
      </form>
    </Modal>
  );
}