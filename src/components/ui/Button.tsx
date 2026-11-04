import type { ButtonHTMLAttributes } from "react";

export function PrimaryButton({
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="submit"
      {...props}
      className={`h-16 w-full rounded-full bg-[#111] text-[15px] font-semibold text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-400 disabled:hover:bg-neutral-100 ${className}`}
    />
  );
}

export function ChoiceButton({
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      {...props}
      className={`h-16 w-full rounded-full border border-neutral-200 bg-white text-[15px] font-semibold text-neutral-900 transition-colors hover:bg-neutral-50 ${className}`}
    />
  );
}

export function ToolbarButton({
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      {...props}
      className={`inline-flex h-12 items-center gap-2 rounded-full border border-neutral-300/70 bg-white px-5 text-[15px] font-semibold tracking-tight text-neutral-900 transition-colors hover:bg-neutral-50 ${className}`}
    />
  );
}

export function SolidButton({
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="submit"
      {...props}
      className={`inline-flex h-12 items-center justify-center rounded-full bg-[#111] px-7 text-[15px] font-semibold tracking-tight text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-400 disabled:hover:bg-neutral-100 ${className}`}
    />
  );
}