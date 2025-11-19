const mongoose = require("mongoose");

var subSubCategorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
  },
  { versionKey: false, timestamps: true }
);

var SubSubCategoryModel = mongoose.model(
  "subsubcategories",
  subSubCategorySchema
);
module.exports = SubSubCategoryModel;
