"use client";

import { useSavePost } from "@/components/collections/save/savePostContext";
import { SmallSolidButton } from "@/components/ui/Button";

type Props = { postId: string; saved: boolean };

export default function SaveTextButton({ postId, saved }: Props) {
  const { isSaved, openSave } = useSavePost();
  const savedNow = isSaved(postId, saved);

  return (
    <SmallSolidButton onClick={() => openSave(postId, savedNow)}>
      {savedNow ? "Saved" : "Save"}
    </SmallSolidButton>
  );
}