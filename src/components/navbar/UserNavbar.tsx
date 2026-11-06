"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { SessionUser } from "../auth/AuthProvider";
import NavHeader from "./NavHeader";
import NavSearch from "./NavSearch";
import NavTextButton from "./NavTextButton";
import UserMenu from "./UserMenu";
import CreatePostButton from "./CreatePostButton";

const TABS = ["For You", "Following", "Explore"] as const;

export default function UserNavbar({ user }: { user: SessionUser }) {
  const [active, setActive] = useState<(typeof TABS)[number]>("For You");

  return (
    <NavHeader className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-6">
      {/* Left: logo + tabs */}
      <div className="flex items-center gap-6">
        <Link href="/" className="flex items-center">
          <Image src="/icon.svg" alt="Cosmos logo" width={40} height={40} priority />
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {TABS.map((tab) => (
            <NavTextButton
              key={tab}
              active={active === tab}
              onClick={() => setActive(tab)}
            >
              {tab}
            </NavTextButton>
          ))}
        </div>
      </div>

      {/* Center: search */}
      <NavSearch />

      {/* Right: create + profile */}
      <div className="flex items-center justify-end gap-3">
        <CreatePostButton />
        <UserMenu user={user} />
      </div>
    </NavHeader>
  );
}