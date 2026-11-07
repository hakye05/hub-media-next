import { createContext, useContext } from "react";

export type SavePostValue = {
  /** Effective saved state: the local override if there is one, else the server value. */
  isSaved: (postId: string, fallback: boolean) => boolean;
  /** Optimistic save/unsave; rolls back and throws on failure. */
  setSaved: (postId: string, saved: boolean) => Promise<void>;
  /** Save button click: opens the picker (and saves the post if it isn't saved yet). */
  openSave: (postId: string, saved: boolean) => void;
  /** Post IDs optimistically removed from a collection, keyed by collection id. */
  removedFrom: (collectionId: string) => ReadonlySet<string>;
  clearRemoved: (collectionId: string) => void;
  /** Record that a post was removed from / added back to a collection. */
  setRemoved: (collectionId: string, postId: string, removed: boolean) => void;
};

export const SavePostContext = createContext<SavePostValue | null>(null);

export function useSavePost() {
  const ctx = useContext(SavePostContext);
  if (!ctx) throw new Error("useSavePost must be used inside <SavePostProvider>");
  return ctx;
}