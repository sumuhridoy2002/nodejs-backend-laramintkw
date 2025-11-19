const { default: mongoose } = require("mongoose");
let userModel = require("../../models/users/userModel");
let productModel = require("../../models/product/productModel");
const checkAssociateService = require("../../services/common/checkAssociateService");
const listOneJoinService = require("../../services/common/listOneJoinService");

exports.createAndRemoveWishList = async (req, res) => {
  let email = req.headers.email;
  let productId = req.body.productId;
  let queryObject = {};
  let ObjectId = mongoose.Types.ObjectId;
  queryObject.wishList = ObjectId(productId);

  let checkAllReadyWishListedProduct = await checkAssociateService(
    req,
    queryObject,
    userModel
  );

  if (checkAllReadyWishListedProduct) {
    await userModel.updateOne(
      { email: email },
      { $pull: { wishList: productId } }
    );
    return res
      .status(200)
      .json({ status: "success", data: "Remove wishlist product" });
  } else {
    await userModel.updateOne(
      { email: email },
      { $push: { wishList: productId } }
    );
  }

  return res
    .status(200)
    .json({ status: "success", data: "Added wishlist product" });
};

exports.getWishList = async (req, res) => {
  let searchRgx = { $regex: req.params.searchKeyword, $options: "i" };
  let searchArray = [{ "products.name": searchRgx }];
  let joinStage1 = {
    $lookup: {
      from: "products",
      localField: "wishList",
      foreignField: "_id",
      as: "products",
    },
  };
  let data = await listOneJoinService(req, userModel, searchArray, joinStage1);
  return res.status(200).json(data);
};
