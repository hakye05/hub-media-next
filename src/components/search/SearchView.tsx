"use client";

import { useSearchParams } from "next/navigation";
import PeopleResults from "./PeopleResults";
import PostResults from "./PostResults";
import SearchTabs, { type SearchType } from "./SearchTabs";
import CollectionResults from "./CollectionResults";

const TYPES: SearchType[] = ["posts", "people", "collections"];

export default function SearchView() {
  const params = useSearchParams();
  const q = (params.get("q") ?? "").trim();
  const type = TYPES.find((t) => t === params.get("type")) ?? "posts";

  return (
    <main className="w-full flex-1 px-9 pb-5">
      {!q ? (
        <p className="mt-6 text-[15px] text-neutral-500">Type something in the search bar.</p>
      ) : (
        <>
          <div className="mb-8 flex justify-center">
            <SearchTabs q={q} active={type} />
          </div>
          {type === "posts" ? (
            <PostResults key={q} q={q} />
          ) : type === "people" ? (
            <PeopleResults key={q} q={q} />
          ) : (
            <CollectionResults key={q} q={q} />
          )}
        </>
      )}
    </main>
  );
}