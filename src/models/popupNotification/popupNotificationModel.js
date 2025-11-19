const mongoose = require("mongoose");

var popupNotificationSchema = mongoose.Schema(
  {
    img: { type: Array },
    link: { type: String },
  },
  { versionKey: false, timestamps: true }
);

var PopupNotificationModel = mongoose.model(
  "popupnotifications",
  popupNotificationSchema
);
module.exports = PopupNotificationModel;
