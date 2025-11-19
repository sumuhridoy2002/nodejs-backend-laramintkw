const mongoose = require("mongoose");
const SubCategoryModel = require("../../models/subCategory/subCategoryModel");
const CategoriesModel = require("../../models/category/categoryModel");
const ProductModel = require("../../models/product/productModel");
const checkAssociateService = require("../../services/common/checkAssociateService");
const createService = require("../../services/common/createService");
const deleteService = require("../../services/common/deleteService");
const dropdownListService = require("../../services/common/dropdownListService");
const getServiceById = require("../../services/common/getSerciceById");
const listService = require("../../services/common/listService");
const updateService = require("../../services/common/updateService");
const listOneJoinServiceWithOutEmail = require("../../services/common/listOneJoinServiceWithOutEmail");
const listTwoJoinService = require("../../services/common/listTwoJoinService");

exports.createSubCategory = async (req, res) => {
  let reqBody = req.body;
  let subCategoryName = reqBody["name"];
  let categoryId = reqBody.categoryId;

  try {
    let data = await SubCategoryModel.create({ name: subCategoryName });
    await CategoriesModel.updateOne(
      {
        _id: categoryId,
      },
      {
        $push: {
          subCategoryId: data._id,
        },
      }
    );
    return res.status(200).json({ status: "success", data: data });
  } catch (e) {
    return res.status(200).json({ status: "fail", data: e });
  }
};
exports.listSubCategories = async (req, res) => {
  let searchRgx = { $regex: req.params.searchKeyword, $options: "i" };
  let searchArray = [{ name: searchRgx }];
  let result = await listService(req, SubCategoryModel, searchArray);
  return res.status(200).json(result);
};
exports.dropdownListSubCategories = async (req, res) => {
  let searchRgx = { $regex: req.params.searchKeyword, $options: "i" };
  let searchArray = [{ name: searchRgx }];
  let joinStage1 = {
    $lookup: {
      from: "subsubcategories",
      localField: "subSubCategoryId",
      foreignField: "_id",
      as: "subsubCategories",
    },
  };

  let data = await listOneJoinServiceWithOutEmail(
    req,
    SubCategoryModel,
    searchArray,
    joinStage1
  );
  return res.status(200).json(data);
};
exports.getSubCategoryDetailsById = async (req, res) => {
  let result = await getServiceById(req, SubCategoryModel);
  return res.status(200).json(result);
};
exports.updateSubCategory = async (req, res) => {
  let categoryId = req.body.categoryId;
  let subCategoryId = req.params.id || req.body.id;
  // push subcategory in category
  let checkCategoryId = mongoose.Types.ObjectId.isValid(categoryId);
  let checkSubcategoryId = mongoose.Types.ObjectId.isValid(subCategoryId);
  try {
    let result = await updateService(req, SubCategoryModel);
    if (checkCategoryId && checkSubcategoryId) {
      // check if category has subcategory
      let category = await CategoriesModel.aggregate([
        { $match: { _id: mongoose.Types.ObjectId(categoryId) } },
        {
          $project: {
            _id: 0,
            hasRated: {
              $in: [mongoose.Types.ObjectId(subCategoryId), "$subCategoryId"],
            },
          },
        },
      ]);

      // push subcategory in category
      if (!category[0].hasRated) {
        updateRating = await CategoriesModel.updateOne(
          {
            _id: categoryId,
          },
          {
            $push: {
              subCategoryId: subCategoryId,
            },
          }
        );
      }
      // find subcategory in another category
      let subCategoryInAnotherCategory = await CategoriesModel.aggregate([
        {
          $match: {
            subCategoryId: mongoose.Types.ObjectId(subCategoryId),
            _id: { $ne: mongoose.Types.ObjectId(categoryId) },
          },
        },
      ]);
      // pull subcategory in another category
      if (subCategoryInAnotherCategory.length > 0) {
        await CategoriesModel.updateOne(
          {
            _id: subCategoryInAnotherCategory[0]._id,
          },
          {
            $pull: {
              subCategoryId: subCategoryId,
            },
          }
        );
      }

      return res.status(200).json(result);
    } else {
      return res
        .status(200)
        .json({ status: "fail", data: "Invalid Object id" });
    }
  } catch (error) {
    return res.status(200).json({ status: "fail", data: error.toString() });
  }
};
exports.deleteSubCategory = async (req, res) => {
  let id = req.params.id;
  let objectId = mongoose.Types.ObjectId;
  let queryObject = { subCategoryId: objectId(id) };

  let isDelete = await checkAssociateService(queryObject, ProductModel);
  if (isDelete === true) {
    return res.status(200).json({
      status: "associate",
      data: "This SubCategory associate to products",
    });
  } else {
    let result = await deleteService(req, SubCategoryModel);
    if (result.data?.deletedCount === 1) {
      await CategoriesModel.updateOne(
        {
          subCategoryId: id,
        },
        {
          $pull: {
            subCategoryId: id,
          },
        }
      );
    }
    return res.status(200).json(result);
  }
};
