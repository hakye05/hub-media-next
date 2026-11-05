"use client";

import { useState, type SyntheticEvent } from "react";
import { getErrorMessage } from "@/lib/errors";
import { usersApi, type UserMe } from "@/lib/users";
import { SolidButton, ToolbarButton } from "../../../ui/Button";
import { SoftField } from "../../../ui/fields/Field";
import { FormGroup } from "../../../ui/fields/FormGroup";
import { PasswordField } from "../../../ui/fields/PasswordField";
import StatusText, { type Status } from "../../../ui/StatusText";
import Pane from "../Pane";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Props = {
  email: string;
  onUpdated: (me: UserMe) => void;
  onSaved: (message: string) => void;
  onCancel: () => void;
};

export default function EmailSection({ email, onUpdated, onSaved, onCancel }: Props) {
  const [newEmail, setNewEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<Status>(null);

  const canSave = EMAIL_RE.test(newEmail.trim()) && password.length > 0 && !busy;

  async function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!canSave) return;
    setBusy(true);
    setStatus(null);
    try {
      onUpdated(await usersApi.changeEmail(newEmail.trim(), password));
      onSaved("Email updated.");
    } catch (err) {
      setStatus({ type: "error", text: getErrorMessage(err) });
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
      <Pane
        title="Update email"
        footer={
          <>
            <div className="mr-auto min-w-0">
              <StatusText status={status} />
            </div>
            <ToolbarButton onClick={onCancel}>Cancel</ToolbarButton>
            <SolidButton disabled={!canSave}>{busy ? "Saving…" : "Save changes"}</SolidButton>
          </>
        }
      >
        <div className="flex flex-col gap-5">
          <p className="truncate px-1 text-[13px] text-neutral-500">Currently {email}</p>

          <FormGroup label="New email">
            <SoftField
              type="email"
              autoComplete="email"
              placeholder="name@example.com"
              value={newEmail}
              onChange={(e) => {
                setNewEmail(e.target.value);
                setStatus(null);
              }}
            />
          </FormGroup>

          <FormGroup label="Current password">
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