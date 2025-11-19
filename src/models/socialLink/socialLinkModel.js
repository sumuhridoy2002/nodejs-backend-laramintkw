const mongoose = require("mongoose");

var socialLinksSchema = mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    socialLink: { type: String },
  },
  { versionKey: false, timestamps: true }
);

var SocialLinksModel = mongoose.model("sociallinks", socialLinksSchema);
module.exports = SocialLinksModel;
