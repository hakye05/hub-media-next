"use client";

import { useState } from "react";
import { getErrorMessage } from "@/lib/errors";
import { postsApi } from "@/lib/posts";
import TrashIcon from "../icons/TrashIcon";
import { IconDangerButton } from "../ui/Button";
import ConfirmModal from "../ui/ConfirmModal";

type Props = { postId: string; onDeleted: () => void };

export default function DeletePostButton({ postId, onDeleted }: Props) {
    const [open, setOpen] = useState(false);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);

    function close() {
        setOpen(false);
        setError(null);
    }

    async function confirm() {
        setBusy(true);
        setError(null);
        try {
            await postsApi.delete(postId);
            onDeleted();
        } catch (err) {
            setError(getErrorMessage(err));
            setBusy(false);
        }
    }

    return (
        <>
            <IconDangerButton label="Delete post" onClick={() => setOpen(true)}>
                <TrashIcon />
            </IconDangerButton>

            {open && (
                <ConfirmModal
                    title="Delete post?"
                    message="This post will be permanently deleted."
                    confirmLabel="Delete"
                    busy={busy}
                    error={error}
                    onConfirm={confirm}
                    onCancel={close}
                />
            )}
        </>
    );
}