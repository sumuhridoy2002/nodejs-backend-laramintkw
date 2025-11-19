const mongoose = require("mongoose");
const { deleteCloudinaryImg } = require("../../utils/cloudinary");

const deleteServiceWithImg = async (Request, DataModel) => {
  let id = Request.params.id;

  let objectId = mongoose.Types.ObjectId;
  let query = {};
  query._id = objectId(id);

  try {
    // delete img
    let imgDataOfDataModel = await DataModel.findOne({ _id: id });

    imgDataOfDataModel?.img?.map(async (item) => {
      await deleteCloudinaryImg(item.public_id);
    });

    // delete info
    var data = await DataModel.deleteMany(query);

    return { status: "success", data };
  } catch (error) {
    return { status: "fail", data: error.toString() };
  }
};

module.exports = deleteServiceWithImg;
