"use client";

import { useState } from "react";
import Image from "next/image";
import logo from "../../../public/icon.svg";
import { AuthShell } from "./AuthShell";
import { PrimaryButton } from "../ui/Button";
import { Field } from "../ui/fields/Field";
import { Heading } from "../ui/Heading";
import { PasswordField } from "../ui/fields/PasswordField";
import { TextLink } from "../ui/TextLink";
import { useAuth } from "./AuthProvider";
import { getErrorMessage } from "@/lib/errors";

export default function LoginForm({
  onClose,
  onSwitch,
}: {
  onClose: () => void;
  onSwitch: () => void;
}) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const canSubmit = email.trim().length > 0 && password.length > 0 && !busy;

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!canSubmit) return;
    setBusy(true);
    setError(null);
    try {
      await login(email.trim(), password);
      onClose();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthShell
      onClose={onClose}
      logo={<Image src={logo} alt="Cosmos" width={35} height={35} />}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <Heading
          title="Welcome back"
          subtitle={
            <>
              Enter your credentials or{" "}
              <TextLink onClick={onSwitch}>sign up</TextLink>
            </>
          }
        />

        <div className="flex flex-col gap-3">
          <Field
            autoFocus
            type="email"
            autoComplete="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError(null);
            }}
          />
          <PasswordField
            autoComplete="current-password"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(null);
            }}
          />
          {error && (
            <p className="text-center text-[13px] text-red-500">{error}</p>
          )}
          <PrimaryButton disabled={!canSubmit}>Next</PrimaryButton>
        </div>

        <button
          type="button"
          className="mx-auto text-[13px] text-neutral-500 transition-colors hover:text-neutral-900"
        >
          Forgot password?
        </button>
      </form>
    </AuthShell>
  );
}