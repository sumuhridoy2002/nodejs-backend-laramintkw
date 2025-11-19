const mongoose = require("mongoose");

var userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    photo: {
      type: Array,
    },
    cart: [],
    wishList: [{ type: mongoose.Schema.Types.ObjectId, default: [] }],
    address: {},
    role: {
      type: String,
      default: "user",
      trim: true,
    },
    isBlock: {
      type: String,
      default: "No",
    },
    couponCodeUses: { type: String, default: "0" },
    refreshToken: {
      type: String,
    },
  },
  { versionKey: false, timestamps: true }
);

var UserModel = mongoose.model("users", userSchema);
module.exports = UserModel;
