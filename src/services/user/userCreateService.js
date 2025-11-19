const bcrypt = require("bcrypt");
const SendEmailUtilityCreateUserWhenOrderToNewEmail = require("../../utils/sendEmailUtilityCreateUserWhenOrderToNewEmail");
const createUserService = async (Request, DataModel) => {
  let reqBody = Request.body;
  let password = Request.body.password;
  Request.body.photo = [
    {
      public_id: "default_avatar",
      secure_url:
        "https://res.cloudinary.com/dwcjrquex/image/upload/v1709617274/profile/avatar_mwtugu.jpg",
    },
  ];

  try {
    const salt = await bcrypt.genSaltSync(10);
    const hashPassword = await bcrypt.hash(password, salt);
    reqBody.password = hashPassword;
    let data = await DataModel.create(reqBody);

    // mail send email & password
    await SendEmailUtilityCreateUserWhenOrderToNewEmail(
      Request.body.email,
      password
    );

    return { status: "success", data };
  } catch (error) {
    return { status: "fail", data: error };
  }
};

module.exports = createUserService;
