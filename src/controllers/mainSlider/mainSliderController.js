const MainSliderModel = require("../../models/mainSlider/mainSliderModel");
const createServiceWithImage = require("../../services/common/createServiceWithImage");
const deleteServiceWithImg = require("../../services/common/deleteServiceWithImg");
const getServiceById = require("../../services/common/getSerciceById");
const listService = require("../../services/common/listService");
const updateServiceWithDeleteImg = require("../../services/common/updateServiceWithDeleteImg");
const updateServiceWithImg = require("../../services/common/updateServiceWithImg");

exports.getMainSliders = async (req, res) => {
  let searchRgx = { $regex: req.params.searchKeyword, $options: "i" };
  let searchArray = [{ link: searchRgx }];
  let result = await listService(req, MainSliderModel, searchArray);
  return res.status(200).json(result);
};
exports.getMainSliderDetailsById = async (req, res) => {
  let result = await getServiceById(req, MainSliderModel);
  return res.status(200).json(result);
};
exports.createMainSlider = async (req, res) => {
  let result = await createServiceWithImage(
    req,
    MainSliderModel,
    "mainSlider",
    "1400",
    "620"
  );
  return res.status(200).json(result);
};
exports.updateMainSliderWithImg = async (req, res) => {
  let result = await updateServiceWithImg(
    req,
    MainSliderModel,
    "mainSlider",
    "1400",
    "620"
  );
  return res.status(200).json(result);
};
exports.deleteImgMainSlider = async (req, res) => {
  let result = await updateServiceWithDeleteImg(req, MainSliderModel);
  return res.status(200).json(result);
};
exports.deleteMainSlider = async (req, res) => {
  let result = await deleteServiceWithImg(req, MainSliderModel);
  return res.status(200).json(result);
};
