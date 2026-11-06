import { api } from "./api";
import { pageQuery, type CursorPage } from "./pagination";
import type { ProfileSummary } from "./users";

const base = (username: string) => `/api/users/${encodeURIComponent(username)}`;
const withQuery = (query?: string) => (query ? `&q=${encodeURIComponent(query)}` : "");

export const followsApi = {
  follow: (username: string) => api<void>(`${base(username)}/follow`, { method: "POST" }),

  unfollow: (username: string) => api<void>(`${base(username)}/follow`, { method: "DELETE" }),

  followers: (username: string, cursor?: string | null, size = 20, query?: string) =>
    api<CursorPage<ProfileSummary>>(
      `${base(username)}/followers?${pageQuery(cursor, size)}${withQuery(query)}`
    ),

  following: (username: string, cursor?: string | null, size = 20, query?: string) =>
    api<CursorPage<ProfileSummary>>(
      `${base(username)}/following?${pageQuery(cursor, size)}${withQuery(query)}`
    ),
};