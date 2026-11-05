import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean };

export default function NavTextButton({ active = false, ...props }: Props) {
  return (
    <button
      type="button"
      {...props}
      className={`text-[15px] tracking-tight font-semibold transition-colors ${
        active
          ? "text-neutral-900"
          : "text-text-gray hover:text-background-hover"
      }`}
    />
  );
}