const mongoose = require("mongoose");

var termOfConditionSchema = mongoose.Schema(
  {
    termOfCondition: String,
  },
  { versionKey: false, timestamps: true }
);

var TermOfConditionModel = mongoose.model(
  "privacypolicytermofconditions",
  termOfConditionSchema
);
module.exports = TermOfConditionModel;
