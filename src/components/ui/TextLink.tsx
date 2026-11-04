import type { ButtonHTMLAttributes } from "react";

export function TextLink({
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      {...props}
      className="font-medium text-neutral-900 hover:underline"
    >
      {children}
    </button>
  );
}