import { useCallback, useState } from "react";
import { getErrorMessage } from "@/lib/errors";
import { postsApi } from "@/lib/posts";

export function useDeletePost(postId: string, onDeleted: () => void) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(async () => {
    setBusy(true);
    setError(null);
    try {
      await postsApi.delete(postId);
      onDeleted();
    } catch (err) {
      setError(getErrorMessage(err));
      setBusy(false);
    }
  }, [postId, onDeleted]);

  return { busy, error, run };
}