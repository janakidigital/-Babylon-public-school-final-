function parseCalendarDate(value, label = "Date", required = false) {
  if (value === undefined || value === null || value === "") {
    if (!required) return value === undefined ? undefined : null;
    const error = new Error(`${label} is required`);
    error.statusCode = 400;
    throw error;
  }

  // Accept a date picker value or a UTC timestamp returned by the API.
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z)?$/.test(value)) {
    const date = new Date(value);
    const day = value.slice(0, 10);
    if (!Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === day) {
      return new Date(`${day}T00:00:00.000Z`);
    }
  }

  const error = new Error(`${label} must be a valid date in YYYY-MM-DD format`);
  error.statusCode = 400;
  throw error;
}

module.exports = { parseCalendarDate };
