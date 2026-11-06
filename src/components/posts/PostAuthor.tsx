import Link from "next/link";
import type { ProfileSummary } from "@/lib/users";
import Avatar from "../ui/Avatar";

export default function PostAuthor({ author }: { author: ProfileSummary }) {
  return (
    <Link
      href={`/${author.username}`}
      className="flex items-center gap-3 transition-opacity hover:opacity-80"
    >
      <Avatar
        name={author.displayName}
        src={author.avatarUrl}
        className="h-12 w-12 shrink-0"
        textClassName="text-[16px]"
      />
      <div className="min-w-0">
        <p className="truncate text-[16px] font-semibold text-neutral-900">
          {author.displayName}
        </p>
        <p className="truncate text-[14px] text-neutral-500">@{author.username}</p>
      </div>
    </Link>
  );
}