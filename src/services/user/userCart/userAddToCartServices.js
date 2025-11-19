const mongoose = require("mongoose");

const userAddToCartService = async (Request, DataModel) => {
  let id = Request.params.id;
  let reqBody = Request.body;
  let cart = reqBody.cart;

  try {
    if (mongoose.Types.ObjectId.isValid(id)) {
      let data = await DataModel.updateMany(
        { _id: mongoose.Types.ObjectId(id) },
        {
          $set: {
            cart: cart,
          },
        }
      );

      // let data = await DataModel.aggregate([
      //   { $match: { _id: mongoose.Types.ObjectId(id) } },
      //   {
      //     $project: {
      //       _id: 0,
      //       hasRated: {
      //         $in: [cart[0]._id, "$cart._id"],
      //       },
      //     },
      //   },
      // ]);
      // let updateData;
      // if (data[0].hasRated) {
      //   ("findOneAndUpdate");
      //   updateData = await DataModel.findOneAndUpdate(
      //     {
      //       _id: mongoose.Types.ObjectId(id),
      //       "cart._id": cart[0]._id,
      //     },
      //     {
      //       $set: {
      //         "cart.$._id": cart[0]._id,
      //         "cart.$.name": cart[0].name,
      //         "cart.$.slug": cart[0].slug,
      //         "cart.$.description": cart[0].description,
      //         "cart.$.price": cart[0].price,
      //         "cart.$.discount": cart[0].discount,
      //         "cart.$.finalPrice": cart[0].finalPrice,
      //         "cart.$.saveAmount": cart[0].saveAmount,
      //         "cart.$.quantity": cart[0].quantity,
      //         "cart.$.sold": cart[0].sold,
      //         "cart.$.color": cart[0].color,
      //         "cart.$.size": cart[0].size,
      //         "cart.$.weight": cart[0].weight,
      //         "cart.$.totalRating": cart[0].totalRating,
      //         "cart.$.categoryId": cart[0].categoryId,
      //         "cart.$.subCategoryId": cart[0].subCategoryId,
      //         "cart.$.brandId": cart[0].brandId,
      //         "cart.$.tags": cart[0].tags,
      //         "cart.$.ratings": cart[0].ratings,
      //         "cart.$.createdAt": cart[0].createdAt,
      //         "cart.$.updatedAt": cart[0].updatedAt,
      //         "cart.$.sortDescription": cart[0].sortDescription,
      //         "cart.$.customerChoiceProductQuantity":
      //           cart[0].customerChoiceProductQuantity,
      //       },
      //     }
      //   );
      // } else {
      //   ("updateMany");
      //   updateData = await DataModel.updateMany(
      //     { _id: id },
      //     { $push: { cart: { $each: cart } } }
      //   );
      // }
      return { status: "success", data: data };
    } else {
      return { status: "fail", data: "User id invalid" };
    }
  } catch (error) {
    return { status: "fail", data: error.toString() };
  }
};

module.exports = userAddToCartService;
