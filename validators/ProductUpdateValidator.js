const {body} = require("express-validator");
const ProductUpdateValidator = [
  body("name").notEmpty().withMessage("product name is required!"),
  body("category").notEmpty().withMessage("Please select a category!"),
  body("price").notEmpty().withMessage("Product price is required!"),
  body("quantity").notEmpty().withMessage("Product quantity is required!"),
];

module.exports = ProductUpdateValidator;
