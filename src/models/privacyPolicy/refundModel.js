const mongoose = require("mongoose");

var refundSchema = mongoose.Schema(
  {
    refund: String,
  },
  { versionKey: false, timestamps: true }
);

var RefundModel = mongoose.model("privacypolicyrefund", refundSchema);
module.exports = RefundModel;
