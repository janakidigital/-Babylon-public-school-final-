// Simple validation middleware factory for required fields
// Usage: validateBody(["name","email"]) -> middleware

const validateBody = (requiredFields = []) => (req, res, next) => {
  const missing = [];

  requiredFields.forEach((field) => {
    const val = req.body[field];
    if (val === undefined || val === null || String(val).trim() === "") missing.push(field);
  });

  if (missing.length) {
    return res.status(400).json({ success: false, message: `Missing or empty fields: ${missing.join(", ")}` });
  }

  next();
};

module.exports = { validateBody };
