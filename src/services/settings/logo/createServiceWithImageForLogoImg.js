const fs = require("fs");
const { uploadMultipleImages } = require("../../../utils/cloudinary");

const createServiceWithImageForLogoImg = async (
  Request,
  DataModel,
  folder,
  width,
  height
) => {
  let reqBody = Request.body;
  try {
    let cloudinaryUploadedImgUrl;
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

    // delete file in img local directory
    urls.map((item) => {
      fs.unlinkSync(item);
    });

    if (cloudinaryUploadedImgUrl.length > 0) {
      reqBody.logoImg = cloudinaryUploadedImgUrl;
      var infoResult = await DataModel.create(reqBody);
    }

    return {
      status: "success",
      fileResult: cloudinaryUploadedImgUrl,
      infoResult: infoResult,
    };
  } catch (error) {
    return {
      status: "fail",
      data: error,
    };
  }
};

module.exports = createServiceWithImageForLogoImg;
