import { useCallback, useEffect, useRef, useState } from "react";
import { getErrorMessage } from "@/lib/errors";
import { ALLOWED_IMAGE_TYPES, uploadsApi } from "@/lib/upload";

/** Uploads the picked image right away and exposes its uploadId once it's done. */
export function useImageUpload() {
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadId, setUploadId] = useState<string | null>(null);
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
      const upload = await uploadsApi.uploadImage("POST", file);
      if (id === latest.current) setUploadId(upload.uploadId);
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
    setUploading(false);
    setError(null);
  }, []);

  return { preview, uploadId, uploading, error, pick, clear };
}