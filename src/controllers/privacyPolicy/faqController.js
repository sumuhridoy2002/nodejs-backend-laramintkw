const FaqModel = require("../../models/privacyPolicy/faqModel");
const createService = require("../../services/common/createService");

const deleteService = require("../../services/common/deleteService");
const getServiceById = require("../../services/common/getSerciceById");

exports.addFaq = async (req, res) => {
  let result = await createService(req, FaqModel);
  return res.status(200).json(result);
};

exports.listFaq = async (req, res) => {
  let result = await FaqModel.find({});
  return res.status(200).json({ status: "success", data: result });
};

exports.deleteFaq = async (req, res) => {
  let result = await deleteService(req, FaqModel);
  return res.status(200).json(result);
};
