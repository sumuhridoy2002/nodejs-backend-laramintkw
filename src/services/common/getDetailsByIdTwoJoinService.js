const { default: mongoose } = require("mongoose");

const getDetailsByIdTwoJoinService = async (
  Request,
  DataModel,
  joinStage1,
  joinStage2
) => {
  let id = Request.params.id;

  try {
    if (mongoose.Types.ObjectId.isValid(id)) {
      let objectId = mongoose.Types.ObjectId;
      let query = {};
      query._id = objectId(id);

      let data;

      data = await DataModel.aggregate([
        { $match: query },
        joinStage1,
        joinStage2,
      ]);

      return { status: "success", data };
    } else {
      return { status: "fail", data: "Invalid Id" };
    }
  } catch (error) {
    return { status: "fail", data: error.toString() };
  }
};

module.exports = getDetailsByIdTwoJoinService;
