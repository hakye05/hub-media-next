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
import AuthModal from "./AuthModal";
import { refreshSession, setAccessToken, type AuthResponse, type User } from "@/lib/api";
import { authApi, type RegisterPayload } from "@/lib/authApi";

export type AuthMode = "login" | "signup";
export type AuthStatus = "loading" | "authenticated" | "guest";

type AuthContextValue = {
  user: User | null;
  status: AuthStatus;
  openAuth: (mode: AuthMode) => void;
  closeAuth: () => void;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (patch: Partial<User>) => void;
  setSession: (r: AuthResponse) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<AuthMode | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");

  const applySession = useCallback((r: AuthResponse) => {
    setAccessToken(r.accessToken);
    setUser(r.user);
    setStatus("authenticated");
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

  const openAuth = useCallback((m: AuthMode) => setMode(m), []);
  const closeAuth = useCallback(() => setMode(null), []);

  const login = useCallback(
    async (email: string, password: string) =>
      applySession(await authApi.login(email, password)),
    [applySession]
  );

  const register = useCallback(
    async (payload: RegisterPayload) =>
      applySession(await authApi.register(payload)),
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
    (patch: Partial<User>) => setUser((u) => (u ? { ...u, ...patch } : u)),
    []
  );

  const value = useMemo(
    () => ({ user, status, openAuth, closeAuth, login, register, logout, updateUser, setSession: applySession }),
    [user, status, openAuth, closeAuth, login, register, logout, updateUser, applySession]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
      {mode && (
        <AuthModal
          mode={mode}
          onClose={closeAuth}
          onSwitch={() => setMode(mode === "login" ? "signup" : "login")}
        />
      )}
    </AuthContext.Provider>
  );
}