const {Schema, model} = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
      default:
        "data:image/png;base64,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",
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    number: String,
  },
  {timestamps: true}
);

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.getSignedToken = function () {
  return jwt.sign({id: this._id}, process.env.JWT_SECRET);
};

const User = model("User", UserSchema);

module.exports = User;
