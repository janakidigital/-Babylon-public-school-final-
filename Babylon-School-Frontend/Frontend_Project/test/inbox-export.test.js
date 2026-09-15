import { test } from "node:test";
import assert from "node:assert/strict";
import ExcelJS from "exceljs";
import { createInboxWorkbook } from "../src/lib/inboxExport.js";

async function roundTrip(kind, records) {
  const original = await createInboxWorkbook(kind, records, { baseUrl: "https://school.example" });
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(await original.xlsx.writeBuffer());
  return workbook.worksheets[0];
}

function rowByHeader(sheet, rowNumber = 2) {
  return Object.fromEntries(sheet.getRow(1).values.slice(1).map((header, index) =>
    [header, sheet.getRow(rowNumber).getCell(index + 1)]));
}

const timestamps = {
  _id: "123456789012345678901234",
  createdAt: "2026-09-15T12:34:56.789Z",
  updatedAt: "2026-09-16T01:02:03.456Z",
};

test("admissions workbook retains every saved field, dates and international text", async () => {
  const submission = {
    ...timestamps,
    name: "सीता श्रेष्ठ",
    email: "sita@example.com",
    phone: "+977 0123456789",
    dateOfBirth: "2010-01-02T00:00:00.000Z",
    gender: "female",
    temporaryAddress: "Kathmandu, Nepal\nWard 10",
    permanentAddress: "Bhaktapur & Kathmandu",
    parentName: "Parent Name",
    parentPhone: "0012345678",
    program: "Class 10",
    previousSchool: "Previous School",
    message: 'Please call after 5, "thank you"!\nनमस्ते 👋',
    status: "reviewing",
    adminNote: "Documents checked",
  };
  const sheet = await roundTrip("admissions", [submission]);
  assert.equal(sheet.name, "Admissions");
  assert.equal(sheet.rowCount, 2);
  assert.equal(sheet.columnCount, 17);
  const row = rowByHeader(sheet);
  assert.deepEqual(Object.fromEntries(Object.entries(row).map(([key, cell]) => [key, cell.value])), {
    "Submission ID": submission._id,
    "Submitted At (UTC)": "2026-09-15 12:34:56.789",
    "Updated At (UTC)": "2026-09-16 01:02:03.456",
    "Student Name": submission.name,
    "Email": submission.email,
    "Phone": submission.phone,
    "Date of Birth": "2010-01-02",
    "Gender": submission.gender,
    "Temporary Address": submission.temporaryAddress,
    "Permanent Address": submission.permanentAddress,
    "Parent / Guardian Name": submission.parentName,
    "Parent / Guardian Phone": submission.parentPhone,
    "Programme": submission.program,
    "Previous School": submission.previousSchool,
    "Applicant Message": submission.message,
    "Status": submission.status,
    "Admin Note": submission.adminNote,
  });
  assert.equal(row.Phone.type, ExcelJS.ValueType.String);
  assert.equal(row.Phone.numFmt, "@");
  assert.equal(sheet.views[0].ySplit, 1);
  assert.equal(sheet.getCell("A1").font.bold, true);
  assert.equal(sheet.autoFilter, "A1:Q2");
});

test("contact download contains the entire list and formula-like input stays literal text", async () => {
  const messages = ['=HYPERLINK("https://example.com", "click")', "+SUM(1,2)", "-1+2", "@SUM(A1:A2)"];
  const records = Array.from({ length: 205 }, (_, i) => ({
    ...timestamps,
    _id: String(i), name: `Sender ${i}`, email: `sender${i}@example.com`,
    phone: "0098765432", subject: "Question", message: messages[i % messages.length],
    status: "new", adminNote: "Follow up",
  }));
  const sheet = await roundTrip("contacts", records);
  assert.equal(sheet.name, "Contact Inbox");
  assert.equal(sheet.rowCount, 206);
  assert.equal(sheet.columnCount, 10);
  records.forEach((record, index) => {
    const row = rowByHeader(sheet, index + 2);
    assert.equal(row["Submission ID"].value, record._id);
    assert.equal(row.Message.value, record.message);
    assert.equal(row.Message.type, ExcelJS.ValueType.String);
    assert.equal(row.Message.formula, undefined);
    assert.equal(row.Phone.value, "0098765432");
    assert.equal(row.Subject.value, "Question");
    assert.equal(row["Admin Note"].value, "Follow up");
  });
});

