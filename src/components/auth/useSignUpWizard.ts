"use client";

import { useState, type SyntheticEvent } from "react";
import { authApi } from "@/lib/authApi";
import { getErrorMessage } from "@/lib/errors";
import { EMAIL_RE, sanitizeUsername, usernameMessage, usernameRegex } from "@/lib/validation";
import { useAuth } from "./AuthProvider";

export type SignUpStep = "email" | "password" | "name" | "age" | "gender" | "username";

export const SIGN_UP_STEPS: SignUpStep[] = [
  "email",
  "password",
  "name",
  "age",
  "gender",
  "username",
];

const MIN_AGE = 13;
const MAX_AGE = 120;
const USERNAME_MAX = 20;
const USERNAME_RE = usernameRegex(USERNAME_MAX);

type Data = {
  email: string;
  password: string;
  name: string;
  age: string;
  gender: string;
  username: string;
};

/** Wizard state, per-step validation and the async submit handlers for SignUpFlow. */
export function useSignUpWizard(onComplete: () => void) {
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

  const step = SIGN_UP_STEPS[index];

  const set = <K extends keyof Data>(key: K, value: Data[K]) => {
    setData((d) => ({ ...d, [key]: value }));
    setError(null);
  };

  const ageNum = Number(data.age);
  const valid: Record<SignUpStep, boolean> = {
    email: EMAIL_RE.test(data.email.trim()),
    password: data.password.length >= 8,
    name: data.name.trim().length > 0,
    age: data.age !== "" && ageNum >= MIN_AGE && ageNum <= MAX_AGE,
    gender: data.gender !== "",
    username: USERNAME_RE.test(data.username),
  };

  // The username button stays clickable (once something is typed) so an invalid
  // username can show its red message on click instead of while typing.
  const canSubmit = !busy && (step === "username" ? data.username !== "" : valid[step]);

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
      setError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  async function submitUsername() {
    if (!valid.username) {
      setError(usernameMessage(USERNAME_MAX));
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
        gender: data.gender,
      });
      onComplete();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    if (step === "username") return void submitUsername();
    if (!valid[step]) return;
    if (step === "email") return void submitEmail();
    advance();
  }

  function chooseGender(value: string) {
    set("gender", value);
    advance();
  }

  function goBack() {
    setError(null);
    setIndex((i) => i - 1);
  }

  function setUsername(value: string) {
    set("username", sanitizeUsername(value, USERNAME_MAX));
  }

  return {
    index,
    step,
    data,
    set,
    setUsername,
    error,
    canSubmit,
    handleSubmit,
    chooseGender,
    goBack,
  };
}