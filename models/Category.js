const {Schema, model} = require("mongoose");

const CategorySchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  children: {
    type: Schema.Types.Array,
    default: [],
  },
  parent: String,
  slug: {
    type: String,
    required: true,
  },
  image: String,
});

const Category = model("Category", CategorySchema);
module.exports = Category;
