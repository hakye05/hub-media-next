"use client";

import type { ReactNode } from "react";
import { AuthShell } from "./AuthShell";
import { ChoiceButton, PrimaryButton } from "../ui/Button";
import { Field } from "../ui/fields/Field";
import { Heading } from "../ui/Heading";
import { LogoDots } from "../ui/LogoDots";
import { PasswordField } from "../ui/fields/PasswordField";
import { TextLink } from "../ui/TextLink";
import { GENDER_OPTIONS } from "@/lib/gender";
import { useSignUpWizard } from "./useSignUpWizard";

const terms = (
  <p className="text-center text-[12px] leading-relaxed text-neutral-500">
    By creating an account, you agree to our
    <br />
    <span className="underline">Terms of Service</span> and{" "}
    <span className="underline">Privacy Policy</span>
  </p>
);

export default function SignUpFlow({
  onClose,
  onSwitch,
}: {
  onClose: () => void;
  onSwitch: () => void;
}) {
  const {
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
  } = useSignUpWizard(onClose);

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
      heading = <Heading title="Choose a password" subtitle="Use at least 8 characters" />;
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
        <Heading title="Enter your full name" subtitle="This will be shown on your profile" />
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
      heading = <Heading title="Enter your age" subtitle="It won't be displayed." />;
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
              <span className="text-neutral-500">This is how people will find you</span>
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
            onChange={(e) => setUsername(e.target.value)}
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
            {GENDER_OPTIONS.map((g) => (
              <ChoiceButton key={g.value} onClick={() => chooseGender(g.value)}>
                {g.label}
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