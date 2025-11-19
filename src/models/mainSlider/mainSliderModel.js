const mongoose = require("mongoose");

var mainSliderSchema = mongoose.Schema(
  {
    img: { type: Array },
    link: { type: String },
  },
  { versionKey: false, timestamps: true }
);

var MainSliderModel = mongoose.model("mainSliders", mainSliderSchema);
module.exports = MainSliderModel;
