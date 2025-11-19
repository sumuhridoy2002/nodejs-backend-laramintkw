const mongoose = require("mongoose");

var returnAndRefundPolicySchema = mongoose.Schema(
  {
    returnAndRefund: String,
  },
  { versionKey: false, timestamps: true }
);

var ReturnAndRefundPolicyModel = mongoose.model(
  "returnandrefundpolicies",
  returnAndRefundPolicySchema
);
module.exports = ReturnAndRefundPolicyModel;
