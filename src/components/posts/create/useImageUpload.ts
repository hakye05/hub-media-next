import { useCallback, useEffect, useRef, useState } from "react";
import { getErrorMessage } from "@/lib/errors";
import { ALLOWED_IMAGE_TYPES, uploadsApi } from "@/lib/upload";
import { extractImageColors } from "@/lib/extractImageColors";

/** Uploads the picked image right away and exposes its uploadId once it's done. */
export function useImageUpload() {
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadId, setUploadId] = useState<string | null>(null);
  const [colors, setColors] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const latest = useRef(0); // ignores results of superseded or cleared uploads

  // Free the previous blob URL whenever the preview changes or the modal closes
  useEffect(
    () => () => {
      if (preview) URL.revokeObjectURL(preview);
    },
    [preview]
  );

  const pick = useCallback(async (file: File) => {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setError("Use a JPG, PNG or WebP image.");
      return;
    }

    const id = ++latest.current;
    setError(null);
    setUploadId(null);
    setUploading(true);
    setPreview(URL.createObjectURL(file));

    try {
      // A failed color read must never block the post, so it falls back to no colors.
      const found = extractImageColors(file).catch(() => [] as string[]);
      const [upload, palette] = await Promise.all([
        uploadsApi.uploadImage("POST", file),
        found,
      ]);
      if (id === latest.current) {
        setColors(palette);
        setUploadId(upload.uploadId);
      }
    } catch (err) {
      if (id === latest.current) {
        setPreview(null);
        setError(getErrorMessage(err));
      }
    } finally {
      if (id === latest.current) setUploading(false);
    }
  }, []);

  const clear = useCallback(() => {
    latest.current++;
    setPreview(null);
    setUploadId(null);
    setColors([]);
    setUploading(false);
    setError(null);
  }, []);

  return { preview, uploadId, colors, uploading, error, pick, clear };
}