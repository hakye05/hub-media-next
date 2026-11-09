import Link from "next/link";
import { PROFILE_TABS, tabHref } from "./tabs";

type Props = { username: string; activeSegment: string | null; isSelf: boolean };

export default function ProfileTabs({ username, activeSegment, isSelf }: Props) {
  const tabs = PROFILE_TABS.filter((t) => !("ownerOnly" in t && t.ownerOnly) || isSelf);

  return (
    <nav
      aria-label="Profile sections"
      className="flex w-full rounded-full border border-neutral-300/70 p-1 md:inline-flex md:w-auto"
    >
      {tabs.map(({ label, segment }) => {
        const active = segment === activeSegment;
        return (
          <Link
            key={label}
            href={tabHref(username, segment)}
            scroll={false}
            aria-current={active ? "page" : undefined}
            className={`inline-flex h-10 flex-1 items-center justify-center rounded-full px-2 md:flex-none md:px-5 text-[15px] font-semibold tracking-tight transition-colors ${
              active
                ? "bg-neutral-200/70 text-neutral-900"
                : "text-neutral-500 hover:text-neutral-900"
            }`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}