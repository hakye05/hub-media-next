"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../auth/AuthProvider";
import NavHeader from "./NavHeader";
import NavSearch from "./NavSearch";
import NavTextButton from "./NavTextButton";
import UserNavbar from "./UserNavbar";

export default function Navbar() {
  const { openAuth, user, status } = useAuth();
  const pathname = usePathname();

  if (status === "loading") {
    return <NavHeader />;
  }

  if (status === "authenticated" && user) {
    return <UserNavbar user={user} />;
  }

  // On /search the search field takes the middle logo's place, so guests get the same bar users do
  const onSearch = pathname === "/search";

  return (
    <NavHeader
      className={
        onSearch
          ? "grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-6"
          : "relative flex items-center justify-between"
      }
    >
      {/* Left: logo + about */}
      <div className="flex items-center gap-6">
        <Link href="/" className="flex items-center">
          <Image src="/icon.svg" alt="Cosmos logo" width={40} height={40} priority />
        </Link>

        <NavTextButton>Explore</NavTextButton>
        <NavTextButton>About</NavTextButton>
      </div>

      {/* Center: search field on /search, wordmark elsewhere */}
      {onSearch ? (
        <NavSearch />
      ) : (
        <span className="absolute left-1/2 -translate-x-1/2 text-[22px] font-bold tracking-tight">
          HAKYE-HUB
        </span>
      )}

      {/* Right: login + signup */}
      <div className="flex items-center gap-7">
        <NavTextButton onClick={() => openAuth("login")}>Log in</NavTextButton>
        <button
          type="button"
          onClick={() => openAuth("signup")}
          className="h-12 rounded-full bg-[#111] px-6 text-[15px] tracking-tight font-semibold text-white transition-colors hover:bg-neutral-800"
        >
          Sign up
        </button>
      </div>
    </NavHeader>
  );
}