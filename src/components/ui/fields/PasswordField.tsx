"use client";

import { useState } from "react";
import type { InputHTMLAttributes } from "react";
import { Field, SoftField } from "./Field";

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
        {visible ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M23 12.1738C23 12.1738 18.7443 4.43891 11.948 4.39243C5.1516 4.34596 0.999923 12.1737 0.999923 12.1737" strokeWidth="1.6" strokeLinecap="round" stroke="currentColor" />
            <circle cx="12" cy="13" r="5" fill="currentColor" />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_56_7607)">
              <path d="M7.67842 18.4168C6.20588 17.5924 4.98312 16.4986 4.09134 15.5567C3.04148 14.4479 2.45033 13.5497 2.45033 13.5497M4.09134 15.5567L1.82401 17.824M20.2013 15.5783C19.3385 16.5068 18.1346 17.6032 16.6671 18.4288C15.3483 19.1708 13.8166 19.6941 12.1283 19.6803C10.4863 19.6669 8.98417 19.1478 7.67842 18.4168M12.1283 19.6803L12.1317 22.2573M7.67842 18.4168L6.00943 20.9948M16.6671 18.4288L18.1348 21.0111M20.2013 15.5783C21.1688 14.5372 21.7072 13.7072 21.7072 13.7072M20.2013 15.5783L22.3115 17.6885" strokeWidth="1.6" strokeLinecap="round" stroke="currentColor" />
            </g>
            <defs>
              <clipPath id="clip0_56_7607">
                <rect width="24" height="24" fill="currentColor" />
              </clipPath>
            </defs>
          </svg>
        )}
      </button>
    </div>
  );
}