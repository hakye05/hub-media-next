"use client";

import { useEffect, useState } from "react";
import { IconToolbarButton } from "./Button";
import CheckIcon from "../icons/CheckIcon";
import LinkIcon from "../icons/LinkIcon";

type Props = { path: string; label?: string };

export default function CopyLinkButton({ path, label = "Copy link" }: Props) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}${path}`);
      setCopied(true);
    } catch {
      /* clipboard not available */
    }
  }

  return (
    <IconToolbarButton label={copied ? "Link copied" : label} onClick={copy}>
      {copied ? <CheckIcon /> : <LinkIcon />}
    </IconToolbarButton>
  );
}