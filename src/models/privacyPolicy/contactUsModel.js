const mongoose = require("mongoose");

var contactUsSchema = mongoose.Schema(
  {
    contactUs: String,
  },
  { versionKey: false, timestamps: true }
);

var ContactUsModel = mongoose.model("privacypolicycontactus", contactUsSchema);
module.exports = ContactUsModel;
