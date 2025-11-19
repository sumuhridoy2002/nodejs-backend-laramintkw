const { default: mongoose } = require("mongoose");

const getDetailsByIdThreeJoinService = async (
  Request,
  DataModel,
  joinStage1,
  joinStage2,
  joinStage3
) => {
  try {
    let id = Request.params.id;
    let checkValidObjectId = mongoose.Types.ObjectId.isValid(Request.params.id);
    if (checkValidObjectId) {
      let objectId = mongoose.Types.ObjectId;
      let query = {};
      query._id = objectId(id);
      let data;
      data = await DataModel.aggregate([
        { $match: query },
        joinStage1,
        joinStage2,
        joinStage3,
      ]);
      return { status: "success", data };
    } else {
      return { status: "fail", data: "BJson data invalid" };
    }
  } catch (error) {
    return { status: "fail", data: error.toString() };
  }
};

module.exports = getDetailsByIdThreeJoinService;
