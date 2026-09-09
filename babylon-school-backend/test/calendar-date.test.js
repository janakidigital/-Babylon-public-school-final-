const test = require("node:test");
const assert = require("node:assert/strict");
const { parseCalendarDate } = require("../src/utils/calendarDate");

test("calendar dates accept date input and round-trip API timestamps", () => {
  for (const value of ["2024-02-29", "2024-02-29T00:00:00.000Z", "2024-02-29T12:30:00Z"]) {
    assert.equal(parseCalendarDate(value).toISOString(), "2024-02-29T00:00:00.000Z");
  }
  assert.equal(parseCalendarDate(undefined), undefined);
  assert.equal(parseCalendarDate(""), null);
  assert.equal(parseCalendarDate(null), null);
});

test("calendar dates reject invalid days, malformed values and missing required dates", () => {
  for (const value of ["2025-02-29", "2026-04-31T00:00:00.000Z", "2026-01-01T25:00:00Z", "09/09/2026", [], {}, 2026]) {
    assert.throws(() => parseCalendarDate(value, "Album date"), { statusCode: 400 });
  }
  for (const value of [undefined, null, ""]) {
    assert.throws(() => parseCalendarDate(value, "Event date", true), { statusCode: 400, message: "Event date is required" });
  }
});
