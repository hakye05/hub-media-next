"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";

/**
 * Returns the session user once known, or null while loading and while a
 * guest is being redirected to `redirectTo`.
 */
export function useRequireAuth(redirectTo = "/") {
  const { status, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (status !== "loading" && !user) router.replace(redirectTo);
  }, [status, user, router, redirectTo]);

  return status === "loading" || !user ? null : user;
}