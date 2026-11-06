"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { getErrorMessage } from "@/lib/errors";
import { ALLOWED_IMAGE_TYPES, uploadsApi } from "@/lib/upload";
import { usersApi, type UserMe } from "@/lib/users";
import CameraIcon from "../../icons/CameraIcon";
import CloseIcon from "../../icons/CloseIcon";
import Avatar from "../../ui/Avatar";

const focusRing ="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900";

type Props = {
  me: UserMe;
  onChange: (me: UserMe) => void;
  onError: (message: string | null) => void;
};

export default function AvatarPicker({ me, onChange, onError }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  async function onPick(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow picking the same file again
    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      onError("Use a JPG, PNG or WebP image.");
      return;
    }

    setBusy(true);
    onError(null);
    try {
      // The backend attaches the finished upload to the user
      const { url } = await uploadsApi.uploadImage("AVATAR", file);
      onChange({ ...me, avatarUrl: url });
    } catch (err) {
      onError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    setBusy(true);
    onError(null);
    try {
      onChange(await usersApi.removeAvatar());
    } catch (err) {
      onError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="relative shrink-0">
      <button
        type="button"
        aria-label="Change profile photo"
        onClick={() => inputRef.current?.click()}
        disabled={busy}
        className={`group relative block h-14 w-14 overflow-hidden rounded-full ${focusRing}`}
      >
        <Avatar
          name={me.displayName}
          src={me.avatarUrl}
          className="h-14 w-14"
          textClassName="text-lg"
        />
        <span className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
          <CameraIcon />
        </span>
        {busy && <span className="absolute inset-0 animate-pulse bg-white/60" />}
      </button>

      {me.avatarUrl && (
        <button
          type="button"
          aria-label="Remove profile photo"
          onClick={remove}
          disabled={busy}
          className={`absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white ring-2 ring-white transition-colors hover:bg-red-600 disabled:opacity-60 ${focusRing}`}
        >
          <CloseIcon size={10} strokeWidth={3.5} />
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={ALLOWED_IMAGE_TYPES.join(",")}
        onChange={onPick}
        className="hidden"
      />
    </div>
  );
}