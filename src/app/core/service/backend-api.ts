import { environment } from '../../../environments/environment';



// const baseURL= 'http://localhost:8888'
// const baseAdmin= 'http://localhost:8888'

// baseAdmin APi admin and baseURL API product
const baseAdmin = environment.configAdmin;
const baseURL = environment.configFile;


export const ordersApi = `${baseAdmin}/orders/admin/all/status/page`;

export const loginApi = `${baseAdmin}/app-user/signin`;

export const forgotPasswordApi = `${baseAdmin}/app-user/forgot-password`;
// Verify Reset Password Token
export const verifyForgotPasswordTokenApi = `${baseURL}/app-user/verify-forgot-password-token`;
// Reset Password
export const resetPasswordApi = `${baseURL}/app-user/reset-password`;


export const orderDetailApi = `${baseAdmin}/orders/detail/:id`;

export const orderStatusApi = `${baseAdmin}/orders/:id/admin/status`;

export const paymentVerifyApi = `${baseAdmin}/payment/admin/verify`;

export const getOrderByStatus = `${baseAdmin}/orders/admin/all`;

export const getShippingAgentsFormDataApi = `${baseAdmin}/shipping/admin/shipping-agents-form-data`;

export const createShipmentApi = `${baseAdmin}/shipping/admin/create-shipment`;

export const deleteShippingAgentApi = `${baseAdmin}/shipping/admin/shipping-agent/:orderId`;

// update reason unbox
export const updateReasonUnboxApi = `${baseAdmin}/orders/nounbox-admin/:id`;
// update reason unbox
export const updateReasonHostApi = `${baseAdmin}/orders/nohost-admin/:id`;

export const countOrder = `${baseAdmin}/orders/count/admin`;
//product
export const getProductsByEntityId = `${baseAdmin}/products`;

//updated product
export const updateProductByPublicIdApi = `${baseAdmin}/products/?public_id=:PUBLICID`;

export const getProductByPublicIdApi = `${baseAdmin}/products/:PUBLICID`;

export const deleteProductApi = `${baseAdmin}/products/:PUBLICID`;

export const saveProductImage = `${baseAdmin}/products/image`;

export const updateImageApi = `${baseAdmin}/attachment`;

export const deleteImageApi = `${baseAdmin}/attachment?id=:id`;
//Category

export const getAllCategories = `${baseAdmin}/category/admin`;

// Category
export const cartegoryListApi = `${baseURL}/category`;
// CategoryById
export const cartegorybyIdApi = `${baseURL}/category/:id`;
// Category Update
export const cartegoryUpdateApi = `${baseURL}/category/update`;
// Delete by id
export const cartegoryDeleteApi = `${baseURL}/category/delete/:id`;
// Upload image
export const saveCategoryImage = `${baseAdmin}/category/image`;

export const categoryHistoryApi = `${baseAdmin}/category-update-history/:id`;

export const cartegoryAdminApi = `${baseURL}/category/admin`;

export const setDefaultCategoryApi = `${baseURL}/category/set-default`;

//attachments

export const updateAttachmentApi = `${baseURL}/attachment?product_uuid=:PUBLICID`;

// Requery payment status
export const requeryPaymentStatusApi = `${baseAdmin}/payment/admin/requery-payment-status`;
// export const requeryPaymentStatusApi = `https://stag2-thermomix.doxa-holdings.com/payment/admin/requery-payment-status`;

// News
export const newsListApi = `${baseURL}/news`;

export const GetInsightNewsApi = `${baseURL}/customer-news-notification/weekly-insight?start=:startDay&end=:endDay`;

export const GetWeeklyResultNewsApi = `${baseURL}/customer-news-notification/weekly-result?start=:startDay&end=:endDay&uuid=:id`;

export const GetDailyResultNewsApi = `${baseURL}/customer-news-notification/daily-views?uuid=:id`;

export const GetCustomerViewNewsApi = `${baseURL}/customer-news-notification/views-list`;

