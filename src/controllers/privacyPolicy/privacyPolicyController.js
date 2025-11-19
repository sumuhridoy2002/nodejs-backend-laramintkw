const PrivacyPolicyModel = require("../../models/privacyPolicy/privacyPolicyModel");
const createService = require("../../services/common/createService");

const deleteService = require("../../services/common/deleteService");
const getServiceById = require("../../services/common/getSerciceById");
const updateService = require("../../services/common/updateService");

exports.addPrivacyPolicy = async (req, res) => {
  let result = await createService(req, PrivacyPolicyModel);
  return res.status(200).json(result);
};

exports.listPrivacyPolicy = async (req, res) => {
  let result = await PrivacyPolicyModel.aggregate([
    {
      $sort: { createdAt: -1 },
    },
  ]);
  return res.status(200).json({ status: "success", data: result });
};

exports.getPrivacyPolicyById = async (req, res) => {
  let result = await getServiceById(req, PrivacyPolicyModel);
  return res.status(200).json(result);
};

exports.updatePrivacyPolicy = async (req, res) => {
  let result = await updateService(req, PrivacyPolicyModel);
  return res.status(200).json({ status: "success", data: result });
};

exports.deletePrivacyPolicy = async (req, res) => {
  let result = await deleteService(req, PrivacyPolicyModel);
  return res.status(200).json(result);
};
