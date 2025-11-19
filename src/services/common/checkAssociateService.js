const checkAssociateService = async (queryObject, DataModel) => {
  try {
    let data = await DataModel.aggregate([{ $match: queryObject }]);
    return data.length > 0;
  } catch (error) {
    return false;
  }
};

module.exports = checkAssociateService;
