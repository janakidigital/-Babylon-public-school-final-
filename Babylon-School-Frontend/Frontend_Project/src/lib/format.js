export function formatDateParts(value) {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) {
    return { day: "--", month: "---", year: "", full: "" };
  }
  return {
    day: String(date.getDate()).padStart(2, "0"),
    month: date.toLocaleString("en", { month: "short" }),
    year: String(date.getFullYear()),
    full: date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
  };
}

export function itemId(item) {
  return item?._id || item?.slug || item?.id;
}
