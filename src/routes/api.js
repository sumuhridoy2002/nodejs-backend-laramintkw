const router = require("express").Router();
const {
  createBrand,
  listBrand,
  updateBrand,
  dropdownListBrand,
  getBrandDetailsById,
  deleteBrandImgAndpullImg,
  deleteBrandWithImg,
} = require("../controllers/brands/brandController");
const {
  createCard,
  getCards,
  removeCardwhenOrder,
  deleteCard,
} = require("../controllers/card/cardController");
const {
  createCateogry,
  listCategory,
  dropdownListCategory,
  getCategoryDetailsById,
  updateCategory,
  deleteCategory,
} = require("../controllers/categories/categoryController");
const {
  createCoupon,
  getCoupon,
  getCouponDetailsById,
  updateCoupon,
  deleteCoupon,
  validateCouponCode,
} = require("../controllers/coupon/couponController");
const {
  createOrder,
  getAllOrderForAdmin,
  getDetailsById,
  changeOrderStatus,
  getRunningOrderForUser,
  getDeliveredOrderForUser,
  getCancelledOrderForUser,
  getReturnedOrderForUser,
} = require("../controllers/order/orderController");

const {
  createProduct,

  getProductDetailsById,
  updateProduct,
  deleteProduct,
  listProductForGlobal,
  ratingsProduct,
  deleteProductImgAndPullImg,
  bestSalesProductForGlobal,
  relatedProducts,
  getMegaMenuProductsByCategory,
  setOfferByCategoryB1G1OrB2G1,
  setOfferByBrandB1G1OrB2G1,
  setOfferEachProductB1G1OrB2G1,
  CheckOfferByCategoryB1G1,
  CheckOfferByCategoryB2G1,
  CheckOfferByBrandB1G1,
  CheckOfferByBrandB2G1,
  setOfferEachAndDifferentMultipleProductB1G1OrB2G1,
} = require("../controllers/products/productController");

const {
  deleteMainSlider,
  createMainSlider,
  updateMainSliderWithImg,
  deleteImgMainSlider,
  getMainSliders,
  getMainSliderDetailsById,
} = require("../controllers/mainSlider/mainSliderController");

const {
  createSubCategory,
  listSubCategories,
  dropdownListSubCategories,
  getSubCategoryDetailsById,
  updateSubCategory,
  deleteSubCategory,
} = require("../controllers/subCategory/subCategoryController");
const {
  createSubSubCategory,
  listSubSubCategories,
  getSubSubCategoryDetailsById,
  updateSubSubCategory,
  deleteSubSubCategory,
} = require("../controllers/subSubCategory/subSubCategoryController");
const {
  salesSummary,
  cancelSummary,
  orderSummary,
  runningOrderSummary,
  salesSummaryReport,
  cancelSummaryReport,
  allOrderSummaryReport,
  runningOrderSummaryReport,
  refundSummary,
  returnSummary,
  returnedSummaryReport,
} = require("../controllers/summary/summaryController");

const {
  deleteImages,
  uploadImages,
} = require("../controllers/upload/uploadController");

const {
  registration,
  login,
  userDetailsById,
  userUpdate,
  allUser,
  verifyEmail,
  verifyOtp,
  resetPassword,
  adminLogin,
  saveUserAddress,
  allAdmin,
  logOut,
  addToCart,
  subcriptionEmailForm,
} = require("../controllers/user/userController");

const {
  createAndRemoveWishList,
  getWishList,
} = require("../controllers/wishList/wishListController");
const { uploadPhoto } = require("../middlewares/uploadImgMiddleware");
const verifyAdminMiddleware = require("../middlewares/verifyAdminMiddleware");
const verifyAuthMiddleware = require("../middlewares/verifyAuthMiddleware");

const {
  addFaq,
  listFaq,
  deleteFaq,
} = require("../controllers/privacyPolicy/faqController");
const {
  addAboutUs,
  listAboutUs,
  deleteAboutUs,
  updateAboutUs,
  getAboutUsById,
} = require("../controllers/privacyPolicy/aboutUsController");

