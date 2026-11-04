"use client";

import Image from "next/image";
import { useAuth } from "../auth/AuthProvider";
import UserNavbar from "./UserNavbar";
import Link from "next/link";

export default function Navbar() {
  const { openAuth, user, status } = useAuth();

  if (status === "loading") {
    return (
      <header className="sticky top-0 z-50 bg-[#f6f5f3]/90 backdrop-blur">
        <div className="h-22.5" />
      </header>
    );
  }

  if (status === "authenticated" && user) {
    return <UserNavbar user={user} />;
  }

  return (
    <header className="sticky top-0 z-50 bg-[#f6f5f3]/90 backdrop-blur">
      <nav className="relative flex h-22.5 items-center justify-between px-9">
        {/* Left: logo + about */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center">
            <Image src="/icon.svg" alt="Cosmos logo" width={40} height={40} priority />
          </Link>

          <button
            type="button"
            className="text-[15px] tracking-tight font-semibold text-text-gray transition-colors hover:text-background-hover"
          >
            Explore
          </button>
          
          <button
            type="button"
            className="text-[15px] tracking-tight font-semibold text-text-gray transition-colors hover:text-background-hover"
          >
            About
          </button>
        </div>

        {/* Center: wordmark */}
        <span className="absolute left-1/2 -translate-x-1/2 text-[22px] font-bold tracking-tight">
          HAKYE-HUB
        </span>

        {/* Right: login + signup (hidden while the session is being restored) */}
        <div className="flex items-center gap-7">
          <button
            type="button"
            onClick={() => openAuth("login")}
            className="text-[15px] tracking-tight font-semibold text-text-gray transition-colors hover:text-background-hover"
          >
            Log in
          </button>
          <button
            type="button"
            onClick={() => openAuth("signup")}
            className="h-12 rounded-full bg-[#111] px-6 text-[15px] tracking-tight font-semibold text-white transition-colors hover:bg-neutral-800"
          >
            Sign up
          </button>
        </div>
      </nav>
    </header>
  );
}