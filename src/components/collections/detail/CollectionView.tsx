"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import PageMessage from "@/components/ui/PageMessage";
import { ApiError } from "@/lib/api";
import { collectionsApi, type CollectionDetail } from "@/lib/collections";
import { getErrorMessage } from "@/lib/errors";
import CollectionHeader from "./CollectionHeader";
import CollectionPosts from "./CollectionPosts";

type Result = {
  id: string;
  collection: CollectionDetail | null;
  notFound: boolean;
  error: string | null;
};

export default function CollectionView({ id }: { id: string }) {
  const { status, user } = useAuth();
  const [result, setResult] = useState<Result | null>(null);
  const viewerId = user?.id ?? null;

  // Wait for the session check so the request carries the token (private collections)
  useEffect(() => {
    if (status === "loading") return;
    let active = true;
    collectionsApi
      .get(id)
      .then((collection) => {
        if (active) setResult({ id, collection, notFound: false, error: null });
      })
      .catch((err) => {
        if (!active) return;
        const notFound = err instanceof ApiError && err.status === 404;
        setResult({
          id,
          collection: null,
          notFound,
          error: notFound ? null : getErrorMessage(err),
        });
      });
    return () => {
      active = false;
    };
  }, [id, status, viewerId]);

  if (status === "loading" || !result || result.id !== id) return null;

  if (!result.collection) {
    return result.notFound ? (
      <PageMessage
        title="Collection not found"
        message="This collection doesn't exist."
      />
    ) : (
      <PageMessage title="Something went wrong" message={result.error ?? "Please try again."} />
    );
  }

  const { collection } = result;
  const isOwner = user?.username === collection.author.username; // only the owner can delete

  return (
    <main className="mx-auto flex w-full flex-col items-center gap-8 px-9 pb-16">
      <CollectionHeader collection={collection} isOwner={isOwner} />
      <CollectionPosts collectionId={collection.id} />
    </main>
  );
}