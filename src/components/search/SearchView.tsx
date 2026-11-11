"use client";

import { useSearchParams } from "next/navigation";
import { parseColorParam } from "@/lib/color";
import PeopleResults from "./PeopleResults";
import PostResults from "./PostResults";
import SearchTabs, { type SearchType } from "./SearchTabs";
import CollectionResults from "./CollectionResults";

const TYPES: SearchType[] = ["posts", "people", "collections"];

export default function SearchView() {
  const params = useSearchParams();
  const q = (params.get("q") ?? "").trim();
  const color = parseColorParam(params.get("color"));
  const requested = TYPES.find((t) => t === params.get("type")) ?? "posts";
  const type = q ? requested : "posts"; // people and collections need text

  return (
    <main className="w-full flex-1 px-3 pb-5 sm:px-9">
      {!q && !color ? (
        <p className="mt-6 text-center text-[15px] text-neutral-500">
          Type something or pick a color in the search bar.
        </p>
      ) : (
        <>
          {q && (
            <div className="mb-5 flex justify-center sm:mb-8">
              <SearchTabs q={q} color={color} active={type} />
            </div>
          )}
          {type === "posts" ? (
            <div className={q ? "-mt-2" : undefined}>
              <PostResults key={`${q}|${color ?? ""}`} q={q} color={color} />
            </div>
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