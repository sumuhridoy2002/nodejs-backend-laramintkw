const TermOfConditionModel = require("../../models/privacyPolicy/termOfConditionModel");
const createService = require("../../services/common/createService");
const deleteService = require("../../services/common/deleteService");
const getServiceById = require("../../services/common/getSerciceById");
const updateService = require("../../services/common/updateService");

exports.addTermOfCondition = async (req, res) => {
  let result = await createService(req, TermOfConditionModel);
  return res.status(200).json(result);
};

exports.listTermOfCondition = async (req, res) => {
  let result = await TermOfConditionModel.aggregate([
    {
      $sort: { createdAt: -1 },
    },
  ]);
  return res.status(200).json({ status: "success", data: result });
};

exports.getTermOfConditionById = async (req, res) => {
  let result = await getServiceById(req, TermOfConditionModel);
  return res.status(200).json(result);
};

exports.updateTermOfCondition = async (req, res) => {
  let result = await updateService(req, TermOfConditionModel);
  return res.status(200).json(result);
};
exports.deleteTermOfCondition = async (req, res) => {
  let result = await deleteService(req, TermOfConditionModel);
  return res.status(200).json(result);
};
