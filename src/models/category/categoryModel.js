const mongoose = require("mongoose");

var categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    subCategoryId: [{ type: mongoose.Schema.Types.ObjectId }],
  },
  { versionKey: false, timestamps: true }
);

// Add an index to the createdAt field
categorySchema.index({ createdAt: -1 });

var CategoryModel = mongoose.model("categories", categorySchema);
module.exports = CategoryModel;
