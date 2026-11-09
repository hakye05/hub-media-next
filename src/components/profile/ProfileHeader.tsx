import type { PublicProfile } from "@/lib/users";
import Avatar from "../ui/Avatar";
import ExpandableBio from "./ExpandableBio";
import ProfileBanner from "./banner/ProfileBanner";
import ProfileFollowSection from "./ProfileFollowSection";

const compact = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});

type Props = {
  profile: PublicProfile;
  onBannerChanged: () => void;
};

export default function ProfileHeader({ profile, onBannerChanged }: Props) {
  return (
    <header className="flex flex-col">
      {/* Banner: default gradient until the user uploads their own image */}
      <ProfileBanner
        bannerUrl={profile.bannerUrl ?? null}
        isSelf={profile.isSelf}
        onChanged={onBannerChanged}
      />

      <div className="relative z-10 px-4 sm:px-17">
        <Avatar
          name={profile.displayName}
          src={profile.avatarUrl}
          className="-mt-10 h-20 w-20 shrink-0 ring-4 ring-[#f6f5f3] sm:-mt-14 sm:h-28 sm:w-28"
          textClassName="text-3xl sm:text-4xl"
        />
      </div>

      <div className="mt-3 flex max-w-xl flex-col gap-1 px-4 sm:mt-4 sm:px-17">
        <h1 className="wrap-break-word text-2xl font-bold sm:text-3xl tracking-tight">
          {profile.displayName}
        </h1>
        <p className="text-[15px] text-neutral-500">@{profile.username}</p>

        {profile.bio && <ExpandableBio key={profile.id} text={profile.bio} />}

        <ProfileFollowSection profile={profile} />
      </div>
    </header>
  );
}