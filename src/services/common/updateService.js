const mongoose = require("mongoose");

const updateService = async (Request, DataModel) => {
  let id = Request.params.id || Request.body.id;
  let reqBody = Request.body;

  let checkObjectId = mongoose.Types.ObjectId.isValid(id);

  try {
    if (!checkObjectId) {
      return { status: "fail", data: "Invalid Object Id" };
    } else {
      let data = await DataModel.updateOne({ _id: id }, reqBody);
      return { status: "success", data };
    }
  } catch (e) {
    return { status: "fail", data: e.toString() };
  }
};

module.exports = updateService;
