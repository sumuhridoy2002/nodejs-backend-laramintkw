const mongoose = require("mongoose");

var mainSliderForMobileSchema = mongoose.Schema(
  {
    img: { type: Array },
    link: { type: String },
  },
  { versionKey: false, timestamps: true }
);

var MainSliderForMobileModel = mongoose.model(
  "mainSliderForMobile",
  mainSliderForMobileSchema
);
module.exports = MainSliderForMobileModel;
