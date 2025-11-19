const SendEmailUtility = require("../../../utils/sendMaliUtility");

const verifyEmailService = async (Request, DataModel, otpDataModel) => {
  let email = Request.params.email;
  let OTPCode = Math.floor(100000 + Math.random() * 900000);
  try {
    let verifiedEmail = await DataModel.aggregate([
      { $match: { email: email } },
    ]);
    if (verifiedEmail.length > 0) {
      let createOtpInDatabase = await otpDataModel.create({
        email: email,
        otp: OTPCode,
        status: 0,
      });
      let emailSendResult = await SendEmailUtility(
        email,
        `Your 6 digit OTP code is: ${OTPCode}`
      );
      return { status: "success", data: emailSendResult };
    } else {
      return { status: "fail", data: "Email Not Found!" };
    }
  } catch (error) {
    return { status: "fail", data: error.toString() };
  }
};

module.exports = verifyEmailService;
