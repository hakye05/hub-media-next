"use client";

import { useCallback, useState, type ReactNode } from "react";
import type { UserMe } from "@/lib/users";
import EditProfileModal from "./edit/EditProfileModal";
import ProfileToolbar from "./ProfileToolbar";

type Props = {
  isSelf: boolean;
  username: string;
  activeSegment: string | null;
  onProfileUpdated: (me: UserMe) => void;
  children: ReactNode; // the active tab's page
};

export default function ProfileContent({
  isSelf,
  username,
  activeSegment,
  onProfileUpdated,
  children,
}: Props) {
  const [editing, setEditing] = useState(false);
  const closeEditor = useCallback(() => setEditing(false), []);

  return (
    <section className="mx-auto w-full min-w-0 mt-5 px-3 sm:mt-7 sm:px-9">
      <ProfileToolbar
        isSelf={isSelf}
        username={username}
        activeSegment={activeSegment}
        onEditProfile={() => setEditing(true)}
      />

      {children}

      {editing && <EditProfileModal onClose={closeEditor} onUpdated={onProfileUpdated} />}
    </section>
  );
}