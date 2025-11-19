const MultipleCurrencyModel = require("../../models/multipleCurrency/multipleCurrencyModel");
const getServiceById = require("../../services/common/getSerciceById");
const listService = require("../../services/common/listService");
const createServiceWithImage = require("../../services/common/createServiceWithImage");
const updateServiceWithImg = require("../../services/common/updateServiceWithImg");
const updateServiceWithDeleteImg = require("../../services/common/updateServiceWithDeleteImg");
const deleteServiceWithImg = require("../../services/common/deleteServiceWithImg");

exports.createMultipleCurrency = async (req, res) => {
  let result = await createServiceWithImage(
    req,
    MultipleCurrencyModel,
    "MultipleCurrency",
    40,
    40
  );
  return res.status(200).json(result);
};

exports.listMultipleCurrency = async (req, res) => {
  let searchRgx = { $regex: req.params.searchKeyword, $options: "i" };
  let searchArray = [{ countryName: searchRgx }];
  let result = await listService(req, MultipleCurrencyModel, searchArray);
  return res.status(200).json(result);
};

exports.getMultipleCurrencyDetailsById = async (req, res) => {
  let result = await getServiceById(req, MultipleCurrencyModel);
  return res.status(200).json(result);
};
exports.updateMultipleCurrency = async (req, res) => {
  let result = await updateServiceWithImg(
    req,
    MultipleCurrencyModel,
    "MultipleCurrency",
    40,
    40
  );
  return res.status(200).json(result);
};

exports.deleteMultipleCurrencyImgAndpullImg = async (req, res) => {
  let result = await updateServiceWithDeleteImg(req, MultipleCurrencyModel);
  return res.status(200).json(result);
};

exports.deleteMultipleCurrencyImgWithImg = async (req, res) => {
  let result = await deleteServiceWithImg(req, MultipleCurrencyModel);
  return res.status(200).json(result);
};
