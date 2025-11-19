const mongoose = require("mongoose");
const slugify = require("slugify");
const ProductModel = require("../../models/product/productModel");
const BrandModel = require("../../models/brand/brandModel");
const OrderModel = require("../../models/order/orderModel");
const createServiceWithImage = require("../../services/common/createServiceWithImage");

const checkAssociateService = require("../../services/common/checkAssociateService");
const deleteServiceWithImg = require("../../services/common/deleteServiceWithImg");
const updateServiceWithImg = require("../../services/common/updateServiceWithImg");
const updateServiceWithDeleteImg = require("../../services/common/updateServiceWithDeleteImg");
const getDetailsByIdThreeJoinService = require("../../services/common/getDetailsByIdThreeJoinService");
const RelatedProductsSearchSercice = require("../../services/common/relatedProductsServices");
const listFourJoinServiceForGlobal = require("../../services/common/listFourJoinServiceForGlobal");
const getDetailsByIdForuJoinService = require("../../services/common/getDetailsByIdFourJoinService");
const listFourJoinServiceBestSalesForGlobal = require("../../services/common/listFourJoinServiceBestSalesForGlobal");

exports.createProduct = async (req, res) => {
  if (req.body.name !== "undefined") {
    req.body.slug = slugify(req.body.name);
  }

  if (req.body.tags !== undefined) {
    let tagArr = req.body.tags.trim().split(/[ ,]+/);
    req.body.tags = tagArr;
  }
  if (
    (req.body.price !== "undefined" && req.body.discount == 0) ||
    req.body.discount == undefined
  ) {
    req.body.finalPrice = Number(req.body.price);
    req.body.discount = 0;
    req.body.saveAmount = 0;
  } else if (
    req.body.price !== "undefined" &&
    req.body.discount !== "undefined"
  ) {
    req.body.finalPrice = (
      (Number(req.body.price) * (100 - req.body.discount)) /
      100
    ).toFixed(3);
    req.body.saveAmount = (
      Number(req.body.price) *
      (req.body.discount / 100)
    ).toFixed(3);
  }
  let result = await createServiceWithImage(
    req,
    ProductModel,
    "products",
    600,
    600
  );

  return res.status(200).json(result);
};

exports.listProductForGlobal = async (req, res) => {
  // let searchRgx = { $regex: req.params.searchKeyword, $options: "i" };
  let searchRgx = { $regex: req.query.searchKeyword, $options: "i" };
  let searchArray = [
    { name: searchRgx },
    { slug: searchRgx },
    { description: searchRgx },
    { features: searchRgx },
    { ingredients: searchRgx },
    { "category.name": searchRgx },
    { "subCategory.name": searchRgx },
    { "subsubcategories.name": searchRgx },
    { "brands.name": searchRgx },
  ];

  let joinStage1 = {
    $lookup: {
      from: "categories",
      localField: "categoryId",
      foreignField: "_id",
      as: "category",
    },
  };
  let joinStage2 = {
    $lookup: {
      from: "subcategories",
      localField: "subCategoryId",
      foreignField: "_id",
      as: "subCategory",
    },
  };
  let joinStage3 = {
    $lookup: {
      from: "subsubcategories",
      localField: "subSubCategoryId",
      foreignField: "_id",
      as: "subsubcategories",
    },
  };
  let joinStage4 = {
    $lookup: {
      from: "brands",
      localField: "brandId",
      foreignField: "_id",
      as: "brands",
    },
  };
  let result = await listFourJoinServiceForGlobal(
    req,
    ProductModel,
    searchArray,
    joinStage1,
    joinStage2,
    joinStage3,
    joinStage4
  );
  // const result = await BrandModel.find({ name: "la roche posay" });
  return res.status(200).json(result);
};
// Best Sales Products
exports.bestSalesProductForGlobal = async (req, res) => {
  let searchRgx = { $regex: req.query.searchKeyword, $options: "i" };
  let searchArray = [
    { name: searchRgx },
    { slug: searchRgx },
    { color: searchRgx },
    { "category.name": searchRgx },
    { "subCategory.name": searchRgx },
    { "subsubcategories.name": searchRgx },
    { "brands.name": searchRgx },
  ];

  let joinStage1 = {
    $lookup: {
      from: "categories",
      localField: "categoryId",
      foreignField: "_id",
      as: "category",
    },
  };
  let joinStage2 = {
    $lookup: {
      from: "subcategories",
      localField: "subCategoryId",
      foreignField: "_id",
      as: "subCategory",
    },
  };
  let joinStage3 = {
    $lookup: {
      from: "subsubcategories",
      localField: "subCategory.subSubCategoryId",
      foreignField: "_id",
      as: "subsubcategories",
    },
  };
  let joinStage4 = {
    $lookup: {
      from: "brands",
      localField: "brandId",
      foreignField: "_id",
      as: "brands",
    },
  };
  let result = await listFourJoinServiceBestSalesForGlobal(
    req,
    ProductModel,
    searchArray,
    joinStage1,
    joinStage2,
    joinStage3,
    joinStage4
  );
  return res.status(200).json(result);
};

