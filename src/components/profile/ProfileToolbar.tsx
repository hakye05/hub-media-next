"use client";

import SlidersIcon from "../icons/SlidersIcon";
import { ToolbarButton } from "../ui/Button";
import FollowButton from "@/components/follow/FollowButton";
import ProfileTabs from "./ProfileTabs";
import ShareProfileButton from "./ShareProfileButton";
import { useProfileFollow } from "./ProfileFollowContext";

type Props = {
  isSelf: boolean;
  username: string;
  activeSegment: string | null;
  onEditProfile: () => void;
};

export default function ProfileToolbar({
  isSelf,
  username,
  activeSegment,
  onEditProfile,
}: Props) {
  const { isFollowing, onFollowChange } = useProfileFollow();

  return (
    <div className="mb-5 flex flex-col gap-3 md:mb-8 md:grid md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-4">
      {/* Phones: buttons share one full-width line */}
      <div className="flex items-center gap-2 max-md:[&>button]:h-10 max-md:[&>button]:flex-1 max-md:[&>button]:justify-center max-md:[&>button]:px-3 md:gap-3">
        {isSelf && <ToolbarButton onClick={onEditProfile}>Edit profile</ToolbarButton>}
        <ShareProfileButton username={username} />
        {!isSelf && (
          <FollowButton
            username={username}
            isFollowing={isFollowing}
            onChange={onFollowChange}
          />
        )}
      </div>

      <ProfileTabs username={username} activeSegment={activeSegment} isSelf={isSelf} />

      {/* Sort/filter button is hidden on phones */}
      <div className="hidden justify-end md:flex">
        <ToolbarButton>
          Latest
          <SlidersIcon />
        </ToolbarButton>
      </div>
    </div>
  );
}