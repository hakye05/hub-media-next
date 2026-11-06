import SearchView from "@/components/search/SearchView";
import { Suspense } from "react";

export default function SearchPage() {
  return (
    <Suspense>
      <SearchView />
    </Suspense>
  );
}