const {Schema, model} = require("mongoose");

const CartSchema = new Schema({
  user: {type: Schema.Types.ObjectId, ref: "User"},
  cartItems: [
    {
      product: {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
      quantity: {
        type: "Number",
        default: 1,
      },
    },
  ],
});

const Cart = model("Cart", CartSchema);
module.exports = Cart;
