"use client";

import { useState, type ReactNode } from "react";
import { AuthShell } from "./AuthShell";
import { ChoiceButton, PrimaryButton } from "../ui/Button";
import { Field } from "../ui/fields/Field";
import { Heading } from "../ui/Heading";
import { LogoDots } from "../ui/LogoDots";
import { PasswordField } from "../ui/fields/PasswordField";
import { TextLink } from "../ui/TextLink";
import { useAuth } from "./AuthProvider";
import { ApiError } from "@/lib/api";
import { authApi } from "@/lib/authApi";

type Step = "email" | "password" | "name" | "age" | "gender" | "username";

const STEPS: Step[] = ["email", "password", "name", "age", "gender", "username"];
const GENDERS = ["Woman", "Man", "Non-binary", "Prefer not to say"] as const;

// Adjust the right-hand values to match your backend `Gender` enum exactly.
const GENDER_VALUES: Record<(typeof GENDERS)[number], string> = {
  Woman: "FEMALE",
  Man: "MALE",
  "Non-binary": "NON_BINARY",
  "Prefer not to say": "PREFER_NOT_TO_SAY",
};

const MIN_AGE = 13;
const MAX_AGE = 120;
const USERNAME_RE = /^[a-z0-9_.]{3,20}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_FORMAT_MSG = "Use 3–20 letters, numbers, _ or .";

type Data = {
  email: string;
  password: string;
  name: string;
  age: string;
  gender: string;
  username: string;
};

const terms = (
  <p className="text-center text-[12px] leading-relaxed text-neutral-500">
    By creating an account, you agree to our
    <br />
    <span className="underline">Terms of Service</span> and{" "}
    <span className="underline">Privacy Policy</span>
  </p>
);

const errorMessage = (err: unknown) =>
  err instanceof ApiError ? err.message : "Can't reach the server. Please try again.";

export default function SignUpFlow({
  onClose,
  onSwitch,
}: {
  onClose: () => void;
  onSwitch: () => void;
}) {
  const { register } = useAuth();
  const [index, setIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [data, setData] = useState<Data>({
    email: "",
    password: "",
    name: "",
    age: "",
    gender: "",
    username: "",
  });

  const step = STEPS[index];
  const set = <K extends keyof Data>(key: K, value: Data[K]) => {
    setData((d) => ({ ...d, [key]: value }));
    setError(null);
  };

  const ageNum = Number(data.age);
  const valid: Record<Step, boolean> = {
    email: EMAIL_RE.test(data.email.trim()),
    password: data.password.length >= 8,
    name: data.name.trim().length > 0,
    age: data.age !== "" && ageNum >= MIN_AGE && ageNum <= MAX_AGE,
    gender: data.gender !== "",
    username: USERNAME_RE.test(data.username),
  };

  // The username button stays clickable (once something is typed) so an invalid
  // username can show its red message on click instead of while typing.
  const canSubmit =
    !busy && (step === "username" ? data.username !== "" : valid[step]);

  const advance = () => setIndex((i) => i + 1);

  async function submitEmail() {
    setBusy(true);
    setError(null);
    try {
      const { available } = await authApi.checkEmail(data.email.trim());
      if (!available) {
        setError("This email is already registered.");
        return;
      }
      advance();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  async function submitUsername() {
    if (!valid.username) {
      setError(USERNAME_FORMAT_MSG);
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const { available } = await authApi.checkUsername(data.username);
      if (!available) {
        setError("Username is not available");
        return;
      }
      await register({
        email: data.email.trim(),
        password: data.password,
        displayName: data.name.trim(),
        username: data.username,
        age: ageNum,
        gender: GENDER_VALUES[data.gender as (typeof GENDERS)[number]],
      });
      onClose();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    if (step === "username") return void submitUsername();
    if (!valid[step]) return;
    if (step === "email") return void submitEmail();
    advance();
  }

  function chooseGender(g: string) {
    set("gender", g);
    advance();
  }

  function goBack() {
    setError(null);
    setIndex((i) => i - 1);
  }

  /* ----- per-step content ----- */
  let heading: ReactNode;
  let body: ReactNode = null;

  switch (step) {
    case "email":
      heading = (
        <Heading
          title="Enter your email address"
          subtitle={
            error ? (
              <>
                <span className="text-red-500">{error}</span>{" "}
                <TextLink onClick={onSwitch}>Log in</TextLink>
              </>
            ) : (
              <>
                Sign up or <TextLink onClick={onSwitch}>log in</TextLink>
              </>
            )
          }
        />
      );
      body = (
        <Field
          autoFocus
          type="email"
          autoComplete="email"
          placeholder="Enter your email address"
          value={data.email}
          onChange={(e) => set("email", e.target.value)}
        />
      );
      break;

    case "password":
      heading = (
        <Heading title="Choose a password" subtitle="Use at least 8 characters" />
      );
      body = (
        <PasswordField
          autoFocus
          autoComplete="new-password"
          placeholder="Password"
          value={data.password}
          onChange={(e) => set("password", e.target.value)}
        />
      );
      break;

    case "name":
      heading = (
        <Heading
          title="Enter your full name"
          subtitle="This will be shown on your profile"
        />
      );
      body = (
        <Field
          autoFocus
          type="text"
          autoComplete="name"
          placeholder="Name"
          value={data.name}
          onChange={(e) => set("name", e.target.value)}
        />
      );
      break;

    case "age":
      heading = (
        <Heading title="Enter your age" subtitle="It won't be displayed." />
      );
      body = (
        <Field
          autoFocus
          type="text"
          inputMode="numeric"
          maxLength={3}
          placeholder="Age"
          value={data.age}
          onChange={(e) => set("age", e.target.value.replace(/\D/g, ""))}
        />
      );
      break;

    case "gender":
      heading = (
        <Heading
          title="Select your gender"
          subtitle="We use this to tailor your feed. It won't be displayed."
        />
      );
      break;

    case "username":
      heading = (
        <Heading
          title="Choose a username"
          subtitle={
            error ? (
              <span className="text-red-500">{error}</span>
            ) : (
              <span className="text-neutral-500">
                This is how people will find you
              </span>
            )
          }
        />
      );
      body = (
        <div className="relative">
          <span className="pointer-events-none absolute left-6 top-1/2 -translate-y-1/2 text-[17px] text-neutral-400">
            @
          </span>
          <Field
            autoFocus
            type="text"
            autoComplete="username"
            autoCapitalize="none"
            spellCheck={false}
            className="pl-11"
            value={data.username}
            onChange={(e) =>
              set(
                "username",
                e.target.value.toLowerCase().replace(/[^a-z0-9_.]/g, "").slice(0, 20)
              )
            }
          />
        </div>
      );
      break;
  }

  return (
    <AuthShell
      onClose={onClose}
      onBack={index > 0 ? goBack : undefined}
      logo={<LogoDots filled={index + 1} total={7} />}
    >
      <form key={step} onSubmit={handleSubmit} className="flex flex-col gap-6">
        {heading}

        {step === "gender" ? (
          <div className="grid grid-cols-2 gap-3">
            {GENDERS.map((g) => (
              <ChoiceButton key={g} onClick={() => chooseGender(g)}>
                {g}
              </ChoiceButton>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {body}
            <PrimaryButton disabled={!canSubmit}>Next</PrimaryButton>
          </div>
        )}

        {terms}
      </form>
    </AuthShell>
  );
}