const {
  addPrivacyPolicy,
  listPrivacyPolicy,
  deletePrivacyPolicy,
  updatePrivacyPolicy,
  getPrivacyPolicyById,
} = require("../controllers/privacyPolicy/privacyPolicyController");
const {
  addContactUs,
  listContactUs,
  deleteContactUs,
  updateContactUs,
  getContactUsById,
} = require("../controllers/privacyPolicy/contactUsController");
const {
  addTeam,
  listTeam,
  deleteTeam,
} = require("../controllers/privacyPolicy/teamController");

const {
  createMultipleCurrency,
  listMultipleCurrency,
  getMultipleCurrencyDetailsById,
  updateMultipleCurrency,
  deleteMultipleCurrencyImgAndpullImg,
  deleteMultipleCurrencyImgWithImg,
} = require("../controllers/multipleCurrency/multipleCurrencyController");
const {
  addReturnAndRefundPolicy,
  listReturnAndRefundPolicy,
  updateReturnAndRefundPolicy,
  deleteReturnAndRefundPolicy,
  getReturnAndRefundById,
} = require("../controllers/privacyPolicy/returnAndRefundController");
const {
  addTermOfCondition,
  listTermOfCondition,
  updateTermOfCondition,
  deleteTermOfCondition,
  getTermOfConditionById,
} = require("../controllers/privacyPolicy/termOfConditionController");
const {
  addTermOfService,
  listTermOfService,
  updateTermOfService,
  deleteTermOfService,
  getTermOfServiceById,
} = require("../controllers/privacyPolicy/termOfServiceController");
const {
  addRefund,
  listRefund,
  updateRefund,
  deleteRefund,
  getRefundById,
} = require("../controllers/privacyPolicy/refundController");
const {
  listShippingCost,
  addShippingCost,
  updateShippingCost,
  deleteShippingCost,
  getShippingCostById,
} = require("../controllers/shippingCost/shippingCostController");
const {
  addSocialLink,
  listSocialLink,
  getSocialLinkById,
  deleteSocialLink,
  updateSocialLinks,
} = require("../controllers/socialLinks/socialLinksController");
const {
  initiatePayment,
  executivePayment,
  failPayment,
  successPayment,
} = require("../controllers/myFatoorah/myFatoorahController");
const {
  getMainSlidersForMobile,
  getMainSliderForMobileDetailsById,
  createMainSliderForMobile,
  updateMainSliderForMobileWithImg,
  deleteImgMainSliderForMobile,
  deleteMainSliderForMobile,
} = require("../controllers/mainSliderForMobile/mainSliderForMobileController");
const {
  getPopupNotifications,
  getPopupNotificationDetailsById,
  createPopupNotification,
  updatePopupNotificationWithImg,
  deleteImgPopupNotification,
  deletePopupNotification,
} = require("../controllers/popupNotification/popupNotification");

// registration
router.post("/registration", registration);
// login
router.post("/login", login);
router.get("/logout", logOut);
router.post("/admin-login", adminLogin);
// user details for user
router.get("/user-detail-by-user", verifyAuthMiddleware, userDetailsById);
// user details for Admin
router.get(
  "/user-detail-by-admin/:id",
  verifyAuthMiddleware,
  verifyAdminMiddleware,
  userDetailsById
);
// user Udpate for User
router.post(
  "/user-udpate-by-user/:id",
  verifyAuthMiddleware,
  uploadPhoto.array("images", 10),
  userUpdate
);
// user Udpate for Admin
router.post(
  "/user-udpate-by-admin/:id",
  verifyAuthMiddleware,
  verifyAdminMiddleware,
  userUpdate
);

// all user for admin
router.get(
  "/all-user/:pageNo/:perPage/:searchKeyword",
  verifyAuthMiddleware,
  verifyAdminMiddleware,
  allUser
);
// all admin for admin
router.get(
  "/all-admin/:pageNo/:perPage/:searchKeyword",
  verifyAuthMiddleware,
  verifyAdminMiddleware,
  allAdmin
);

