const listThreeJoinServiceForGlobal = async (
  Request,
  DataModel,
  searchArray,
  joinStage1,
  joinStage2,
  joinStage3
) => {
  // query search
  let min = Number(Request.query.min);
  let max = Number(Request.query.max);
  let category = Request.query.category;
  let subcategory = Request.query.subcategory;
  let subsubcategory = Request.query.subsubcategory;
  let discount = Number(Request.query.discount);
  let inStock = Request.query.inStock;
  let tag = Request.query.tag;
  let sortby = Request.query.sortby;
  let remark = Request.query.remark;
  let remarkbycategory = Request.query.remarkbycategory;

  // let pageNo = Number(Request.params.pageNo);
  // let perPage = Number(Request.params.perPage);
  // let searchKeyword = Request.params.searchKeyword;

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
    {
      $project: {
        description: 0,
      },
    },
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
  // inStock;
  if (inStock == "true") {
    queryPipeline.insert(-1, {
      $match: {
        quantity: { $gte: 1 },
      },
    });
  }
  // inStock;
  if (inStock == "false") {
    queryPipeline.insert(-1, {
      $match: {
        quantity: { $lte: 0 },
      },
    });
  }

  if (tag !== undefined) {
    let tagArr = tag.trim().split(/[ ,]+/);
    queryPipeline.insert(
      -1,

      {
        $match: { tags: { $in: tagArr } },
      }
    );
  }

  if (remark !== undefined) {
    queryPipeline.insert(-1, {
      $match: {
        $or: [
          {
            remark: {
              $regex: Request.query.remark,
              $options: "i",
            },
          },
        ],
      },
    });
  }

  // its for mega menu show products
  if (remarkbycategory !== undefined) {
    queryPipeline.insert(-1, {
      $match: {
        $or: [
          {
            remarkByCategory: {
              $regex: Request.query.remarkbycategory,
              $options: "i",
            },
          },
        ],
      },
    });
  }
  // for all products latest

  if (sortby !== undefined && sortby == 0) {
    queryPipeline.insert(-1, {
      $sort: {
        finalPrice: 1,
        createdAt: -1,
      },
    });
  } else if (sortby !== undefined && sortby == 1) {
    queryPipeline.insert(-1, {
      $sort: {
        finalPrice: -1,
        createdAt: -1,
      },
    });
  } else {
    queryPipeline.insert(-1, {
      $sort: {
        createdAt: -1,
      },
    });
  }

  try {
    let data;
    data = await DataModel.aggregate(queryPipeline).allowDiskUse();

    return { status: "success", data };
  } catch (error) {
    return { status: "fail", data: error.toString() };
  }
};

module.exports = listThreeJoinServiceForGlobal;
