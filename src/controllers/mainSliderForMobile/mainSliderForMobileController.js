const MainSliderForMobileModel = require("../../models/mainSliderForMobile/mainSliderForMobileModel");
const createServiceWithImage = require("../../services/common/createServiceWithImage");
const deleteServiceWithImg = require("../../services/common/deleteServiceWithImg");
const getServiceById = require("../../services/common/getSerciceById");
const listService = require("../../services/common/listService");
const updateServiceWithDeleteImg = require("../../services/common/updateServiceWithDeleteImg");
const updateServiceWithImg = require("../../services/common/updateServiceWithImg");

exports.getMainSlidersForMobile = async (req, res) => {
  let searchRgx = { $regex: req.params.searchKeyword, $options: "i" };
  let searchArray = [{ link: searchRgx }];
  let result = await listService(req, MainSliderForMobileModel, searchArray);
  return res.status(200).json(result);
};
exports.getMainSliderForMobileDetailsById = async (req, res) => {
  let result = await getServiceById(req, MainSliderForMobileModel);
  return res.status(200).json(result);
};
exports.createMainSliderForMobile = async (req, res) => {
  let result = await createServiceWithImage(
    req,
    MainSliderForMobileModel,
    "mainSliderForMobile",
    "545",
    "800"
  );
  return res.status(200).json(result);
};
exports.updateMainSliderForMobileWithImg = async (req, res) => {
  let result = await updateServiceWithImg(
    req,
    MainSliderForMobileModel,
    "mainSliderForMobile",
    "545",
    "800"
  );
  return res.status(200).json(result);
};
exports.deleteImgMainSliderForMobile = async (req, res) => {
  let result = await updateServiceWithDeleteImg(req, MainSliderForMobileModel);
  return res.status(200).json(result);
};
exports.deleteMainSliderForMobile = async (req, res) => {
  let result = await deleteServiceWithImg(req, MainSliderForMobileModel);
  return res.status(200).json(result);
};