// save address
router.post("/save-address/:id", verifyAuthMiddleware, saveUserAddress);
// Add to cart
router.post("/add-to-cart/:id", verifyAuthMiddleware, addToCart);

//------------------------------ contact form----------------------------------------------------------------
router.post("/subcription-email", subcriptionEmailForm);
//------------------------------ Reset password----------------------------------------------------------------------------
// step 01
router.get("/verify-email/:email", verifyEmail);
// step 02
router.get("/verify-otp/:email/:otp", verifyOtp);
// step 03
router.post("/reset-password", resetPassword);

//------------------------------ Category ----------------------------------------------------------------------------
// Create Category
router.post(
  "/create-category",
  verifyAuthMiddleware,
  verifyAdminMiddleware,
  uploadPhoto.array("images", 10),
  createCateogry
);
// list Category
router.get(
  "/list-category/:pageNo/:perPage/:searchKeyword",
  verifyAuthMiddleware,
  verifyAdminMiddleware,
  listCategory
);
// dropdown list Category global
router.get(
  "/dropdown-category/:pageNo/:perPage/:searchKeyword",
  dropdownListCategory
);
// get category details by id
router.get(
  "/category-details/:id",
  verifyAuthMiddleware,
  verifyAdminMiddleware,
  getCategoryDetailsById
);
// update category
router.post(
  "/update-category/:id",
  verifyAuthMiddleware,
  verifyAdminMiddleware,
  updateCategory
);
// delete category
router.get(
  "/delete-category/:id",
  verifyAuthMiddleware,
  verifyAdminMiddleware,
  deleteCategory
);

//------------------------------ Sub-Categories ----------------------------------------------------------------------------
// create subcategory
router.post(
  "/create-subcategory",
  verifyAuthMiddleware,
  verifyAdminMiddleware,
  createSubCategory
);

// list subcategory
router.get(
  "/list-subcategory/:pageNo/:perPage/:searchKeyword",
  verifyAuthMiddleware,
  verifyAdminMiddleware,
  listSubCategories
);
// dropdown list subcategory Global
router.get(
  "/dropdown-subcategory/:pageNo/:perPage/:searchKeyword",
  dropdownListSubCategories
);
// get subcategory details by id
router.get(
  "/subcategory-details/:id",
  verifyAuthMiddleware,
  verifyAdminMiddleware,
  getSubCategoryDetailsById
);
// update subcategory
router.post(
  "/update-subcategory/:id",
  verifyAuthMiddleware,
  verifyAdminMiddleware,
  updateSubCategory
);
// delete subcategory
router.get(
  "/delete-subcategory/:id",
  verifyAuthMiddleware,
  verifyAdminMiddleware,
  deleteSubCategory
);

//------------------------------ Sub-Sub-Categories ----------------------------------------------------------------------------
// create sub subcategory
router.post(
  "/create-sub-subcategory",
  verifyAuthMiddleware,
  verifyAdminMiddleware,
  createSubSubCategory
);

// list sub subcategory
router.get(
  "/list-sub-subcategory/:pageNo/:perPage/:searchKeyword",
  listSubSubCategories
);

// get sub subcategory details by id
router.get(
  "/sub-subcategory-details/:id",
  verifyAuthMiddleware,
  verifyAdminMiddleware,
  getSubSubCategoryDetailsById
);
// update sub subcategory
router.post(
  "/update-sub-subcategory/:id",
  verifyAuthMiddleware,
  verifyAdminMiddleware,
  updateSubSubCategory
);
// delete sub subcategory
router.get(
  "/delete-sub-subcategory/:id",
  verifyAuthMiddleware,
  verifyAdminMiddleware,
  deleteSubSubCategory
);

//------------------------------ Brands  ------------------------------------
// create brand
router.post(
  "/create-brand",
  verifyAuthMiddleware,
  verifyAdminMiddleware,
  uploadPhoto.array("images", 10),
  createBrand
);

