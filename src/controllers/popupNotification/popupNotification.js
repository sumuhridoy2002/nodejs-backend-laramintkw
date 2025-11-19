const PopupNotificationModel = require("../../models/popupNotification/popupNotificationModel");
const createServiceWithImage = require("../../services/common/createServiceWithImage");
const deleteServiceWithImg = require("../../services/common/deleteServiceWithImg");
const getServiceById = require("../../services/common/getSerciceById");
const listService = require("../../services/common/listService");
const updateServiceWithDeleteImg = require("../../services/common/updateServiceWithDeleteImg");
const updateServiceWithImg = require("../../services/common/updateServiceWithImg");

exports.getPopupNotifications = async (req, res) => {
  let searchRgx = { $regex: req.params.searchKeyword, $options: "i" };
  let searchArray = [{ link: searchRgx }];
  let result = await listService(req, PopupNotificationModel, searchArray);
  return res.status(200).json(result);
};
exports.getPopupNotificationDetailsById = async (req, res) => {
  let result = await getServiceById(req, PopupNotificationModel);
  return res.status(200).json(result);
};
exports.createPopupNotification = async (req, res) => {
  let result = await createServiceWithImage(
    req,
    PopupNotificationModel,
    "popupNotification",
    "800",
    "600"
  );
  return res.status(200).json(result);
};
exports.updatePopupNotificationWithImg = async (req, res) => {
  let result = await updateServiceWithImg(
    req,
    PopupNotificationModel,
    "popupNotification",
    "800",
    "600"
  );
  return res.status(200).json(result);
};
exports.deleteImgPopupNotification = async (req, res) => {
  let result = await updateServiceWithDeleteImg(req, PopupNotificationModel);
  return res.status(200).json(result);
};

exports.deletePopupNotification = async (req, res) => {
  let result = await deleteServiceWithImg(req, PopupNotificationModel);
  return res.status(200).json(result);
};
