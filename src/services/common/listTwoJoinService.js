const listTwoJoinService = async (
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

  try {
    let totalQuery = {};
    if (searchKeyword !== "0") {
      totalQuery = { $or: searchArray };
    }

    const total = await DataModel.countDocuments(totalQuery);

    let rows;
    if (searchKeyword !== "0") {
      rows = await DataModel.aggregate([
        {
          $project: {
            description: 0,
          },
        },
        { $sort: { createdAt: -1 } },
        joinStage1,
        joinStage2,
        { $match: { $or: searchArray } },
        { $skip: skipRow },
        { $limit: perPage },
      ]);
    } else {
      rows = await DataModel.aggregate([
        { $sort: { createdAt: -1 } },
        joinStage1,
        joinStage2,
        { $skip: skipRow },
        { $limit: perPage },
      ]);
    }

    return { status: "success", data: { total, rows } };
  } catch (error) {
    return { status: "fail", data: error.toString() };
  }
};

module.exports = listTwoJoinService;
