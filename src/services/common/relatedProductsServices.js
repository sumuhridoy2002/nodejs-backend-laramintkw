const RelatedProductsSearchSercice = async (
  Request,
  DataModel,
  searchArray,
  joinStage1,
  joinStage2
) => {
  let pageNo = Number(Request.params.pageNo);
  let perPage = Number(Request.params.perPage);
  let searchKeyword = Request.params.searchKeyword;
  let subCategory = Request.query.subCategory;
  let skipRow = (pageNo - 1) * perPage;
  try {
    let data;
    let namesToSearch = [];
    namesToSearch.push(subCategory);
    const regexPatterns = namesToSearch.map((name) => new RegExp(name, "i"));
    if (searchKeyword !== "0") {
      data = await DataModel.aggregate([
        joinStage1,
        joinStage2,
        {
          $project: {
            description: 0,
          },
        },
        {
          $match: {
            $or: [
              {
                "subCategory.name": {
                  $in: namesToSearch,
                },
              },
              {
                "subCategory.name": {
                  $in: regexPatterns,
                },
              },
            ],
          },
        },
        { $match: { $or: searchArray } },
        {
          $facet: {
            total: [{ $count: "count" }],
            rows: [{ $skip: skipRow }, { $limit: perPage }],
          },
        },
      ]);
    } else {
      data = await DataModel.aggregate([
        joinStage1,
        joinStage2,
        {
          $project: {
            description: 0,
          },
        },
        {
          $match: {
            $or: [
              {
                "subCategory.name": {
                  $in: namesToSearch,
                },
              },
              {
                "subCategory.name": {
                  $in: regexPatterns,
                },
              },
            ],
          },
        },
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

module.exports = RelatedProductsSearchSercice;
