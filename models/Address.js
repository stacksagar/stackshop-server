const {Schema, model} = require("mongoose");

const addressSchema = new Schema({
  name: {type: String, required: true},
  number: {type: String, required: true},
  address: {type: String, required: true},
  district: {type: String, required: true},
  postcode: String,
  alternate_number: String,
  addressType: {
    type: String,
    enum: ["home", "office"],
    required: true,
  },
});

const Address = model("Address", addressSchema);

const userAddressSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  addresses: [
    {
      address: {
        type: Schema.Types.ObjectId,
        ref: "Address",
      },
    },
  ],
});

const UserAddress = model("UserAddress", userAddressSchema);
module.exports = {Address, UserAddress};