// list Brand
router.get("/list-brand/:pageNo/:perPage/:searchKeyword", listBrand);
// dropdown list brand
router.get(
  "/dropdown-brand-admin",
  verifyAuthMiddleware,
  verifyAdminMiddleware,
  dropdownListBrand
);
// dropdown list brand for Global
router.get("/dropdown-brand", dropdownListBrand);
// get brand details by id
router.get(
  "/brand-details/:id",
  verifyAuthMiddleware,
  verifyAdminMiddleware,
  getBrandDetailsById
);
// update brand
router.post(
  "/update-brand/:id",
  verifyAuthMiddleware,
  verifyAdminMiddleware,
  uploadPhoto.array("images", 10),
  updateBrand
);
// delete brand img
router.post(
  "/delete-brand-img/:id",
  verifyAuthMiddleware,
  verifyAdminMiddleware,
  deleteBrandImgAndpullImg
);

// delete brand
router.get(
  "/delete-brand/:id",
  verifyAuthMiddleware,
  verifyAdminMiddleware,
  deleteBrandWithImg
);

//------------------------------  Multiple Currency  ------------------------------------
// create MultipleCurrency
router.post(
  "/create-multipleCurrency",
  verifyAuthMiddleware,
  verifyAdminMiddleware,
  uploadPhoto.array("images", 10),
  createMultipleCurrency
);

// list MultipleCurrency
router.get(
  "/list-multiple-currency/:pageNo/:perPage/:searchKeyword",

  listMultipleCurrency
);

// get MultipleCurrency details by id
router.get(
  "/multiple-currency-details/:id",

  getMultipleCurrencyDetailsById
);

// update MultipleCurrency
router.post(
  "/update-multiple-currency/:id",
  verifyAuthMiddleware,
  verifyAdminMiddleware,
  uploadPhoto.array("images", 10),
  updateMultipleCurrency
);

// delete MultipleCurrency img
router.post(
  "/delete-multiple-currency-img/:id",
  verifyAuthMiddleware,
  verifyAdminMiddleware,
  deleteMultipleCurrencyImgAndpullImg
);

// delete MultipleCurrency
router.get(
  "/delete-multiple-currency/:id",
  verifyAuthMiddleware,
  verifyAdminMiddleware,
  deleteMultipleCurrencyImgWithImg
);

//------------------------------ product ----------------------------------------------------------------------------
// create product
router.post(
  "/create-product",
  verifyAuthMiddleware,
  verifyAdminMiddleware,
  uploadPhoto.array("images", 10),
  createProduct
);

// list product for Global
router.get("/list-product-global", listProductForGlobal);
// Best Sales product for Global
router.get("/best-sales", bestSalesProductForGlobal);

// list product for mega menu by category
router.get("/list-mega-menu-products", getMegaMenuProductsByCategory);

// get product details by id
router.get("/product-details/:id", getProductDetailsById);

router.get(
  "/related-products/:pageNo/:perPage/:searchKeyword",
  relatedProducts
);

// update product
router.post(
  "/update-product/:id",
  verifyAuthMiddleware,
  verifyAdminMiddleware,
  uploadPhoto.array("images", 10),
  updateProduct
);
// delete product
router.get(
  "/delete-product/:id",
  verifyAuthMiddleware,
  verifyAdminMiddleware,
  deleteProduct
);
// delete product Img
router.post(
  "/delete-product-img/:id",
  verifyAuthMiddleware,
  verifyAdminMiddleware,
  deleteProductImgAndPullImg
);
// ratings product
router.post("/ratings-product/:id", verifyAuthMiddleware, ratingsProduct);

// -------------------------- Wish List -------------------------------------------------
router.post("/wishlist", verifyAuthMiddleware, createAndRemoveWishList);
router.get(
  "/getWishList/:pageNo/:perPage/:searchKeyword",
  verifyAuthMiddleware,
  getWishList
);

// ----------------------------------- Set offers in products ---------------------------

