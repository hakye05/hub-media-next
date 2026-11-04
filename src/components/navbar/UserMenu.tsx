"use client";

import { useEffect, useRef, useState } from "react";
import type { User } from "@/lib/api";
import { useAuth } from "../auth/AuthProvider";
import Link from "next/link";

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase() || "?";
}

export default function UserMenu({ user }: { user: User }) {
  const { logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const avatar = (size: string, text: string) => (
    <span
      className={`flex ${size} items-center justify-center rounded-full bg-linear-to-br from-rose-200 via-fuchsia-200 to-purple-300 ${text} font-semibold text-neutral-800`}
    >
      {initials(user.displayName)}
    </span>
  );

  return (
    <div ref={ref} className="relative flex items-center gap-1">
      {/* Profile: navigation */}
      <Link
        href={`/${user.username}/collections`}
        aria-label="Go to profile"
        className="rounded-full transition-opacity hover:opacity-80"
      >
        {avatar("h-11 w-11", "text-[15px]")}
      </Link>

      {/* Dropdown toggle */}
      <button
        type="button"
        aria-label="Account menu"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex h-9 w-9 items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-black/5 hover:text-neutral-900"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full mt-3 w-72 rounded-3xl border border-neutral-200 bg-white p-3 shadow-xl"
        >
          <div className="flex items-center gap-3 px-3 py-3">
            {avatar("h-12 w-12 shrink-0", "text-[16px]")}
            <div className="min-w-0">
              <p className="truncate text-[16px] font-semibold text-neutral-900">
                {user.displayName}
              </p>
              <p className="truncate text-[14px] text-neutral-500">
                @{user.username}
              </p>
            </div>
          </div>

          <div className="my-2 h-px bg-neutral-200" />

          <button
            type="button"
            role="menuitem"
            onClick={async () => {
              setOpen(false);
              await logout();
            }}
            className="w-full rounded-2xl px-3 py-3 text-left text-[16px] font-medium text-neutral-800 transition-colors hover:bg-neutral-100"
          >
            Log out
          </button>
        </div>
      )}
    </div>
  );
}