export const postCountLabel = (count: number) => `${count} ${count === 1 ? "post" : "posts"}`;

export const collectionSubtitle = (c: { postCount: number; isPublic: boolean }) =>
  `${postCountLabel(c.postCount)}${c.isPublic ? "" : " · Private"}`;