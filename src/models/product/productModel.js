const mongoose = require("mongoose");

var productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
    },
    features: {
      type: String,
    },
    ingredients: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
    },
    finalPrice: {
      type: Number,
      required: true,
    },
    saveAmount: {
      type: Number,
      required: true,
    },

    quantity: { type: Number, required: [true, "Quantity is required"] },
    sold: { type: Number, default: 0 },
    img: [],
    color: { type: String },
    size: [],
    weight: { type: String },
    ratings: [
      {
        star: Number,
        comment: String,
        author: mongoose.Schema.Types.ObjectId,
        createdAt: { type: String, default: new Date(0) },
      },
    ],
    totalRating: { type: Number, default: 0 },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    subCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    subSubCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    brandId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    tags: [],
    country: String,
    skinType: String,
    sku: String,
    madeIn: String,
    remark: {
      type: String,
      enum: ["Popular", "New", "Top", "Special", "Trending", "Regular"],
    },
    remarkByCategory: {
      type: String,
      trim: true,
      lowercase: true,
    },
    // offers isEachProductB1G1 & isEachProductB2G1 set function use becouse when we update product to mongoose error conflict error for pass offers={isCategoryBrandB1G1:false, isCategoryBrandB2G1:false}
    offers: {
      isCategoryBrandB1G1: { type: Boolean, default: false },
      isCategoryBrandB2G1: { type: Boolean, default: false },
      isEachProductB1G1: {
        type: Boolean,
        default: false,
        set: function (value) {
          if (value == "true") {
            this.set("offers.isCategoryBrandB1G1", false);
            this.set("offers.isCategoryBrandB2G1", false);
          }
          return value;
        },
      },
      isEachProductB2G1: {
        type: Boolean,
        default: false,
        type: Boolean,
        default: false,
        set: function (value) {
          if (value == "true") {
            this.set("offers.isCategoryBrandB1G1", false);
            this.set("offers.isCategoryBrandB2G1", false);
          }
          return value;
        },
      },
    },
  },
  { versionKey: false, timestamps: true }
);

var PorductModel = mongoose.model("products", productSchema);
module.exports = PorductModel;
