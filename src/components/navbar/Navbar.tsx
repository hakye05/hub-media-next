"use client";

import Image from "next/image";
import Link from "next/link";
import { useAuth } from "../auth/AuthProvider";
import NavHeader from "./NavHeader";
import NavTextButton from "./NavTextButton";
import UserNavbar from "./UserNavbar";

export default function Navbar() {
  const { openAuth, user, status } = useAuth();

  if (status === "loading") {
    return <NavHeader />;
  }

  if (status === "authenticated" && user) {
    return <UserNavbar user={user} />;
  }

  return (
    <NavHeader className="relative flex items-center justify-between">
      {/* Left: logo + about */}
      <div className="flex items-center gap-6">
        <Link href="/" className="flex items-center">
          <Image src="/icon.svg" alt="Cosmos logo" width={40} height={40} priority />
        </Link>

        <NavTextButton>Explore</NavTextButton>
        <NavTextButton>About</NavTextButton>
      </div>

      {/* Center: wordmark */}
      <span className="absolute left-1/2 -translate-x-1/2 text-[22px] font-bold tracking-tight">
        HAKYE-HUB
      </span>

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