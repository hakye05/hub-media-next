import { api } from "./api";
import { pageQuery, type CursorPage } from "./pagination";
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
  colors?: string[];
};

export type UpdatePostPayload = {
  title?: string;
  description?: string; // empty string clears it
};

export type PostSearch = { q?: string; color?: string | null };

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

  following: (cursor?: string | null, size = 20) =>
    api<CursorPage<PostDetail>>(`/api/posts/following?${pageQuery(cursor, size)}`),

  search: ({ q, color }: PostSearch, cursor?: string | null, size = 20) => {
    const params = new URLSearchParams(pageQuery(cursor, size));
    if (q) params.set("q", q);
    if (color) params.set("color", color.replace("#", ""));
    return api<CursorPage<Post>>(`/api/posts/search?${params}`);
  },
};