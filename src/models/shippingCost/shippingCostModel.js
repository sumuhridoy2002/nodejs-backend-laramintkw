const mongoose = require("mongoose");

var shippingConstSchema = mongoose.Schema(
  {
    region: { type: String, required: true },
    method: { type: String, required: true },
    shippingCost: { type: Number, default: 0 },
    otherCost: { type: Number, default: 0 },
  },
  { versionKey: false, timestamps: true }
);

var ShippingConstModel = mongoose.model("shippingcost", shippingConstSchema);
module.exports = ShippingConstModel;
