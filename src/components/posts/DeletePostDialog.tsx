"use client";

import { useCallback } from "react";
import { postsApi } from "@/lib/posts";
import { useAsyncAction } from "@/lib/useAsyncAction";
import ConfirmModal from "../ui/ConfirmModal";

type Props = { postId: string; onDeleted: () => void; onClose: () => void };

export default function DeletePostDialog({ postId, onDeleted, onClose }: Props) {
  const deletePost = useCallback(() => postsApi.delete(postId), [postId]);
  const { busy, error, run } = useAsyncAction(deletePost, onDeleted);

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