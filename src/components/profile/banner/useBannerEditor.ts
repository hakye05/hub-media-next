import { useCallback, useEffect, useState } from "react";
import type { Area, Point } from "react-easy-crop";
import { CropError, cropToFile } from "@/lib/cropImage";
import { ALLOWED_IMAGE_TYPES } from "@/lib/upload";
import { BANNER_MAX_WIDTH } from "./constants";

const ORIGIN: Point = { x: 0, y: 0 };

/**
 * Local draft of the banner change. Nothing is sent to the server until the
 * modal's Accept button, because completing a BANNER upload attaches it right away.
 */
export function useBannerEditor(currentUrl: string | null) {
  const [preview, setPreview] = useState<string | null>(null); // blob URL of the picked file
  const [removed, setRemoved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [position, setPosition] = useState<Point>(ORIGIN);
  const [zoom, setZoom] = useState(1);
  const [area, setArea] = useState<Area | null>(null); // crop rectangle in source pixels

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
    setPosition(ORIGIN);
    setZoom(1);
    setArea(null);
    setPreview(URL.createObjectURL(next));
  }, []);

  const clear = useCallback(() => {
    setError(null);
    setRemoved(true);
    setPosition(ORIGIN);
    setZoom(1);
    setArea(null);
    setPreview(null);
  }, []);

  /** The cropped version of the picked image, ready to upload */
  const cropFile = useCallback(async () => {
    if (!preview || !area) throw new CropError("Couldn't process the image. Try another one.");
    return cropToFile(preview, area, { maxWidth: BANNER_MAX_WIDTH, fileName: "banner.jpg" });
  }, [preview, area]);

  return {
    error,
    /** Blob URL of a newly picked image; shown in the cropper */
    preview,
    /** Current banner shown in the upload area, unless it was removed */
    existingUrl: removed ? null : currentUrl,
    position,
    setPosition,
    zoom,
    setZoom,
    setArea,
    hasNewImage: preview !== null,
    /** A new image whose crop area is measured, or removal of an existing banner */
    canSave: preview !== null ? area !== null : removed && currentUrl !== null,
    pick,
    clear,
    cropFile,
  };
}