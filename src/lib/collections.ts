import { api } from "./api";
import { pageQuery, searchQuery, type CursorPage } from "./pagination";
import type { Post } from "./posts";
import type { ProfileSummary } from "./users";

// Mirrors CollectionResponse
export type Collection = {
  id: string;
  userId: string;
  title: string;
  isPublic: boolean;
  savedByViewer: boolean;
  postCount: number;
  coverImageUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

// Mirrors CollectionDetailResponse
export type CollectionDetail = Omit<Collection, "userId" | "postCount" | "coverImageUrl"> & {
  author: ProfileSummary;
};

// Mirrors CollectionSummaryResponse
export type CollectionSummary = Pick<Collection, "id" | "title" | "isPublic">;

// Mirrors CollectionSearchResponse
export type CollectionSearchResult = Collection & { owner: ProfileSummary };

/** What collection lists render: profile lists omit the owner, search results include it */
export type CollectionItem = Collection & { owner?: ProfileSummary };

export type CreateCollectionPayload = { title: string; isPublic: boolean };
export type UpdateCollectionPayload = { title?: string; isPublic?: boolean };

const enc = encodeURIComponent;

export const collectionsApi = {
  create: (payload: CreateCollectionPayload) =>
    api<Collection>("/api/collections", { method: "POST", json: payload }),

  get: (id: string) => api<CollectionDetail>(`/api/collections/${enc(id)}`),

  update: (id: string, payload: UpdateCollectionPayload) =>
    api<Collection>(`/api/collections/${enc(id)}`, { method: "PATCH", json: payload }),

  delete: (id: string) => api<void>(`/api/collections/${enc(id)}`, { method: "DELETE" }),

  byUsername: (username: string, cursor?: string | null, size = 20) =>
    api<CursorPage<Collection>>(
      `/api/users/${enc(username)}/collections?${pageQuery(cursor, size)}`
    ),

  search: (q: string, cursor?: string | null, size = 20) =>
    api<CursorPage<CollectionSearchResult>>(
      `/api/collections/search?${searchQuery(q, cursor, size)}`
    ),

  posts: (id: string, cursor?: string | null, size = 20) =>
    api<CursorPage<Post>>(`/api/collections/${enc(id)}/posts?${pageQuery(cursor, size)}`),

  addPost: (id: string, postId: string) =>
    api<void>(`/api/collections/${enc(id)}/posts/${enc(postId)}`, { method: "PUT" }),

  removePost: (id: string, postId: string) =>
    api<void>(`/api/collections/${enc(id)}/posts/${enc(postId)}`, { method: "DELETE" }),

  /** The caller's collections that contain this post */
  containingPost: (postId: string) =>
    api<CollectionSummary[]>(`/api/posts/${enc(postId)}/collections`),

  save: (id: string) => api<void>(`/api/collections/${enc(id)}/save`, { method: "PUT" }),

  unsave: (id: string) => api<void>(`/api/collections/${enc(id)}/save`, { method: "DELETE" }),

  /** The caller's saved collections (each carries its owner) */
  saved: (cursor?: string | null, size = 20) =>
    api<CursorPage<CollectionSearchResult>>(`/api/collections/saved-collections?${pageQuery(cursor, size)}`),
};