"use client";

import { useState } from "react";
import type { MouseEvent } from "react";
import FollowList, { type FollowKind } from "./FollowList";
import Modal from "@/components/ui/modals/Modal";
import { useDebouncedValue } from "@/lib/useDebouncedValue";
import { useAuth } from "@/components/auth/AuthProvider";

const compact = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 });

type Props = {
  username: string;
  initial: FollowKind;
  counts: Record<FollowKind, number>;
  onClose: () => void;
  onFollowingDelta: (delta: 1 | -1) => void;
};

const TABS: { kind: FollowKind; label: string }[] = [
  { kind: "followers", label: "Followers" },
  { kind: "following", label: "Following" },
];

export default function FollowListModal({
  username,
  initial,
  counts,
  onClose,
  onFollowingDelta,
}: Props) {
  const { user } = useAuth();
  const [kind, setKind] = useState<FollowKind>(initial);
  const [query, setQuery] = useState("");
  const debounced = useDebouncedValue(query.trim());

  const isOwn = user?.username === username;

  function handleFollowChange(following: boolean) {
    onFollowingDelta(following ? 1 : -1);
  }

  function handleLinkClick(e: MouseEvent<HTMLDivElement>) {
    const link = (e.target as HTMLElement).closest("a");
    const plainClick = e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey;
    if (link && plainClick) onClose();
  }

  return (
    <Modal onClose={onClose} label="Followers and following" className="max-w-105">
      <div className="flex h-[70vh] w-full flex-col">
        <div className="flex border-b border-neutral-200">
          {TABS.map((t) => (
            <button
              key={t.kind}
              type="button"
              onClick={() => setKind(t.kind)}
              className={`flex-1 border-b-2 py-4 text-[15px] font-semibold tracking-tight transition-colors ${
                kind === t.kind
                  ? "border-neutral-900 text-neutral-900"
                  : "border-transparent text-neutral-400 hover:text-neutral-700"
              }`}
            >
              {compact.format(counts[t.kind])} {t.label}
            </button>
          ))}
        </div>

        <div className="px-6 pt-4">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search"
            className="h-11 w-full rounded-full bg-neutral-100/70 px-5 text-[15px] outline-none placeholder:text-neutral-400"
          />
        </div>

        <div
          className="flex-1 overflow-y-auto px-6 py-3"
          onClickCapture={handleLinkClick}
        >
          {/* key remounts the list so each tab starts from page one */}
          <FollowList
            key={`${kind}:${debounced}`}
            username={username}
            kind={kind}
            query={debounced}
            onFollowChange={isOwn ? handleFollowChange : undefined}
          />
        </div>
      </div>
    </Modal>
  );
}