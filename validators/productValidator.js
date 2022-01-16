const {body} = require("express-validator");
const Product = require("../models/Product");
const WordsFirstLetterUC = require("../utils/WordsFirstLetterUC");

const ProductValidator = [
  body("name")
    .notEmpty()
    .withMessage("product name is required!")
    .custom(async (name) => {
      const product = await Product.findOne({name: WordsFirstLetterUC(name)});
      if (product) {
        throw new Error(`Product name already exist, try different!`);
      } else {
        return true;
      }
    }),
  body("category").notEmpty().withMessage("Please select a category!"),
  body("price").notEmpty().withMessage("Product price is required!"),
  body("quantity").notEmpty().withMessage("Product quantity is required!"),
];

module.exports = ProductValidator;
