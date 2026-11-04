"use client";

import { useState } from "react";
import Image from "next/image";
import type { User } from "@/lib/api";
import NavSearch from "./NavSearch";
import UserMenu from "./UserMenu";
import Link from "next/link";
import PlusIcon from "../icons/PlusIcon";

const TABS = ["For You", "Following", "Explore"] as const;

export default function UserNavbar({ user }: { user: User }) {
  const [active, setActive] = useState<(typeof TABS)[number]>("For You");

  return (
    <header className="sticky top-0 z-50 bg-[#f6f5f3]/90 backdrop-blur">
      <nav className="grid h-22.5 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-6 px-9">
        {/* Left: logo + tabs */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center">
            <Image src="/icon.svg" alt="Cosmos logo" width={40} height={40} priority />
          </Link>

          <div className="hidden items-center gap-6 md:flex">
            {TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActive(tab)}
                className={`text-[15px] tracking-tight font-semibold transition-colors ${active === tab
                    ? "text-neutral-900"
                    : "text-text-gray hover:text-background-hover"
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Center: search */}
        <NavSearch />

        {/* Right: create + profile */}
        <div className="flex items-center justify-end gap-3">
          <Link
            href="/create"
            className="inline-flex h-12 items-center gap-2 rounded-full border border-neutral-300/70 bg-white px-5 text-[15px] font-semibold tracking-tight text-neutral-900 transition-colors hover:bg-neutral-50"
          >
            <PlusIcon />
            Create
          </Link>
          <UserMenu user={user} />
        </div>
      </nav>
    </header>
  );
}