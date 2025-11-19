const bcrypt = require("bcrypt");
const generateRandomPassword = require("../../utils/generateRandomPassword");
const SendEmailUtilityCreateUserWhenOrderToNewEmail = require("../../utils/sendEmailUtilityCreateUserWhenOrderToNewEmail");

const createUserServiceWhenOrder = async (createUserData, DataModel) => {
  let createAllUserData = createUserData;

  let randomPassword = generateRandomPassword();

  createAllUserData.photo = [
    {
      public_id: "default_avatar",
      secure_url:
        "https://res.cloudinary.com/dwcjrquex/image/upload/v1709617274/profile/avatar_mwtugu.jpg",
    },
  ];

  try {
    const salt = await bcrypt.genSaltSync(10);
    let password = await bcrypt.hash(randomPassword, salt);
    createAllUserData.password = password;
    let data = await DataModel.create(createAllUserData);
    const data2 = await SendEmailUtilityCreateUserWhenOrderToNewEmail(
      createAllUserData.email,
      randomPassword
    );

    return { status: "success", data };
  } catch (error) {
    return { status: "fail", data: error };
  }
};

module.exports = createUserServiceWhenOrder;
