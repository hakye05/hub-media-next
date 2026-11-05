import { useCallback, useEffect, useState } from "react";
import { ALLOWED_IMAGE_TYPES } from "@/lib/upload";

/**
 * Local draft of the banner change. Nothing is sent to the server until the
 * modal's Accept button, because completing a BANNER upload attaches it right away.
 */
export function useBannerEditor(currentUrl: string | null) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null); // blob URL of the picked file
  const [removed, setRemoved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Free the previous blob URL whenever the preview changes or the modal closes
  useEffect(
    () => () => {
      if (preview) URL.revokeObjectURL(preview);
    },
    [preview]
  );

  const pick = useCallback((next: File) => {
    if (!ALLOWED_IMAGE_TYPES.includes(next.type)) {
      setError("Use a JPG, PNG or WebP image.");
      return;
    }
    setError(null);
    setRemoved(false);
    setFile(next);
    setPreview(URL.createObjectURL(next));
  }, []);

  const clear = useCallback(() => {
    setError(null);
    setFile(null);
    setPreview(null);
    setRemoved(true);
  }, []);

  return {
    file,
    error,
    /** What the upload area shows: the new pick, else the current banner unless it was removed */
    shown: preview ?? (removed ? null : currentUrl),
    /** Something to save: a new image, or removal of an existing one */
    hasChange: file !== null || (removed && currentUrl !== null),
    pick,
    clear,
  };
}