// category wise
router.post(
  "/set-offers-by-category-in-products",
  verifyAuthMiddleware,
  verifyAdminMiddleware,
  setOfferByCategoryB1G1OrB2G1
);

router.get(
  "/check-offers-by-category-b1g1/:id",
  verifyAuthMiddleware,
  verifyAdminMiddleware,
  CheckOfferByCategoryB1G1
);
router.get(
  "/check-offers-by-category-b2g1/:id",
  verifyAuthMiddleware,
  verifyAdminMiddleware,
  CheckOfferByCategoryB2G1
);
router.get(
  "/check-offers-by-brand-b1g1/:id",
  verifyAuthMiddleware,
  verifyAdminMiddleware,
  CheckOfferByBrandB1G1
);
router.get(
  "/check-offers-by-brand-b2g1/:id",
  verifyAuthMiddleware,
  verifyAdminMiddleware,
  CheckOfferByBrandB2G1
);

// brand wise
router.post(
  "/set-offers-by-brand-in-products",
  verifyAuthMiddleware,
  verifyAdminMiddleware,
  setOfferByBrandB1G1OrB2G1
);
// set each/different  multiple selected products
router.post(
  "/set-offers-by-each-and-different-multiple-products",
  verifyAuthMiddleware,
  verifyAdminMiddleware,
  setOfferEachAndDifferentMultipleProductB1G1OrB2G1
);

router.post(
  "/set-offers-each-product",
  verifyAuthMiddleware,
  verifyAdminMiddleware,
  setOfferEachProductB1G1OrB2G1
);

// -------------------------- Coupon code -------------------------------------------------
router.post(
  "/coupon",
  verifyAuthMiddleware,
  verifyAdminMiddleware,
  createCoupon
);
router.get(
  "/all-coupon/:pageNo/:perPage/:searchKeyword",
  verifyAuthMiddleware,
  verifyAdminMiddleware,
  getCoupon
);
router.get(
  "/coupon-details/:id",
  verifyAuthMiddleware,
  verifyAdminMiddleware,
  getCouponDetailsById
);
router.post(
  "/update-coupon",
  verifyAuthMiddleware,
  verifyAdminMiddleware,
  updateCoupon
);
router.get(
  "/delete-coupon/:id",
  verifyAuthMiddleware,
  verifyAdminMiddleware,
  deleteCoupon
);
router.post("/validate-coupon-code", validateCouponCode);

// ------------------------- Upload Img ------------------------------------------------
router.post("/upload-img", uploadPhoto.array("images", 10), uploadImages);
router.get("/delete-img/:id", deleteImages);

// ------------------------- Card -------------------------------------------------------------
router.post("/create-card", verifyAuthMiddleware, createCard);
router.get(
  "/get-cards/:pageNo/:perPage/:searchKeyword",
  verifyAuthMiddleware,
  getCards
);
router.post(
  "/remove-card-when-order",
  verifyAuthMiddleware,
  removeCardwhenOrder
);
router.get("/delete-card/:id", verifyAuthMiddleware, deleteCard);

// ------------------------- Order -------------------------------------------------------------
router.post("/create-order", createOrder);
// get all order for admin only
router.get(
  "/get-all-order-for-admin/:pageNo/:perPage/:searchKeyword",
  verifyAuthMiddleware,
  verifyAdminMiddleware,
  getAllOrderForAdmin
);
// get running order for user only
router.get(
  "/get-running-order/:pageNo/:perPage/:searchKeyword",
  verifyAuthMiddleware,
  getRunningOrderForUser
);
// get Delivered order for user only
router.get(
  "/get-delivered-order/:pageNo/:perPage/:searchKeyword",
  verifyAuthMiddleware,
  getDeliveredOrderForUser
);
// get Cancelled order for user only
router.get(
  "/get-cancelled-order/:pageNo/:perPage/:searchKeyword",
  verifyAuthMiddleware,
  getCancelledOrderForUser
);
// get Returned order for user only
router.get(
  "/get-returned-order/:pageNo/:perPage/:searchKeyword",
  verifyAuthMiddleware,
  getReturnedOrderForUser
);

