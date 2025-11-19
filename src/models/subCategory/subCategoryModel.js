const mongoose = require("mongoose");

var subCategorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    subSubCategoryId: [{ type: mongoose.Schema.Types.ObjectId }],
  },
  { versionKey: false, timestamps: true }
);

var SubCategoryModel = mongoose.model("subcategories", subCategorySchema);
module.exports = SubCategoryModel;
