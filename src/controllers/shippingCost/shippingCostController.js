const ShippingCost = require("../../models/shippingCost/shippingCostModel");

const createService = require("../../services/common/createService");
const deleteService = require("../../services/common/deleteService");
const getServiceById = require("../../services/common/getSerciceById");
const updateService = require("../../services/common/updateService");

exports.addShippingCost = async (req, res) => {
  let result = await createService(req, ShippingCost);
  return res.status(200).json(result);
};

exports.listShippingCost = async (req, res) => {
  let result = await ShippingCost.aggregate([
    {
      $sort: { createdAt: -1 },
    },
  ]);
  return res.status(200).json({ status: "success", data: result });
};

exports.getShippingCostById = async (req, res) => {
  let result = await getServiceById(req, ShippingCost);
  return res.status(200).json(result);
};
exports.updateShippingCost = async (req, res) => {
  let result = await updateService(req, ShippingCost);
  return res.status(200).json(result);
};
exports.deleteShippingCost = async (req, res) => {
  let result = await deleteService(req, ShippingCost);
  return res.status(200).json(result);
};
