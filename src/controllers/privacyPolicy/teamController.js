const TeamModel = require("../../models/privacyPolicy/teamModel");
const createService = require("../../services/common/createService");

const deleteService = require("../../services/common/deleteService");

exports.addTeam = async (req, res) => {
  let result = await createService(req, TeamModel);
  return res.status(200).json(result);
};

exports.listTeam = async (req, res) => {
  let result = await TeamModel.find({});
  return res.status(200).json({ status: "success", data: result });
};

exports.deleteTeam = async (req, res) => {
  let result = await deleteService(req, TeamModel);
  return res.status(200).json(result);
};
