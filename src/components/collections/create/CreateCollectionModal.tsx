"use client";

import { useState, type SyntheticEvent } from "react";
import CloseIcon from "@/components/icons/CloseIcon";
import { SolidButton } from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import StatusText from "@/components/ui/StatusText";
import Toggle from "@/components/ui/Toggle";
import { collectionsApi, type Collection } from "@/lib/collections";
import { getErrorMessage } from "@/lib/errors";

const TITLE_MAX = 100;
const noop = () => {};

type Props = { onClose: () => void; onCreated: (collection: Collection) => void };

export default function CreateCollectionModal({ onClose, onCreated }: Props) {
  const [title, setTitle] = useState("");
  const [makePrivate, setMakePrivate] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canCreate = title.trim().length > 0 && !busy;

  async function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!canCreate) return;

    setBusy(true);
    setError(null);
    try {
      const collection = await collectionsApi.create({
        title: title.trim(),
        isPublic: !makePrivate,
      });
      onCreated(collection);
      onClose();
    } catch (err) {
      setError(getErrorMessage(err)); // e.g. 409 duplicate title
      setBusy(false);
    }
  }

  return (
    <Modal label="New collection" onClose={busy ? noop : onClose} className="max-w-100">
      <form onSubmit={handleSubmit} className="flex flex-col px-7 pb-7 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-[16px] font-semibold text-neutral-400">New collection</h2>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            disabled={busy}
            className="flex h-10 w-10 items-center justify-center rounded-full text-neutral-600 transition-colors hover:bg-neutral-200/60 hover:text-neutral-900"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="flex min-h-40 items-center justify-center py-8">
          <input
            autoFocus
            type="text"
            value={title}
            maxLength={TITLE_MAX}
            placeholder="New collection"
            aria-label="Collection title"
            onChange={(e) => {
              setTitle(e.target.value);
              setError(null);
            }}
            className="w-full bg-transparent text-center text-[34px] font-semibold tracking-tight text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
          />
        </div>

        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-[15px] font-semibold">Make private</p>
            <p className="text-[13px] text-neutral-400">Only you can see this collection</p>
          </div>
          <Toggle
            checked={makePrivate}
            onChange={setMakePrivate}
            label="Make private"
            disabled={busy}
          />
        </div>

        <StatusText status={error ? { type: "error", text: error } : null} />
        <SolidButton disabled={!canCreate} className="mt-2 h-14 w-full">
          {busy ? "Creating…" : "Create collection"}
        </SolidButton>
      </form>
    </Modal>
  );
}