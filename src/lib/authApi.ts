import { api, type AuthResponse } from "./api";

export type RegisterPayload = {
  email: string;
  password: string;
  displayName: string;
  username: string;
  age: number;
  gender: string;
};

type Availability = { available: boolean };

export const authApi = {
  login: (email: string, password: string) =>
    api<AuthResponse>("/api/auth/login", {
      method: "POST",
      json: { email, password },
    }),

  register: (payload: RegisterPayload) =>
    api<AuthResponse>("/api/auth/register", { method: "POST", json: payload }),

  logout: () => api<void>("/api/auth/logout", { method: "POST" }),

  checkEmail: (email: string) =>
    api<Availability>(`/api/auth/check-email?email=${encodeURIComponent(email)}`),

  checkUsername: (username: string) =>
    api<Availability>(
      `/api/auth/check-username?username=${encodeURIComponent(username)}`
    ),
};