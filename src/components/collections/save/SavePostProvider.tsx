"use client";

import { useCallback, useMemo, useState, type ReactNode } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { savedPostsApi } from "@/lib/savedPosts";
import { SavePostContext, type SavePostValue } from "./savePostContext";
import SaveToCollectionModal from "./SaveToCollectionModal";

type Overrides = { ownerId: string | null; map: Record<string, boolean> };
type Target = { postId: string; wasSaved: boolean };

const NONE: Record<string, boolean> = {};

export default function SavePostProvider({ children }: { children: ReactNode }) {
  const { user, openAuth } = useAuth();
  const userId = user?.id ?? null;
  const [overrides, setOverrides] = useState<Overrides>({ ownerId: null, map: NONE });
  const [target, setTarget] = useState<Target | null>(null);

  // Another account logging in must not inherit the previous user's saved state
  const map = overrides.ownerId === userId ? overrides.map : NONE;

  const patch = useCallback(
    (postId: string, saved: boolean) =>
      setOverrides((o) => ({
        ownerId: userId,
        map: { ...(o.ownerId === userId ? o.map : NONE), [postId]: saved },
      })),
    [userId]
  );

  const isSaved = useCallback(
    (postId: string, fallback: boolean) => map[postId] ?? fallback,
    [map]
  );

  const setSaved = useCallback(
    async (postId: string, saved: boolean) => {
      patch(postId, saved);
      try {
        await (saved ? savedPostsApi.save(postId) : savedPostsApi.unsave(postId));
      } catch (err) {
        patch(postId, !saved);
        throw err;
      }
    },
    [patch]
  );

  const openSave = useCallback(
    (postId: string, saved: boolean) => {
      if (!userId) {
        openAuth("login");
        return;
      }
      setTarget({ postId, wasSaved: saved });
    },
    [userId, openAuth]
  );

  const closeModal = useCallback(() => setTarget(null), []);

  const value = useMemo<SavePostValue>(
    () => ({ isSaved, setSaved, openSave }),
    [isSaved, setSaved, openSave]
  );

  return (
    <SavePostContext.Provider value={value}>
      {children}
      {target && user && (
        <SaveToCollectionModal
          key={target.postId}
          postId={target.postId}
          wasSaved={target.wasSaved}
          username={user.username}
          onClose={closeModal}
        />
      )}
    </SavePostContext.Provider>
  );
}