const { default: mongoose } = require("mongoose");

const userDetailByIdService = async (Request, DataModel) => {
  let id = Request.params.id;
  let isAdmin = Request.headers?.isAdmin;

  let objectId = mongoose.Types.ObjectId;
  let queryUser = {};
  queryUser.email = Request.headers.email;

  let queryAdmin = {};
  queryAdmin._id = objectId(id);

  try {
    if (isAdmin == true) {
      let data = await DataModel.aggregate([
        { $match: queryAdmin },
        {
          $project: {
            password: 0,
          },
        },
      ]);
      if (data.length > 0) {
        return { status: "success", data };
      } else {
        return { status: "fail", data: "User not found" };
      }
    } else {
      let data = await DataModel.aggregate([
        { $match: queryUser },
        {
          $project: {
            password: 0,
          },
        },
      ]);
      if (data.length > 0) {
        return { status: "success", data };
      } else {
        return { status: "fail", data: "User not found" };
      }
    }
  } catch (error) {
    return { status: "fail", data: error };
  }
};

module.exports = userDetailByIdService;
