const validateCouponCodeService = async (Request, DataModel) => {
  let name = Request.body.name;

  try {
    let data = await DataModel.aggregate([
      { $match: { name: name } },
      {
        $match: {
          expiry: { $gte: new Date() },
        },
      },
    ]);
    return { status: "success", data };
  } catch (error) {
    return { status: "fail", data: error.toString() };
  }
};

module.exports = validateCouponCodeService;
