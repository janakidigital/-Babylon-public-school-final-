// Centralized error handling middleware
module.exports = (err, req, res, next) => {
  console.error("Unhandled error:", err);

  const status = err.status || 500;
  const message = err.message || "Internal Server Error";
  const errors = err.errors || undefined;

  res.status(status).json({
    success: false,
    message,
    ...(errors ? { errors } : {}),
  });
};