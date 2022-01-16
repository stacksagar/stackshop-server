const User = require("../models/User");
const ValidationResult = require("../utils/ValidationResult");
const SelectFirstError = require("../utils/SelectFirstError");

exports.signin = (role) => {
  return async (req, res, next) => {
    const errors = ValidationResult(req);
    if (!errors.isEmpty()) {
      return res.json({
        success: false,
        error: SelectFirstError(errors.mapped()),
      });
    }
    try {
      const user = await User.findOne({email: req.body.email}).select(
        "-password"
      );
      if (role === "admin") {
        if (user.role !== "admin") throw new Error("Invalid Credentials!");
      }
      const token = await user.getSignedToken();
      res.json({success: true, token, user});
    } catch (error) {
      return res.json({success: false, error: error.message});
    }
  };
};

exports.signup = (role) => {
  return async (req, res, next) => {
    const errors = ValidationResult(req);
    if (!errors.isEmpty()) {
      return res.json({
        success: false,
        error: SelectFirstError(errors.mapped()),
      });
    }
    try {
      const user = await User.create({
        ...req.body,
        role: role || "user",
        username: req.body.name + (Math.random() * 99).toString().split(".")[1],
      });
      const token = user.getSignedToken();
      return res.status(201).json({success: true, token, user});
    } catch (error) {
      return res.json({success: false, error: error.message});
    }
  };
};
