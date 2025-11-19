const fs = require("fs");
const {
  uploadMultipleImages,
  deleteCloudinaryImg,
} = require("../../utils/cloudinary");

exports.uploadImages = async (req, res, next) => {
  try {
    let cloudinaryUploadedImgUrl;
    const urls = [];
    const files = req.files;
    for (const file of files) {
      const { path } = file;
      urls.push(path);
    }

    cloudinaryUploadedImgUrl = await uploadMultipleImages(urls, {
      overwrite: true,
      invalidate: true,
      resource_type: "auto",
      width: 300,
      height: 300,
    });

    urls.map((item) => {
      fs.unlinkSync(item);
    });

    res.status(200).json({ status: "success", data: cloudinaryUploadedImgUrl });

    next();
  } catch (error) {
    res.status(400).json({ status: "fail", data: error.toString() });
  }
};

exports.deleteImages = async (req, res) => {
  const id = req.params.id;
  try {
    const deleted = await deleteCloudinaryImg(id);
    res.status(200).json({ status: "success", data: deleted });
  } catch (error) {
    res.status(400).json({ status: "fail", data: error.toString() });
  }
};
