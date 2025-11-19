const mongoose = require("mongoose");

const orderSchema = mongoose.Schema(
  {
    userId: mongoose.Schema.Types.ObjectId,
    tran_id: String,
    orderId: String,
    refundTrxID: String,
    refundAmount: Number,
    refundReason: String,
    refundExecuteTime: String,
    refund: String,
    merchantInvoiceNumber: String,
    paymentExecuteTime: String,
    paymentStatus: String,
    allProducts: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
        },
        finalPrice: Number,
        total: Number,
        customerChoiceProductQuantity: Number,
        customerChoiceProductSize: String,
      },
    ],
    paymentIntent: {
      paymentId: String,
      paymentMethod: String,
      paymentStatus: String,
      amount: Number,
    },
    vatTax: { type: Number, default: 0 },
    voucherDiscount: { type: Number, default: 0 },
    productsSubTotal: { type: Number, default: 0 },
    subTotal: { type: Number, default: 0 },
    saveAmount: { type: Number, default: 0 },
    grandTotal: { type: Number, default: 0 },
    otherCost: { type: Number, default: 0 },
    shippingCost: { type: Number, default: 0 },
    shippingMethod: { type: String },
    note: { type: String },
    orderStatus: {
      type: String,
      default: "Not Processed",
      enum: [
        "Not Processed",
        "Processing",
        "Shipping",
        "Cancelled",
        "Returned",
        "Failed",
        "Delivered",
      ],
    },
    shippingAddress: {
      firstName: String,
      lastName: String,
      email: String,
      phone: String,
      alternativePhone: String,
      country: String,
      city: String,
      apartment: String,
      postalCode: String,
      address: String,
    },
    billingAddress: {
      firstName: String,
      lastName: String,
      phone: String,
      alternativePhone: String,
      country: String,
      city: String,
      apartment: String,
      postalCode: String,
      address: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false }
);

const orderModel = mongoose.model("order", orderSchema);
module.exports = orderModel;
