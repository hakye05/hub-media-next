"use client";

import { useAuth } from "@/components/auth/AuthProvider";
import { OutlineSmallButton, SolidButton } from "@/components/ui/Button";
import { useFollow } from "./useFollow";

type Props = {
  username: string;
  isFollowing: boolean;
  onChange?: (following: boolean) => void;
};

export default function FollowButton({ username, isFollowing, onChange }: Props) {
  const { user } = useAuth();
  const { following, pending, toggle } = useFollow(username, isFollowing, onChange);

  if (!user || user.username === username) return null;

  const Button = following ? OutlineSmallButton : SolidButton;
  return (
    <Button onClick={toggle} disabled={pending} aria-pressed={following}>
      {following ? "Following" : "Follow"}
    </Button>
  );
}