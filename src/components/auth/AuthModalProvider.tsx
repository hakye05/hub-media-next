"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import AuthModal from "./AuthModal";

export type AuthMode = "login" | "signup";

type AuthModalValue = {
  openAuth: (mode: AuthMode) => void;
  closeAuth: () => void;
};

const AuthModalContext = createContext<AuthModalValue | null>(null);

export function useAuthModal() {
  const ctx = useContext(AuthModalContext);
  if (!ctx) throw new Error("useAuthModal must be used inside <AuthProvider>");
  return ctx;
}

/** Opening/closing the auth modal must not re-render session consumers. */
export function AuthModalProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<AuthMode | null>(null);

  const openAuth = useCallback((m: AuthMode) => setMode(m), []);
  const closeAuth = useCallback(() => setMode(null), []);

  const value = useMemo(() => ({ openAuth, closeAuth }), [openAuth, closeAuth]);

  return (
    <AuthModalContext.Provider value={value}>
      {children}
      {mode && (
        <AuthModal
          mode={mode}
          onClose={closeAuth}
          onSwitch={() => setMode(mode === "login" ? "signup" : "login")}
        />
      )}
    </AuthModalContext.Provider>
  );
}