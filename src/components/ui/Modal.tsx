"use client";

import { useEffect, type ReactNode } from "react";

type Props = {
  label: string;
  onClose: () => void;
  className?: string;
  children: ReactNode;
};

export default function Modal({ label, onClose, className = "max-w-135", children }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={label}
        className={`max-h-[90vh] w-full overflow-hidden rounded-4xl bg-white shadow-2xl ${className}`}
      >
        {children}
      </div>
    </div>
  );
}