"use client";

import { useAuth } from "../auth/AuthProvider";
import Feed from "./Feed";
import Hero from "../landing/Hero";

export default function HomeContent() {
  const { status } = useAuth();

  // Session still being restored: render nothing
  if (status === "loading") return null;

  return status === "authenticated" ? <Feed /> : <Hero />;
}