import SlidersIcon from "../icons/SlidersIcon";
import { ToolbarButton } from "../ui/Button";
import ProfileTabs from "./ProfileTabs";
import ShareProfileButton from "./ShareProfileButton";

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
  return (
    <div className="mb-8 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
      <div className="flex items-center gap-3">
        {isSelf && <ToolbarButton onClick={onEditProfile}>Edit profile</ToolbarButton>}
        <ShareProfileButton username={username} />
      </div>

      <ProfileTabs username={username} activeSegment={activeSegment} />

      <div className="flex justify-end">
        <ToolbarButton>
          Latest
          <SlidersIcon />
        </ToolbarButton>
      </div>
    </div>
  );
}