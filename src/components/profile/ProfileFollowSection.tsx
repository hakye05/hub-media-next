"use client";

import { useState } from "react";
import type { PublicProfile } from "@/lib/users";
import FollowListModal from "@/components/follow/list/FollowListModal";
import type { FollowKind } from "@/components/follow/list/FollowList";
import { useProfileFollow } from "./ProfileFollowContext";

const compact = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 });

export default function ProfileFollowSection({ profile }: { profile: PublicProfile }) {
  const { followers } = useProfileFollow();
  const [open, setOpen] = useState<FollowKind | null>(null);

  return (
    <>
      <p className="mt-1 text-[14px] font-semibold text-neutral-900">
        <button type="button" onClick={() => setOpen("followers")} className="hover:underline">
          {compact.format(followers)} followers
        </button>
        {" · "}
        <button type="button" onClick={() => setOpen("following")} className="hover:underline">
          {compact.format(profile.followingCount)} following
        </button>
      </p>

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