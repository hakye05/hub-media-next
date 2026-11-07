import { useCallback, useEffect, useRef, useState } from "react";
import { collectionsApi, type Collection } from "@/lib/collections";
import { getErrorMessage } from "@/lib/errors";
import type { CursorPage } from "@/lib/pagination";
import { useSavePost } from "./savePostContext";

export const SAVED_KEY = "saved";

type Args = { postId: string; username: string; wasSaved: boolean };

async function fetchAllCollections(username: string) {
  const all: Collection[] = [];
  let cursor: string | null = null;
  do {
    const page: CursorPage<Collection> = await collectionsApi.byUsername(username, cursor, 50);
    all.push(...page.items);
    cursor = page.nextCursor;
  } while (cursor && all.length < 500);
  return all;
}

export function useCollectionPicker({ postId, username, wasSaved }: Args) {
  const { isSaved, setSaved, setRemoved } = useSavePost();
  const saved = isSaved(postId, wasSaved);

  const [collections, setCollections] = useState<Collection[]>([]);
  const [memberOf, setMemberOf] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  // Resolves when the save-on-open request is done, so adds never race it (the API 409s otherwise)
  const ready = useRef<Promise<void>>(Promise.resolve());
  const started = useRef(false);

  useEffect(() => {
    if (wasSaved || started.current) return;
    started.current = true;
    ready.current = setSaved(postId, true).catch((err) => setError(getErrorMessage(err)));
  }, [wasSaved, postId, setSaved]);

  useEffect(() => {
    let active = true;
    Promise.all([fetchAllCollections(username), collectionsApi.containingPost(postId)])
      .then(([all, containing]) => {
        if (!active) return;
        setCollections(all);
        setMemberOf(new Set(containing.map((c) => c.id)));
        setLoading(false);
      })
      .catch((err) => {
        if (!active) return;
        setError(getErrorMessage(err));
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [postId, username, attempt]);

  const retry = useCallback(() => {
    setLoading(true);
    setError(null);
    setAttempt((a) => a + 1);
  }, []);

  async function withBusy(key: string, task: () => Promise<void>) {
    if (busy.has(key)) return;
    setBusy((b) => new Set(b).add(key));
    setError(null);
    try {
      await task();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusy((b) => {
        const next = new Set(b);
        next.delete(key);
        return next;
      });
    }
  }

  const adjustCount = (ids: Set<string>, delta: number) =>
    setCollections((list) =>
      list.map((c) =>
        ids.has(c.id) ? { ...c, postCount: Math.max(0, c.postCount + delta) } : c
      )
    );

  const toggleSaved = () =>
    withBusy(SAVED_KEY, async () => {
      await ready.current;
      if (saved) {
        await setSaved(postId, false);
        memberOf.forEach((id) => setRemoved(id, postId, true));
        adjustCount(memberOf, -1);
        setMemberOf(new Set());
      }
    });

  const toggleCollection = (id: string) =>
    withBusy(id, async () => {
      await ready.current;
      if (memberOf.has(id)) {
        await collectionsApi.removePost(id, postId);
        setRemoved(id, postId, true);
        setMemberOf((m) => { const next = new Set(m); next.delete(id); return next; });
        adjustCount(new Set([id]), -1);
      } else {
        if (!saved) await setSaved(postId, true);
        await collectionsApi.addPost(id, postId);
        setRemoved(id, postId, false);
        setMemberOf((m) => new Set(m).add(id));
        adjustCount(new Set([id]), 1);
      }
    });

  /** A collection just created from the picker: list it and put the post straight in. */
  const addCreated = (collection: Collection) => {
    setCollections((list) => [collection, ...list]);
    void toggleCollection(collection.id);
  };

  return {
    saved,
    collections,
    memberOf,
    busy,
    loading,
    error,
    retry,
    toggleSaved,
    toggleCollection,
    addCreated,
  };
}