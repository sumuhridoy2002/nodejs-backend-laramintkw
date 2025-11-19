const ReturnAndRefundModel = require("../../models/privacyPolicy/returnAndRefundModel");
const createService = require("../../services/common/createService");
const deleteService = require("../../services/common/deleteService");
const getServiceById = require("../../services/common/getSerciceById");
const updateService = require("../../services/common/updateService");

exports.addReturnAndRefundPolicy = async (req, res) => {
  let result = await createService(req, ReturnAndRefundModel);
  return res.status(200).json(result);
};

exports.listReturnAndRefundPolicy = async (req, res) => {
  let result = await ReturnAndRefundModel.aggregate([
    {
      $sort: { createdAt: -1 },
    },
  ]);
  return res.status(200).json({ status: "success", data: result });
};

exports.getReturnAndRefundById = async (req, res) => {
  let result = await getServiceById(req, ReturnAndRefundModel);
  return res.status(200).json(result);
};

exports.updateReturnAndRefundPolicy = async (req, res) => {
  let result = await updateService(req, ReturnAndRefundModel);
  return res.status(200).json({ status: "success", data: result });
};

exports.deleteReturnAndRefundPolicy = async (req, res) => {
  let result = await deleteService(req, ReturnAndRefundModel);
  return res.status(200).json(result);
};
