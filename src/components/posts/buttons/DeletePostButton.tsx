"use client";

import TrashIcon from "@/components/icons/TrashIcon";
import { IconDangerButton } from "@/components/ui/Button";
import { useState } from "react";
import DeletePostDialog from "../DeletePostDialog";

type Props = { postId: string; onDeleted: () => void };

export default function DeletePostButton({ postId, onDeleted }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <IconDangerButton label="Delete post" onClick={() => setOpen(true)}>
        <TrashIcon />
      </IconDangerButton>

      {open && (
        <DeletePostDialog
          postId={postId}
          onDeleted={onDeleted}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}