const mongoose = require("mongoose");

const runningOrderServices = async (
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
    const baseMatch = [
      { $match: { userId: mongoose.Types.ObjectId(userId) } },
      { $match: { orderStatus: { $not: { $eq: "Delivered" } } } },
      { $match: { orderStatus: { $not: { $eq: "Cancelled" } } } },
      { $match: { orderStatus: { $not: { $eq: "Returned" } } } },
    ];

    if (searchKeyword !== "0") {
      data = await DataModel.aggregate([
        ...baseMatch,
        joinStage1,
        joinStage2,
        { $match: { $or: searchArray } },
        { $sort: { createdAt: -1 } }, // Sort by createdAt in descending order
        {
          $facet: {
            total: [{ $count: "count" }],
            rows: [{ $skip: skipRow }, { $limit: perPage }],
          },
        },
      ]);
    } else {
      data = await DataModel.aggregate([
        ...baseMatch,
        joinStage1,
        joinStage2,
        { $sort: { createdAt: -1 } }, // Sort by createdAt in descending order
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

module.exports = runningOrderServices;