export const GetDailyResultReachesNewsApi = `${baseURL}/customer-news-notification/daily-reached?uuid=:id`;
// News by UUID
export const newsByUuidApi = `${baseURL}/news/uuid`;

export const newsInsightByUuidApi = `${baseURL}/news/insight-detail`;
// News attachment
export const updateNewsImageApi = `${baseURL}/news/image`;
// News attachment
export const newsAttachApi = `${baseURL}/news-attachment`;

// News attachment
export const newsReleaseViewAPi = `${baseURL}/news/release-views`;

export const newsTopAPi = `${baseURL}/news/top-views`;

export const customerNewsNotificationApi = `${baseURL}/customer-news-notification/views-list`;


export const stockCardDetailApi = `${baseURL}/inventory-stock-card/id/:UUID`;
//Inventory
export const createInventory = `${baseAdmin}/inventory-stock-card`;

export const saveproductInventoryImage = `${baseAdmin}/inventory-stock-card/image`;


export const productInventory = `${baseAdmin}/products/product/inventory`;

export const getInventoryStockCardApi = `${baseAdmin}/inventory-stock-card?page=:page&limit=:limit`;

export const getInventoryProductApi = `${baseAdmin}/product-inventory`;

export const getInventoryProductLowStockApi = `${baseAdmin}/product-inventory/min-stock`;

export const getInventoryProductByUuidApi = `${baseAdmin}/inventory-stock-card-item?uuid=:uuid`;

export const getMinStockApi = `${baseAdmin}/products/min-stock/admin`;

//Warrantied
export const warrantiedApi = `${baseURL}/warrantied-products`;

export const warrantiedDetailApi = `${baseURL}/warrantied-products/id?id=:id`;

export const warrantiedHistoryApi = `${baseURL}/warrantied-history?warrantyId=:id&comment=:comment`;

export const createSerialNumberApi = `${baseURL}/warrantied-products/admin`;

export const updateSerialNumberApi = `${baseURL}/warrantied-products/admin/update-serial`;

export const getAdminInventoryProduct = `${baseURL}/orders/product/inventory?id=:id`;

export const deleteWarranty = `${baseURL}/warrantied-products?order_id=:id`;

export const updateStatusWarranty = `${baseURL}/warrantied-products/admin?customer_id=:customerId&order_id=:orderId`;

export const createWarranty = `${baseURL}/warrantied-products/admin`;

//NAEP service

export const getNAEPApi = `${baseURL}/approved-recruitment/naep`;

export const getNAEPPendingApi = `${baseURL}/recruitment/pending`;

export const getNAEPApprovedAndRejectedApi = `${baseURL}/recruitment/approved-rejected`;

export const getNAEPByUuid = `${baseURL}/recruitment/naep/uuid/`;

export const updateDateNAEP = `${baseURL}/approved-recruitment`;

export const getDiscountProduct = `${baseURL}/products/product/naep-discount-inventory/`;

export const getDataKeyProduct = `${baseURL}/products/naep/key`;

//save epp approval code

export const saveEPPApprovalCodeApi = `${baseAdmin}/payment/admin/input/epp-approval-code`;

// Special Product
export const updateSpecialProduct = `${baseURL}/special-product`;

export const getSpecialProduct = `${baseURL}/special-product`;

export const checkIsNAEPProductApi = `${baseURL}/special-product/product/admin`;

export const checkRecruitMentApi = `${baseURL}/recruitment/check/customer`;

export const createSaleHistoryApi = `${baseURL}/recruitment-sales-history`;

export const becomeAdvisorApi = `${baseURL}/auth/become-an-advisor`;

export const specialProductApi = `${baseURL}/special-product/product/key`;



//get all recurring payments by status

export const getRecurringPaymentsByStatus = `${baseAdmin}/orders/admin/installment-all?page=pages&limit=limited&status=newStatus`;

export const countRecurringPayments = `${baseAdmin}/payment/recurring-payment/count/admin`;

export const getCustomerAddress = `${baseAdmin}/orders/admin/customer-address?customerId=orderCustomerId`;

