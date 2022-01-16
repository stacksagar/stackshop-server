const errorHandler = (err, req, res, next) => {
  return res.status(err?.status_code || 500).json({
    success: false,
    error: err.message || "Server Error!",
  });
};

module.exports = errorHandler;
