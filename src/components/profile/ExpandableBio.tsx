"use client";

import { useState } from "react";

type Props = { text: string; limit?: number };

export default function ExpandableBio({ text, limit = 120 }: Props) {
  const [expanded, setExpanded] = useState(false);
  const long = text.length > limit;
  const shown = expanded || !long ? text : `${text.slice(0, limit).trimEnd()}…`;

  return (
    <p className="mt-2 whitespace-pre-line wrap-break-word text-[15px] leading-relaxed text-neutral-800">
      {shown}
      {long && (
        <>
          {" "}
          <button
            type="button"
            onClick={() => setExpanded((e) => !e)}
            className="font-semibold text-neutral-900 hover:underline"
          >
            {expanded ? "less" : "more"}
          </button>
        </>
      )}
    </p>
  );
}