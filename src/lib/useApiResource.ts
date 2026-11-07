"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ApiError } from "@/lib/api";
import { getErrorMessage } from "@/lib/errors";

export type Resource<T> =
  | { status: "loading" }
  | { status: "ready"; data: T }
  | { status: "notFound" }
  | { status: "error"; message: string };

type Options = {
  /** Gate fetching, e.g. until the session is known. */
  enabled?: boolean;
  /** Refetch when this changes, e.g. the viewer id. */
  refreshKey?: unknown;
};

/** Single-resource fetch with 404 mapping, an enable gate and manual reload. */
export function useApiResource<T>(
  key: string,
  load: () => Promise<T>,
  { enabled = true, refreshKey }: Options = {}
) {
  const [state, setState] = useState<{ key: string; result: Resource<T> } | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const loadRef = useRef(load);

  useEffect(() => {
    loadRef.current = load;
  });

  useEffect(() => {
    if (!enabled) return;
    let active = true;
    loadRef
      .current()
      .then((data) => active && setState({ key, result: { status: "ready", data } }))
      .catch((err) => {
        if (!active) return;
        const notFound = err instanceof ApiError && err.status === 404;
        setState({
          key,
          result: notFound
            ? { status: "notFound" }
            : { status: "error", message: getErrorMessage(err) },
        });
      });
    return () => {
      active = false;
    };
  }, [key, enabled, refreshKey, reloadKey]);

  const reload = useCallback(() => setReloadKey((k) => k + 1), []);

  const resource: Resource<T> =
    enabled && state && state.key === key ? state.result : { status: "loading" };

  return { resource, reload };
}