test("career applications include full letters, usable CV links and legacy field aliases", async () => {
  const letter = "My teaching experience.\n".repeat(30);
  const sheet = await roundTrip("career-applications", [
    { ...timestamps, careerTitle: "Teacher", name: "Applicant", email: "teacher@example.com", phone: "+9770123456789", coverLetter: letter, resumeUrl: "/babylon-school/careers/my%20cv.pdf", status: "pending" },
    { fullName: "Legacy Applicant", position: "Coordinator", cv: "https://files.example/cv.pdf" },
    { name: "No attachment" },
    { name: "Invalid attachment", resumeUrl: "javascript:alert(1)" },
  ]);
  const row = rowByHeader(sheet);
  assert.equal(sheet.columnCount, 10);
  assert.equal(row["Applied For"].value, "Teacher");
  assert.equal(row["Cover Letter"].value, letter);
  assert.deepEqual(row["CV / Resume URL"].value, {
    text: "https://school.example/babylon-school/careers/my%20cv.pdf",
    hyperlink: "https://school.example/babylon-school/careers/my%20cv.pdf",
  });
  const legacy = rowByHeader(sheet, 3);
  assert.equal(legacy["Applicant Name"].value, "Legacy Applicant");
  assert.equal(legacy["Applied For"].value, "Coordinator");
  assert.equal(legacy["CV / Resume URL"].hyperlink, "https://files.example/cv.pdf");
  assert.ok(!rowByHeader(sheet, 4)["CV / Resume URL"].value);
  assert.equal(rowByHeader(sheet, 5)["CV / Resume URL"].value, "javascript:alert(1)");
  assert.equal(rowByHeader(sheet, 5)["CV / Resume URL"].hyperlink, undefined);
});

test("messages exceeding Excel's cell limit continue without losing text or splitting emoji", async () => {
  const message = "x".repeat(32766) + "👋" + "नमस्ते\n".repeat(7000);
  const sheet = await roundTrip("contacts", [{ name: "Long message", message }, { name: "Short message", message: "Hello" }]);
  const row = rowByHeader(sheet);
  const parts = Object.entries(row).filter(([header]) => header.startsWith("Message")).map(([, cell]) => cell.value);
  assert.ok(parts.length > 1);
  assert.equal(parts.join(""), message);
  assert.ok(parts.every(part => part.length <= 32767));
  assert.equal(rowByHeader(sheet, 3).Message.value, "Hello");
});

test("Excel escapes, control characters and CRLF line breaks preserve the submitted text", async () => {
  const message = "literal _x0041_ and _x000A_ and _x005F_x0041_\r\nNext line\rReturn\u0001Control";
  const sheet = await roundTrip("contacts", [{ name: "Text escapes", message }]);
  assert.equal(rowByHeader(sheet).Message.value, message);
  const resumeUrl = "https://files.example/cv_x0041_.pdf";
  const careerSheet = await roundTrip("career-applications", [{ name: "Applicant", resumeUrl }]);
  assert.deepEqual(rowByHeader(careerSheet)["CV / Resume URL"].value, { text: resumeUrl, hyperlink: resumeUrl });
});

test("empty and invalid export inputs cannot produce a misleading data workbook", async () => {
  const sheet = await roundTrip("contacts", []);
  assert.equal(sheet.rowCount, 1);
  await assert.rejects(() => createInboxWorkbook("unknown", []), /Unknown inbox/);
  await assert.rejects(() => createInboxWorkbook("contacts", {}), /Unable to read/);
});
