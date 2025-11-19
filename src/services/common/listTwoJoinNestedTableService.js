const listTwoJoinNestedTableService = async (
  Request,
  DataModel,
  searchArray,
  joinStage1
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
        { $match: totalQuery },
        {
          $project: {
            description: 0,
          },
        },

        joinStage1,
        {
          $unwind: { path: "$subCategories", preserveNullAndEmptyArrays: true },
        },
        {
          $lookup: {
            from: "subsubcategories",
            localField: "subCategories.subSubCategoryId",
            foreignField: "_id",
            as: "subCategories.subsubCategories",
          },
        },
        {
          $group: {
            _id: "$_id",
            name: { $first: "$name" },
            subCategoryId: { $first: "$subCategoryId" },
            createdAt: { $first: "$createdAt" },
            updatedAt: { $first: "$updatedAt" },
            subCategories: { $push: "$subCategories" },
          },
        },
        { $sort: { createdAt: -1 } },
        { $skip: skipRow },
        { $limit: perPage },
      ]);
    } else {
      rows = await DataModel.aggregate([
        joinStage1,
        {
          $unwind: { path: "$subCategories", preserveNullAndEmptyArrays: true },
        },
        {
          $lookup: {
            from: "subsubcategories",
            localField: "subCategories.subSubCategoryId",
            foreignField: "_id",
            as: "subCategories.subsubCategories",
          },
        },
        {
          $group: {
            _id: "$_id",
            name: { $first: "$name" },
            subCategoryId: { $first: "$subCategoryId" },
            createdAt: { $first: "$createdAt" },
            updatedAt: { $first: "$updatedAt" },
            subCategories: { $push: "$subCategories" },
          },
        },
        { $sort: { createdAt: -1 } },
        { $skip: skipRow },
        { $limit: perPage },
      ]);
    }

    return { status: "success", data: { total, rows } };
  } catch (error) {
    return { status: "fail", data: error.toString() };
  }
};

module.exports = listTwoJoinNestedTableService;
