var uniqid = require("uniqid");
const axios = require("axios");
const globals = require("node-global-storage");
const OrderModel = require("../../models/order/orderModel");
const createServiceWithIncreaseDecreaseItem = require("../../services/order/createServiceWithIncreaseDecreaseItem");
const SendEmailUtility = require("../../utils/sendMaliUtility");
const createUserServiceWhenOrder = require("../../services/user/userCreateServiceWhenOrder");
const createService = require("../../services/common/createService");
const UserModel = require("../../models/users/userModel");

const {
  MYFATOORAH_API_KEY,
  MYFATOORAH_BASE_URL,
  FRONTEND_DOMAIN,
  BACKEND_DOMAIN,
} = process.env;

exports.initiatePayment = async (req, res) => {
  const { amount, currency, description } = req.body;

  const paymentData = {
    NotificationOption: "ALL",
    CustomerName: "Ahmed",
    DisplayCurrencyIso: "KWD",
    MobileCountryCode: "+965",
    CustomerMobile: "12345678",
    CustomerEmail: "xx@yy.com",
    InvoiceValue: 100,
    CallBackUrl: "https://google.com",
    ErrorUrl: "https://google.com",
    Language: "en",
    CustomerReference: "ref 1",
    CustomerCivilId: 12345678,
    UserDefinedField: "Custom field",
    ExpireDate: "",
    CustomerAddress: {
      Block: "",
      Street: "",
      HouseBuildingNo: "",
      Address: "",
      AddressInstructions: "",
    },
  };

  try {
    const response = await axios.post(
      MYFATOORAH_BASE_URL + "/v2/InitiatePayment",

      {
        InvoiceAmount: 100,
        CurrencyIso: "KWD",

        CustomerEmail: "nur@gmail.com",
        CustomerName: "nur",
      },
      {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + MYFATOORAH_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    return res.json({
      status: "success",
      paymentData: response.data,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      status: "fail",
      message: error,
    });
  }
};

exports.executivePayment = async (req, res) => {
  const reqBody = req.body;
  globals.unset("orderAllInformation");
  globals.set("orderAllInformation", JSON.stringify(reqBody));

  const paymentData = {
    PaymentMethodId: "1",
    CustomerName:
      reqBody?.shippingAddress?.firstName +
      " " +
      reqBody?.shippingAddress?.lastName,
    DisplayCurrencyIso: "KWD",
    MobileCountryCode: "+965",
    CustomerMobile: reqBody?.shippingAddress?.phone,
    CustomerEmail: reqBody?.shippingAddress?.email,
    InvoiceValue: reqBody?.grandTotal,
    CallBackUrl: `${BACKEND_DOMAIN}/success-payment`,
    ErrorUrl: `${BACKEND_DOMAIN}/fail-payment`,
    Language: "en",
    CustomerReference: "ref 1",
    CustomerCivilId: new Date().getDate(),
    UserDefinedField: "Custom field",
    ExpireDate: "",
  };

  try {
    const response = await axios.post(
      MYFATOORAH_BASE_URL + "/v2/ExecutePayment",
      paymentData,
      {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + MYFATOORAH_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );
    return res.json({
      status: "success",
      paymentData: response.data,
    });
  } catch (error) {
    return res.status(400).json({
      status: "fail",
      message: error,
    });
  }
};

exports.successPayment = async (req, res) => {
  // this functions for globals variables to store in reqbody
  function mergeOrderInfo(reqbody, ordersAllInfo) {
    for (let key in ordersAllInfo) {
      if (ordersAllInfo.hasOwnProperty(key)) {
        reqbody[key] = ordersAllInfo[key];
      }
    }
    return reqbody;
  }

  const { paymentId } = req.query;
  let reqBody = req.body;
  let ordersAllInfo;
  let ordersAllInfoRaw = globals.get("orderAllInformation");
  if (ordersAllInfoRaw !== undefined && ordersAllInfoRaw !== null) {
    ordersAllInfo = JSON.parse(ordersAllInfoRaw);
  } else {
    ordersAllInfo = {};
  }
  mergeOrderInfo(reqBody, ordersAllInfo);

  let orderId = uniqid.process();
  reqBody.orderId = orderId;
  reqBody.userId = req.headers.userId;

  // Ensure paymentIntent object is properly set up
  if (!reqBody.paymentIntent) {
    reqBody.paymentIntent = {};
  }

  // Set the paymentIntent details
  reqBody["paymentIntent.paymentId"] = paymentId;
  reqBody["paymentIntent.paymentStatus"] = "Payment paid";
  reqBody["paymentIntent.paymentMethod"] = "MyFatoorah";
  reqBody["paymentIntent.amount"] = ordersAllInfo.grandTotal;

  const createUserData = {
    firstName: ordersAllInfo?.shippingAddress?.firstName,
    lastName: ordersAllInfo?.shippingAddress?.lastName,
    email: ordersAllInfo?.shippingAddress?.email,
    phone: ordersAllInfo?.shippingAddress?.phone,
    address: ordersAllInfo?.shippingAddress,
  };

  if (!req.headers.userId) {
    const exitsUser = await UserModel.find({
      email: ordersAllInfo?.shippingAddress?.email,
    });
    if (!exitsUser.length) {
      const createUser = await createUserServiceWhenOrder(
        createUserData,
        UserModel
      );
      reqBody.userId = createUser.data._id;
    } else {
      reqBody.userId = exitsUser[0]._id;
    }
  }

  let result = await createServiceWithIncreaseDecreaseItem(req, OrderModel);

  // order then send email to user
  if (result?.data?.orderId?.length > 1) {
    await SendEmailUtility(
      ordersAllInfo?.shippingAddress?.email,
      "Order Placed",
      `Thank you for your purchase! Your order has been successfully placed. Order ID: ${result?.data?.orderId}`
    );
  }

  return res.redirect(`${FRONTEND_DOMAIN}/payment-success`);
};

exports.failPayment = async (req, res) => {
  // this functions for globals variables to store in reqbody
  function mergeOrderInfo(reqbody, ordersAllInfo) {
    for (let key in ordersAllInfo) {
      if (ordersAllInfo.hasOwnProperty(key)) {
        reqbody[key] = ordersAllInfo[key];
      }
    }
    return reqbody;
  }

  const { paymentId } = req.query;
  let reqBody = req.body;
  let ordersAllInfo;
  let ordersAllInfoRaw = globals.get("orderAllInformation");
  if (ordersAllInfoRaw !== undefined && ordersAllInfoRaw !== null) {
    ordersAllInfo = JSON.parse(ordersAllInfoRaw);
  } else {
    ordersAllInfo = {};
  }
  mergeOrderInfo(reqBody, ordersAllInfo);

  let orderId = uniqid.process();
  reqBody.orderId = orderId;
  reqBody.userId = req.headers.userId;
  reqBody.orderStatus = "Cancelled";

  // Set the paymentIntent details
  reqBody["paymentIntent.paymentId"] = paymentId;
  reqBody["paymentIntent.paymentStatus"] = "Payment failed";
  reqBody["paymentIntent.paymentMethod"] = "MyFatoorah";
  reqBody["paymentIntent.amount"] = ordersAllInfo.grandTotal;

  const createUserData = {
    firstName: ordersAllInfo?.shippingAddress?.firstName,
    lastName: ordersAllInfo?.shippingAddress?.lastName,
    email: ordersAllInfo?.shippingAddress?.email,
    phone: ordersAllInfo?.shippingAddress?.phone,
    address: ordersAllInfo?.shippingAddress,
  };

  if (!req.headers.userId) {
    const exitsUser = await UserModel.find({
      email: ordersAllInfo?.shippingAddress?.email,
    });
    if (!exitsUser.length) {
      const createUser = await createUserServiceWhenOrder(
        createUserData,
        UserModel
      );
      reqBody.userId = createUser.data._id;
    } else {
      reqBody.userId = exitsUser[0]._id;
    }
  }

  let result = await createService(req, OrderModel);

  // order then send email to user
  if (result?.data?.orderId?.length > 1) {
    await SendEmailUtility(
      ordersAllInfo?.shippingAddress?.email,
      "Order Cancelled",
      `Your order has been cancelled because of payment failure! Order ID: ${result?.data?.orderId}`
    );
  }

  return res.redirect(`${FRONTEND_DOMAIN}/payment-fail`);
  // return res.status(200).json({
  //   status: "payment fail",
  //   data: result,
  // });
};
