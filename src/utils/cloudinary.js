const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUNDINARY_NAME,
  api_key: process.env.CLOUNDINARY_API_KEY,
  api_secret: process.env.CLOUNDINARY_SECRET_KEY,
});

// const opts = {
//   overwrite: true,
//   invalidate: true,
//   resource_type: "auto",
//   width: 300,
//   height: 300,
// };

const uploadImage = (image, opt) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(image, opt, (error, result) => {
      if (result && result.secure_url) {
        return resolve({
          public_id: result.public_id,
          secure_url: result.secure_url,
        });
      }
      return reject({ message: error.message });
    });
  });
};
exports.uploadMultipleImages = (images, opt) => {
  return new Promise((resolve, reject) => {
    const uploads = images.map((base) => uploadImage(base, opt));
    Promise.all(uploads)
      .then((values) => resolve(values))
      .catch((err) => reject(err));
  });
};

exports.deleteCloudinaryImg = async (imgId) => {
  let result = await cloudinary.uploader.destroy(imgId);

  return result;
};
