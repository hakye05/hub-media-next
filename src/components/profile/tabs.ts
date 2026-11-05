export const PROFILE_TABS = [
  { label: "Posts", segment: null },
  { label: "Collections", segment: "collections" },
  { label: "Saved", segment: "saved" },
] as const;

/** Posts lives at /username, every other tab at /username/<segment> */
export const tabHref = (username: string, segment: string | null) =>
  segment ? `/${username}/${segment}` : `/${username}`;