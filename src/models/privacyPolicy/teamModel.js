const mongoose = require("mongoose");

var teamSchema = mongoose.Schema(
  {
    team: String,
  },
  { versionKey: false, timestamps: true }
);

var TeamModel = mongoose.model("privacypolicyteam", teamSchema);
module.exports = TeamModel;
