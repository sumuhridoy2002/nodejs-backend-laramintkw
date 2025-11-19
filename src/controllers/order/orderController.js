let mongoose = require("mongoose");
const OrderModel = require("../../models/order/orderModel");
const UserModel = require("../../models/users/userModel");
const { jsPDF } = require("jspdf");
require("jspdf-autotable");
const moment = require("moment");
const base64Logo = require("../../utils/base64Logo/base64Logo");
const getDetailsByIdTwoJoinService = require("../../services/common/getDetailsByIdTwoJoinService");
const listTwoJoinService = require("../../services/common/listTwoJoinService");
const updateServiceOrderChangeStatus = require("../../services/order/updateServiceChangeOrderStatus");
var uniqid = require("uniqid");
const createServiceWithIncreaseDecreaseItem = require("../../services/order/createServiceWithIncreaseDecreaseItem");
const runningOrderServices = require("../../services/order/runningOrderServices");
const deliveredOrderServices = require("../../services/order/deliveredOrderServices");
const cancelledOrderServices = require("../../services/order/cancelledOrderServices");
const returnedOrderServices = require("../../services/order/returnedOrderServices");

const createUserServiceWhenOrder = require("../../services/user/userCreateServiceWhenOrder");
const SendEmailUtility = require("../../utils/sendMaliUtility");
const PorductModel = require("../../models/product/productModel");

