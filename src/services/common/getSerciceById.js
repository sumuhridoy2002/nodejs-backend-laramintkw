const { default: mongoose } = require("mongoose");

const getServiceById = async (Request, DataModel) => {
  let id = Request.params.id;
  let objectId = mongoose.Types.ObjectId;
  let query = {};
  query._id = objectId(id);
  try {
    let data = await DataModel.aggregate([{ $match: query }]);
    return { status: "success", data };
  } catch (error) {
    return { status: "success", data: error.toString() };
  }
};

module.exports = getServiceById;