export const getInstallmentById = `${baseAdmin}/orders/admin/installment?Id=installmentId`;


export const terminateRecurringPaymentByIdApi = `${baseAdmin}/payment/admin/terminate-recurring/:installmentId`;


//Change price
export const updatePrice = `${baseURL}/order-line-item/update-price`;

//Assign Advisor
// export const searchAssignAdvisor = `${baseURL}/auth/signup/:id`;
export const searchAssignAdvisor = `${baseURL}/auth/admin/assign/:id`;

//Add Assign Advisor
export const addAssignAdvisor = `${baseURL}/orders/update-advisor`;

//Report branch sales
export const getBranchManager = `${baseURL}/customer-role/admin/branch-manager`;

//get data report
export const getDataReport = `${baseURL}/orders/reports`;

export const getProductReportApi = `${baseURL}/products/report/all-products`;

export const getTeamLeaderOfBranchApi = `${baseURL}/customer-role/team-leader/admin`;

//Promotion Gifts
export const getAllPaymentPromotionGifts = `${baseURL}/products/admin/all/payment-promotion-gifts`;
export const checkSerialNumberApi = `${baseURL}/warrantied-products/admin/check-serial`;

//get naep
export const getDataNaep = `${baseURL}/special-product/product/naep/key`;

//get data profile
export const getDataProfile = `${baseURL}/app-user/profile`;

//update image profile
export const updateImageProfile = `${baseURL}/app-user/get-presigned-url`;

//change password
export const changePassword = `${baseURL}/app-user/change-password`;

//change password
export const changeName = `${baseURL}/app-user/profile`;

//customers
export const getDataCustomers = `${baseURL}/auth/customer/all`;

//detail customer
export const getCustomerInformation = `${baseURL}/auth/customer-information?uuid=:uuid`;

//Assign Advisor
export const updateAdvisor = `${baseURL}/auth/update-advisor`;

//Report NAEP naep recruitment
export const reportNAEPRecruitment = `${baseURL}/recruitment/report/naep-recruitment`;

//Report NAEP naep recruitment
export const reportFirstSalesRecruitment = `${baseURL}/recruitment/report/firstSales`;

//Report NAEP naep recruitment
export const reportNAEPReport = `${baseURL}/recruitment/naep/report`;

//Qxpress
export const createQxpressTrackingApi = `${baseURL}/shipping/admin-sg/create/shipment-agent/qxpress`;

export const getTrackingDataApi = `${baseURL}/shipping/admin-sg/shipment-agent/qxpress`;

// dynamic translations
// ------- product
export const getTranslationProduct = `${baseURL}/translate/product?id=:PRODUCTID`;

export const updateTranslationProduct = `${baseURL}/translate?id=:TRANSLATION_ID`;

export const getTranslationByTranslationId = `${baseURL}/translate?id=:TRANSLATION_ID`;

export const createTranslationProduct = `${baseURL}/translate/product`;

export const deleteTranslationProduct = `${baseURL}/translate?id=:TRANSLATION_ID`;
// ------- category
export const getTranslationCategory = `${baseURL}/translate/category?id=:CATEGORYID`;

export const getTranslationCategoryByTranslationId = `${baseURL}/translate?id=:TRANSLATION_ID`;

export const updateTranslationCategory = `${baseURL}/translate?id=:TRANSLATION_ID`;

export const createTranslationCategory = `${baseURL}/translate/category`;

export const deleteTranslationCategory = `${baseURL}/translate?id=:TRANSLATION_ID`;

export const editDeliveryAddressApi = `${baseURL}/address/admin-update`;

//Download Shipping Label
export const updateHistoryDownloadShippingLabel = `${baseURL}/orders/admin/history`;

//Lock Orders
export const lockOrderApi = `${baseURL}/order-locked`;

export const checkLockOrderApi = `${baseURL}/order-locked/status`;

//Evidence Receive
export const saveOrderImage = `${baseURL}/orders/order-photo`;

//order status
export const checkOrderStatus = `${baseURL}/orders/check-status/order`;

