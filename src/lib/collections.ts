import { api } from "./api";
import { pageQuery, type CursorPage } from "./pagination";
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

  posts: (id: string, cursor?: string | null, size = 20) =>
    api<CursorPage<Post>>(`/api/collections/${enc(id)}/posts?${pageQuery(cursor, size)}`),

  addPost: (id: string, postId: string) =>
    api<void>(`/api/collections/${enc(id)}/posts/${enc(postId)}`, { method: "PUT" }),

  removePost: (id: string, postId: string) =>
    api<void>(`/api/collections/${enc(id)}/posts/${enc(postId)}`, { method: "DELETE" }),

  /** The caller's collections that contain this post */
  containingPost: (postId: string) =>
    api<CollectionSummary[]>(`/api/posts/${enc(postId)}/collections`),
};