exports.getProductDetailsById = async (req, res) => {
  let joinStage1 = {
    $lookup: {
      from: "categories",
      localField: "categoryId",
      foreignField: "_id",
      as: "category",
    },
  };
  let joinStage2 = {
    $lookup: {
      from: "subcategories",
      localField: "subCategoryId",
      foreignField: "_id",
      as: "subCategory",
    },
  };
  let joinStage3 = {
    $lookup: {
      from: "subsubcategories",
      localField: "subCategory.subSubCategoryId",
      foreignField: "_id",
      as: "subsubcategories",
    },
  };
  let joinStage4 = {
    $lookup: {
      from: "brands",
      localField: "brandId",
      foreignField: "_id",
      as: "brands",
    },
  };

  let result = await getDetailsByIdForuJoinService(
    req,
    ProductModel,
    joinStage1,
    joinStage2,
    joinStage3,
    joinStage4
  );
  return res.status(200).json(result);
};
exports.updateProduct = async (req, res) => {
  if (
    (req.body.price !== "undefined" && req.body.discount == 0) ||
    req.body.discount == undefined
  ) {
    req.body.finalPrice = req.body.price;
    req.body.discount = 0;
    req.body.saveAmount = 0;
  } else if (
    req.body.price !== "undefined" &&
    req.body.discount !== "undefined"
  ) {
    req.body.finalPrice = (
      (req.body.price * (100 - req.body.discount)) /
      100
    ).toFixed(3);
    req.body.saveAmount = (req.body.price * (req.body.discount / 100)).toFixed(
      3
    );
  }
  let result = await updateServiceWithImg(
    req,
    ProductModel,
    "products",
    600,
    600
  );
  return res.status(200).json(result);
};
exports.deleteProductImgAndPullImg = async (req, res) => {
  let result = await updateServiceWithDeleteImg(req, ProductModel);
  return res.status(200).json(result);
};
exports.deleteProduct = async (req, res) => {
  let id = req.params.id;
  let objectId = mongoose.Types.ObjectId;
  let queryObject = { "allProducts.productId": objectId(id) };

  let isDelete = await checkAssociateService(queryObject, OrderModel);
  if (isDelete === true) {
    return res
      .status(200)
      .json({ status: "associate", data: "This product associate to orders" });
  } else {
    let result = await deleteServiceWithImg(req, ProductModel);
    return res.status(200).json(result);
  }
};
exports.ratingsProduct = async (req, res) => {
  let { star, comment } = req.body;
  let userId = req.headers.userId;

  let checkValidObjectId = mongoose.Types.ObjectId.isValid(req.params.id);
  try {
    if (checkValidObjectId) {
      let objectId = mongoose.Types.ObjectId;
      let productId = req.params.id;
      let queryObject = {};
      queryObject._id = objectId(productId);

      let product = await ProductModel.aggregate([
        { $match: queryObject },
        {
          $project: {
            _id: 0,
            hasRated: {
              $in: [objectId(userId), "$ratings.author"],
            },
          },
        },
      ]);
      let pushItem = { star: star, author: userId, comment: comment };
      let updateRating;
      if (product[0].hasRated) {
        updateRating = await ProductModel.findOneAndUpdate(
          {
            _id: productId,
            "ratings.author": userId,
          },
          {
            $set: {
              "ratings.$.star": star,
              "ratings.$.author": userId,
              "ratings.$.comment": comment,
            },
          }
        );
      } else {
        updateRating = await ProductModel.updateOne(
          {
            _id: productId,
          },
          {
            $push: {
              ratings: pushItem,
            },
          }
        );
      }

      let productAllRating = await ProductModel.aggregate([
        { $match: queryObject },
        {
          $project: {
            _id: 0,
            name: 0,
            slug: 0,
            description: 0,
            price: 0,
            quantity: 0,
            sold: 0,
            img: 0,
            color: 0,
            categoryId: 0,
            brandId: 0,
            createdAt: 0,
            updatedAt: 0,
          },
        },
      ]);
      let totalRating = productAllRating[0].ratings.length;
      let totalRatingSum = productAllRating[0].ratings.reduce(
        (prev, curr) => prev + curr.star,
        0
      );

      totalRating = Math.floor(totalRatingSum / totalRating);

      await ProductModel.findOneAndUpdate(
        { _id: productId },
        { totalRating: totalRating }
      );

      return res.status(200).json({ status: "success", data: updateRating });
    } else {
      return res.status(200).json({ status: "fail", data: "ObjectId invalid" });
    }
  } catch (error) {
    return res.status(200).json({ status: "fail", data: error.toString() });
  }
};

