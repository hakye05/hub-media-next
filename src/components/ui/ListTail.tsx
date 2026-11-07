import type { ReactNode } from "react";
import ListMessage from "./ListMessage";
import LoadMoreSentinel from "./LoadMoreSentinel";

type Props = {
  loading: boolean;
  error: string | null;
  retry: () => void;
  /** Whether to render the empty-state message (list empty after loading). */
  showEmpty: boolean;
  emptyMessage: ReactNode;
  hasMore: boolean;
  loadMore: () => void;
  rootMargin?: string;
};

export default function ListTail({
  loading,
  error,
  retry,
  showEmpty,
  emptyMessage,
  hasMore,
  loadMore,
  rootMargin,
}: Props) {
  return (
    <>
      {loading && <ListMessage>Loading…</ListMessage>}
      {error && (
        <ListMessage actionLabel="Try again" onAction={retry}>
          {error}
        </ListMessage>
      )}
      {!loading && !error && showEmpty && <ListMessage>{emptyMessage}</ListMessage>}
      {hasMore && !loading && !error && (
        <LoadMoreSentinel onVisible={loadMore} rootMargin={rootMargin} />
      )}
    </>
  );
}