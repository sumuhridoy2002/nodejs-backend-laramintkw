const OrderSummary = require("../../services/summary/orderSummary");
const SalesSummary = require("../../services/summary/saleSummary");
const CancelSummary = require("../../services/summary/cancelSummary");
const RunningOrderSummary = require("../../services/summary/runningOrderSummary");
const SalesSummaryReportService = require("../../services/report/salesSummaryReportService");
const CancelledSummaryReportService = require("../../services/report/cancelledSummaryReportService");
const AllOrderSummaryReport = require("../../services/report/allOrderSummaryReportService");
const orderModel = require("../../models/order/orderModel");
const RunningOrderSummaryReport = require("../../services/report/runningOrderSummaryReportService");
const RefundSummary = require("../../services/summary/refundSurmmary");
const ReturnedSummary = require("../../services/summary/returnSummary");
const ReturnedSummaryReportService = require("../../services/report/returnedSummaryReportService");

exports.salesSummary = async (req, res) => {
  let result = await SalesSummary(req);
  return res.status(200).json(result);
};
exports.refundSummary = async (req, res) => {
  let result = await RefundSummary(req);
  return res.status(200).json(result);
};
exports.salesSummaryReport = async (req, res) => {
  let result = await SalesSummaryReportService(req, orderModel);
  return res.status(200).json(result);
};

exports.cancelSummary = async (req, res) => {
  let result = await CancelSummary(req);
  return res.status(200).json(result);
};
exports.cancelSummaryReport = async (req, res) => {
  let result = await CancelledSummaryReportService(req, orderModel);
  return res.status(200).json(result);
};

exports.returnSummary = async (req, res) => {
  let result = await ReturnedSummary(req);
  return res.status(200).json(result);
};

exports.returnedSummaryReport = async (req, res) => {
  let result = await ReturnedSummaryReportService(req, orderModel);
  return res.status(200).json(result);
};

exports.runningOrderSummary = async (req, res) => {
  let result = await RunningOrderSummary(req);
  return res.status(200).json(result);
};
exports.runningOrderSummaryReport = async (req, res) => {
  let result = await RunningOrderSummaryReport(req, orderModel);
  return res.status(200).json(result);
};

exports.orderSummary = async (req, res) => {
  let result = await OrderSummary(req);
  return res.status(200).json(result);
};
exports.allOrderSummaryReport = async (req, res) => {
  let result = await AllOrderSummaryReport(req, orderModel);
  return res.status(200).json(result);
};
