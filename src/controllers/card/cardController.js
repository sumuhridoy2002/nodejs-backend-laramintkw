const { default: mongoose } = require("mongoose");
const cardModel = require("../../models/card/cardModel");
const createService = require("../../services/common/createService");
const listOneJoinService = require("../../services/common/listOneJoinService");

// Create Card
exports.createCard = async (req, res) => {
  let email = req.headers.email;
  let hasCard = await cardModel.find({ email: email });
  if (hasCard.length > 0) {
    updateCard = await cardModel.updateOne(
      {
        email: email,
      },
      {
        $push: {
          products: req.body.products,
        },

        totalPrice: req.body.totalPrice,
        totalAfterDiscount: req.body.totalAfterDiscount,
      }
    );
    return res.status(200).json(updateCard);
  } else {
    let result = await createService(req, cardModel);
    return res.status(200).json(result);
  }
};

// Get Cards
exports.getCards = async (req, res) => {
  let searchRgx = { $regex: req.params.searchKeyword, $options: "i" };
  let searchArray = [{ name: searchRgx }];
  let joinStage1 = {
    $lookup: {
      from: "products",
      localField: "products.productId",
      foreignField: "_id",
      as: "allProduct",
    },
  };
  let result = await listOneJoinService(
    req,
    cardModel,
    searchArray,
    joinStage1
  );
  return res.status(200).json(result);
};

// Remove Cards after order
exports.removeCardwhenOrder = async (req, res) => {
  let email = req.headers.email;

  let hasCard = await cardModel.find({ email: email });

  if (hasCard.length > 0) {
    var updateCard;
    req.body.products.map(async (item) => {
      updateCard = await cardModel.updateOne(
        {
          email: email,
        },
        {
          $pull: {
            products: { productId: item.productId },
          },

          totalPrice: req.body.totalPrice,
          totalAfterDiscount: req.body.totalAfterDiscount,
        }
      );
    });

    return res.status(200).json({ status: "success" });
  } else {
    let result = await createService(req, cardModel);
    return res.status(200).json(result);
  }
};

// delete one Card
exports.deleteCard = async (req, res) => {
  let email = req.headers.email;
  let id = req.params.id;

  try {
    let data = await cardModel.updateOne(
      { email: email },
      { $pull: { products: { productId: id } } }
    );
    return res.status(200).json({ status: "success", data });
  } catch (error) {
    return res.status(400).json({ status: "fail", data: error.toString() });
  }
};
