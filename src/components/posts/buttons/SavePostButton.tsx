"use client";

import BookmarkIcon from "@/components/icons/BookmarkIcon";
import { useSavePost } from "@/components/collections/save/savePostContext";
import { IconSolidButton } from "@/components/ui/Button";

type Props = { postId: string; saved: boolean; size?: "md" | "sm" };

export default function SavePostButton({ postId, saved, size }: Props) {
  const { isSaved, openSave } = useSavePost();
  const savedNow = isSaved(postId, saved);

  return (
    <IconSolidButton
      label={savedNow ? "Saved" : "Save"}
      size={size}
      onClick={() => openSave(postId, savedNow)}
    >
      <BookmarkIcon filled={savedNow} />
    </IconSolidButton>
  );
}