// get order details for admin only
router.get(
  "/get-order-details-for-admin/:id",
  verifyAuthMiddleware,
  verifyAdminMiddleware,
  getDetailsById
);

// get order details for user only
router.get("/get-order-details/:id", verifyAuthMiddleware, getDetailsById);
// change orderStatus for Admin
router.post(
  "/change-order-status-for-admin/:id",
  verifyAuthMiddleware,
  verifyAdminMiddleware,
  changeOrderStatus
);
// change orderStatus for User
router.post(
  "/change-order-status/:id",
  verifyAuthMiddleware,
  changeOrderStatus
);

// ---------------------Summary--------------------------------
// Order Summary
router.get(
  "/order-summary",
  verifyAuthMiddleware,
  verifyAdminMiddleware,
  orderSummary
);
router.get(
  "/refund-summary",
  verifyAuthMiddleware,
  verifyAdminMiddleware,
  refundSummary
);
// All Order Summary Report
router.post(
  "/order-summary-report",
  verifyAuthMiddleware,
  verifyAdminMiddleware,
  allOrderSummaryReport
);

// Running Order Summary
router.get(
  "/running-order-summary",
  verifyAuthMiddleware,
  verifyAdminMiddleware,
  runningOrderSummary
);
// Running Order Summary Report
router.post(
  "/running-order-summary-report",
  verifyAuthMiddleware,
  verifyAdminMiddleware,
  runningOrderSummaryReport
);

// Sales summary
router.get(
  "/sales-summary",
  verifyAuthMiddleware,
  verifyAdminMiddleware,
  salesSummary
);
// Sales summary Report
router.post(
  "/sales-summary-report",
  verifyAuthMiddleware,
  verifyAdminMiddleware,
  salesSummaryReport
);
// cancel Summary
router.get(
  "/cancel-summary",
  verifyAuthMiddleware,
  verifyAdminMiddleware,
  cancelSummary
);
router.post(
  "/cancel-summary-report",
  verifyAuthMiddleware,
  verifyAdminMiddleware,
  cancelSummaryReport
);

// return Summary
router.get(
  "/return-summary",
  verifyAuthMiddleware,
  verifyAdminMiddleware,
  returnSummary
);
// return Summary Report
router.post(
  "/return-summary-report",
  verifyAuthMiddleware,
  verifyAdminMiddleware,
  returnedSummaryReport
);

// -------- Main Slider -------------------------------------------
router.get(
  "/get-all-main-slider/:pageNo/:perPage/:searchKeyword",
  getMainSliders
);
router.get("/get-main-slider-details/:id", getMainSliderDetailsById);
router.post(
  "/add-main-slider",
  verifyAuthMiddleware,
  verifyAdminMiddleware,
  uploadPhoto.array("images", 10),
  createMainSlider
);
router.post(
  "/update-main-slider/:id",
  verifyAuthMiddleware,
  verifyAdminMiddleware,
  uploadPhoto.array("images", 10),
  updateMainSliderWithImg
);
router.post(
  "/delete-img-main-slider/:id",
  verifyAuthMiddleware,
  verifyAdminMiddleware,
  deleteImgMainSlider
);
router.post(
  "/delete-main-slider/:id",
  verifyAuthMiddleware,
  verifyAdminMiddleware,
  deleteMainSlider
);

// -------- Main Slider For Mobile -------------------------------------------
router.get(
  "/get-all-main-slider-for-mobile/:pageNo/:perPage/:searchKeyword",
  getMainSlidersForMobile
);
router.get(
  "/get-main-slider-details-for-mobile/:id",
  getMainSliderForMobileDetailsById
);
router.post(
  "/add-main-slider-for-mobile",
  verifyAuthMiddleware,
  verifyAdminMiddleware,
  uploadPhoto.array("images", 10),
  createMainSliderForMobile
);
router.post(
  "/update-main-slider-for-mobile/:id",
  verifyAuthMiddleware,
  verifyAdminMiddleware,
  uploadPhoto.array("images", 10),
  updateMainSliderForMobileWithImg
);
router.post(
  "/delete-img-main-slider-for-mobile/:id",
  verifyAuthMiddleware,
  verifyAdminMiddleware,
  deleteImgMainSliderForMobile
);
router.post(
  "/delete-main-slider-for-mobile/:id",
  verifyAuthMiddleware,
  verifyAdminMiddleware,
  deleteMainSliderForMobile
);