// Start search related products with subCategory.
exports.relatedProducts = async (req, res) => {
  let searchRgx = { $regex: req.params.searchKeyword, $options: "i" };
  let searchArray = [{ name: searchRgx }];
  let joinStage1 = {
    $lookup: {
      from: "categories",
      localField: "categoryId",
      foreignField: "_id",
      as: "category",
    },
  };
  let joinStage2 = {
    $lookup: {
      from: "subcategories",
      localField: "subCategoryId",
      foreignField: "_id",
      as: "subCategory",
    },
  };

  let result = await RelatedProductsSearchSercice(
    req,
    ProductModel,
    searchArray,
    joinStage1,
    joinStage2
  );
  return res.status(200).json(result);
};

exports.getMegaMenuProductsByCategory = async (req, res) => {
  try {
    const data = await ProductModel.find({
      $and: [
        { remarkByCategory: { $exists: true } },
        { remarkByCategory: { $ne: "" } },
      ],
      $sort: { createdAt: -1 },
    });

    return res.status(200).json({ status: "success", data });
  } catch (error) {
    return res.status(200).json({ status: "fail", data: error.toString() });
  }
};

// set offer by category under all products
exports.setOfferByCategoryB1G1OrB2G1 = async (req, res) => {
  const { categoryId, isCategoryBrandB1G1, isCategoryBrandB2G1 } = req.body;

  try {
    const data = await ProductModel.find({
      categoryId: categoryId,
    });

    if (data.length > 0) {
      const data = await ProductModel.updateMany(
        { categoryId: categoryId },
        {
          $set: {
            offers: {
              isCategoryBrandB1G1: isCategoryBrandB1G1 || false,
              isCategoryBrandB2G1: isCategoryBrandB2G1 || false,
              isEachProductB1G1: false,
              isEachProductB2G1: false,
            },
          },
        }
      );
      return res.status(200).json({ status: "success", data });
    } else {
      return res
        .status(200)
        .json({ status: "success", data: "No product found" });
    }
  } catch (error) {
    return res.status(200).json({ status: "fail", data: error.toString() });
  }
};

exports.CheckOfferByCategoryB1G1 = async (req, res) => {
  const categoryId = req.params.id;

  try {
    const data = await ProductModel.find({
      categoryId: categoryId,
      "offers.isCategoryBrandB1G1": true,
    });

    if (data.length > 0) {
      return res.status(200).json({ status: "success", data: true });
    } else {
      return res.status(200).json({ status: "success", data: false });
    }
  } catch (error) {
    return res.status(200).json({ status: "fail", data: error.toString() });
  }
};

