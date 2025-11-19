const mongoose = require("mongoose");
const BrandModel = require("../../models/brand/brandModel");
const ProductModel = require("../../models/product/productModel");
const checkAssociateService = require("../../services/common/checkAssociateService");
const dropdownListService = require("../../services/common/dropdownListService");
const getServiceById = require("../../services/common/getSerciceById");
const listService = require("../../services/common/listService");
const createServiceWithImage = require("../../services/common/createServiceWithImage");
const updateServiceWithImg = require("../../services/common/updateServiceWithImg");
const updateServiceWithDeleteImg = require("../../services/common/updateServiceWithDeleteImg");
const deleteServiceWithImg = require("../../services/common/deleteServiceWithImg");

exports.createBrand = async (req, res) => {
  let result = await createServiceWithImage(
    req,
    BrandModel,
    "brands",
    300,
    128
  );
  return res.status(200).json(result);
};

exports.listBrand = async (req, res) => {
  let searchRgx = { $regex: req.params.searchKeyword, $options: "i" };
  let searchArray = [{ name: searchRgx }];
  let result = await listService(req, BrandModel, searchArray);
  return res.status(200).json(result);
};
exports.dropdownListBrand = async (req, res) => {
  let result = await dropdownListService(req, BrandModel);
  return res.status(200).json(result);
};
exports.getBrandDetailsById = async (req, res) => {
  let result = await getServiceById(req, BrandModel);
  return res.status(200).json(result);
};
exports.updateBrand = async (req, res) => {
  let result = await updateServiceWithImg(req, BrandModel, "brands", 300, 128);
  return res.status(200).json(result);
};

exports.deleteBrandImgAndpullImg = async (req, res) => {
  let result = await updateServiceWithDeleteImg(req, BrandModel);
  return res.status(200).json(result);
};

exports.deleteBrandWithImg = async (req, res) => {
  let id = req.params.id;
  let objectId = mongoose.Types.ObjectId;
  let queryObject = { brandId: objectId(id) };

  let isDelete = await checkAssociateService(queryObject, ProductModel);
  if (isDelete === true) {
    return res
      .status(200)
      .json({ status: "associate", data: "This brand associate to products" });
  } else {
    let result = await deleteServiceWithImg(req, BrandModel);
    return res.status(200).json(result);
  }
};