// -------- popup notification -------------------------------------------
router.get(
  "/get-popup-notifications/:pageNo/:perPage/:searchKeyword",
  getPopupNotifications
);
router.get(
  "/get-popup-notification-by-id/:id",
  getPopupNotificationDetailsById
);
router.post(
  "/add-popup-notification",
  verifyAuthMiddleware,
  verifyAdminMiddleware,
  uploadPhoto.array("images", 10),
  createPopupNotification
);
router.post(
  "/update-popup-notification/:id",
  verifyAuthMiddleware,
  verifyAdminMiddleware,
  uploadPhoto.array("images", 10),
  updatePopupNotificationWithImg
);
// delete img only
router.post(
  "/delete-img-popup-notification/:id",
  verifyAuthMiddleware,
  verifyAdminMiddleware,
  deleteImgPopupNotification
);
// delete table with img
router.post(
  "/delete-popup-notification/:id",
  verifyAuthMiddleware,
  verifyAdminMiddleware,
  deletePopupNotification
);

// --------------------------- shipping cost ------------------------------
router.get("/get-shipping-cost", listShippingCost);
router.post(
  "/add-shipping-cost",
  verifyAuthMiddleware,
  verifyAdminMiddleware,
  addShippingCost
);
router.post(
  "/update-shipping-cost/:id",
  verifyAuthMiddleware,
  verifyAdminMiddleware,
  updateShippingCost
);
router.get("/get-shipping-cost-by-id/:id", getShippingCostById);
router.get(
  "/delete-shipping-cost/:id",
  verifyAuthMiddleware,
  verifyAdminMiddleware,
  deleteShippingCost
);

// --------------------------- Social Links  ------------------------------
router.get("/get-social-link", listSocialLink);
router.post(
  "/add-social-link",
  verifyAuthMiddleware,
  verifyAdminMiddleware,
  addSocialLink
);
router.post(
  "/update-social-link/:id",
  verifyAuthMiddleware,
  verifyAdminMiddleware,
  updateSocialLinks
);
router.get("/get-social-link-by-id/:id", getSocialLinkById);
router.get(
  "/delete-social-link/:id",
  verifyAuthMiddleware,
  verifyAdminMiddleware,
  deleteSocialLink
);

// --------------------------------------- return and refund Policy --------------------------------------

router.get("/list-return-and-refund-policy", listReturnAndRefundPolicy);
router.get("/get-return-and-refund-policy-by-id/:id", getReturnAndRefundById);
router.post(
  "/add-return-and-refund-policy",
  verifyAuthMiddleware,
  verifyAdminMiddleware,
  addReturnAndRefundPolicy
);
router.post(
  "/update-return-and-refund-policy/:id",
  verifyAuthMiddleware,
  verifyAdminMiddleware,
  updateReturnAndRefundPolicy
);
router.get(
  "/delete-return-and-refund-policy/:id",
  verifyAuthMiddleware,
  verifyAdminMiddleware,
  deleteReturnAndRefundPolicy
);

// about us privacy policy
router.post(
  "/add-about-us",
  verifyAuthMiddleware,
  verifyAdminMiddleware,
  addAboutUs
);
// about us privacy policy
router.post(
  "/update-about-us/:id",
  verifyAuthMiddleware,
  verifyAdminMiddleware,
  updateAboutUs
);

router.get("/get-about-us-by-id/:id", getAboutUsById);
router.get("/list-about-us", listAboutUs);

