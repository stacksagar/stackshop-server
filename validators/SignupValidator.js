const {body} = require("express-validator");
const User = require("../models/User");
const bcrypt = require("bcrypt");

const signupValidator = [
  body("name")
    .notEmpty()
    .withMessage("name is required!")
    .isLength({min: 3})
    .withMessage("your name must be at least 3 characters!"),
  body("email")
    .notEmpty()
    .withMessage("email is required!")
    .isEmail()
    .withMessage("please provide valid email address!")
    .custom(async (email) => {
      const user = await User.findOne({email});
      if (user) throw new Error("email already exist!");
    }),
  body("password")
    .notEmpty()
    .withMessage("password is required!")
    .isLength({min: 4})
    .withMessage("minimum 4 character is required!"),
];

module.exports = signupValidator;
