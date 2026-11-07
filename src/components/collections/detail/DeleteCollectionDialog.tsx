"use client";

import { useCallback } from "react";
import { collectionsApi } from "@/lib/collections";
import { useAsyncAction } from "@/lib/useAsyncAction";
import ConfirmModal from "@/components/ui/ConfirmModal";

type Props = { collectionId: string; onDeleted: () => void; onClose: () => void };

export default function DeleteCollectionDialog({ collectionId, onDeleted, onClose }: Props) {
  const deleteCollection = useCallback(() => collectionsApi.delete(collectionId), [collectionId]);
  const { busy, error, run } = useAsyncAction(deleteCollection, onDeleted);

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