import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean };

export default function NavTextButton({ active = false, ...props }: Props) {
  return (
    <button
      type="button"
      {...props}
      className={`pb-px text-[14px] sm:text-[15px] tracking-tight font-semibold transition-colors ${
        active
          ? "text-neutral-900"
          : "text-text-gray hover:text-background-hover"
      }`}
    />
  );
}