const mongoose = require("mongoose");

var brandSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    img: {
      type: Array,
    },
  },
  { versionKey: false, timestamps: true }
);

var BrandModel = mongoose.model("brands", brandSchema);
module.exports = BrandModel;
