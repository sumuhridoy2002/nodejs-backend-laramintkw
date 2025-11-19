const userModel = require("../models/users/userModel");

const verifyAdminMiddleware = async (req, res, next) => {
  let email = req.headers.email;

  try {
    let data = await userModel.aggregate([
      { $match: { email: email, role: "admin" } },
    ]);

    if (data.length > 0) {
      req.headers.isAdmin = true;
      next();
    } else {
      req.headers.isAdmin = false;
      return res.status(401).json({ status: "You are not an admin" });
    }
  } catch (error) {
    req.headers.isAdmin = false;
    return res.status(401).json({ status: "Something went wrong" });
  }
};

module.exports = verifyAdminMiddleware;
