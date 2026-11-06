"use client";

import { useCallback, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { SessionUser } from "../auth/AuthProvider";
import NavHeader from "./NavHeader";
import NavSearch from "./NavSearch";
import NavTextButton from "./NavTextButton";
import UserMenu from "./UserMenu";
import CreatePostButton from "./CreatePostButton";
import CreatePostModal from "../posts/create/CreatePostModal";

const TABS = [
  { label: "For You", href: "/" },
  { label: "Following", href: "/following" },
  { label: "Explore", href: null },
] as const;

export default function UserNavbar({ user }: { user: SessionUser }) {
  const pathname = usePathname();
  const router = useRouter();
  const [creating, setCreating] = useState(false);
  const openCreate = useCallback(() => setCreating(true), []);
  const closeCreate = useCallback(() => setCreating(false), []);

  return (
    <NavHeader className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-6">
      <div className="flex items-center gap-6">
        <Link href="/" className="flex items-center">
          <Image src="/icon.svg" alt="Cosmos logo" width={40} height={40} priority />
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {TABS.map((tab) => (
            <NavTextButton
              key={tab.label}
              active={tab.href !== null && pathname === tab.href}
              onClick={() => tab.href && router.push(tab.href)}
            >
              {tab.label}
            </NavTextButton>
          ))}
        </div>
      </div>

      <NavSearch />

      <div className="flex items-center justify-end gap-3">
        {/* Below md the Create action lives in the account dropdown */}
        <div className="hidden md:block">
          <CreatePostButton onClick={openCreate} />
        </div>
        <UserMenu user={user} onCreate={openCreate} />
      </div>

      {/* The navbar's backdrop-blur would trap a fixed modal, so render it on <body> */}
      {creating && createPortal(<CreatePostModal onClose={closeCreate} />, document.body)}
    </NavHeader>
  );
}