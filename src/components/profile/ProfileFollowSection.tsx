"use client";

import { useState } from "react";
import type { PublicProfile } from "@/lib/users";
import FollowButton from "@/components/follow/FollowButton";
import FollowListModal from "@/components/follow/list/FollowListModal";
import type { FollowKind } from "@/components/follow/list/FollowList";

const compact = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 });

export default function ProfileFollowSection({ profile }: { profile: PublicProfile }) {
  const [followers, setFollowers] = useState(profile.followerCount);
  const [open, setOpen] = useState<FollowKind | null>(null);

  return (
    <>
      <div className="mt-1 flex items-center gap-4">
        <p className="text-[14px] font-semibold text-neutral-900">
          <button type="button" onClick={() => setOpen("followers")} className="hover:underline">
            {compact.format(followers)} followers
          </button>
          {" · "}
          <button type="button" onClick={() => setOpen("following")} className="hover:underline">
            {compact.format(profile.followingCount)} following
          </button>
        </p>
        <FollowButton
          key={profile.id}
          username={profile.username}
          isFollowing={profile.isFollowing}
          onChange={(f) => setFollowers((c) => Math.max(0, c + (f ? 1 : -1)))}
        />
      </div>

      {open && (
        <FollowListModal
          username={profile.username}
          initial={open}
          counts={{ followers, following: profile.followingCount }}
          onClose={() => setOpen(null)}
        />
      )}
    </>
  );
}