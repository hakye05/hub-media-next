"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Post } from "@/lib/posts";
import { useAuth } from "../auth/AuthProvider";

type Value = {
  /** Posts created in this session by the current user, newest first */
  created: Post[];
  add: (post: Post) => void;
};

type State = { ownerId: string | null; posts: Post[] };

const EMPTY: Post[] = [];
const CreatedPostsContext = createContext<Value | null>(null);

export function useCreatedPosts() {
  const ctx = useContext(CreatedPostsContext);
  if (!ctx) throw new Error("useCreatedPosts must be used inside <CreatedPostsProvider>");
  return ctx;
}

export default function CreatedPostsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const userId = user?.id ?? null;
  const [state, setState] = useState<State>({ ownerId: null, posts: EMPTY });

  const add = useCallback(
    (post: Post) =>
      setState((s) => ({
        ownerId: post.userId,
        posts: s.ownerId === post.userId ? [post, ...s.posts] : [post],
      })),
    []
  );

  // Another account logging in must not see the previous user's posts
  const value = useMemo<Value>(
    () => ({ created: state.ownerId === userId ? state.posts : EMPTY, add }),
    [state, userId, add]
  );

  return <CreatedPostsContext.Provider value={value}>{children}</CreatedPostsContext.Provider>;
}