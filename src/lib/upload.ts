import { api, ApiError } from "./api";

export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export type UploadKind = "AVATAR" | "BANNER" | "POST";

type PresignedUpload = {
  uploadId: string;
  uploadUrl: string;
  method: string;
  headers: Record<string, string>;
  expiresAt: string;
};

export type CompletedUpload = {
  uploadId: string;
  key: string;
  url: string; // public URL of the final image
};

export const uploadsApi = {
  /** create -> PUT straight to R2 -> complete. For AVATAR the backend also attaches it to the user. */
  async uploadImage(kind: UploadKind, file: File): Promise<CompletedUpload> {
    const presigned = await api<PresignedUpload>("/api/uploads", {
      method: "POST",
      json: { kind, contentType: file.type, size: file.size },
    });

    // Direct to R2: plain fetch, no cookies and no Authorization header
    let put: Response;
    try {
      put = await fetch(presigned.uploadUrl, {
        method: presigned.method,
        headers: presigned.headers,
        body: file,
      });
    } catch {
      throw new ApiError(
        0,
        "Couldn't reach the storage server. Check your R2 bucket CORS settings."
      );
    }
    if (!put.ok) throw new ApiError(put.status, "Upload failed. Please try again.");

    return api<CompletedUpload>(`/api/uploads/${presigned.uploadId}/complete`, {
      method: "POST",
    });
  },
};