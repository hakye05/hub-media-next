"use client";

import { useCallback, useState } from "react";
import { createPortal } from "react-dom";
import PlusIcon from "../icons/PlusIcon";
import { ToolbarButton } from "../ui/Button";
import CreatePostModal from "../posts/create/CreatePostModal";

export default function CreatePostButton() {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  return (
    <>
      <ToolbarButton onClick={() => setOpen(true)}>
        <PlusIcon />
        Create
      </ToolbarButton>

      {/* The navbar's backdrop-blur would trap a fixed modal, so render it on <body> */}
      {open && createPortal(<CreatePostModal onClose={close} />, document.body)}
    </>
  );
}