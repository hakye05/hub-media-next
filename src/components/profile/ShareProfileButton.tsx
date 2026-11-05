"use client";

import { useEffect, useState } from "react";
import { ToolbarButton } from "../ui/Button";
import { tabHref } from "./tabs";

export default function ShareProfileButton({ username }: { username: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);

  async function share() {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}${tabHref(username, null)}`
      );
      setCopied(true);
    } catch {
      /* clipboard not available */
    }
  }

  return <ToolbarButton onClick={share}>{copied ? "Link copied" : "Share profile"}</ToolbarButton>;
}