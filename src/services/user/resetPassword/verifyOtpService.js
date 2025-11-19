const verifyOtpService = async (Request, DataModel) => {
  let email = Request.params.email;
  let otp = Request.params.otp;

  email, otp;

  try {
    let matchingOtp = await DataModel.aggregate([
      { $match: { email: email, otp: otp, status: 0 } },
    ]);
    if (matchingOtp.length > 0) {
      let updateOtpStatus = await DataModel.updateOne(
        { email: email, otp: otp, status: 0 },
        { status: 1 }
      );
      return { status: "success", data: updateOtpStatus };
    } else {
      return { status: "fail", data: "Invalid Otp Code." };
    }
  } catch (error) {
    return { status: "fail", data: error.toString() };
  }
};

module.exports = verifyOtpService;
