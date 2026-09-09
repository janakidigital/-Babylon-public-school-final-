import test from "node:test";
import assert from "node:assert/strict";
import { formatCalendarDate, formatDateParts } from "../src/lib/format.js";

test("document dates display the selected day in different time zones", () => {
  const previousTimeZone = process.env.TZ;
  try {
    for (const timeZone of ["America/Los_Angeles", "Asia/Kathmandu", "Pacific/Auckland"]) {
      process.env.TZ = timeZone;
      assert.equal(formatCalendarDate("2026-09-09T00:00:00.000Z"), "9 September 2026");
      assert.equal(formatCalendarDate("2024-02-29"), "29 February 2024");
      assert.deepEqual(formatDateParts("2026-01-01T00:00:00.000Z"), {
        day: "01", month: "Jan", year: "2026", full: "1 January 2026",
      });
    }
  } finally {
    if (previousTimeZone === undefined) delete process.env.TZ;
    else process.env.TZ = previousTimeZone;
  }
});

test("undated documents do not display an invented date", () => {
  for (const value of [undefined, null, "", "invalid"]) {
    assert.equal(formatCalendarDate(value), "");
    assert.equal(formatDateParts(value).full, "");
  }
});
