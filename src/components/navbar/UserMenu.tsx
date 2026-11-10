"use client";

import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import type { SessionUser } from "../auth/AuthProvider";
import { useAuth } from "../auth/AuthProvider";
import Avatar from "../ui/Avatar";
import ChevronDownIcon from "../icons/ChevronDownIcon";
import { useDismissable } from "../ui/useDismissable";

export default function UserMenu({ user, onCreate }: { user: SessionUser; onCreate: () => void }) {
  const { logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);
 
  useDismissable(ref, open, close);

  return (
    <div ref={ref} className="relative flex items-center gap-1">
      {/* Profile: navigation */}
      <Link
        href={`/${user.username}/collections`}
        aria-label="Go to profile"
        className="rounded-full transition-opacity hover:opacity-80"
      >
        <Avatar
          name={user.displayName}
          src={user.avatarUrl}
          className="h-9 w-9 sm:h-11 sm:w-11"
          textClassName="text-[15px]"
        />
      </Link>

      {/* Dropdown toggle */}
      <button
        type="button"
        aria-label="Account menu"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-black/5 hover:text-neutral-900 sm:h-9 sm:w-9"
      >
        <ChevronDownIcon className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full mt-3 w-56 rounded-xl sm:w-72 border border-neutral-200 bg-white p-3 shadow-xl"
        >
          <div className="flex items-center gap-3 px-3 py-3">
            <Avatar
              name={user.displayName}
              src={user.avatarUrl}
              className="h-10 w-10 shrink-0 sm:h-12 sm:w-12"
              textClassName="text-[16px]"
            />
            <div className="min-w-0">
              <p className="truncate text-[14px] font-semibold text-neutral-900 sm:text-[16px]">
                {user.displayName}
              </p>
              <p className="truncate text-[12px] text-neutral-500 sm:text-[14px]">
                @{user.username}
              </p>
            </div>
          </div>

          <div className="my-2 h-px bg-neutral-200" />

          {/* Only shown when the navbar's Following tab is hidden (below md) */}
          <Link
            href="/following"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="block w-full rounded-lg px-3 py-2.5 text-left text-[14px] font-medium text-neutral-800 transition-colors hover:bg-neutral-100 sm:py-3 sm:text-[16px] md:hidden"
          >
            Following
          </Link>

          {/* Only shown when the navbar's Create button is hidden (below md) */}
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              onCreate();
            }}
            className="w-full rounded-lg px-3 py-2.5 text-left text-[14px] font-medium text-neutral-800 transition-colors hover:bg-neutral-100 sm:py-3 sm:text-[16px] md:hidden"
          >
            Create
          </button>

          <button
            type="button"
            role="menuitem"
            onClick={async () => {
              setOpen(false);
              await logout();
            }}
            className="w-full rounded-lg px-3 py-2.5 text-left text-[14px] font-medium text-neutral-800 transition-colors hover:bg-neutral-100 sm:py-3 sm:text-[16px]"
          >
            Log out
          </button>
        </div>
      )}
    </div>
  );
}