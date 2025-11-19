const allUserService = async (Request, DataModel, searchArray) => {
  let perPage = Number(Request.params.perPage);
  let pageNo = Number(Request.params.pageNo);
  let searchKeyword = Request.params.searchKeyword;
  let skipRow = (pageNo - 1) * perPage;
  try {
    let data;
    if (searchKeyword !== "0") {
      let searchQuery = { $or: searchArray };
      data = await DataModel.aggregate([
        { $match: searchQuery },
        { $match: { role: "user" } },
        { $project: { password: 0 } },
        {
          $facet: {
            total: [{ $count: "count" }],
            rows: [{ $skip: skipRow }, { $limit: perPage }],
          },
        },
      ]);
    } else {
      data = await DataModel.aggregate([
        { $match: { role: "user" } },
        { $project: { password: 0 } },
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

module.exports = allUserService;