//NAEP new flow
export const NaepType = `${baseURL}/naep-type`;

export const NaepProcess = `${baseURL}/naep-process`;

export const NaepPackage = `${baseURL}/naep-package`;

export const getNaepTypeDetail = `${baseURL}/naep-type/detail`;

export const updateNaepType = `${baseURL}/naep-type/update-naep-type`;

export const getNaepProcessDetail = `${baseURL}/naep-process/detail`;

export const updateNaepProcess = `${baseURL}/naep-process/update`;

export const GetNaepPackageDetail = `${baseURL}/naep-package/get-detail`;

export const GetListNaepMember = `${baseURL}/naep-sales-customer-process/naep`;

export const ExtendNaepEndTime = `${baseURL}/naep-sales-customer-process`;

export const getUrlImageNaepPackageApi = `${baseURL}/naep-package/image`;

// New Report
export const reportStock = `${baseURL}/orders/stock/reports`;

export const reportDailyCollection = `${baseURL}/orders/payments/reports`;

export const NaepAdvisorKit = `${baseURL}/naep-package-kit/advisor-kit`;

export const NaepDepositProduct = `${baseURL}/products/admin/deposit-product-naep`;

export const HasAdvisorProduct = `${baseURL}/products/admin/has-advisor-product`;

//Change shipping
export const changeShippingApi = `${baseURL}/shipping/admin/change-shipping`;

//Change Shipping Locagion MY
export const changeShippingLocationApi = `${baseURL}/shipping/admin/change-location`;

//searchOrder
export const searchOrderInAllData = `${baseURL}/orders/search-all-order/admin`;

//customer Edit phone and email

export const EditPhoneCustomer = `${baseURL}/auth/edit-phone/admin`;

export const EditEmailCustomer = `${baseURL}/auth/edit-email/admin`;

export const editBankInfoApi = `${baseURL}/auth/edit-bank/admin`;

//Admin Roles
export const GetListAdminRole = `${baseURL}/app-user/list`;

export const UpdateAdminRole = `${baseURL}/app-user/update/role`;
export const EditNameCustomer = `${baseURL}/auth/edit-name/admin`;

//Export Packing List
export const getPackingListByProductQuantityApi = `${baseURL}/orders/packing-list-product/reports`;

export const getAllProductOrdersPackingApi = `${baseURL}/orders/orders-packing/all-product`;

export const getOrdersPackingListApi = `${baseURL}/orders/orders-packing/reports`;

//Order edit payment
export const EditPayment = `${baseURL}/orders/change-payment-by-admin`;

export const checkBeforeDeleteProductApi = `${baseURL}/products/check-delete-product`;

export const ReportCustomerHistoryApi = `${baseURL}/customer-update-history`;

export const MxpressShipping = `${baseURL}/shipping/create-mxpress-admin`;

export const RefundApi = `${baseURL}/naep-sales-customer-process/update-refund`;

export const TrackingMxpressApi = `${baseURL}/shipping/admin/tracking-mxpress`;

export const getPublicHolidayApi = `${baseURL}/shipping/admin/get-public-holiday`;

export const getQuickTimeSlotQXpressApi = `${baseURL}/shipping/admin/time-slot-available-qxpress`;

export const getSpTimeAfterByDateApi = `${baseURL}/sp-time-after/admin/get-time-after`;

export const saveShippingSpecialApi = `${baseURL}/shipping/admin/change-shipping-type`;

export const createQXpressApi = `${baseURL}/shipping/admin/create-qxpress`;

export const cancelQXpressApi = `${baseURL}/shipping/cancel-qxpress`;

export const shippingLocationAPI = `${baseURL}/shipping-location/customer`;

export const shippingLocationAdminAPI = `${baseURL}/shipping-location/admin`;

export const SendDataAxWayApi = `${baseURL}/orders/send-data-axway/admin`;

export const UpdateRewardApi =  `${baseURL}/naep-sales-customer-process-type`;

export const UpdatePurchasedApi =  `${baseURL}/naep-sales-customer-process/mark-buy-discount`;

