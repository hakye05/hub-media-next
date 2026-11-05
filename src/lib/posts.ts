import { api } from "./api";
import type { CursorPage } from "./pagination";

// Mirrors PostResponse on the backend
export type Post = {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  imageUrl: string;
  width: number;
  height: number;
  createdAt: string;
  updatedAt: string;
  savedByViewer: boolean;
};

export type CreatePostPayload = {
  uploadId: string;
  title: string;
  description?: string;
};

const pageQuery = (cursor?: string | null, size = 20) => {
  const params = new URLSearchParams({ size: String(size) });
  if (cursor) params.set("cursor", cursor);
  return params.toString();
};

export const postsApi = {
  create: (payload: CreatePostPayload) =>
    api<Post>("/api/posts", { method: "POST", json: payload }),

  // Assumed endpoint: adjust if your feed lives elsewhere
  feed: (cursor?: string | null, size = 20) =>
    api<CursorPage<Post>>(`/api/posts?${pageQuery(cursor, size)}`),

  byUsername: (username: string, cursor?: string | null, size = 20) =>
    api<CursorPage<Post>>(
      `/api/users/${encodeURIComponent(username)}/posts?${pageQuery(cursor, size)}`
    ),
};