const {Schema, model} = require("mongoose");
const orderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    address: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Address",
    },
    amount: {
      type: Number,
      required: true,
    },
    items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        price: {
          required: true,
          type: Number,
        },
        quantity: {
          required: true,
          type: Number,
        },
      },
    ],
    peymentStatus: {
      type: String,
      enum: ["pending", "completed", "cancelled", "refund"],
      required: true,
    },
    peymentMethod: {
      type: String,
      required: true,
    },
    orderStatus: [
      {
        type: {
          type: String,
          enum: ["ordered", "packed", "shipped", "delivered"],
          default: "ordered",
        },
        date: Array,
        isCompleted: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  {timestamps: true}
);

const Order = model("Order", orderSchema);
module.exports = Order;
