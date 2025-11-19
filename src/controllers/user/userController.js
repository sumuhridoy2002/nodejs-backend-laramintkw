const userModel = require("../../models/users/userModel");
const otpModel = require("../../models/users/otpModel");
const userCreateService = require("../../services/user/userCreateService");
const userDetailByIdService = require("../../services/user/userDetailByIdService");
const userLoginService = require("../../services/user/userLoginService");
const adminLoginService = require("../../services/user/adminLoginService");
const userUpdateService = require("../../services/user/userUpdateService");
const allUserService = require("../../services/user/userAllService");
const verifyEmailService = require("../../services/user/resetPassword/verifyEmailService");
const verifyOtpService = require("../../services/user/resetPassword/verifyOtpService");
const userResetPasswordService = require("../../services/user/resetPassword/userResetPasswordService");
const updateService = require("../../services/common/updateService");
const allAdminService = require("../../services/user/adminAllService");
const userAddToCartService = require("../../services/user/userCart/userAddToCartServices");

const fs = require("fs");
const {
  uploadMultipleImages,
  deleteCloudinaryImg,
} = require("../../utils/cloudinary");
const SendEmailUtilityForEmailSubcription = require("../../utils/sendEmailUtilityForEmailSubcription");

exports.registration = async (req, res) => {
  let data = await userCreateService(req, userModel);
  return res.status(200).json(data);
};

exports.login = async (req, res) => {
  let data = await userLoginService(req, res, userModel);
  return res.status(200).json(data);
};
exports.logOut = async (req, res) => {
  res.clearCookie("token");
  res.clearCookie("token2");
  res.clearCookie("token", { domain: ".laramintkw.com", path: "/" });
  res.clearCookie("token2", { domain: ".laramintkw.com", path: "/" });
  res.clearCookie("token", { domain: ".localhost", path: "/" });
  res.clearCookie("token2", { domain: ".localhost", path: "/" });
  return res
    .status(200)
    .json({ status: "success", data: "Successfully logged out" });
};
exports.adminLogin = async (req, res) => {
  let data = await adminLoginService(req, res, userModel);
  return res.status(200).json(data);
};

exports.userDetailsById = async (req, res) => {
  let data = await userDetailByIdService(req, userModel);
  return res.status(200).json(data);
};

exports.userUpdate = async (req, res) => {
  let id = req.params.id;
  let isAdmin = req.headers.isAdmin;
  let email = req.headers.email;
  let reqBody = req.body;

  try {
    if (isAdmin) {
      let data = await userModel.updateOne({ _id: id }, reqBody);
      return res.status(200).json({ status: "success", data: data });
    }

    if (req?.files?.length > 0) {
      let cloudinaryUploadedImgUrl;
      const urls = [];
      const files = req.files;
      for (const file of files) {
        const { path } = file;
        urls.push(path);
      }
      cloudinaryUploadedImgUrl = await uploadMultipleImages(urls, {
        folder: "profile",
        width: "400",
        height: "400",
      });
      // delete file in img directory
      urls.map((item) => {
        fs.unlinkSync(item);
      });

      let userOldPhoto = await userModel.findOne({ _id: id, email: email });
      if (userOldPhoto?.photo.length > 0) {
        await deleteCloudinaryImg(userOldPhoto?.photo[0].public_id);
      }

      let updateAndFindData;
      var pushImg;
      await Promise.all(
        cloudinaryUploadedImgUrl.map(async (element) => {
          pushImg = await userModel.updateOne(
            { _id: id, email: email },
            { photo: element }
          );
        })
      );

      var updateData = await userModel.updateOne(
        { _id: id, email: email },
        reqBody
      );
      // succesfully updated then return data
      if (
        (pushImg?.acknowledged && pushImg?.modifiedCount > 0) ||
        (updateData?.acknowledged && updateData?.modifiedCount > 0)
      ) {
        updateAndFindData = await userModel.findOne(
          { _id: id, email: email },
          {
            password: 0,
            cart: 0,
            wishList: 0,
            role: 0,
            isBlock: 0,
            couponCodeUses: 0,
            refreshToken: 0,
            createdAt: 0,
            updatedAt: 0,
          }
        );
      }
      return res.status(200).json({
        status: "success",
        data: updateAndFindData,
      });
    } else {
      let data = await userModel.updateOne({ _id: id, email: email }, reqBody);

      if (data?.acknowledged && data?.modifiedCount > 0) {
        data = await userModel.findOne(
          { _id: id, email: email },
          {
            password: 0,
            cart: 0,
            wishList: 0,
            role: 0,
            isBlock: 0,
            refreshToken: 0,
            createdAt: 0,
            updatedAt: 0,
          }
        );
      }
      return res.status(200).json({
        status: "success",
        data,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: "fail", data: error.toString() });
  }
};
// all user
exports.allUser = async (req, res) => {
  let searchRegex = { $regex: req.params.searchKeyword, $options: "i" };
  let searchArray = [
    { firstName: searchRegex },
    { lastName: searchRegex },
    { email: searchRegex },
    { mobile: searchRegex },
  ];
  let data = await allUserService(req, userModel, searchArray);
  return res.status(200).json(data);
};
// all Admin
exports.allAdmin = async (req, res) => {
  let searchRegex = { $regex: req.params.searchKeyword, $options: "i" };
  let searchArray = [
    { firstName: searchRegex },
    { lastName: searchRegex },
    { email: searchRegex },
    { mobile: searchRegex },
  ];
  let data = await allAdminService(req, userModel, searchArray);
  return res.status(200).json(data);
};
// save user address
exports.saveUserAddress = async (req, res) => {
  let result = await updateService(req, userModel);
  return res.status(200).json(result);
};
// AddToCart
exports.addToCart = async (req, res) => {
  let result = await userAddToCartService(req, userModel);
  return res.status(200).json(result);
};

// ------------------------ Contact Us -------------------------------------//
exports.subcriptionEmailForm = async (req, res) => {
  let { email } = req.body;
  let data = await SendEmailUtilityForEmailSubcription(email);
  return res.status(200).json(data);
};

// ------------------------ Reset Password -------------------------------------//

// step 01
exports.verifyEmail = async (req, res) => {
  let data = await verifyEmailService(req, userModel, otpModel);
  return res.status(200).json(data);
};
// step 02
exports.verifyOtp = async (req, res) => {
  let data = await verifyOtpService(req, otpModel);
  return res.status(200).json(data);
};
// step 03
exports.resetPassword = async (req, res) => {
  let data = await userResetPasswordService(req, userModel, otpModel);
  return res.status(200).json(data);
};
