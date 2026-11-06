import { api } from "./api";
import type { CursorPage } from "./pagination";
import { ProfileSummary } from "./users";

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

export type PostDetail = Omit<Post, "userId"> & { author: ProfileSummary };


export type CreatePostPayload = {
  uploadId: string;
  title: string;
  description?: string;
};

export type UpdatePostPayload = {
  title?: string;
  description?: string; // empty string clears it
};

const pageQuery = (cursor?: string | null, size = 20) => {
  const params = new URLSearchParams({ size: String(size) });
  if (cursor) params.set("cursor", cursor);
  return params.toString();
};

export const postsApi = {
  create: (payload: CreatePostPayload) =>
    api<Post>("/api/posts", { method: "POST", json: payload }),

  get: (id: string) => api<PostDetail>(`/api/posts/${encodeURIComponent(id)}`),

  update: (id: string, payload: UpdatePostPayload) =>
    api<Post>(`/api/posts/${encodeURIComponent(id)}`, { method: "PATCH", json: payload }),

  delete: (id: string) =>
    api<void>(`/api/posts/${encodeURIComponent(id)}`, { method: "DELETE" }),

  feed: (cursor?: string | null, size = 20) =>
    api<CursorPage<Post>>(`/api/posts?${pageQuery(cursor, size)}`),

  byUsername: (username: string, cursor?: string | null, size = 20) =>
    api<CursorPage<Post>>(
      `/api/users/${encodeURIComponent(username)}/posts?${pageQuery(cursor, size)}`
    ),
};