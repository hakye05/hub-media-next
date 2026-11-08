"use client";

import { useState, type SyntheticEvent } from "react";
import { useRouter } from "next/navigation";
import { getErrorMessage } from "@/lib/errors";
import { usersApi } from "@/lib/users";
import { useAuth } from "../../../auth/AuthProvider";
import { DangerButton, ToolbarButton } from "../../../ui/Button";
import { FormGroup } from "../../../ui/fields/FormGroup";
import { PasswordField } from "../../../ui/fields/PasswordField";
import StatusText, { type Status } from "../../../ui/StatusText";
import Pane from "../Pane";

export default function DeleteAccountSection({ onCancel }: { onCancel: () => void }) {
  const router = useRouter();
  const { logout } = useAuth();
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<Status>(null);

  const canDelete = password.length > 0 && !busy;

  async function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!canDelete) return;
    setBusy(true);
    setStatus(null);
    try {
      await usersApi.deleteAccount(password);
    } catch (err) {
      setStatus({ type: "error", text: getErrorMessage(err) });
      setBusy(false);
      return;
    }
    // The account is gone; clear the local session (and cookie, if the server still answers)
    await logout().catch(() => {});
    router.replace("/");
  }

  return (
    <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
      <Pane
        title="Delete account"
        footer={
          <>
            <div className="mr-auto min-w-0">
              <StatusText status={status} />
            </div>
            <ToolbarButton onClick={onCancel} disabled={busy}>
              Cancel
            </ToolbarButton>
            <DangerButton disabled={!canDelete}>{busy ? "Deleting…" : "Delete account"}</DangerButton>
          </>
        }
      >
        <div className="flex flex-col gap-5">
          <p className="text-[14px] leading-snug text-neutral-600">
            This permanently deletes your profile, posts, collections, saved items and follows.
            This can't be undone.
          </p>

          <FormGroup label="Confirm with your password">
            <PasswordField
              variant="soft"
              autoComplete="current-password"
              placeholder="Current password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setStatus(null);
              }}
            />
          </FormGroup>
        </div>
      </Pane>
    </form>
  );
}