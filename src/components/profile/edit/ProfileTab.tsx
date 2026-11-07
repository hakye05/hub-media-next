"use client";

import { useState, type SyntheticEvent } from "react";
import { authApi } from "@/lib/authApi";
import { getErrorMessage } from "@/lib/errors";
import { GENDER_OPTIONS } from "@/lib/gender";
import { usersApi, type UserMe } from "@/lib/users";
import { SolidButton } from "../../ui/Button";
import { SoftField, SoftTextArea } from "../../ui/fields/Field";
import { FormGroup } from "../../ui/fields/FormGroup";
import Pane from "./Pane";
import AvatarPicker from "./AvatarPicker";
import { sanitizeUsername, usernameMessage, usernameRegex } from "@/lib/validation";

const NAME_MAX = 50;
const BIO_MAX = 160;
const USERNAME_MAX = 30;
const USERNAME_RE = usernameRegex(USERNAME_MAX);
const USERNAME_MSG = usernameMessage(USERNAME_MAX);

type Props = {
  me: UserMe;
  onUpdated: (me: UserMe) => void;
  onDone: () => void;
};

export default function ProfileTab({ me, onUpdated, onDone }: Props) {
  const [name, setName] = useState(me.displayName);
  const [username, setUsername] = useState(me.username);
  const [bio, setBio] = useState(me.bio ?? "");
  const [gender, setGender] = useState(me.gender ?? "");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const nameChanged = name.trim() !== me.displayName;
  const bioChanged = bio.trim() !== (me.bio ?? "");
  const genderChanged = gender !== (me.gender ?? "");
  const usernameChanged = username !== me.username;
  const dirty = nameChanged || bioChanged || genderChanged || usernameChanged;
  const canSave = dirty && name.trim().length > 0 && username !== "" && !busy;

  async function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!canSave) return;

    if (usernameChanged && !USERNAME_RE.test(username)) {
      setError(USERNAME_MSG);
      return;
    }

    setBusy(true);
    setError(null);
    try {
      // Check the username first so nothing is half-saved on a conflict
      if (usernameChanged) {
        const { available } = await authApi.checkUsername(username);
        if (!available) {
          setError("Username is not available");
          return;
        }
      }

      if (nameChanged || bioChanged || genderChanged) {
        onUpdated(
          await usersApi.updateProfile({
            ...(nameChanged && { displayName: name.trim() }),
            ...(bioChanged && { bio: bio.trim() }),
            ...(genderChanged && { gender }),
          })
        );
      }
      if (usernameChanged) {
        onUpdated(await usersApi.changeUsername(username));
      }
      onDone();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
      <Pane
        title="Profile"
        footer={
          <>
            <p className="mr-auto min-w-0 text-[13px] text-red-500">{error}</p>
            <SolidButton disabled={!canSave}>{busy ? "Saving…" : "Save changes"}</SolidButton>
          </>
        }
      >
        <div className="flex flex-col gap-5">
          <div className="flex items-end gap-4">
            <div className="min-w-0 flex-1">
              <FormGroup label="Username">
                <div className="relative">
                  <span className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-[16px] text-neutral-400">
                    @
                  </span>
                  <SoftField
                    type="text"
                    autoComplete="username"
                    autoCapitalize="none"
                    spellCheck={false}
                    className="pl-10"
                    value={username}
                    onChange={(e) => {
                      setUsername(sanitizeUsername(e.target.value, USERNAME_MAX));
                      setError(null);
                    }}
                  />
                </div>
              </FormGroup>
            </div>
            <AvatarPicker me={me} onChange={onUpdated} onError={setError} />
          </div>

          <FormGroup label="Full name">
            <SoftField
              type="text"
              autoComplete="name"
              maxLength={NAME_MAX}
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError(null);
              }}
            />
          </FormGroup>

          <FormGroup label="Bio" hint={`${bio.length}/${BIO_MAX}`}>
            <SoftTextArea
              rows={2}
              maxLength={BIO_MAX}
              placeholder="Tell people about yourself"
              value={bio}
              onChange={(e) => {
                setBio(e.target.value);
                setError(null);
              }}
            />
          </FormGroup>

          <FormGroup label="Gender" as="div">
            <div className="flex flex-wrap gap-2">
              {GENDER_OPTIONS.map((g) => (
                <button
                  key={g.value}
                  type="button"
                  aria-pressed={gender === g.value}
                  onClick={() => {
                    setGender(g.value);
                    setError(null);
                  }}
                  className={`h-10 rounded-full border px-4 text-[14px] font-medium transition-colors ${
                    gender === g.value
                      ? "border-[#111] bg-[#111] text-white"
                      : "border-neutral-200 bg-[#faf9f8] text-neutral-800 hover:bg-neutral-100"
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </FormGroup>
        </div>
      </Pane>
    </form>
  );
}