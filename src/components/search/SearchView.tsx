"use client";

import { useSearchParams } from "next/navigation";
import { useAuth } from "../auth/AuthProvider";
import SearchBar from "../navbar/SearchBar";
import PeopleResults from "./PeopleResults";
import PostResults from "./PostResults";
import SearchTabs, { type SearchType } from "./SearchTabs";

export default function SearchView() {
    const params = useSearchParams();
    const q = (params.get("q") ?? "").trim();
    const type: SearchType = params.get("type") === "people" ? "people" : "posts";
    const { user, status } = useAuth();

    return (
        <main className="w-full flex-1 px-9">
            {!user && status !== "loading" && (
                <div className="mb-2">
                    <SearchBar key={q} initialValue={q} />
                </div>
            )}

            {!q ? (
                <p className="mt-6 text-[15px] text-neutral-500">Type something in the search bar.</p>
            ) : (
                <>
                    <div className="mb-8 flex justify-center">
                        <SearchTabs q={q} active={type} />
                    </div>
                    {type === "posts" ? <PostResults key={q} q={q} /> : <PeopleResults key={q} q={q} />}
                </>
            )}
        </main>
    );
}