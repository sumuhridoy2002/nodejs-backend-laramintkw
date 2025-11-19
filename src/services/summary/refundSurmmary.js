let OrderModel = require("../../models/order/orderModel");
const RefundSummary = async (Request) => {
  try {
    let data = await OrderModel.aggregate([
      { $match: { refund: "Success" } },
      {
        $facet: {
          totalDeliverd: [{ $count: "count" }],
          total: [
            {
              $group: {
                _id: 0,
                totalAmount: { $sum: "$refundAmount" },
              },
            },
          ],
          last30Days: [
            {
              $group: {
                _id: {
                  $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
                },
                totalAmount: { $sum: "$refundAmount" },
              },
            },
            { $sort: { _id: -1 } },
            { $limit: 30 },
          ],
        },
      },
    ]);

    return { status: "success", data };
  } catch (error) {
    return { status: "success", data: error };
  }
};

module.exports = RefundSummary;
