class ErrorResponse extends Error {
  constructor(message, status_code) {
    super(message);
    this.status_code = status_code;
  }
}

module.exports = ErrorResponse;
