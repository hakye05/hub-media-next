import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

export function Field({
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`h-12 sm:h-16 w-full rounded-full border border-neutral-200 bg-white px-5 sm:px-6 text-[16px] sm:text-[17px] text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none ${className}`}
    />
  );
}

export function SoftField({
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`h-14 w-full rounded-2xl border border-neutral-200 bg-[#faf9f8] px-5 text-[16px] text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus:bg-white focus:outline-none ${className}`}
    />
  );
}

export function SoftTextArea({
  className = "",
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`w-full resize-none rounded-2xl border border-neutral-200 bg-[#faf9f8] px-5 py-3.5 text-[16px] text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus:bg-white focus:outline-none ${className}`}
    />
  );
}