const axios = require("axios");
const globals = require("node-global-storage");

const BkashMiddleware = async (req, res, next) => {
  try {
    globals.unset("id_token");

    let data = await axios.post(
      process.env.bkash_grant_token_url,
      {
        app_key: process.env.bkash_app_key,
        app_secret: process.env.bkash_secret_key,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          username: process.env.bkash_username,
          password: process.env.bkash_password,
        },
      }
    );
    globals.set("id_token", data?.data?.id_token);
    next();
  } catch (error) {
    return res.status(400).json({ status: "fail", data: error });
  }
};

module.exports = BkashMiddleware;
