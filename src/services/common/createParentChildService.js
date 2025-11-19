// const mongoose = require("mongoose");
// const productsModel = require("../../models/product/productModel");
// var uniqid = require("uniqid");

// const createParentChildService = async (
//   Request,
//   ParentModel,
//   ChildModel,
//   JoinPropertyName
// ) => {
//   // Create Transaction Session
//   const session = await mongoose.startSession();

//   try {
//     // Start Transaction Session
//     session.startTransaction();

//     //  First Database Process
//     let parentBody = Request.body.parent;
//     parentBody.userId = Request.headers.userId;
//     let parentData = await ParentModel.create([parentBody], { session });

//     // second database Process
//     let childBody = Request.body.childs;

//     childBody[JoinPropertyName] = parentData[0]._id;
//     childBody.orderId = uniqid.time();
//     childBody.userId = Request.headers.userId;

//     // create order then products quantity decrease
//     Request.body.childs.products.map(async (prods) => {
//       await productsModel.findOneAndUpdate(
//         { _id: prods.productId },
//         {
//           $inc: {
//             quantity: -Number(prods.quantity),
//             sold: Number(prods.quantity),
//           },
//         }
//       );
//     });
//     // End create order then products quantity decrease

//     let childData = await ChildModel.insertMany(childBody, { session });

//     //  success Transaction
//     await session.commitTransaction();
//     session.endSession();

//     return {
//       status: "success",
//       parent: parentData,
//       child: childData,
//     };
//   } catch (error) {
//     await session.abortTransaction();
//     session.endSession();
//     return {
//       status: "fail",
//       data: error.toString(),
//     };
//   }
// };

// module.exports = createParentChildService;
