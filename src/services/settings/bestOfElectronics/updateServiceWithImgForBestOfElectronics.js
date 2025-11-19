const fs = require("fs");
const { uploadMultipleImages } = require("../../../utils/cloudinary");

const updateServiceWithImgForBestOfElectronics = async (
  Request,
  DataModel,
  folder,
  width,
  height
) => {
  let id = Request.params.id || Request.body.id;
  let reqBody = Request.body;

  try {
    if (Request.files.length > 0) {
      let cloudinaryUploadedImgUrl = [];
      const urls = [];
      const files = Request.files;
      for (const file of files) {
        const { path } = file;
        urls.push(path);
      }
      cloudinaryUploadedImgUrl = await uploadMultipleImages(urls, {
        folder: folder,
        width: width,
        height: height,
      });
      // delete file in img directory
      urls.map((item) => {
        fs.unlinkSync(item);
      });

      var pushImg;
      await Promise.all(
        cloudinaryUploadedImgUrl.map(async (element) => {
          element.link = reqBody.link;
          pushImg = await DataModel.updateOne(
            { _id: id },
            { $push: { bestOfElectronics: element } }
          );
        })
      );

      // var updateData = await DataModel.updateOne({ _id: id }, reqBody);

      return {
        status: "success",
        fileResult: pushImg,
        updateData: updateData,
      };
    } else {
      var updateData = await DataModel.updateOne({ _id: id }, reqBody);
      return {
        status: "success",
        infoResult: updateData,
      };
    }
  } catch (e) {
    return { status: "fail", data: e.toString() };
  }
};

module.exports = updateServiceWithImgForBestOfElectronics;
