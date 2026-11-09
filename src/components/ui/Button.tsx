import type { ButtonHTMLAttributes } from "react";

const VARIANTS = {
  primary:
    "h-12 sm:h-16 w-full rounded-full bg-[#111] text-[15px] font-semibold text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-400 disabled:hover:bg-neutral-100",
  choice:
    "h-12 sm:h-16 w-full rounded-full border border-neutral-200 bg-white text-[15px] font-semibold text-neutral-900 transition-colors hover:bg-neutral-50",
  toolbar:
    "inline-flex h-10 sm:h-12 items-center gap-2 rounded-full border border-neutral-300/70 bg-white px-4 sm:px-5 text-[15px] font-semibold tracking-tight text-neutral-900 transition-colors hover:bg-neutral-50",
  solid:
    "inline-flex h-10 sm:h-12 items-center justify-center rounded-full bg-[#111] px-5 sm:px-7 text-[15px] font-semibold tracking-tight text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-400 disabled:hover:bg-neutral-100",
  iconToolbar:
    "inline-flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-full border border-neutral-300/70 bg-white text-neutral-900 transition-colors hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-50",
  iconSolid:
    "inline-flex shrink-0 items-center justify-center rounded-full bg-[#111] text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50",
  iconDanger:
    "inline-flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-full bg-red-600 text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50",
  smallSolid:
    "inline-flex h-9 shrink-0 items-center justify-center rounded-full bg-[#111] px-4 pb-px text-[14px] font-semibold leading-none tracking-tight text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50",
  outlineSmall:
    "inline-flex h-10 sm:h-12 shrink-0 items-center justify-center rounded-full border border-neutral-300/70 bg-white px-4 sm:px-5 pb-px text-[14px] font-semibold leading-none tracking-tight text-neutral-900 transition-colors hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50",
  danger:
    "inline-flex h-10 sm:h-12 items-center justify-center rounded-full bg-red-600 px-5 sm:px-7 text-[15px] font-semibold tracking-tight text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50",
} as const;

const ICON_SOLID_SIZE = { md: "h-10 w-10 sm:h-12 sm:w-12", sm: "h-9 w-9" };

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant: keyof typeof VARIANTS;
};

export function Button({ variant, type = "button", className = "", ...props }: ButtonProps) {
  return <button type={type} {...props} className={`${VARIANTS[variant]} ${className}`} />;
}

export function PrimaryButton(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <Button variant="primary" type="submit" {...props} />;
}

export function ChoiceButton(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <Button variant="choice" {...props} />;
}

export function ToolbarButton(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <Button variant="toolbar" {...props} />;
}

export function SolidButton(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <Button variant="solid" type="submit" {...props} />;
}

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { label: string };

export function IconToolbarButton({ label, ...props }: IconButtonProps) {
  return <Button variant="iconToolbar" aria-label={label} title={label} {...props} />;
}

export function IconSolidButton({
  label,
  size = "md",
  className = "",
  ...props
}: IconButtonProps & { size?: "md" | "sm" }) {
  return (
    <Button
      variant="iconSolid"
      aria-label={label}
      title={label}
      className={`${ICON_SOLID_SIZE[size]} ${className}`}
      {...props}
    />
  );
}

export function IconDangerButton({ label, ...props }: IconButtonProps) {
  return <Button variant="iconDanger" aria-label={label} title={label} {...props} />;
}

export function SmallSolidButton(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <Button variant="smallSolid" {...props} />;
}

export function OutlineSmallButton(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <Button variant="outlineSmall" {...props} />;
}

export function DangerButton(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <Button variant="danger" type="submit" {...props} />;
}