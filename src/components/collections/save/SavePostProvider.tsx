"use client";

import { useCallback, useMemo, useState, type ReactNode } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { savedPostsApi } from "@/lib/savedPosts";
import { SavePostContext, type SavePostValue } from "./savePostContext";
import SaveToCollectionModal from "./SaveToCollectionModal";

type Overrides = { ownerId: string | null; map: Record<string, boolean> };
type Target = { postId: string; wasSaved: boolean };
type Removals = { ownerId: string | null; map: Record<string, Set<string>> };

const NONE: Record<string, boolean> = {};
const NO_REMOVALS: Removals = { ownerId: null, map: {} };   // NEW
const EMPTY_SET: ReadonlySet<string> = new Set();            // NEW

export default function SavePostProvider({ children }: { children: ReactNode }) {
  const { user, openAuth } = useAuth();
  const userId = user?.id ?? null;
  const [overrides, setOverrides] = useState<Overrides>({ ownerId: null, map: NONE });
  const [target, setTarget] = useState<Target | null>(null);
  const [removals, setRemovals] = useState<Removals>(NO_REMOVALS);   // NEW

  // Another account logging in must not inherit the previous user's saved state
  const map = overrides.ownerId === userId ? overrides.map : NONE;
  const removalMap = removals.ownerId === userId ? removals.map : {};   // NEW — Bug 1 fix

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

  // NEW — removal tracking
  const removedFrom = useCallback(
    (collectionId: string) => removalMap[collectionId] ?? EMPTY_SET,
    [removalMap]
  );

  const setRemoved = useCallback(
    (collectionId: string, postId: string, removed: boolean) =>
      setRemovals((prev) => {
        const base = prev.ownerId === userId ? prev.map : {};
        const set = new Set(base[collectionId]);
        if (removed) set.add(postId);
        else set.delete(postId);
        return { ownerId: userId, map: { ...base, [collectionId]: set } };
      }),
    [userId]
  );

  const clearRemoved = useCallback(
    (collectionId: string) =>
      setRemovals((prev) => {
        const base = prev.ownerId === userId ? prev.map : {};
        if (!base[collectionId]) return prev;
        const map = { ...base };
        delete map[collectionId];
        return { ownerId: userId, map };
      }),
    [userId]
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
    () => ({ isSaved, setSaved, openSave, removedFrom, setRemoved, clearRemoved }),   // UPDATED
    [isSaved, setSaved, openSave, removedFrom, setRemoved, clearRemoved]              // UPDATED
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