exports.CheckOfferByCategoryB2G1 = async (req, res) => {
  const categoryId = req.params.id;

  try {
    const data = await ProductModel.find({
      categoryId: categoryId,
      "offers.isCategoryBrandB2G1": true,
    });

    if (data.length > 0) {
      return res.status(200).json({ status: "success", data: true });
    } else {
      return res.status(200).json({ status: "success", data: false });
    }
  } catch (error) {
    return res.status(200).json({ status: "fail", data: error.toString() });
  }
};

// set offer by brand under all products
exports.setOfferByBrandB1G1OrB2G1 = async (req, res) => {
  const { brandId, isCategoryBrandB1G1, isCategoryBrandB2G1 } = req.body;

  try {
    const data = await ProductModel.find({
      brandId: brandId,
    });

    if (data.length > 0) {
      const data = await ProductModel.updateMany(
        { brandId: brandId },
        {
          $set: {
            offers: {
              isCategoryBrandB1G1: isCategoryBrandB1G1 || false,
              isCategoryBrandB2G1: isCategoryBrandB2G1 || false,
              isEachProductB1G1: false,
              isEachProductB2G1: false,
            },
          },
        }
      );
      return res.status(200).json({ status: "success", data });
    } else {
      return res
        .status(200)
        .json({ status: "success", data: "No product found" });
    }
  } catch (error) {
    return res.status(200).json({ status: "fail", data: error.toString() });
  }
};

exports.CheckOfferByBrandB1G1 = async (req, res) => {
  const brandId = req.params.id;

  try {
    const data = await ProductModel.find({
      brandId: brandId,
      "offers.isCategoryBrandB1G1": true,
    });

    if (data.length > 0) {
      return res.status(200).json({ status: "success", data: true });
    } else {
      return res.status(200).json({ status: "success", data: false });
    }
  } catch (error) {
    return res.status(200).json({ status: "fail", data: error.toString() });
  }
};

exports.CheckOfferByBrandB2G1 = async (req, res) => {
  const brandId = req.params.id;

  try {
    const data = await ProductModel.find({
      brandId: brandId,
      "offers.isCategoryBrandB2G1": true,
    });
    if (data.length > 0) {
      return res.status(200).json({ status: "success", data: true });
    } else {
      return res.status(200).json({ status: "success", data: false });
    }
  } catch (error) {
    return res.status(200).json({ status: "fail", data: error.toString() });
  }
};

// set offer Each product
exports.setOfferEachAndDifferentMultipleProductB1G1OrB2G1 = async (
  req,
  res
) => {
  const { idsToUpdate, isCategoryBrandB1G1, isCategoryBrandB2G1 } = req.body;

  try {
    const data = await ProductModel.updateMany(
      { _id: { $in: idsToUpdate } },
      {
        $set: {
          offers: {
            isEachProductB1G1: false,
            isEachProductB2G1: false,
            isCategoryBrandB1G1: isCategoryBrandB1G1 || false,
            isCategoryBrandB2G1: isCategoryBrandB2G1 || false,
          },
        },
      }
    );
    return res.status(200).json({ status: "success", data });
  } catch (error) {
    return res.status(200).json({ status: "fail", data: error.toString() });
  }
};

// set offer Each product
exports.setOfferEachProductB1G1OrB2G1 = async (req, res) => {
  const { idsToUpdate, isEachProductB1G1, isEachProductB2G1 } = req.body;

  try {
    const data = await ProductModel.updateMany(
      { _id: { $in: idsToUpdate } },
      {
        $set: {
          offers: {
            isEachProductB1G1: isEachProductB1G1 || false,
            isEachProductB2G1: isEachProductB2G1 || false,
            isCategoryBrandB1G1: false,
            isCategoryBrandB2G1: false,
          },
        },
      }
    );
    return res.status(200).json({ status: "success", data });
  } catch (error) {
    return res.status(200).json({ status: "fail", data: error.toString() });
  }
};
