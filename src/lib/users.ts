import { api, AuthResponse } from "./api";
import { CursorPage, searchQuery } from "./pagination";

export type PublicProfile = {
  id: string;
  username: string;
  displayName: string;
  bio: string | null;
  avatarUrl: string | null;
  bannerUrl?: string | null;
  createdAt: string;
  followerCount: number;
  followingCount: number;
  isSelf: boolean;
  isFollowing: boolean;
};

export type UserMe = {
  id: string;
  email: string;
  displayName: string;
  username: string;
  age: number | null;
  gender: string | null;
  bio: string | null;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

export type UpdateProfilePayload = {
  displayName?: string;
  bio?: string; // empty string clears the bio
  gender?: string;
};

export type ProfileSummary = {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  isSelf: boolean;
  isFollowing: boolean;
};

const json = (body: unknown, method: string) => ({ method, json: body });

export const usersApi = {
  getProfile: (username: string) =>
    api<PublicProfile>(`/api/users/${encodeURIComponent(username)}`),

  getMe: () => api<UserMe>("/api/users/me"),

  deleteAccount: (currentPassword: string) =>
    api<void>("/api/users/me", json({ currentPassword }, "DELETE")),

  updateProfile: (payload: UpdateProfilePayload) =>
    api<UserMe>("/api/users/me", json(payload, "PATCH")),

  changeUsername: (username: string) =>
    api<UserMe>("/api/users/me/username", json({ username }, "PATCH")),

  changeEmail: (newEmail: string, currentPassword: string) =>
    api<UserMe>("/api/users/me/email", json({ newEmail, currentPassword }, "PATCH")),

  changePassword: (
    currentPassword: string,
    newPassword: string,
    logoutOtherDevices: boolean
  ) =>
    api<AuthResponse>(
      "/api/users/me/password",
      json({ currentPassword, newPassword, logoutOtherDevices }, "PATCH")
    ),

  changeAvatar: (uploadId: string) =>
    api<UserMe>("/api/users/me/avatar", json({ uploadId }, "PATCH")),

  removeAvatar: () => api<UserMe>("/api/users/me/avatar", { method: "DELETE" }),

  changeBanner: (uploadId: string) =>
    api<UserMe>("/api/users/me/banner", json({ uploadId }, "PATCH")),

  removeBanner: () => api<UserMe>("/api/users/me/banner", { method: "DELETE" }),

  search: (q: string, cursor?: string | null, size = 20) =>
    api<CursorPage<ProfileSummary>>(`/api/users/search?${searchQuery(q, cursor, size)}`),
};