const bcrypt = require("bcrypt");
const createToken = require("../../utils/createToken");

const userLoginService = async (Request, Response, DataModel) => {
  let email = Request.body.email;
  let enteredPassword = Request.body.password;
  try {
    let data = await DataModel.aggregate([{ $match: { email: email } }]);
    let token;
    let refreshToken;

    if (data.length > 0) {
      let encrypt = await bcrypt.compare(enteredPassword, data[0].password);
      if (encrypt) {
        if (data.length > 0) {
          token = await createToken(data[0].email, data[0]._id);
        }
        const oneMonthInMilliseconds = 1000 * 60 * 60 * 24 * 30;
        Response.cookie("token", token, {
          // domain: ".egolap.com",
          maxAge: oneMonthInMilliseconds, // 1 month
          sameSite: "None",
          path: "/",
          // httpOnly: process.env.NODE_ENV === "production",
          // secure: process.env.NODE_ENV === "production",
          // httpOnly: true,
          // secure: true,
        });

        return {
          status: "success",
          data: {
            id: data[0]._id,
            firstName: data[0].firstName,
            lastName: data[0].lastName,
            email: data[0].email,
            phone: data[0].phone,
            photo: data[0].photo,
            cart: data[0].cart,
            wishList: data[0].wishList,
            address: data[0].address,
            couponCodeUses: data[0].couponCodeUses,
          },
          token,
        };
      } else {
        return {
          status: "Invalid Credentials",
          data: "invalid email or password",
        };
      }
    } else {
      return {
        status: "Invalid Credentials",
        data: "User not found!",
      };
    }
  } catch (error) {
    return { status: "fail", data: error.toString() };
  }
};

module.exports = userLoginService;
