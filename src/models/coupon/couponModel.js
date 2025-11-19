const mongoose = require("mongoose");

var couponSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    expiry: {
      type: Date,
      required: true,
    },
    discound: {
      type: Number,
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

var CouponModel = mongoose.model("coupons", couponSchema);
module.exports = CouponModel;
