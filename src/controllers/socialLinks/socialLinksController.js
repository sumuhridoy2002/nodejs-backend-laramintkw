const SocialLinksModel = require("../../models/socialLink/socialLinkModel");

const createService = require("../../services/common/createService");
const deleteService = require("../../services/common/deleteService");
const getServiceById = require("../../services/common/getSerciceById");
const updateService = require("../../services/common/updateService");

exports.addSocialLink = async (req, res) => {
  let result = await createService(req, SocialLinksModel);
  return res.status(200).json(result);
};

exports.listSocialLink = async (req, res) => {
  let result = await SocialLinksModel.aggregate([
    {
      $sort: { createdAt: -1 },
    },
  ]);
  return res.status(200).json({ status: "success", data: result });
};

exports.getSocialLinkById = async (req, res) => {
  let result = await getServiceById(req, SocialLinksModel);
  return res.status(200).json(result);
};
exports.updateSocialLinks = async (req, res) => {
  let result = await updateService(req, SocialLinksModel);
  return res.status(200).json(result);
};
exports.deleteSocialLink = async (req, res) => {
  let result = await deleteService(req, SocialLinksModel);
  return res.status(200).json(result);
};
