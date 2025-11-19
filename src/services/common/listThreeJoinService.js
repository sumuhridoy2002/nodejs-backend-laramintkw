const listThreeJoinService = async (
  Request,
  DataModel,
  searchArray,
  joinStage1,
  joinStage2,
  joinStage3
) => {
  let inStock = Request.query.inStock?.toString();

  let pageNo = Number(Request.params.pageNo);
  let perPage = Number(Request.params.perPage);
  let searchKeyword = Request.params.searchKeyword;
  let skipRow = (pageNo - 1) * perPage;
  let email = Request.headers.email;

  // start custom array push indexing
  Array.prototype.insert = function (index, ...items) {
    this.splice(index, 0, ...items);
  };
  // end custom array push indexing

  let queryPipeline = [
    { $match: { $expr: { $ne: ["$events", []] } } },
    joinStage1,
    joinStage2,
    joinStage3,
    {
      $facet: {
        total: [{ $count: "count" }],
        rows: [{ $skip: skipRow }, { $limit: perPage }],
      },
    },
  ];
  if (searchKeyword !== "0") {
    queryPipeline.insert(-1, { $match: { $or: searchArray } });
  }

  if (inStock == "true") {
    queryPipeline.insert(-1, { $match: { quantity: { $gte: 1 } } });
  }
  if (inStock == "false") {
    queryPipeline.insert(-1, { $match: { quantity: 0 } });
  }
  if (inStock == "5") {
    queryPipeline.insert(-1, { $match: { quantity: { $gte: 1, $lte: 5 } } });
  }
  if (inStock == "10") {
    queryPipeline.insert(-1, { $match: { quantity: { $gte: 1, $lte: 10 } } });
  }

  try {
    let data;
    data = await DataModel.aggregate(queryPipeline);
    return { status: "success", data };
  } catch (error) {
    return { status: "fail", data: error.toString() };
  }
};

module.exports = listThreeJoinService;
