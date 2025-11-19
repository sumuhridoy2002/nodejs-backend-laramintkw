const mongoose = require("mongoose");
let ProdcutModel = require("../../models/product/productModel");
const createServiceWithIncreaseDecreaseItem = async (Request, DataModel) => {
  let reqBody = Request.body;
  Request.body.allProducts.map((prod) => {
    prod.productId = mongoose.Types.ObjectId(prod.productId);
  });
  let allProducts = Request.body.allProducts;

  try {
    await allProducts.map(async (prod) => {
      await ProdcutModel.findOneAndUpdate(
        { _id: prod.productId },
        {
          $inc: {
            quantity: -Number(prod.customerChoiceProductQuantity),
            sold: Number(prod.customerChoiceProductQuantity),
          },
        }
      );
    });

    let data = await DataModel.create(reqBody);
    return { status: "success", data };
  } catch (e) {
    return { status: "fail", data: e };
  }
};

module.exports = createServiceWithIncreaseDecreaseItem;
