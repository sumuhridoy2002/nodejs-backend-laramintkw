const createService = async (Request, DataModel) => {
  let reqBody = Request.body;

  try {
    let data = await DataModel.create(reqBody);
    return { status: "success", data };
  } catch (e) {
    return { status: "fail", data: e };
  }
};

module.exports = createService;
