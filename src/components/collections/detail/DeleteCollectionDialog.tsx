"use client";

import { useState } from "react";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { collectionsApi } from "@/lib/collections";
import { getErrorMessage } from "@/lib/errors";

type Props = { collectionId: string; onDeleted: () => void; onClose: () => void };

export default function DeleteCollectionDialog({ collectionId, onDeleted, onClose }: Props) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    setBusy(true);
    setError(null);
    try {
      await collectionsApi.delete(collectionId);
      onDeleted();
    } catch (err) {
      setError(getErrorMessage(err));
      setBusy(false);
    }
  }

  return (
    <ConfirmModal
      title="Delete collection?"
      message="The collection will be deleted. Your saved posts stay saved."
      confirmLabel="Delete"
      busy={busy}
      error={error}
      onConfirm={run}
      onCancel={onClose}
    />
  );
}