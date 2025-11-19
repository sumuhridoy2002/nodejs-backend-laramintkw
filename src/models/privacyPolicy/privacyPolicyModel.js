const mongoose = require("mongoose");

var privacyPolicy = mongoose.Schema(
  {
    privacyPolicy: String,
  },
  { versionKey: false, timestamps: true }
);

var PrivacyPolicyModel = mongoose.model("privacypolicies", privacyPolicy);
module.exports = PrivacyPolicyModel;
