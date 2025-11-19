const mongoose = require("mongoose");
const SubCategoryModel = require("../../models/subCategory/subCategoryModel");
const SubSubCategoryModel = require("../../models/subSubCategory/subSubCategoryModel");
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

exports.createSubSubCategory = async (req, res) => {
  let reqBody = req.body;
  let subSubCategoryName = reqBody["name"];
  let subCategoryId = reqBody.subCategoryId;

  try {
    let data = await SubSubCategoryModel.create({ name: subSubCategoryName });
    await SubCategoryModel.updateOne(
      {
        _id: subCategoryId,
      },
      {
        $push: {
          subSubCategoryId: data._id,
        },
      }
    );
    return res.status(200).json({ status: "success", data: data });
  } catch (e) {
    return res.status(200).json({ status: "fail", data: e });
  }
};
exports.listSubSubCategories = async (req, res) => {
  let searchRgx = { $regex: req.params.searchKeyword, $options: "i" };
  let searchArray = [{ name: searchRgx }];
  let result = await listService(req, SubSubCategoryModel, searchArray);
  return res.status(200).json(result);
};

exports.getSubSubCategoryDetailsById = async (req, res) => {
  let result = await getServiceById(req, SubSubCategoryModel);
  return res.status(200).json(result);
};
exports.updateSubSubCategory = async (req, res) => {
  let subCategoryId = req.body.subCategoryId;
  let subSubCategoryId = req.params.id || req.body.id;
  // push sub sub category in subcategory
  let checkSubSubCategoryId = mongoose.Types.ObjectId.isValid(subSubCategoryId);
  let checkSubCategoryId = mongoose.Types.ObjectId.isValid(subCategoryId);
  try {
    let result = await updateService(req, SubSubCategoryModel);
    if (checkSubCategoryId && checkSubSubCategoryId) {
      // check if category has subcategory
      let subCategory = await SubCategoryModel.aggregate([
        { $match: { _id: mongoose.Types.ObjectId(subCategoryId) } },
        {
          $project: {
            _id: 0,
            hasRated: {
              $in: [
                mongoose.Types.ObjectId(subSubCategoryId),
                "$subSubCategoryId",
              ],
            },
          },
        },
      ]);

      // push subcategory in category
      if (!subCategory[0].hasRated) {
        updateRating = await SubCategoryModel.updateOne(
          {
            _id: subCategoryId,
          },
          {
            $push: {
              subSubCategoryId: subSubCategoryId,
            },
          }
        );
      }
      // find sub subcategory in another subcategory
      let subSubCategoryInAnotherSubCategory = await SubCategoryModel.aggregate(
        [
          {
            $match: {
              subSubCategoryId: mongoose.Types.ObjectId(subSubCategoryId),
              _id: { $ne: mongoose.Types.ObjectId(subCategoryId) },
            },
          },
        ]
      );
      // pull subcategory in another category
      if (subSubCategoryInAnotherSubCategory.length > 0) {
        await SubCategoryModel.updateOne(
          {
            _id: subSubCategoryInAnotherSubCategory[0]._id,
          },
          {
            $pull: {
              subSubCategoryId: subSubCategoryId,
            },
          }
        );
      }

      return res.status(200).json(result);
    } else {
      return res
        .status(200)
        .json({ status: "fail", data: "Invalid Object Id" });
    }
  } catch (error) {
    return res.status(200).json({ status: "fail", data: error.toString() });
  }
};
exports.deleteSubSubCategory = async (req, res) => {
  let id = req.params.id;
  let objectId = mongoose.Types.ObjectId;
  let queryObject = { subSubCategoryId: objectId(id) };

  let isDelete = await checkAssociateService(queryObject, ProductModel);
  if (isDelete === true) {
    return res.status(200).json({
      status: "associate",
      data: "This Sub SubCategory associate to products",
    });
  } else {
    let result = await deleteService(req, SubSubCategoryModel);
    if (result.data?.deletedCount === 1) {
      await SubCategoryModel.updateOne(
        {
          subCategoryId: id,
        },
        {
          $pull: {
            subSubCategoryId: id,
          },
        }
      );
    }
    return res.status(200).json(result);
  }
};
