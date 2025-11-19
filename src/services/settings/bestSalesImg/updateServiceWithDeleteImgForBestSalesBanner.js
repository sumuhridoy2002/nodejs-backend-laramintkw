const { deleteCloudinaryImg } = require("../../../utils/cloudinary");

const updateServiceWithDeleteImgForBestSalesBanner = async (
  Request,
  DataModel
) => {
  let id = Request.params.id || Request.body.id;
  let imgId = Request.body.imgId;

  try {
    let deleteImg = await deleteCloudinaryImg(imgId);

    if (deleteImg.result === "ok") {
      var pullImg = await DataModel.findOneAndUpdate(
        {
          _id: id,
        },
        { $pull: { bestSales: { public_id: imgId } } }
      );

      return {
        status: "success",
        fileResult: deleteImg,
        infoResult: pullImg,
      };
    } else {
      return {
        status: "fail",
        fileResult: deleteImg,
      };
    }
  } catch (e) {
    return { status: "fail", data: e.toString() };
  }
};

module.exports = updateServiceWithDeleteImgForBestSalesBanner;
