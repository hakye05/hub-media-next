import { api } from "./api";
import { pageQuery, type CursorPage } from "./pagination";
import type { Post } from "./posts";

const enc = encodeURIComponent;

export const savedPostsApi = {
  save: (postId: string) => api<void>(`/api/posts/${enc(postId)}/save`, { method: "PUT" }),

  unsave: (postId: string) => api<void>(`/api/posts/${enc(postId)}/save`, { method: "DELETE" }),

  list: (cursor?: string | null, size = 20) =>
    api<CursorPage<Post>>(`/api/saved-posts?${pageQuery(cursor, size)}`),
};