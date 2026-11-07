"use client";

import { useCallback, useState } from "react";
import { getErrorMessage } from "@/lib/errors";

/** Busy/error tracking for a one-shot async action (delete, submit, …). */
export function useAsyncAction(action: () => Promise<unknown>, onDone?: () => void) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(async () => {
    setBusy(true);
    setError(null);
    try {
      await action();
      onDone?.();
    } catch (err) {
      setError(getErrorMessage(err));
      setBusy(false);
    }
  }, [action, onDone]);

  return { busy, error, run };
}