"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../auth/AuthProvider";
import { useAuthModal } from "../auth/AuthModalProvider";
import NavHeader from "./NavHeader";
import NavSearch from "./NavSearch";
import NavTextButton from "./NavTextButton";
import UserNavbar from "./UserNavbar";

export default function Navbar() {
  const { user, status } = useAuth();
  const { openAuth } = useAuthModal()
  const pathname = usePathname();

  if (status === "loading") {
    return <NavHeader />;
  }

  if (status === "authenticated" && user) {
    return <UserNavbar user={user} />;
  }

  const onLanding = pathname === "/";

  return (
    <NavHeader
      className={
        onLanding
          ? "relative flex items-center justify-between"
          : "grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 sm:gap-6"
      }
    >
      {/* Left: logo */}
      <Link href="/" className="flex items-center">
        <Image
          src="/icon.svg"
          alt="Cosmos logo"
          width={40}
          height={40}
          priority
          className="h-9 w-9 sm:h-10 sm:w-10"
        />
      </Link>

      {/* Center: wordmark on the landing page (desktop only), search field elsewhere */}
      {onLanding ? (
        <Link
          href="/"
          className="absolute left-1/2 hidden -translate-x-1/2 text-[22px] font-bold tracking-tight md:block"
        >
          HAKYE-HUB
        </Link>
      ) : (
        <NavSearch />
      )}

      {/* Right: login + signup */}
      <div className="flex items-center gap-4 sm:gap-7">
        <NavTextButton onClick={() => openAuth("login")}>Log in</NavTextButton>
        <button
          type="button"
          onClick={() => openAuth("signup")}
          className="h-10 rounded-full bg-[#111] px-4 pb-px text-[14px] sm:h-12 sm:px-6 sm:text-[15px] tracking-tight font-semibold text-white transition-colors hover:bg-neutral-800"
        >
          Sign up
        </button>
      </div>
    </NavHeader>
  );
}