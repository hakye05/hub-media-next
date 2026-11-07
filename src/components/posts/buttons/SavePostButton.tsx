"use client";

import BookmarkIcon from "@/components/icons/BookmarkIcon";
import { useSavePost } from "@/components/save/savePostContext";
import { IconSolidButton, SmallSolidButton } from "@/components/ui/Button";

type Props = {
  postId: string;
  saved: boolean;
  /** "icon": bookmark button on the post view. "text": small pill on cards. */
  variant?: "icon" | "text";
  size?: "md" | "sm";
};

export default function SavePostButton({ postId, saved, variant = "icon", size }: Props) {
  const { isSaved, openSave } = useSavePost();
  const savedNow = isSaved(postId, saved);
  const onClick = () => openSave(postId, savedNow);

  if (variant === "text") {
    return <SmallSolidButton onClick={onClick}>{savedNow ? "Saved" : "Save"}</SmallSolidButton>;
  }

  return (
    <IconSolidButton label={savedNow ? "Saved" : "Save"} size={size} onClick={onClick}>
      <BookmarkIcon filled={savedNow} />
    </IconSolidButton>
  );
}