router.get(
  "/delete-about-us/:id",
  verifyAuthMiddleware,
  verifyAdminMiddleware,
  deleteAboutUs
);

// Terms of Condition privacy policy
router.post(
  "/add-term-of-condition",
  verifyAuthMiddleware,
  verifyAdminMiddleware,
  addTermOfCondition
);
router.post(
  "/update-term-of-condition/:id",
  verifyAuthMiddleware,
  verifyAdminMiddleware,
  updateTermOfCondition
);

router.get("/list-term-of-condition", listTermOfCondition);
router.get("/get-term-of-condition-by-id/:id", getTermOfConditionById);

router.get(
  "/delete-term-of-condition/:id",
  verifyAuthMiddleware,
  verifyAdminMiddleware,
  deleteTermOfCondition
);

// Terms of Service privacy policy
router.post(
  "/add-term-of-service",
  verifyAuthMiddleware,
  verifyAdminMiddleware,
  addTermOfService
);
router.post(
  "/update-term-of-service/:id",
  verifyAuthMiddleware,
  verifyAdminMiddleware,
  updateTermOfService
);

router.get("/list-term-of-service", listTermOfService);
router.get("/get-term-of-service-by-id/:id", getTermOfServiceById);

router.get(
  "/delete-term-of-service/:id",
  verifyAuthMiddleware,
  verifyAdminMiddleware,
  deleteTermOfService
);
// Privacy policy
router.post(
  "/add-privacy-policy",
  verifyAuthMiddleware,
  verifyAdminMiddleware,
  addPrivacyPolicy
);

router.get("/list-privacy-policy", listPrivacyPolicy);
router.get("/get-privacy-policy-by-id/:id", getPrivacyPolicyById);

router.post(
  "/update-privacy-policy/:id",
  verifyAuthMiddleware,
  verifyAdminMiddleware,
  updatePrivacyPolicy
);
router.get(
  "/delete-privacy-policy/:id",
  verifyAuthMiddleware,
  verifyAdminMiddleware,
  deletePrivacyPolicy
);
// Contact us
router.post(
  "/add-contact-us",
  verifyAuthMiddleware,
  verifyAdminMiddleware,
  addContactUs
);

router.get("/list-contact-us", listContactUs);

router.get(
  "/delete-contact-us/:id",
  verifyAuthMiddleware,
  verifyAdminMiddleware,
  deleteContactUs
);
router.get("/get-contact-us-by-id/:id", getContactUsById);
router.post(
  "/update-contact-us/:id",
  verifyAuthMiddleware,
  verifyAdminMiddleware,
  updateContactUs
);

//  refund policy
router.post(
  "/add-refund-policy",
  verifyAuthMiddleware,
  verifyAdminMiddleware,
  addRefund
);

router.get("/list-refund-policy", listRefund);
router.get("/get-refund-policy-by-id/:id", getRefundById);

router.get(
  "/delete-refund-policy/:id",
  verifyAuthMiddleware,
  verifyAdminMiddleware,
  deleteRefund
);
router.post(
  "/update-refund-policy/:id",
  verifyAuthMiddleware,
  verifyAdminMiddleware,
  updateRefund
);

// Team
router.post("/add-team", verifyAuthMiddleware, verifyAdminMiddleware, addTeam);

router.get("/list-team", listTeam);

router.get(
  "/delete-team/:id",
  verifyAuthMiddleware,
  verifyAdminMiddleware,
  deleteTeam
);

// add faq questions
router.post("/add-faq", verifyAuthMiddleware, verifyAdminMiddleware, addFaq);

router.get("/list-faq", listFaq);

router.get(
  "/delete-faq-question/:id",
  verifyAuthMiddleware,
  verifyAdminMiddleware,
  deleteFaq
);

// myFatoorah payment
router.post("/create-payment", initiatePayment);
router.post("/create-order-by-myfatoorah-executive-payment", executivePayment);
router.get("/success-payment", successPayment);
router.get("/fail-payment", failPayment);

module.exports = router;
