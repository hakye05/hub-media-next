import { api, AuthResponse } from "./api";

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
  username: string;
  displayName: string;
  avatarUrl: string | null;
};

const json = (body: unknown, method: string) => ({ method, json: body });

export const usersApi = {
  getProfile: (username: string) =>
    api<PublicProfile>(`/api/users/${encodeURIComponent(username)}`),

  getMe: () => api<UserMe>("/api/users/me"),

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
};