const jwt = require("jsonwebtoken");

const generateRefreshToken = async (data) => {
  return await jwt.sign({ data }, process.env.JWT_SECRET_KEY, {
    expiresIn: "3d",
  });
};

module.exports = generateRefreshToken;
