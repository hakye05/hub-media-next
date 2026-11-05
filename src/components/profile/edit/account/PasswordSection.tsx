"use client";

import { useState, type SyntheticEvent } from "react";
import { getErrorMessage } from "@/lib/errors";
import { usersApi } from "@/lib/users";
import { useAuth } from "../../../auth/AuthProvider";
import { SolidButton, ToolbarButton } from "../../../ui/Button";
import { FormGroup } from "../../../ui/fields/FormGroup";
import { PasswordField } from "../../../ui/fields/PasswordField";
import StatusText, { type Status } from "../../../ui/StatusText";
import Pane from "../Pane";

type Props = {
  onSaved: (message: string) => void;
  onCancel: () => void;
};

export default function PasswordSection({ onSaved, onCancel }: Props) {
  const { setSession } = useAuth();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [logoutOthers, setLogoutOthers] = useState(true);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<Status>(null);

  const passwordsMatch = newPassword === confirmPassword;
  const canSave =
    currentPassword.length > 0 &&
    newPassword.length >= 8 &&
    newPassword.length <= 72 &&
    confirmPassword.length > 0 &&
    passwordsMatch &&
    !busy;

  // Server error wins; otherwise show the live mismatch hint
  const footerStatus: Status =
    status ??
    (confirmPassword.length > 0 && !passwordsMatch
      ? { type: "error", text: "Passwords don't match." }
      : null);

  async function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!canSave) return;
    setBusy(true);
    setStatus(null);
    try {
      // Returns a fresh session: keep this tab logged in with the new access token
      setSession(await usersApi.changePassword(currentPassword, newPassword, logoutOthers));
      onSaved(
        logoutOthers ? "Password updated. Other devices were logged out." : "Password updated."
      );
    } catch (err) {
      setStatus({ type: "error", text: getErrorMessage(err) });
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
      <Pane
        title="Update password"
        footer={
          <>
            <div className="mr-auto min-w-0">
              <StatusText status={footerStatus} />
            </div>
            <ToolbarButton onClick={onCancel}>Cancel</ToolbarButton>
            <SolidButton disabled={!canSave}>{busy ? "Saving…" : "Save changes"}</SolidButton>
          </>
        }
      >
        <div className="flex flex-col gap-5">
          <FormGroup label="Current password">
            <PasswordField
              variant="soft"
              autoComplete="current-password"
              placeholder="Current password"
              value={currentPassword}
              onChange={(e) => {
                setCurrentPassword(e.target.value);
                setStatus(null);
              }}
            />
          </FormGroup>

          <FormGroup label="New password" hint="At least 8 characters">
            <PasswordField
              variant="soft"
              autoComplete="new-password"
              placeholder="New password"
              maxLength={72}
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                setStatus(null);
              }}
            />
          </FormGroup>

          <FormGroup label="Confirm new password">
            <PasswordField
              variant="soft"
              autoComplete="new-password"
              placeholder="Confirm new password"
              maxLength={72}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setStatus(null);
              }}
            />
          </FormGroup>

          <label className="flex cursor-pointer items-center gap-2.5 px-1 text-[14px] text-neutral-700">
            <input
              type="checkbox"
              checked={logoutOthers}
              onChange={(e) => setLogoutOthers(e.target.checked)}
              className="h-4.5 w-4.5 accent-[#111]"
            />
            Log out of other devices
          </label>
        </div>
      </Pane>
    </form>
  );
}