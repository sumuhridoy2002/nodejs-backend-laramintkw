const TermOfServiceModel = require("../../models/privacyPolicy/termOfServiceModel");
const createService = require("../../services/common/createService");
const deleteService = require("../../services/common/deleteService");
const getServiceById = require("../../services/common/getSerciceById");
const updateService = require("../../services/common/updateService");

exports.addTermOfService = async (req, res) => {
  let result = await createService(req, TermOfServiceModel);
  return res.status(200).json(result);
};

exports.listTermOfService = async (req, res) => {
  let result = await TermOfServiceModel.aggregate([
    {
      $sort: { createdAt: -1 },
    },
  ]);
  return res.status(200).json({ status: "success", data: result });
};

exports.getTermOfServiceById = async (req, res) => {
  let result = await getServiceById(req, TermOfServiceModel);
  return res.status(200).json(result);
};

exports.updateTermOfService = async (req, res) => {
  let result = await updateService(req, TermOfServiceModel);
  return res.status(200).json(result);
};
exports.deleteTermOfService = async (req, res) => {
  let result = await deleteService(req, TermOfServiceModel);
  return res.status(200).json(result);
};
