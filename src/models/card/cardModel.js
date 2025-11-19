const mongoose = require("mongoose");

const cardSchema = mongoose.Schema(
  {
    email: String,
    products: [
      {
        productId: mongoose.Schema.Types.ObjectId,
        size: String,
        color: String,
        count: Number,
      },
    ],
    totalPrice: Number,
    totalAfterDiscount: Number,
  },
  { versionKey: false, timestamps: true }
);

const cardModel = mongoose.model("card", cardSchema);
module.exports = cardModel;
