const mongoose = require("mongoose");

var termOfServiceSchema = mongoose.Schema(
  {
    termOfService: String,
  },
  { versionKey: false, timestamps: true }
);

var TermOfServiceModel = mongoose.model(
  "privacypolicytermofservice",
  termOfServiceSchema
);
module.exports = TermOfServiceModel;
