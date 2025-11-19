const RefundModel = require("../../models/privacyPolicy/refundModel");
const createService = require("../../services/common/createService");

const deleteService = require("../../services/common/deleteService");
const getServiceById = require("../../services/common/getSerciceById");
const updateService = require("../../services/common/updateService");

exports.addRefund = async (req, res) => {
  let result = await createService(req, RefundModel);
  return res.status(200).json(result);
};

exports.listRefund = async (req, res) => {
  let result = await RefundModel.aggregate([
    {
      $sort: { createdAt: -1 },
    },
  ]);
  return res.status(200).json({ status: "success", data: result });
};

exports.getRefundById = async (req, res) => {
  let result = await getServiceById(req, RefundModel);
  return res.status(200).json(result);
};

exports.updateRefund = async (req, res) => {
  let result = await updateService(req, RefundModel);
  return res.status(200).json(result);
};
exports.deleteRefund = async (req, res) => {
  let result = await deleteService(req, RefundModel);
  return res.status(200).json(result);
};
