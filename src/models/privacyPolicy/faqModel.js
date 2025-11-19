const mongoose = require("mongoose");

var faqSchema = mongoose.Schema(
  {
    questions: { question: String, answer: String },
  },
  { versionKey: false, timestamps: true }
);

var FaqModel = mongoose.model("privacypolicyfaqs", faqSchema);
module.exports = FaqModel;
