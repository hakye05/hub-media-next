"use client";

import ConfirmModal from "../ui/ConfirmModal";
import { useDeletePost } from "./useDeletePost";

type Props = { postId: string; onDeleted: () => void; onClose: () => void };

export default function DeletePostDialog({ postId, onDeleted, onClose }: Props) {
  const { busy, error, run } = useDeletePost(postId, onDeleted);

  return (
    <ConfirmModal
      title="Delete post?"
      message="This post will be permanently deleted."
      confirmLabel="Delete"
      busy={busy}
      error={error}
      onConfirm={run}
      onCancel={onClose}
    />
  );
}