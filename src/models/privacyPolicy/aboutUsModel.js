const mongoose = require("mongoose");

var aboutUsSchema = mongoose.Schema(
  {
    aboutUs: String,
  },
  { versionKey: false, timestamps: true }
);

var AboutUsModel = mongoose.model("privacypolicyaboutus", aboutUsSchema);
module.exports = AboutUsModel;
