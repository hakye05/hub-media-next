"use client";

import { useEffect, useState } from "react";
import { getErrorMessage } from "@/lib/errors";
import { usersApi, type UserMe } from "@/lib/users";
import { useAuth } from "../../auth/AuthProvider";
import CloseIcon from "../../icons/CloseIcon";
import LockIcon from "../../icons/LockIcon";
import Avatar from "../../ui/Avatar";
import Modal from "../../ui/Modal";
import AccountTab from "./AccountTab";
import Centered from "./Centered";
import EditNavItem from "./EditNavItem";
import ProfileTab from "./ProfileTab";

type Tab = "Profile" | "Account";

type Props = {
  onClose: () => void;
  onUpdated: (me: UserMe) => void;
};

export default function EditProfileModal({ onClose, onUpdated }: Props) {
  const { user, updateUser } = useAuth();
  const [me, setMe] = useState<UserMe | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("Profile");

  useEffect(() => {
    let active = true;
    usersApi
      .getMe()
      .then((m) => active && setMe(m))
      .catch((err) => active && setLoadError(getErrorMessage(err)));
    return () => {
      active = false;
    };
  }, []);

  // Keep the modal, the navbar and the profile page in sync after every successful change
  function handleUpdated(next: UserMe) {
    setMe(next);
    updateUser({
      displayName: next.displayName,
      username: next.username,
      email: next.email,
      avatarUrl: next.avatarUrl,
    });
    onUpdated(next);
  }

  return (
    <Modal label="Edit profile" onClose={onClose} className="h-144 max-w-190">
      <div className="flex h-full flex-col md:flex-row">
        {/* Sidebar (top row on small screens) */}
        <nav className="flex shrink-0 items-center gap-1 border-b border-neutral-200 bg-[#faf9f8] px-3 py-2 md:w-60 md:flex-col md:items-stretch md:border-b-0 md:border-r md:p-4">
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full text-neutral-600 transition-colors hover:bg-neutral-200/60 hover:text-neutral-900 md:mb-3"
          >
            <CloseIcon />
          </button>

          <EditNavItem
            active={tab === "Profile"}
            onClick={() => setTab("Profile")}
            icon={
              <Avatar
                name={me?.displayName ?? user?.displayName ?? ""}
                src={me?.avatarUrl}
                className="h-6 w-6"
                textClassName="text-[10px]"
              />
            }
          >
            Profile
          </EditNavItem>

          <EditNavItem
            active={tab === "Account"}
            onClick={() => setTab("Account")}
            icon={<LockIcon />}
          >
            Account
          </EditNavItem>
        </nav>

        {/* Content */}
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          {loadError ? (
            <Centered error>{loadError}</Centered>
          ) : !me ? (
            <Centered>Loading…</Centered>
          ) : (
            <>
              {/* Both panes stay mounted so unsaved edits survive switching */}
              <div className={tab === "Profile" ? "flex min-h-0 flex-1 flex-col" : "hidden"}>
                <ProfileTab me={me} onUpdated={handleUpdated} onDone={onClose} />
              </div>
              <div className={tab === "Account" ? "flex min-h-0 flex-1 flex-col" : "hidden"}>
                <AccountTab email={me.email} onUpdated={handleUpdated} />
              </div>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
}