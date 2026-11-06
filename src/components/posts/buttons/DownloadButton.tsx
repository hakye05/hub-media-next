"use client";

import { useState } from "react";
import { downloadImage } from "@/lib/downloadImage";
import DownloadIcon from "@/components/icons/DownloadIcon";
import { IconToolbarButton } from "@/components/ui/Button";

type Props = { url: string; title: string };

export default function DownloadButton({ url, title }: Props) {
  const [busy, setBusy] = useState(false);

  async function download() {
    setBusy(true);
    try {
      await downloadImage(url, title);
    } finally {
      setBusy(false); // a failed download no longer leaves the button disabled
    }
  }

  return (
    <IconToolbarButton
      label={busy ? "Downloading…" : "Download"}
      onClick={download}
      disabled={busy}
    >
      <DownloadIcon />
    </IconToolbarButton>
  );
}