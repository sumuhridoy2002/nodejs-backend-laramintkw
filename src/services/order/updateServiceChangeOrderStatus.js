let ProductsModel = require("../../models/product/productModel");
const SendEmailUtility = require("../../utils/sendMaliUtility");

const updateServiceOrderChangeStatus = async (Request, DataModel) => {
  let id = Request.params.id || Request.body.id;
  let orderStatus = Request.body.orderStatus;

  try {
    let allData;
    let checkAllreadyCanceled = await DataModel.find({ _id: id });

    if (
      (checkAllreadyCanceled[0]?.orderStatus !== "Cancelled" &&
        orderStatus == "Cancelled") ||
      (checkAllreadyCanceled[0]?.orderStatus !== "Returned" &&
        orderStatus == "Returned") ||
      (checkAllreadyCanceled[0]?.orderStatus !== "Failed" &&
        orderStatus == "Failed")
    ) {
      checkAllreadyCanceled[0]?.allProducts.map(async (prod) => {
        allData = await ProductsModel.findOneAndUpdate(
          { _id: prod.productId },
          {
            $inc: {
              quantity: Number(prod.customerChoiceProductQuantity),
              sold: -Number(prod.customerChoiceProductQuantity),
            },
          }
        );
      });
      let updateStatus = await DataModel.findOneAndUpdate(
        { _id: id },
        { orderStatus: orderStatus }
      );
      // order status change then send email to user
      if (updateStatus) {
        if (orderStatus === "Processing") {
          await SendEmailUtility(
            checkAllreadyCanceled[0]?.shippingAddress?.email,
            "Order Status",
            `YWe have processed your order and it is now being prepared for shipment. Order Id: ${checkAllreadyCanceled[0]?.orderId}`
          );
        } else if (orderStatus === "Shipping") {
          await SendEmailUtility(
            checkAllreadyCanceled[0]?.shippingAddress?.email,
            "Order Status",
            `Good news! Your order has been dispatched and will be delivered soon. Track your shipment here Order Id: ${checkAllreadyCanceled[0]?.orderId}`
          );
        } else if (orderStatus === "Delivered") {
          await SendEmailUtility(
            checkAllreadyCanceled[0]?.shippingAddress?.email,
            "Order Status",
            `Your order has been delivered. We hope you enjoy your purchase! Order Id: ${checkAllreadyCanceled[0]?.orderId}`
          );
        } else if (orderStatus === "Cancelled") {
          await SendEmailUtility(
            checkAllreadyCanceled[0]?.shippingAddress?.email,
            "Order Status",
            `Your order has been canceled as per your request. Order Id: ${checkAllreadyCanceled[0]?.orderId}`
          );
        } else if (orderStatus === "Returned") {
          await SendEmailUtility(
            checkAllreadyCanceled[0]?.shippingAddress?.email,
            "Order Status",
            `Your return has been processed. We have issued a refund to your account. Order Id: ${checkAllreadyCanceled[0]?.orderId}`
          );
        }
      } else {
        await SendEmailUtility(
          checkAllreadyCanceled[0]?.shippingAddress?.email,
          "Order Status",
          `Your order has been ${orderStatus}. Order Id: ${checkAllreadyCanceled[0]?.orderId}`
        );
      }

      return { status: "success", data: updateStatus };
    } else if (
      (checkAllreadyCanceled[0]?.orderStatus === "Cancelled" &&
        orderStatus === "Cancelled") ||
      (checkAllreadyCanceled[0]?.orderStatus === "Returned" &&
        orderStatus === "Returned")
    ) {
      return {
        status: "fail",
        data: "You have already Cancelled/Returned this order.",
      };
    } else {
      if (
        checkAllreadyCanceled[0]?.orderStatus !== "Cancelled" ||
        checkAllreadyCanceled[0]?.orderStatus !== "Returned"
      ) {
        allData = await DataModel.updateOne(
          { _id: id },
          { orderStatus: orderStatus }
        );

        // order status change then send email to user
        if (allData) {
          if (orderStatus === "Processing") {
            await SendEmailUtility(
              checkAllreadyCanceled[0]?.shippingAddress?.email,
              "Order Status",
              `YWe have processed your order and it is now being prepared for shipment. Order Id: ${checkAllreadyCanceled[0]?.orderId}`
            );
          } else if (orderStatus === "Shipping") {
            await SendEmailUtility(
              checkAllreadyCanceled[0]?.shippingAddress?.email,
              "Order Status",
              `Good news! Your order has been dispatched and will be delivered soon. Track your shipment here Order Id: ${checkAllreadyCanceled[0]?.orderId}`
            );
          } else if (orderStatus === "Delivered") {
            await SendEmailUtility(
              checkAllreadyCanceled[0]?.shippingAddress?.email,
              "Order Status",
              `Your order has been delivered. We hope you enjoy your purchase! Order Id: ${checkAllreadyCanceled[0]?.orderId}`
            );
          } else if (orderStatus === "Cancelled") {
            await SendEmailUtility(
              checkAllreadyCanceled[0]?.shippingAddress?.email,
              "Order Status",
              `Your order has been canceled as per your request. Order Id: ${checkAllreadyCanceled[0]?.orderId}`
            );
          } else if (orderStatus === "Returned") {
            await SendEmailUtility(
              checkAllreadyCanceled[0]?.shippingAddress?.email,
              "Order Status",
              `Your return has been processed. We have issued a refund to your account. Order Id: ${checkAllreadyCanceled[0]?.orderId}`
            );
          }
        } else {
          await SendEmailUtility(
            checkAllreadyCanceled[0]?.shippingAddress?.email,
            "Order Status",
            `Your order has been ${orderStatus}. Order Id: ${checkAllreadyCanceled[0]?.orderId}`
          );
        }
        return { status: "success", data: allData };
      } else {
        return {
          status: "fail",
          data: "fail, Please Order again.",
        };
      }
    }
  } catch (e) {
    console.log(e);
    return { status: "fail", data: e.toString() };
  }
};

module.exports = updateServiceOrderChangeStatus;
