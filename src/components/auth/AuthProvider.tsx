"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { refreshSession, setAccessToken, type AuthResponse, type User } from "@/lib/api";
import { authApi, type RegisterPayload } from "@/lib/authApi";
import { usersApi } from "@/lib/users";
import { AuthModalProvider } from "./AuthModalProvider";

export type AuthStatus = "loading" | "authenticated" | "guest";

// The auth response carries no avatarUrl, so it's filled in from /users/me.
export type SessionUser = User & { avatarUrl: string | null };

type SessionValue = {
  user: SessionUser | null;
  status: AuthStatus;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (patch: Partial<SessionUser>) => void;
  setSession: (r: AuthResponse) => void;
};

const SessionContext = createContext<SessionValue | null>(null);

export function useAuth() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");

  const applySession = useCallback((r: AuthResponse) => {
    setAccessToken(r.accessToken);
    setUser({ ...r.user, avatarUrl: null });
    setStatus("authenticated");

    // Fetch the avatar URL the auth response doesn't include. Ignore failures:
    // the navbar just falls back to initials.
    usersApi
      .getMe()
      .then((me) => setUser((u) => (u && u.id === me.id ? { ...u, avatarUrl: me.avatarUrl } : u)))
      .catch(() => {});
  }, []);

  // Restore the session from the refresh cookie. Guests just end up as "guest".
  useEffect(() => {
    let active = true;
    refreshSession()
      .then((r) => active && applySession(r))
      .catch(() => {
        if (!active) return;
        setAccessToken(null);
        setUser(null);
        setStatus("guest");
      });
    return () => {
      active = false;
    };
  }, [applySession]);

  const login = useCallback(
    async (email: string, password: string) => applySession(await authApi.login(email, password)),
    [applySession]
  );

  const register = useCallback(
    async (payload: RegisterPayload) => applySession(await authApi.register(payload)),
    [applySession]
  );

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      setAccessToken(null);
      setUser(null);
      setStatus("guest");
    }
  }, []);

  const updateUser = useCallback(
    (patch: Partial<SessionUser>) => setUser((u) => (u ? { ...u, ...patch } : u)),
    []
  );

  const value = useMemo(
    () => ({ user, status, login, register, logout, updateUser, setSession: applySession }),
    [user, status, login, register, logout, updateUser, applySession]
  );

  return (
    <SessionContext.Provider value={value}>
      <AuthModalProvider>{children}</AuthModalProvider>
    </SessionContext.Provider>
  );
}