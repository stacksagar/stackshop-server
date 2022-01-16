const {body} = require("express-validator");
const User = require("../models/User");
const bcrypt = require("bcrypt");

const signinValidator = [
  body("email")
    .notEmpty()
    .withMessage("email is required!")
    .isEmail()
    .withMessage("please provide valid email address!")
    .custom(async (email) => {
      const user = await User.findOne({email});
      if (!user) throw new Error("Invalid Creadentials!");
    }),
  body("password")
    .notEmpty()
    .withMessage("password is required!")
    .custom(async (password, {req}) => {
      const user = await User.findOne({email: req.body.email});
      if (!user) throw new Error("Invalid Creadentials!");

      const matchPassword = await bcrypt.compare(password, user.password);
      if (!matchPassword) throw new Error("Invalid Creadentials!");
    }),
];

module.exports = signinValidator;
