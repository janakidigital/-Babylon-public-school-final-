import { formatCalendarDate } from "../../lib/format";

export default function ContentDate({ value }) {
  const label = formatCalendarDate(value);
  if (!label) return null;
  return (
    <time
      dateTime={String(value).slice(0, 10)}
      style={{ display: "block", margin: "6px 0", fontSize: "13px", color: "var(--muted, #718096)" }}
    >
      {label}
    </time>
  );
}
