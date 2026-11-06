import CollectionView from "@/components/collections/detail/CollectionView";
import { Suspense } from "react";

export const instant = false;

async function Collection({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <CollectionView id={id} />;
}

export default function CollectionPage({
  params,
}: {
  params: Promise<{ username: string; id: string }>;
}) {
  return (
    <Suspense fallback={null}>
      <Collection params={params} />
    </Suspense>
  );
}