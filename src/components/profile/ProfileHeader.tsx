import type { PublicProfile } from "@/lib/users";
import Avatar from "../ui/Avatar";
import ExpandableBio from "./ExpandableBio";

const compact = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});

export default function ProfileHeader({ profile }: { profile: PublicProfile }) {
  return (
    <header className="flex flex-col">
      {/* Banner: default gradient until the user uploads their own image */}
      <div
        className="h-48 w-full bg-linear-to-r from-sky-200 via-fuchsia-200 to-amber-200 bg-cover bg-center sm:h-56"
        style={
          profile.bannerUrl
            ? { backgroundImage: `url("${profile.bannerUrl}")` }
            : undefined
        }
      />

      <div className="px-13 sm:px-17">
        <Avatar
          name={profile.displayName}
          src={profile.avatarUrl}
          className="-mt-14 h-28 w-28 shrink-0 ring-4 ring-[#f6f5f3]"
          textClassName="text-4xl"
        />
      </div>

      <div className="mt-4 flex max-w-xl flex-col gap-1 px-13 sm:px-17">
        <h1 className="wrap-break-word text-3xl font-bold tracking-tight">
          {profile.displayName}
        </h1>
        <p className="text-[15px] text-neutral-500">@{profile.username}</p>

        {profile.bio && <ExpandableBio key={profile.id} text={profile.bio} />}

        <p className="mt-1 text-[14px] font-semibold text-neutral-900">
          {compact.format(profile.followerCount)} followers ·{" "}
          {compact.format(profile.followingCount)} following
        </p>
      </div>
    </header>
  );
}