exports.createOrder = async (req, res) => {
  let reqBody = req.body;

  if (reqBody["paymentIntent"] && reqBody["paymentIntent"]["amount"]) {
    reqBody["paymentIntent"]["amount"] = Number(
      reqBody["paymentIntent"]["amount"]
    ).toFixed(3);
  }
  reqBody.subTotal = Number(reqBody.subTotal).toFixed(3);
  reqBody.grandTotal = Number(reqBody.grandTotal).toFixed(3);
  reqBody.shippingCost = Number(reqBody.shippingCost).toFixed(3);
  reqBody.productsSubTotal = Number(reqBody.productsSubTotal).toFixed(3);
  reqBody.voucherDiscount = Number(reqBody.voucherDiscount).toFixed(3);
  reqBody.saveAmount = Number(reqBody.saveAmount).toFixed(3);
  reqBody.otherCost = Number(reqBody.otherCost).toFixed(3);

  // Similarly for allProducts array
  reqBody.allProducts.forEach((product) => {
    product.finalPrice = Number(product.finalPrice).toFixed(3);
    product.total = Number(product.total).toFixed(3);
  });

  let orderId = uniqid.process();
  reqBody.orderId = orderId;
  reqBody.userId = req.headers.userId;

  const createUserData = {
    firstName: reqBody.shippingAddress.firstName,
    lastName: reqBody.shippingAddress.lastName,
    email: reqBody.shippingAddress.email,
    phone: reqBody.shippingAddress.phone,
    address: reqBody?.shippingAddress,
  };

  if (!req.headers.userId) {
    const exitsUser = await UserModel.find({
      email: reqBody.shippingAddress.email,
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

  // Generate PDF invoice
  if (result?.data?.orderId?.length > 1) {
    const doc = new jsPDF();
    const imgData = base64Logo;
    doc.addImage(imgData, "PNG", 10, 10, 50, 20);

    const pageWidth = doc.internal.pageSize.getWidth();
    const rectWidth = 80; // Width of the "PAID" background
    const rectHeight = 12; // Height of the "PAID" background
    const x = pageWidth - rectWidth;
    const y = 0;

    const paymentStatus = result?.data?.paymentIntent?.paymentStatus;
    if (paymentStatus == "Payment paid") {
      doc.setFillColor(0, 128, 0); // Green background
    } else {
      doc.setFillColor(255, 0, 0); // Red background
    }
    doc.rect(x, y, rectWidth, rectHeight, "F");
    doc.setFontSize(20);
    doc.setTextColor(255, 255, 255); // White text color
    doc.text(
      `${paymentStatus == "Payment paid" ? "PAID" : "UNPAID"}`,
      x + rectWidth / 2,
      y + rectHeight - 3,
      {
        align: "center",
      }
    );

    // Add the Invoice heading
    doc.setFontSize(18);
    doc.setTextColor(0, 0, 0);
    doc.text("Invoice", 160, 24, { align: "right" });

    // Add Seller's Info
    doc.setFontSize(12);
    doc.text("Company Name: Laramint", 10, 40);
    doc.text("Website: www.laramintkw.com", 10, 45);

    // Add Order Info
    doc.text(`Order Id: ${result.data.orderId}`, 110, 40);
    doc.text(
      `Date: ${moment(result.data.createdAt).format(
        "MMMM Do YYYY, h:mm:ss a"
      )}`,
      110,
      45
    );

    // billing info
    doc.text("Bill To:", 10, 70);
    doc.text(
      `Payment Method: ${
        result?.data?.paymentIntent?.paymentMethod == "cashOnDelivery"
          ? "Cash On Delivery"
          : result?.data?.paymentIntent?.paymentMethod
      }`,
      10,
      75
    );
    doc.text(
      `Payment Status: ${
        result?.data?.paymentIntent?.paymentStatus == "cashOnDelivery"
          ? "Cash On Delivery"
          : result?.data?.paymentIntent?.paymentStatus
      }`,
      10,
      80
    );
    doc.text(
      `Payment Id/TrxId: ${result?.data?.paymentIntent?.paymentId || "N/A"}`,
      10,
      85
    );

    // Add Shipping Info
    doc.text("Shipping Address:", 110, 70);
    doc.text(
      `Customer Name: ${result.data.shippingAddress.firstName} ${result.data.shippingAddress.lastName}`,
      110,
      75
    );
    doc.text(`Phone: ${result.data.shippingAddress.phone}`, 110, 80);
    doc.text(`City: ${result.data.shippingAddress.city}`, 110, 85);
    doc.text(
      `Apartment: ${result.data.shippingAddress.apartment || "N/A"}`,
      110,
      90
    );
    doc.text(`Postal Code: ${result.data.shippingAddress.postalCode}`, 110, 95);
    doc.text(`Address: ${result.data.shippingAddress.address}`, 110, 100);

    // Add table of items
    const items = await Promise.all(
      result.data.allProducts.map(async (item) => {
        const productsDetails = await PorductModel.findById(item.productId);

        const productName = productsDetails?.name || "";
        const quantity = item?.customerChoiceProductQuantity || 0;
        const unitPrice = (parseFloat(item?.finalPrice) || 0).toFixed(3);
        const total = (unitPrice * quantity).toFixed(3);

        const formattedUnitPrice = `${unitPrice} KWD`;
        const formattedTotal = `${total} KWD`;

        return [productName, quantity, formattedUnitPrice, formattedTotal];
      })
    );

    // Define the headers for the table
    const headers = [["Product Name", "Quantity", "Unit Price", "Total"]];

    // Generate the PDF with the table
    doc.autoTable({
      head: headers,
      body: items,
      startY: 110,
      theme: "grid",
      styles: {
        cellPadding: 3,
        fontSize: 10,
        halign: "center",
      },
      headStyles: {
        fillColor: [61, 181, 136],
        textColor: [255, 255, 255],
      },
      columnStyles: {
        2: { cellWidth: 30 },
        3: { cellWidth: 40 },
      },
    });

    // Add the summary (Subtotal, Taxes, etc.)
    const subTotal = parseFloat(result.data.subTotal).toFixed(3);
    const saveAmount = parseFloat(result.data.saveAmount).toFixed(3);
    const voucherDiscount = parseFloat(result.data.voucherDiscount).toFixed(3);
    const shippingCost = parseFloat(result.data.shippingCost).toFixed(3);
    const otherCost = parseFloat(result.data.otherCost).toFixed(3);
    const grandTotal = parseFloat(result.data.grandTotal).toFixed(3);

    const finalY = doc.autoTable.previous.finalY;
    doc.text(`Subtotal: ${subTotal} KWD`, 110, finalY + 10);
    doc.text(`Save Amount: ${saveAmount} KWD`, 110, finalY + 15);
    doc.text(`Discount: ${voucherDiscount} KWD`, 110, finalY + 20);

    doc.text(`Shipping Cost: ${shippingCost} KWD`, 110, finalY + 25);
    doc.text(`Other Cost: ${otherCost} KWD`, 110, finalY + 30);
    doc.setFontSize(14);
    doc.text(`Total: ${grandTotal} KWD`, 110, finalY + 40);

    // Add Footer with Terms and Conditions
    doc.setFontSize(10);
    doc.text("Thank you for your business!", 10, finalY + 50);

    // Convert PDF to Buffer and send as an email attachment
    const pdfArrayBuffer = doc.output("arraybuffer");
    const pdfBuffer = Buffer.from(new Uint8Array(pdfArrayBuffer));

    await SendEmailUtility(
      reqBody?.shippingAddress?.email,
      "Order Placed",
      `Thank you for your purchase! Your order has been successfully placed. Order ID: ${result?.data?.orderId}`,
      pdfBuffer, // Pass the PDF buffer as an attachment
      `invoice-${result?.data?._id}.pdf` // File name for the attachment
    );
  }

  return res.status(200).json(result);
};

// for admin
exports.getAllOrderForAdmin = async (req, res) => {
  let searchRgx = { $regex: req.params.searchKeyword, $options: "i" };
  let searchArray = [
    { tran_id: searchRgx },
    { orderId: searchRgx },
    { "paymentIntent.paymentMethod": searchRgx },
    { note: searchRgx },
    { "userDetails.firstName": searchRgx },
    { "userDetails.lastName": searchRgx },
    { "userDetails.email": searchRgx },
    { "userDetails.mobile": searchRgx },
    { "productsDetails.name": searchRgx },

    { "shippingAddress.name": searchRgx },
    { "shippingAddress.email": searchRgx },
    { "shippingAddress.mobile": searchRgx },
    { "shippingAddress.alternativeMobile": searchRgx },
    { "shippingAddress.city": searchRgx },
    { "shippingAddress.country": searchRgx },
    { "shippingAddress.address": searchRgx },
    { "allProducts.name": searchRgx },
    { tran_id: searchRgx },
  ];
  if (
    req.params.searchKeyword.length == 12 ||
    req.params.searchKeyword.length == 24
  ) {
    searchArray.push(
      { userId: mongoose.Types.ObjectId(req.params.searchKeyword) },
      {
        "productsDetails._id": mongoose.Types.ObjectId(
          req.params.searchKeyword
        ),
      }
    );
  }

  let joinStage1 = {
    $lookup: {
      from: "users",
      localField: "userId",
      foreignField: "_id",
      as: "userDetails",
      pipeline: [
        {
          $project: {
            _id: 1,
            firstName: 1,
            lastName: 1,
            email: 1,
            mobile: 1,
            photo: 1,
          },
        },
      ],
    },
  };
  let joinStage2 = {
    $lookup: {
      from: "products",
      localField: "allProducts.productId",
      foreignField: "_id",
      as: "productsDetails",
      pipeline: [
        {
          $project: {
            ratings: 0,
          },
        },
      ],
    },
  };
  let result = await listTwoJoinService(
    req,
    OrderModel,
    searchArray,
    joinStage1,
    joinStage2
  );
  return res.status(200).json(result);
};

// for user
exports.getRunningOrderForUser = async (req, res) => {
  let searchRgx = { $regex: req.params.searchKeyword, $options: "i" };
  let searchArray = [
    { orderId: searchRgx },
    { "paymentIntent.paymentMethod": searchRgx },
    { note: searchRgx },
    { "userDetails.firstName": searchRgx },
    { "userDetails.lastName": searchRgx },
    { "userDetails.email": searchRgx },
    { "userDetails.mobile": searchRgx },

    { "productsDetails.name": searchRgx },
  ];
  if (
    req.params.searchKeyword.length == 12 ||
    req.params.searchKeyword.length == 24
  ) {
    searchArray.push(
      { userId: mongoose.Types.ObjectId(req.params.searchKeyword) },
      {
        "productsDetails._id": mongoose.Types.ObjectId(
          req.params.searchKeyword
        ),
      }
    );
  }
  let joinStage1 = {
    $lookup: {
      from: "users",
      localField: "userId",
      foreignField: "_id",
      as: "userDetails",
      pipeline: [
        {
          $project: {
            _id: 1,
            firstName: 1,
            lastName: 1,
            email: 1,
            mobile: 1,
            photo: 1,
          },
        },
      ],
    },
  };
  let joinStage2 = {
    $lookup: {
      from: "products",
      localField: "allProducts.productId",
      foreignField: "_id",
      as: "productsDetails",
      pipeline: [
        {
          $project: {
            ratings: 0,
          },
        },
      ],
    },
  };
  let result = await runningOrderServices(
    req,
    OrderModel,
    searchArray,
    joinStage1,
    joinStage2
  );
  return res.status(200).json(result);
};
exports.getDeliveredOrderForUser = async (req, res) => {
  let searchRgx = { $regex: req.params.searchKeyword, $options: "i" };
  let searchArray = [
    { orderId: searchRgx },
    { "paymentIntent.paymentMethod": searchRgx },
    { note: searchRgx },
    { "userDetails.firstName": searchRgx },
    { "userDetails.lastName": searchRgx },
    { "userDetails.email": searchRgx },
    { "userDetails.mobile": searchRgx },

    { "productsDetails.name": searchRgx },
  ];
  if (
    req.params.searchKeyword.length == 12 ||
    req.params.searchKeyword.length == 24
  ) {
    searchArray.push(
      { userId: mongoose.Types.ObjectId(req.params.searchKeyword) },
      {
        "productsDetails._id": mongoose.Types.ObjectId(
          req.params.searchKeyword
        ),
      }
    );
  }
  let joinStage1 = {
    $lookup: {
      from: "users",
      localField: "userId",
      foreignField: "_id",
      as: "userDetails",
      pipeline: [
        {
          $project: {
            _id: 1,
            firstName: 1,
            lastName: 1,
            email: 1,
            mobile: 1,
            photo: 1,
          },
        },
      ],
    },
  };
  let joinStage2 = {
    $lookup: {
      from: "products",
      localField: "allProducts.productId",
      foreignField: "_id",
      as: "productsDetails",
      pipeline: [
        {
          $project: {
            ratings: 0,
          },
        },
      ],
    },
  };
  let result = await deliveredOrderServices(
    req,
    OrderModel,
    searchArray,
    joinStage1,
    joinStage2
  );
  return res.status(200).json(result);
};
exports.getCancelledOrderForUser = async (req, res) => {
  let searchRgx = { $regex: req.params.searchKeyword, $options: "i" };
  let searchArray = [
    { orderId: searchRgx },
    { "paymentIntent.paymentMethod": searchRgx },
    { note: searchRgx },
    { "userDetails.firstName": searchRgx },
    { "userDetails.lastName": searchRgx },
    { "userDetails.email": searchRgx },
    { "userDetails.mobile": searchRgx },

    { "productsDetails.name": searchRgx },
  ];
  if (
    req.params.searchKeyword.length == 12 ||
    req.params.searchKeyword.length == 24
  ) {
    searchArray.push(
      { userId: mongoose.Types.ObjectId(req.params.searchKeyword) },
      {
        "productsDetails._id": mongoose.Types.ObjectId(
          req.params.searchKeyword
        ),
      }
    );
  }
  let joinStage1 = {
    $lookup: {
      from: "users",
      localField: "userId",
      foreignField: "_id",
      as: "userDetails",
      pipeline: [
        {
          $project: {
            _id: 1,
            firstName: 1,
            lastName: 1,
            email: 1,
            mobile: 1,
            photo: 1,
          },
        },
      ],
    },
  };
  let joinStage2 = {
    $lookup: {
      from: "products",
      localField: "allProducts.productId",
      foreignField: "_id",
      as: "productsDetails",
      pipeline: [
        {
          $project: {
            ratings: 0,
          },
        },
      ],
    },
  };
  let result = await cancelledOrderServices(
    req,
    OrderModel,
    searchArray,
    joinStage1,
    joinStage2
  );
  return res.status(200).json(result);
};
exports.getReturnedOrderForUser = async (req, res) => {
  let searchRgx = { $regex: req.params.searchKeyword, $options: "i" };
  let searchArray = [
    { orderId: searchRgx },
    { "paymentIntent.paymentMethod": searchRgx },
    { note: searchRgx },
    { "userDetails.firstName": searchRgx },
    { "userDetails.lastName": searchRgx },
    { "userDetails.email": searchRgx },
    { "userDetails.mobile": searchRgx },

    { "productsDetails.name": searchRgx },
  ];
  if (
    req.params.searchKeyword.length == 12 ||
    req.params.searchKeyword.length == 24
  ) {
    searchArray.push(
      { userId: mongoose.Types.ObjectId(req.params.searchKeyword) },
      {
        "productsDetails._id": mongoose.Types.ObjectId(
          req.params.searchKeyword
        ),
      }
    );
  }
  let joinStage1 = {
    $lookup: {
      from: "users",
      localField: "userId",
      foreignField: "_id",
      as: "userDetails",
      pipeline: [
        {
          $project: {
            _id: 1,
            firstName: 1,
            lastName: 1,
            email: 1,
            mobile: 1,
            photo: 1,
          },
        },
      ],
    },
  };
  let joinStage2 = {
    $lookup: {
      from: "products",
      localField: "allProducts.productId",
      foreignField: "_id",
      as: "productsDetails",
      pipeline: [
        {
          $project: {
            ratings: 0,
          },
        },
      ],
    },
  };
  let result = await returnedOrderServices(
    req,
    OrderModel,
    searchArray,
    joinStage1,
    joinStage2
  );
  return res.status(200).json(result);
};

exports.getDetailsById = async (req, res) => {
  let joinStage1 = {
    $lookup: {
      from: "users",
      localField: "userId",
      foreignField: "_id",
      as: "userDetails",
      pipeline: [
        {
          $project: {
            _id: 1,
            firstName: 1,
            lastName: 1,
            email: 1,
            mobile: 1,
            photo: 1,
          },
        },
      ],
    },
  };
  let joinStage2 = {
    $lookup: {
      from: "products",
      localField: "allProducts.productId",
      foreignField: "_id",
      as: "productsDetails",
      pipeline: [
        {
          $project: {
            ratings: 0,
          },
        },
      ],
    },
  };
  let result = await getDetailsByIdTwoJoinService(
    req,
    OrderModel,
    joinStage1,
    joinStage2
  );

  return res.status(200).json(result);
};

exports.changeOrderStatus = async (req, res) => {
  let result = await updateServiceOrderChangeStatus(req, OrderModel);
  return res.status(200).json(result);
};
