import Link from "next/link";
import { PROFILE_TABS, tabHref } from "./tabs";

type Props = { username: string; activeSegment: string | null };

export default function ProfileTabs({ username, activeSegment }: Props) {
  return (
    <nav
      aria-label="Profile sections"
      className="inline-flex rounded-full border border-neutral-300/70 p-1"
    >
      {PROFILE_TABS.map(({ label, segment }) => {
        const active = segment === activeSegment;
        return (
          <Link
            key={label}
            href={tabHref(username, segment)}
            scroll={false}
            aria-current={active ? "page" : undefined}
            className={`inline-flex h-10 items-center rounded-full px-5 text-[15px] font-semibold tracking-tight transition-colors ${
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