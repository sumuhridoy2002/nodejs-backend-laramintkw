const dropdownListService = async (Request, DataModel) => {
  try {
    let data = await DataModel.aggregate([{ $project: { _id: 1, name: 1 } }]);
    return { status: "success", data };
  } catch (error) {
    return { status: "success", data: error.toString() };
  }
};

module.exports = dropdownListService;
