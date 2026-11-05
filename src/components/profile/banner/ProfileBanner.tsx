"use client";

import { useCallback, useState } from "react";
import BannerEditButton from "./BannerEditButton";
import BannerModal from "./BannerModal";

type Props = {
  bannerUrl: string | null;
  isSelf: boolean;
  onChanged: () => void;
};

export default function ProfileBanner({ bannerUrl, isSelf, onChanged }: Props) {
  const [editing, setEditing] = useState(false);
  const close = useCallback(() => setEditing(false), []);

  return (
    <>
      {/* Default gradient until the user uploads their own image */}
      <div
        className="group relative h-48 w-full bg-linear-to-r from-sky-200 via-fuchsia-200 to-amber-200 bg-cover bg-center sm:h-56"
        style={bannerUrl ? { backgroundImage: `url("${bannerUrl}")` } : undefined}
      >
        {isSelf && <BannerEditButton onClick={() => setEditing(true)} />}
      </div>

      {editing && <BannerModal currentUrl={bannerUrl} onClose={close} onChanged={onChanged} />}
    </>
  );
}