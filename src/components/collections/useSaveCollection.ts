"use client";

import { useCallback, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useAuthModal } from "@/components/auth/AuthModalProvider";
import { collectionsApi } from "@/lib/collections";

/** Optimistic save/unsave toggle; guests get the login modal. */
export function useSaveCollection(collectionId: string, initialSaved: boolean) {
  const { user } = useAuth();
  const { openAuth } = useAuthModal();
  const [saved, setSaved] = useState(initialSaved);
  const [pending, setPending] = useState(false);

  const toggle = useCallback(async () => {
    if (!user) {
      openAuth("login");
      return;
    }
    if (pending) return;
    const next = !saved;
    setSaved(next);
    setPending(true);
    try {
      await (next ? collectionsApi.save(collectionId) : collectionsApi.unsave(collectionId));
    } catch {
      setSaved(!next); // roll back
    } finally {
      setPending(false);
    }
  }, [user, openAuth, pending, saved, collectionId]);

  return { saved, pending, toggle };
}