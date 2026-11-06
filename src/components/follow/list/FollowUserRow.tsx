import Link from "next/link";
import Avatar from "@/components/ui/Avatar";
import type { ProfileSummary } from "@/lib/users";
import FollowButton from "../FollowButton";

export default function FollowUserRow({ user }: { user: ProfileSummary }) {
  return (
    <li className="flex items-center gap-3 py-2">
      <Link href={`/${user.username}`} className="flex min-w-0 flex-1 items-center gap-3">
        <Avatar
          name={user.displayName}
          src={user.avatarUrl}
          className="h-11 w-11 shrink-0"
          textClassName="text-[15px]"
        />
        <div className="min-w-0">
          <p className="truncate text-[15px] font-semibold text-neutral-900">{user.displayName}</p>
          <p className="truncate text-[13px] text-neutral-500">@{user.username}</p>
        </div>
      </Link>
      <FollowButton key={user.id} username={user.username} isFollowing={user.isFollowing} />
    </li>
  );
}