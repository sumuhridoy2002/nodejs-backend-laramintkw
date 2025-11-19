const AboutUsModel = require("../../models/privacyPolicy/aboutUsModel");
const createService = require("../../services/common/createService");

const deleteService = require("../../services/common/deleteService");
const getServiceById = require("../../services/common/getSerciceById");
const updateService = require("../../services/common/updateService");

exports.addAboutUs = async (req, res) => {
  let result = await createService(req, AboutUsModel);
  return res.status(200).json(result);
};

exports.listAboutUs = async (req, res) => {
  let result = await AboutUsModel.aggregate([
    {
      $sort: { createdAt: -1 },
    },
  ]);
  return res.status(200).json({ status: "success", data: result });
};

exports.getAboutUsById = async (req, res) => {
  let result = await getServiceById(req, AboutUsModel);
  return res.status(200).json(result);
};

exports.updateAboutUs = async (req, res) => {
  let result = await updateService(req, AboutUsModel);
  return res.status(200).json({ status: "success", data: result });
};

exports.deleteAboutUs = async (req, res) => {
  let result = await deleteService(req, AboutUsModel);
  return res.status(200).json(result);
};
