const mongoose = require("mongoose");
const CategoryModel = require("../../models/category/categoryModel");
const ProductModel = require("../../models/product/productModel");
const listService = require("../../services/common/listService");
const dropdownListService = require("../../services/common/dropdownListService");
const getServiceById = require("../../services/common/getSerciceById");
const checkAssociateService = require("../../services/common/checkAssociateService");
const createService = require("../../services/common/createService");
const updateServiceWithDeleteImg = require("../../services/common/updateServiceWithDeleteImg");
const updateServiceWithImg = require("../../services/common/updateServiceWithImg");
const deleteServiceWithImg = require("../../services/common/deleteServiceWithImg");
const listOneJoinServiceWithOutEmail = require("../../services/common/listOneJoinServiceWithOutEmail");
const listTwoJoinService = require("../../services/common/listTwoJoinService");
const updateService = require("../../services/common/updateService");
const deleteService = require("../../services/common/deleteService");
const listTwoJoinNestedTableService = require("../../services/common/listTwoJoinNestedTableService");

exports.createCateogry = async (req, res) => {
  let result = await createService(req, CategoryModel);
  return res.status(200).json(result);
};
exports.listCategory = async (req, res) => {
  let searchRgx = { $regex: req.params.searchKeyword, $options: "i" };
  let searchArray = [{ name: searchRgx }];
  let result = await listService(req, CategoryModel, searchArray);
  return res.status(200).json(result);
};
exports.dropdownListCategory = async (req, res) => {
  let searchRgx = { $regex: req.params.searchKeyword, $options: "i" };
  let searchArray = [{ name: searchRgx }];
  let joinStage1 = {
    $lookup: {
      from: "subcategories",
      localField: "subCategoryId",
      foreignField: "_id",
      as: "subCategories",
    },
  };
  let joinStage2 = {
    $lookup: {
      from: "subsubcategories",
      localField: "subCategories.subSubCategoryId",
      foreignField: "_id",
      as: "subsubCategories",
    },
  };
  let data = await listTwoJoinNestedTableService(
    req,
    CategoryModel,
    searchArray,
    joinStage1
  );
  return res.status(200).json(data);
};
exports.getCategoryDetailsById = async (req, res) => {
  let result = await getServiceById(req, CategoryModel);
  return res.status(200).json(result);
};
exports.updateCategory = async (req, res) => {
  let result = await updateService(req, CategoryModel);
  return res.status(200).json(result);
};

exports.deleteCategory = async (req, res) => {
  let id = req.params.id;
  let objectId = mongoose.Types.ObjectId;
  let queryObject = { categoryId: objectId(id) };

  let isDelete = await checkAssociateService(queryObject, ProductModel);
  if (isDelete === true) {
    return res.status(200).json({
      status: "associate",
      data: "This category associate to products",
    });
  } else {
    let result = await deleteService(req, CategoryModel);
    return res.status(200).json(result);
  }
};
