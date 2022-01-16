const {validationResult} = require("express-validator");

const ValidationResult = (req) =>
  validationResult(req).formatWith((er) => er.msg);

module.exports = ValidationResult;
