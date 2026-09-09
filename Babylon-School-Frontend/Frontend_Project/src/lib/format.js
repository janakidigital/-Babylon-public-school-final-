export function formatDateParts(value) {
  const date = value ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) {
    return { day: "--", month: "---", year: "", full: "" };
  }
  return {
    day: String(date.getUTCDate()).padStart(2, "0"),
    month: date.toLocaleString("en", { month: "short", timeZone: "UTC" }),
    year: String(date.getUTCFullYear()),
    full: date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    }),
  };
}

// Admin-selected calendar dates are stored at UTC midnight by the API.
export function formatCalendarDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function itemId(item) {
  return item?._id || item?.slug || item?.id;
}
