const createService = require("../../services/common/createService");
const listService = require("../../services/common/listService");
const CouponModel = require("../../models/coupon/couponModel");
const getServiceById = require("../../services/common/getSerciceById");
const updateService = require("../../services/common/updateService");
const deleteService = require("../../services/common/deleteService");
const validateCouponCodeService = require("../../services/validateCouponCode/validateCouponCodeService");

exports.createCoupon = async (req, res) => {
  let result = await createService(req, CouponModel);
  return res.status(200).json(result);
};

exports.getCoupon = async (req, res) => {
  let searchRgx = { $regex: req.params.searchKeyword, $options: "i" };
  let searchArray = [{ name: searchRgx }, { discound: searchRgx }];
  let result = await listService(req, CouponModel, searchArray);
  return res.status(200).json(result);
};

exports.getCouponDetailsById = async (req, res) => {
  let result = await getServiceById(req, CouponModel);
  return res.status(200).json(result);
};

exports.updateCoupon = async (req, res) => {
  let result = await updateService(req, CouponModel);
  return res.status(200).json(result);
};

exports.deleteCoupon = async (req, res) => {
  let result = await deleteService(req, CouponModel);
  return res.status(200).json(result);
};

exports.validateCouponCode = async (req, res) => {
  let result = await validateCouponCodeService(req, CouponModel);
  return res.status(200).json(result);
};
