const {Schema, model} = require("mongoose");

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Category",
    },
    price: {
      type: Schema.Types.Number,
      required: true,
    },
    quantity: {
      type: Schema.Types.Number,
      required: true,
    },

    description: String,

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    images: [{image: String}],
    offer: String,
    reviews: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        rating: String,
      },
    ],
  },
  {timestamps: true}
);

const Product = model("Product", ProductSchema);
module.exports = Product;