// import data id
export const importDataIdApi = `${baseURL}/orders/send-data-axway/eo-sle-sc`;

export const importSerialNumberApi = `${baseURL}/orders/send-data-axway/serial-number`;

export const importPaymentGiftIdApi = `${baseURL}/orders/send-data-axway/payment-gift`;

export const importCustomerIdApi = `${baseURL}/auth/axway-send-memmeber`;

// import data excel
export const importDataApi = `${baseURL}/auth/insert-data-csv`;

//Admin Upload Banner
export const bannersListApi = `${baseURL}/banners/save-banner`;

export const updateNewsBannerApi = `${baseURL}/news/banner`;

export const getAllBannersApi = `${baseURL}/banners/banner_admin`;

//Admin verify Email, Phone for customer
export const adminVerifyPhoneApi = `${baseURL}/app-user/verify-customer-phone`;

export const adminVerifyEmailApi = `${baseURL}/app-user/verify-customer-email`;

// weight based shipping
export const costShippingApi = `${baseURL}/shipping-price-calculator`;

// Update Customer Information
export const updateCustomerInformationApi = `${baseURL}/customer-information/admin-update/:id`;

// Download Invoice
export const DownloadInvoiceApi = `${baseURL}/orders/admin/invoice/:uuid`;

// host gift
export const hostGiftSettingApi = `${baseURL}/host-gift/admin`;

// host gift active setting
export const hostGiftItemApi = `${baseURL}/host-gift-item`;

export const getDetailActiveSettingApi = `${baseURL}/host-gift-active/admin`;

export const settingActiveHostGiftApi = `${baseURL}/host-gift-active`;

// redemption monitor
export const redemptionMonitorApi = `${baseURL}/host-gift-advisor/admin/monitory`;

// Get questionnaire status
export const questionnaireStatusApi = `${baseURL}/profile/admin/questionnaire-status/:version1/:version2?uuid=:id`;

export const questionnairePreApi = `${baseURL}/profile/admin/questionnaire1?version=:ver&uuid=:id`;

export const questionnairePostApi = `${baseURL}/profile/admin/questionnaire2?version=:ver&uuid=:id`;

// data transfer check

export const checkEoSleScApi = `${baseURL}/orders/check-data-axway/eo-sle-sc`;

export const checkEoSleScDetGiftApi = `${baseURL}/orders/check-data-axway/eo_sle_sc_det_gift`;

export const checkEoSleScDetSerialNumberApi = `${baseURL}/orders/check-data-axway/eo_sle_sc_det_serial_number`;

export const checkMemmemberApi = `${baseURL}/auth/check-data-axway/memmeber`;

// get advisory product
export const getAdvisoryProductApi = `${baseURL}/advisory-product/admin`

export const createAdvisoryProductApi = `${baseURL}/advisory-product/admin`
//Hierarchy & Ranking

export const createPeriod = `${baseURL}/period-sale`;

export const getPeriodDetail = `${baseURL}/period-sale/detail`;

export const listSalesMonitorApi = `${baseURL}/sales-monitor`;

export const getSalesMonitorDetailApi = `${baseURL}/sales-monitor/detail`;

export const updateSalesMonitorDetailApi = `${baseURL}/sales-monitor/update-period`;

export const updatePeriod = `${baseURL}/period-sale/update-period`;

export const updateNextPeriod = `${baseURL}/period-sale/update-next-period`;

export const consolidatePeriod = `${baseURL}/period-sale/consolidate-period`;

// just host

export const justHostComponentSettingApi = `${baseURL}/just-host/admin`;

export const justHostRequestAllApi = `${baseURL}/just-host-event/admin/requests`;

export const justHostRequestDetailApi = `${baseURL}/just-host-event/admin/request-detail`;

export const justHostRequestRejectApi = `${baseURL}/just-host-event/admin/reject`;

export const justHostRequestApproveApi = `${baseURL}/just-host-event/admin/approve`;

export const justHostGuestTrackerAllApi = `${baseURL}/just-host-guest`;