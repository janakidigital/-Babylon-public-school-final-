export const POST_TYPES = [
  { value: "news", label: "News" },
  { value: "blog", label: "Blog" },
];

// Older entries have no postType and continue to appear as News.
export function getPostType(post) {
  return post?.postType === "blog" ? "blog" : "news";
}

export function getPostTypeLabel(post) {
  return getPostType(post) === "blog" ? "Blog" : "News";
}
