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
    <div className="mb-8 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
      <div className="flex items-center gap-3">
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

      <div className="flex justify-end">
        <ToolbarButton>
          Latest
          <SlidersIcon />
        </ToolbarButton>
      </div>
    </div>
  );
}