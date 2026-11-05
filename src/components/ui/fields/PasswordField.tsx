"use client";

import { useState } from "react";
import type { InputHTMLAttributes } from "react";
import { Field, SoftField } from "./Field";
import EyeIcon from "../../icons/EyeIcon";
import EyeOffIcon from "../../icons/EyeOffIcon";

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  variant?: "pill" | "soft";
};

export function PasswordField({ variant = "pill", ...props }: Props) {
  const [visible, setVisible] = useState(false);
  const Input = variant === "soft" ? SoftField : Field;

  return (
    <div className="relative">
      <Input {...props} type={visible ? "text" : "password"} className="pr-14 [&::-ms-reveal]:hidden" />
      <button
        type="button"
        aria-label={visible ? "Hide password" : "Show password"}
        onClick={() => setVisible((v) => !v)}
        className="absolute right-5 top-1/2 -translate-y-1/2 text-neutral-500 transition-colors hover:text-neutral-900 cursor-pointer"
      >
        {visible ? <EyeIcon /> : <EyeOffIcon />}
      </button>
    </div>
  );
}