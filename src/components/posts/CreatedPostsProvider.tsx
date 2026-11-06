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
  created: Post[];
  add: (post: Post) => void;
  remove: (id: string) => void;
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

  const remove = useCallback(
    (id: string) => setState((s) => ({ ...s, posts: s.posts.filter((p) => p.id !== id) })),
    []
  );

  // Another account logging in must not see the previous user's posts
  const value = useMemo<Value>(
    () => ({ created: state.ownerId === userId ? state.posts : EMPTY, add, remove }),
    [state, userId, add, remove]
  );

  return <CreatedPostsContext.Provider value={value}>{children}</CreatedPostsContext.Provider>;
}