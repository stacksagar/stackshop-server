const {body} = require("express-validator");
const Category = require("../models/Category");
const FirstLetterUC = require("../utils/FirstLetterUC");

const CategoryValidator = [
  body("name")
    .notEmpty()
    .withMessage("category name is required!")
    .custom(async (name) => {
      if (name?.length < 3)
        throw new Error(
          "Category name length is short! min 3 chars is required!"
        );
      const category = await Category.findOne({name: FirstLetterUC(name)});
      if (!category) {
        return true;
      } else {
        throw new Error(`category already exist!`);
      }
    }),
];

module.exports = CategoryValidator;
