const commonColumns = [
  ["_id", "Submission ID", 28],
  ["createdAt", "Submitted At (UTC)", 27, "timestamp"],
  ["updatedAt", "Updated At (UTC)", 27, "timestamp"],
];

const exportConfig = {
  admissions: {
    sheetName: "Admissions",
    columns: [
      ...commonColumns,
      ["name", "Student Name", 26],
      ["email", "Email", 32],
      ["phone", "Phone", 22],
      ["dateOfBirth", "Date of Birth", 16, "date"],
      ["gender", "Gender", 14],
      ["temporaryAddress", "Temporary Address", 40],
      ["permanentAddress", "Permanent Address", 40],
      ["parentName", "Parent / Guardian Name", 28],
      ["parentPhone", "Parent / Guardian Phone", 24],
      ["program", "Programme", 26],
      ["previousSchool", "Previous School", 30],
      ["message", "Applicant Message", 60],
      ["status", "Status", 16],
      ["adminNote", "Admin Note", 60],
    ],
  },
  contacts: {
    sheetName: "Contact Inbox",
    columns: [
      ...commonColumns,
      ["name", "Name", 26],
      ["email", "Email", 32],
      ["phone", "Phone", 22],
      ["subject", "Subject", 40],
      ["message", "Message", 60],
      ["status", "Status", 16],
      ["adminNote", "Admin Note", 60],
    ],
  },
  "career-applications": {
    sheetName: "Career Applications",
    columns: [
      ...commonColumns,
      ["careerTitle", "Applied For", 30],
      ["name", "Applicant Name", 26],
      ["email", "Email", 32],
      ["phone", "Phone", 22],
      ["coverLetter", "Cover Letter", 60],
      ["resumeUrl", "CV / Resume URL", 60, "link"],
      ["status", "Status", 16],
    ],
  },
};

function fieldValue(item, key, type, baseUrl) {
  const aliases = {
    name: ["fullName"],
    careerTitle: ["position", "jobTitle"],
    resumeUrl: ["cv", "resume", "cvUrl"],
  };
  let value = item[key];
  if (!value && aliases[key]) {
    value = aliases[key].map(alias => item[alias]).find(Boolean);
  }
  if (value == null) return "";
  const text = String(value);

  if (type === "date" || type === "timestamp") {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return text;
    return type === "date"
      ? date.toISOString().slice(0, 10)
      : date.toISOString().replace("T", " ").replace("Z", "");
  }
  if (type === "link" && text.trim()) {
    try {
      const url = new URL(text, baseUrl);
      if (["http:", "https:"].includes(url.protocol)) return url.href;
    } catch {
      // Keep a legacy or malformed value as text so it is still exported.
    }
  }
  return text;
}

// Excel limits a cell to 32,767 characters. Continue unusually long messages
// in adjacent columns instead of truncating the submission or corrupting it.
function splitCellText(value) {
  const parts = [];
  let offset = 0;
  do {
    let end = Math.min(offset + 32767, value.length);
    if (end < value.length && /[\uD800-\uDBFF]/.test(value[end - 1])) end -= 1;
    parts.push(value.slice(offset, end));
    offset = end;
  } while (offset < value.length);
  return parts;
}

function excelText(value) {
  // OOXML treats _xNNNN_ as an escape. Preserve literal submitted sequences
  // and XML control characters instead of letting the writer change the text.
  return value
    .replace(/_(?=x[0-9a-f]{4}_)/gi, "_x005F_")
    .replace(/[\u0000-\u0008\u000B-\u001F\u007F\uFFFE\uFFFF]/g,
      char => `_x${char.charCodeAt(0).toString(16).toUpperCase().padStart(4, "0")}_`);
}

export async function createInboxWorkbook(kind, records, { baseUrl } = {}) {
  const config = exportConfig[kind];
  if (!config) throw new Error("Unknown inbox for Excel export.");
  if (!Array.isArray(records)) throw new Error("Unable to read the submissions for export.");

  // Load the spreadsheet library only when an administrator exports an inbox.
  const { default: ExcelJS } = await import("exceljs");
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Babylon School";
  const sheet = workbook.addWorksheet(config.sheetName, {
    views: [{ state: "frozen", ySplit: 1 }],
  });
  const rows = records.map(item => config.columns.map(([key, , , type]) =>
    splitCellText(fieldValue(item, key, type, baseUrl))));
  const columns = config.columns.flatMap(([, header, width, type], fieldIndex) => {
    const partCount = rows.reduce((count, row) => Math.max(count, row[fieldIndex].length), 1);
    return Array.from({ length: partCount }, (_, partIndex) => ({
      header: partIndex ? `${header} (continued ${partIndex + 1})` : header,
      width,
      type,
      fieldIndex,
      partIndex,
      canLink: partCount === 1,
    }));
  });
  sheet.columns = columns.map(({ header, width }) => ({ header, width }));

  for (const values of rows) {
    const row = sheet.addRow(columns.map(({ fieldIndex, partIndex }) => values[fieldIndex][partIndex] || ""));
    row.eachCell((cell, index) => {
      // Explicit text cells preserve phone prefixes/leading zeroes and ensure
      // website input beginning with =, +, -, or @ never becomes a formula.
      cell.numFmt = "@";
      cell.alignment = { vertical: "top", wrapText: true };
      const column = columns[index - 1];
      if (column.type === "link" && column.canLink && /^https?:\/\//i.test(cell.value)) {
        cell.value = { text: excelText(cell.value), hyperlink: cell.value };
        cell.font = { color: { argb: "FF2563EB" }, underline: true };
      } else {
        cell.value = excelText(cell.value);
      }
    });
  }

  const header = sheet.getRow(1);
  header.height = 30;
  header.eachCell(cell => {
    cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF0A192F" } };
    cell.alignment = { vertical: "middle", wrapText: true };
  });
  sheet.autoFilter = {
    from: { row: 1, column: 1 },
    to: { row: Math.max(sheet.rowCount, 1), column: columns.length },
  };
  return workbook;
}

export async function downloadInboxExcel(kind, records) {
  if (!Array.isArray(records) || records.length === 0) {
    throw new Error("There are no submissions to download.");
  }
  const workbook = await createInboxWorkbook(kind, records, { baseUrl: window.location.origin });
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const filename = `babylon-${kind}-${new Date().toISOString().slice(0, 10)}.xlsx`;
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  try {
    link.click();
  } finally {
    link.remove();
    // Give the browser time to start reading the download before releasing it.
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return { count: records.length, filename };
}
