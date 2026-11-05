import type { ReactNode } from "react";

type Props = { error?: boolean; children: ReactNode };

export default function Centered({ error = false, children }: Props) {
  return (
    <div
      className={`flex flex-1 items-center justify-center px-8 text-[15px] ${
        error ? "text-red-500" : "text-neutral-500"
      }`}
    >
      {children}
    </div>
  );
}