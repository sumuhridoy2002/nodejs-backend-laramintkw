const listFourJoinServiceBestSalesForGlobal = async (
  Request,
  DataModel,
  searchArray,
  joinStage1,
  joinStage2,
  joinStage3,
  joinStage4
) => {
  // query search
  let min = Number(Request.query.min);
  let max = Number(Request.query.max);
  let discount = Number(Request.query.discount);
  let category = Request.query.category;
  let subcategory = Request.query.subcategory;
  let subsubcategory = Request.query.subsubcategory;
  let brand = Request.query.brand;

  let pageNo = Number(Request.query.pageNo);
  let perPage = Number(Request.query.perPage);
  let searchKeyword = Request.query.searchKeyword;
  let skipRow = (pageNo - 1) * perPage;

  // thats dynamic array insert function
  Array.prototype.insert = function (index, ...items) {
    this.splice(index, 0, ...items);
  };
  // End thats dynamic array insert function

  let queryPipeline = [
    joinStage1,
    joinStage2,
    joinStage3,
    joinStage4,
    {
      $project: {
        description: 0,
      },
    },
    { $sort: { sold: -1 } },
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
  if (!isNaN(min) && isNaN(max)) {
    queryPipeline.insert(-1, {
      $match: { price: { $gte: min, $lte: 200 } },
    });
  }
  if (isNaN(min) && !isNaN(max)) {
    queryPipeline.insert(-1, {
      $match: { price: { $gte: 0, $lte: max } },
    });
  }
  if (!isNaN(min) && !isNaN(max)) {
    queryPipeline.insert(-1, {
      $match: { price: { $gte: min, $lte: max } },
    });
  }
  if (category !== undefined) {
    queryPipeline.insert(-1, {
      $match: {
        $or: [
          {
            "category.name": { $regex: Request.query.category, $options: "i" },
          },
        ],
      },
    });
  }
  if (brand !== undefined) {
    queryPipeline.insert(-1, {
      $match: {
        $or: [
          {
            "brands.name": { $regex: Request.query.brand, $options: "i" },
          },
        ],
      },
    });
  }
  if (subcategory !== undefined) {
    queryPipeline.insert(-1, {
      $match: {
        $or: [
          {
            "subCategory.name": {
              $regex: Request.query.subcategory,
              $options: "i",
            },
          },
        ],
      },
    });
  }
  if (subsubcategory !== undefined) {
    queryPipeline.insert(-1, {
      $match: {
        $or: [
          {
            "subsubcategories.name": {
              $regex: Request.query.subsubcategory,
              $options: "i",
            },
          },
        ],
      },
    });
  }
  // Discount;
  if (!isNaN(discount)) {
    queryPipeline.insert(-1, {
      $match: { discount: { $gte: discount } },
    });
  }

  try {
    let data;

    data = await DataModel.aggregate(queryPipeline);
    return { status: "success", data };
  } catch (error) {
    return { status: "fail", data: error };
  }
};

module.exports = listFourJoinServiceBestSalesForGlobal;
