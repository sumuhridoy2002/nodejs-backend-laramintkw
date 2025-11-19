const mongoose = require("mongoose");

const cancelledOrderServices = async (
  Request,
  DataModel,
  searchArray,
  joinStage1,
  joinStage2
) => {
  let pageNo = Number(Request.params.pageNo);
  let perPage = Number(Request.params.perPage);
  let searchKeyword = Request.params.searchKeyword;
  let skipRow = (pageNo - 1) * perPage;
  let userId = Request.headers.userId;

  try {
    let data;
    if (searchKeyword !== "0") {
      data = await DataModel.aggregate([
        // { $match: { $expr: { $ne: ["$events", []] } } },
        {
          $match: { userId: mongoose.Types.ObjectId(userId) },
        },
        {
          $match: {
            orderStatus: "Cancelled",
          },
        },
        joinStage1,
        joinStage2,
        { $match: { $or: searchArray } },
        { $sort: { createdAt: -1 } },
        {
          $facet: {
            total: [{ $count: "count" }],
            rows: [{ $skip: skipRow }, { $limit: perPage }],
          },
        },
      ]);
    } else {
      data = await DataModel.aggregate([
        {
          $match: { userId: mongoose.Types.ObjectId(userId) },
        },
        {
          $match: {
            orderStatus: "Cancelled",
          },
        },
        joinStage1,
        joinStage2,
        { $sort: { createdAt: -1 } },
        {
          $facet: {
            total: [{ $count: "count" }],
            rows: [{ $skip: skipRow }, { $limit: perPage }],
          },
        },
      ]);
    }
    return { status: "success", data };
  } catch (error) {
    return { status: "fail", data: error.toString() };
  }
};

module.exports = cancelledOrderServices;
