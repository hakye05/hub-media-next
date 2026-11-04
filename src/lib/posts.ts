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

export const postsApi = {
  create: (payload: CreatePostPayload) =>
    api<Post>("/api/posts", { method: "POST", json: payload }),

  byUsername: (username: string, cursor?: string | null, size = 20) => {
    const params = new URLSearchParams({ size: String(size) });
    if (cursor) params.set("cursor", cursor);
    return api<CursorPage<Post>>(
      `/api/users/${encodeURIComponent(username)}/posts?${params}`
    );
  },
};