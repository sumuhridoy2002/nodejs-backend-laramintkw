const mongoose = require("mongoose");

var optSchema = new mongoose.Schema(
  {
    email: {
      type: String,
    },
    otp: {
      type: String,
    },
    status: {
      type: Number,
      default: 0,
    },
  },
  { versionKey: false, timestamps: true }
);

var optModel = mongoose.model("otps", optSchema);
module.exports = optModel;
