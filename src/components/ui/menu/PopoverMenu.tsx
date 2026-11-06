"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

type Props = { anchor: DOMRect; onClose: () => void; children: ReactNode };

const GAP = 8;
const MARGIN = 8;

export default function PopoverMenu({ anchor, onClose, children }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const { width, height } = el.getBoundingClientRect();
    const below = anchor.bottom + GAP;
    const top =
      below + height + MARGIN > window.innerHeight ? anchor.top - GAP - height : below;
    const left = Math.min(anchor.right - width, window.innerWidth - width - MARGIN);
    setPos({ top: Math.max(MARGIN, top), left: Math.max(MARGIN, left) });
  }, [anchor]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onClose);
    window.addEventListener("scroll", onClose, true);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onClose);
      window.removeEventListener("scroll", onClose, true);
    };
  }, [onClose]);

  return createPortal(
    <>
      {/* Transparent backdrop: outside click closes, and clicking the trigger can't instantly reopen */}
      <div className="fixed inset-0 z-100" onMouseDown={onClose} />
      <div
        ref={ref}
        role="menu"
        style={{
          top: pos?.top ?? 0,
          left: pos?.left ?? 0,
          visibility: pos ? "visible" : "hidden",
        }}
        className="fixed z-101 w-62.5 rounded-3xl border border-neutral-200/70 bg-[#fcfbfa] p-2 shadow-xl"
      >
        {children}
      </div>
    </>,
    document.body
  );
}