import { async } from '@angular/core/testing';
import { NAEPService } from 'app/core/service/naep.service';
import { forEach, isNull, isUndefined } from 'lodash';
import { Injectable } from "@angular/core";
import { HttpErrorResponse, HttpParams, HttpClient, HttpHeaders } from "@angular/common/http";
import { map, catchError, combineAll, retry } from "rxjs/operators";
import {
  ordersApi,
  orderDetailApi,
  orderStatusApi, updateReasonUnboxApi, updateReasonHostApi,
  paymentVerifyApi, getOrderByStatus, countOrder, updatePrice,
  searchAssignAdvisor, addAssignAdvisor,editDeliveryAddressApi,
  updateHistoryDownloadShippingLabel,
  lockOrderApi, checkLockOrderApi , saveOrderImage,
  checkOrderStatus , searchOrderInAllData,
  EditPayment,
  SendDataAxWayApi,
  updateCustomerInformationApi,
  DownloadInvoiceApi
} from "./backend-api";
import { Product, ProductGift, ProductKit, SerialNumberShipping } from "../models/product.model";
import { Observable, throwError } from "rxjs";
import { ApiService } from "./api.service";
import { orderTable, Shipping_location } from "../models/order.model";
import { isNullOrUndefined } from "util";
import { formatDate, formatCurrency } from "@angular/common";
import * as moment from 'moment';
import { saveEPPApprovalCodeApi, getInstallmentById, createSerialNumberApi } from './backend-api';
import { element } from 'protractor';
import * as _ from 'lodash';
import { ShippingService } from './shipping.service';
import { CheckNullOrUndefinedOrEmpty } from '../utils/common-function';
import { Router } from '@angular/router';
@Injectable({
  providedIn: "root",
})
export class OrdersService {
  naep_id : string;
  constructor(
    private api: ApiService,
    private http: HttpClient,
    private _shippingService: ShippingService,
    private  nAEPService : NAEPService,
    private router: Router,
  ) {
    this.nAEPService.checkIsNAEPProduct().subscribe((data) => {
        this.naep_id = data.length > 1?  data[0] : "0" ;
      })
  }

  getOrderbyOrderId(order_id): Observable<any> {
    let url = orderDetailApi.replace(":id", order_id);
    return this.api.get(url);
    // catchError((value) => throwError(value));
  }

  // getListProductByOrderId(order_id): Observable<any> {
  //   var url = orderDetailApi.replace(":id", order_id);
  //   return this.api.get(url).pipe(
  //     map((data: any) => {
  //       return this.renderDataProduct(data.data.order_items);
  //     })
  //   );
  // }

  editDeliveryAddress(deliveryAddressDto,order_id,address_id,customer_id){
    let param = new HttpParams();
    param = param.append('order_id',order_id);
    param = param.append('address_id',address_id);
    param = param.append('customer_id',customer_id)
    if(this.api.isEnable()){
      return this.http.post(editDeliveryAddressApi,deliveryAddressDto,{ headers: this.api.headers, params: param })
      .pipe(map((data : any)=>{
        return data;
      }))
    }
  }

  getAllOrders(status, page, limit, params, colIdSort = '', order = ''): Observable<any> {
    let param = new HttpParams();
    if (!CheckNullOrUndefinedOrEmpty(page)) {
      param = param.append('page', page);
    }
    if (!CheckNullOrUndefinedOrEmpty(limit)) {
      param = param.append('limit', limit);
    }
    if (!CheckNullOrUndefinedOrEmpty(status)) {
      param = param.append('status', status);
    }
    if (!CheckNullOrUndefinedOrEmpty(params.filterModel)) {
      if (!CheckNullOrUndefinedOrEmpty(params.filterModel.advisor)) {
        param = param.append('advisor', params.filterModel.advisor.filter);
      }
      if (!CheckNullOrUndefinedOrEmpty(params.filterModel.customer)) {
        param = param.append('customer', params.filterModel.customer.filter);
      }
      if (!CheckNullOrUndefinedOrEmpty(params.filterModel.orderIdTmm)) {
        param = param.append('orderId', params.filterModel.orderIdTmm.filter);
      }
      if (!CheckNullOrUndefinedOrEmpty(params.filterModel.updatedAt)) {
        param = param.append('date', params.filterModel.updatedAt.filter);
      }
      if (!CheckNullOrUndefinedOrEmpty(params.filterModel.shippingMethod)) {
        param = param.append('shipping-method', params.filterModel.shippingMethod.filter);
      }
    }
    if (colIdSort && order) {
      param = param.append('fieldSort', colIdSort);
      param = param.append('sortType', order.toUpperCase());
    }
    if (this.api.isEnable()) {
      return this.http.get<any>(getOrderByStatus, { headers: this.api.headers, params: param }).pipe(
        map((data) => {
          let listOrders = new Array<orderTable>();
          data.data.oders.forEach((ord) => {
            let orderData = new orderTable();
            orderData.id = "#" + ord.id;
            orderData.orderIdTmm = "#" + ord.order_id_tmm ;
            orderData.availability = (ord.orderLocked !== null) ? true : false;
            orderData.updatedAt = formatDate(ord.updated_at, "dd/MM/yyyy HH:mm", "en-US");
            orderData.customer = ord.customer_information.first_name + " " + ord.customer_information.last_name;

            if (!CheckNullOrUndefinedOrEmpty(ord.shipping.SpecialDelivery)) {

              if (ord.shipping.SpecialDelivery.sd_type == 'SD_ONLY') {
                orderData.shippingDate = !CheckNullOrUndefinedOrEmpty(ord.shipping.SpecialDelivery.select_date) ?
                formatDate(ord.shipping.SpecialDelivery.select_date, "dd/MM/yyyy", "en-US") : '3 working days'

              } else if (ord.shipping.SpecialDelivery.sd_type == 'SD_ONLY_LATER') {
                orderData.shippingDate = 'Select later'

              } else {
                orderData.shippingDate = !CheckNullOrUndefinedOrEmpty(ord.shipping.SpecialDelivery.select_date) ?
                formatDate(ord.shipping.SpecialDelivery.select_date, "dd/MM/yyyy", "en-US") : '';
              }

              if (ord.shipping.SpecialDelivery.sd_type == 'SD_ONLY' || ord.shipping.SpecialDelivery.sd_type == 'SD_ONLY_LATER') {
                if (ord.shipping.is_manual_shipping) {
                  orderData.shippingMethod = 'Date - By Thermomix'
                } else {
                  orderData.shippingMethod = 'Date - By Courier'
                }

              } else if (ord.shipping.SpecialDelivery.sd_type == 'SD_BEFORE') {
                orderData.shippingMethod = 'D&T - By Qxpress'

              } else if (ord.shipping.SpecialDelivery.sd_type == 'SD_AFTER') {
                orderData.shippingMethod = 'D&T - By Thermomix'
              }

            } else {
              if (ord.shipping.shipping_method === 'SELF_COLLECT') {
                orderData.shippingMethod = 'Self Collect'
              } else if (ord.shipping.shipping_method === 'BY_COURRIER'){
                if (ord.shipping.is_manual_shipping) {
                  orderData.shippingMethod = 'By Thermomix'
                } else {
                  orderData.shippingMethod = 'By Courier'
                }
              }
            }

            let shippingLocation = new Shipping_location()
            if(!CheckNullOrUndefinedOrEmpty(ord.shipping.shippinglocation))
            {
              shippingLocation.color = ord.shipping.shippinglocation.color;
              shippingLocation.name = ord.shipping.shippinglocation.name;
            }else{
              shippingLocation = null
            }

            orderData.shippingLocation = shippingLocation;

            // orderData.shippingMethod += _.startCase(_.camelCase(ord.shipping.shipping_method));
            ord.order_items.forEach(item => {
              orderData.quantity += item.quantity
              // + item.order_line_bank_transfer_gifts.length + item.order_line_single_paymt_gifts.length
              if(!CheckNullOrUndefinedOrEmpty(item.order_line_single_paymt_gifts) && item.order_line_single_paymt_gifts.length > 0 ){
                item.order_line_single_paymt_gifts.forEach(order_line_single_paymt => {
                  if(order_line_single_paymt.is_paid){
                    orderData.quantity += 1;
                  }
                });
              }
              if(!CheckNullOrUndefinedOrEmpty(item.order_line_bank_transfer_gifts) && item.order_line_bank_transfer_gifts.length > 0 ){
                item.order_line_bank_transfer_gifts.forEach(order_line_bank_transfer => {
                  if(order_line_bank_transfer.is_paid){
                    orderData.quantity += 1;
                  }
                });
              }
            });
            if (CheckNullOrUndefinedOrEmpty(ord.advisor_customer)) {
              orderData.advisor = " ";
            }
            // else if (CheckNullOrUndefinedOrEmpty(ord.advisor_customer.preferred_name) || ord.advisor_customer.preferred_name =="") {
            //   orderData.advisor = ord.advisor_customer.firt_name;
            // }
            else {
              orderData.advisor = ord.advisor_customer.firt_name;
            }

            orderData.status = ord.status;
            if (ord.order_items.length != 0) {
              orderData.currency = ord.order_items[0].currency_code;
              orderData.total = formatCurrency(ord.total_amount, "en-US", orderData.currency + ' ', "code", "0.2-2");
            }
            else {
              orderData.total = formatCurrency(ord.total_amount, "en-US", " ", "code", "0.2-2");
            }

            listOrders.push(orderData);
          });

          return { listOrders: listOrders, sum: data.data.ordersSum };
        }),
        catchError((data) => throwError(data))
      );
    }
  }


  updateStatusOfOrder(order_id, status, comment? , image?, shipping_method?, shipping_note? ) : Observable<any> {
    let url = orderStatusApi.replace(":id", order_id);
    let param = {
      status: status,
      comment: comment,
      image: image,
      shipping_method : shipping_method,
      shipping_note : shipping_note
    };
    return this.api.put(url, param);
  }

  updateVerifyPayment(paymentId , comment) {
    let param = new HttpParams();
    if(paymentId !== null && paymentId !== undefined){
      param = param.append("id", paymentId);
    }
    if(comment !== null && comment !== undefined){
      param = param.append("comment", comment);
    }
    if(this.api.isEnable()){
      return this.http.put<any>(paymentVerifyApi, " " ,{ headers: this.api.headers, params: param }).pipe(
        map(data => {
          return data;
        })
      )

    }
  }


  saveEPPApprovalCode(formApprovalCode) {
    return this.api.post(saveEPPApprovalCodeApi, formApprovalCode);
  }

  /**
 *
 * @param reason
 * @param flag : flag 1: update unbox
 *               flag 2 : update ship
 */
  updateReason(reason, orderId, flag): Observable<any> {
    let url: string;
    if (flag === true) {
      url = updateReasonUnboxApi.replace(":id", orderId);
    } else {
      url = updateReasonHostApi.replace(":id", orderId);
    }
    let param = {
      reasons: reason
    };
    return this.api.put(url, param).pipe(
      map((value) => {
      }), catchError(value => throwError(value))
    );

  }

  getDeliveryAddressByOrderId(order_id) {
    if (!CheckNullOrUndefinedOrEmpty(order_id)) {
      let addressInfo = new DeliveryAddress();
      let url = orderDetailApi.replace(":id", order_id);
      return this.api.get(url).pipe(
        map((data: any) => {
          addressInfo.firstName = data.data.delivery_address.first_name;
          addressInfo.lastName = data.data.delivery_address.last_name;
          addressInfo.email = data.data.delivery_address.email;
          addressInfo.phoneDialCode =
            data.data.delivery_address.phone_dial_code;
          addressInfo.phoneNumber = data.data.delivery_address.phone_number;
          addressInfo.addressLine1 = data.data.delivery_address.address_line1;
          addressInfo.addressLine2 = data.data.delivery_address.address_line2;
          addressInfo.addressLine3 = data.data.delivery_address.address_line3;
          addressInfo.postalCode = data.data.delivery_address.postal_code;
          addressInfo.stateCode = data.data.delivery_address.state_code;
          addressInfo.countryCode = data.data.delivery_address.country_code;
          addressInfo.createdAt = data.data.delivery_address.created_at;
          addressInfo.updatedAt = data.data.delivery_address.updated_at;
          return addressInfo;
        })
      );
    }
  }

  /**
   * update Price
   * @param formPrice
   */
  updatePrice(formPrice) {
    return this.api.put(updatePrice, formPrice);
  }

  /**
   * search Advisor By Advisor Id
   */
  searchAdvisorByAdvisorId(advisorId): Observable<any> {
    if (!CheckNullOrUndefinedOrEmpty(advisorId)) {

      let url = searchAssignAdvisor.replace(":id", advisorId);
      return this.api.get(url).pipe(
        map(data => {
          if (!CheckNullOrUndefinedOrEmpty(data.advisor_display)) {
            let advisorName;

            if (!CheckNullOrUndefinedOrEmpty(data.advisor_display.preferred_name)) {
              advisorName = data.advisor_display.preferred_name;
            }
            else if (!CheckNullOrUndefinedOrEmpty(data.advisor_display.firt_name && data.advisor_display.last_name)) {
              advisorName = data.advisor_display.firt_name + " " + data.advisor_display.last_name;
            }
            else if (CheckNullOrUndefinedOrEmpty(data.advisor_display.firt_name)) {
              advisorName = data.advisor_display.last_name;
            }
            else if (CheckNullOrUndefinedOrEmpty(data.advisor_display.last_name)) {
              advisorName = data.advisor_display.firt_name;
            }
            else {
              advisorName = " ";
            }

            return advisorName;
          }
        }));
    }
  }

  /**
   * add Assign Advisor
   * @param formAdvisor
   */
  addAssignAdvisor(formAdvisor) {
    return this.api.put(addAssignAdvisor, formAdvisor);
  }

  /**
   * add Serial Number
   * @param formAdvisor
  //  */
  addSerialNumber(formSerial) {
    return this.api.post(createSerialNumberApi, formSerial);
  }


  /**
   * render Data Product
   * @param listProduct
   */
  renderDataProduct(listProduct, is_show_naep ) {
    let orderProducts : Product[] = [];
    let isCheckKit: boolean = true;

    if (listProduct.length > 0) {

      let productFee = listProduct.filter(product => product.is_fee == true);
      let productsKit = listProduct.filter(product => product.is_kit == true);

      listProduct.forEach((pro) => {

        let product = new Product();

        if (pro.is_kit || pro.is_fee) {

          if (pro.is_fee) {
            return;
          }
          else if (pro.is_kit){

            if (isCheckKit) {
              isCheckKit = false;
              product.id = productFee[0].product_reference_id;
              product.orderLineId = productFee[0].id;
              product.productUri = pro.product_uri;
              product.isActive = pro.is_active;
              product.productName = pro.naep_advisor_kit.name;
              product.list_serial_number=  this.renderSerialNumber(pro.warranty);
              product.list_serial_number_shipping = this.renderSerialNumberShipping(pro.warranty)
              product.productDescription = pro.naep_advisor_kit.description;
              product.sku = pro.naep_advisor_kit.sku;
              product.promotionalPrice = productFee[0].price;
              product.tax = productFee[0].tax;
              product.currencyCode = productFee[0].currency_code;
              product.hasAdvisor = productFee[0].has_advisor;
              product.termsAndConditionsLink = productFee[0].terms_and_conditions_link;
              product.cover_photo_key = this.renderAttachment(productFee[0].product.attachments);
              product.price = !CheckNullOrUndefinedOrEmpty(productFee[0].product) ? productFee[0].product.listed_price : '';
              product.quantity = productFee[0].quantity;
              product.warranty_duration_in_days = productFee[0].product.warranty_duration_in_days;
              product.order_line_online_bank_transfer_gifts = productFee[0].order_line_bank_transfer_gifts;
              product.order_line_single_paymt_gifts = productFee[0].order_line_single_paymt_gifts;
              product.properties = productFee[0].properties
              product.is_naep_discount = pro.is_naep_discount;
              product.is_deposit = pro.is_deposit;
              product.is_fee = pro.is_fee;
              product.is_kit = pro.is_kit;
              product.naep_advisor_kit = pro.naep_advisor_kit;
              product.order_id = pro.order_id;

              let listKit = [];
              if (productsKit.length != 0) {
                productsKit.forEach(element => {

                  let product = new ProductKit();
                  product.id = element.product_reference_id;
                  product.name = element.product_name;
                  product.promotionalPrice = element.price;
                  product.sku = element.sku;
                  product.currencyCode = element.currency_code;
                  product.list_serial_number = this.renderSerialNumber(element.warranty);
                  product.list_serial_number_shipping = this.renderSerialNumberShipping(element.warranty);
                  product.warranty_duration_in_days = element.product.warranty_duration_in_days;
                  product.quantity = 1;
                  product.orderLineId = element.id;

                  for (let i = 0; i < product.quantity - product.list_serial_number_shipping.length; i++) {
                    product.arraySerialNumber.push(i)
                  }

                  listKit.push(product);
                });
              }

              product.productKit = listKit;
            }
          }
        }else if(!CheckNullOrUndefinedOrEmpty(pro.host_gift_id) || !CheckNullOrUndefinedOrEmpty(pro.just_host_event_id)){
          product.id = pro.product_reference_id;
          product.orderLineId = pro.id;
          product.productUri = pro.product_uri;
          product.isActive = pro.is_active;
          product.productName = pro.product_name;
          product.productDescription = pro.product_description;
          product.sku = pro.sku;
          product.promotionalPrice = pro.price;
          product.tax = pro.tax;
          product.currencyCode = pro.currency_code;
          product.hasAdvisor = pro.has_advisor;
          product.termsAndConditionsLink = pro.terms_and_conditions_link;
          product.quantity = pro.quantity;
          product.properties = pro.properties
          product.list_serial_number=  this.renderSerialNumber(pro.warranty);
          product.is_host_gift = (!CheckNullOrUndefinedOrEmpty(pro.host_gift_id) || !CheckNullOrUndefinedOrEmpty(pro.just_host_event_id)) ? true : false;
          product.cover_photo_key = this.renderAttachment(pro.product.attachments);
          product.order_line_online_bank_transfer_gifts = pro.order_line_bank_transfer_gifts;
          product.order_line_single_paymt_gifts = pro.order_line_single_paymt_gifts;
          if(!CheckNullOrUndefinedOrEmpty(pro.host_gift_item?.host_gift_item_component)){
            pro.host_gift_item?.host_gift_item_component.forEach(element => {
              let item = new ProductGift();
              item.name = element.product?.product_name;
              item.sku = element.product?.sku;
              item.quantity = pro.quantity;
              item.id = element.product?.id;
              product.productGift.push(item);
            });
          }
          if(!CheckNullOrUndefinedOrEmpty(pro.just_host_item?.just_host_item_component)){
            pro.just_host_item?.just_host_item_component.forEach(element => {
              let item = new ProductGift();
              item.name = element.product?.product_name;
              item.sku = element.product?.sku;
              item.quantity = pro.quantity;
              item.id = element.product?.id;
              product.productGift.push(item);
            });
          }
        } else {

          product.id = pro.product_reference_id;
          product.orderLineId = pro.id;
          product.productUri = pro.product_uri;
          product.isActive = pro.is_active;
          product.productName = pro.product_name;
          product.list_serial_number=  this.renderSerialNumber(pro.warranty);
          product.list_serial_number_shipping = this.renderSerialNumberShipping(pro.warranty)
          product.productDescription = pro.product_description;
          product.sku = pro.sku;
          product.promotionalPrice = pro.price;
          product.tax = pro.tax;
          product.currencyCode = pro.currency_code;
          product.hasAdvisor = pro.has_advisor;
          product.termsAndConditionsLink = pro.terms_and_conditions_link;
          product.cover_photo_key = this.renderAttachment(pro.product.attachments);
          product.price = !CheckNullOrUndefinedOrEmpty(pro.product) ? pro.product.listed_price : '';
          product.quantity = pro.quantity;
          product.warranty_duration_in_days = pro.product.warranty_duration_in_days;
          product.order_line_online_bank_transfer_gifts = pro.order_line_bank_transfer_gifts;
          product.order_line_single_paymt_gifts = pro.order_line_single_paymt_gifts;
          product.properties = pro.properties
          product.is_naep_discount = pro.is_naep_discount;
          product.is_deposit = pro.is_deposit;
          product.is_fee = pro.is_fee;
          product.is_kit = pro.is_kit;
          product.naep_advisor_kit = pro.naep_advisor_kit;
        }

        // orderProducts.push(product);

        if(is_show_naep)
        {
          orderProducts.push(product);
        }else
        {
          if(product.is_naep_discount !== true || product.id != this.naep_id)
          {
            orderProducts.push(product);
          } else if (product.is_kit) {
            orderProducts.push(product)
          }
        }
      });
    }

    // this.nAEPService.checkIsNAEPProduct().subscribe((data) => {
    //   //Case 0: Not have NAEP product.
    //   naep_id = data.length > 1?  data[0] : "0" ;


    // })
    return orderProducts

  }

  renderDataProductFull(listProduct ) {
    let orderProducts : Product[] = [];
    if (listProduct.length > 0) {

      listProduct.forEach((pro) => {

        let product = new Product();
        product.id = pro.product_reference_id;
        product.productName = pro.product_name;
        product.sku = pro.sku;
        product.promotionalPrice = pro.price;
        product.quantity = pro.quantity;
        product.order_line_online_bank_transfer_gifts = pro.order_line_bank_transfer_gifts;
        product.order_line_single_paymt_gifts = pro.order_line_single_paymt_gifts;
        orderProducts.push(product);
      });
    }
    return orderProducts

  }

  renderSerialNumber(list_serial_number) : string[]{
    // console.log(list_serial_number,'aaaaa');
    let return_list_serial : string[] = []
    list_serial_number.forEach(element=>{
      return_list_serial.push(element.serial_number);
    })
    return return_list_serial
  }
  renderSerialNumberShipping(list_serial_number) : SerialNumberShipping[]{
    let data : SerialNumberShipping[] = [];
    list_serial_number.forEach(element=>{
      let eachSerialNumber = new SerialNumberShipping();
      eachSerialNumber.id = element.id;
      eachSerialNumber.value = element.serial_number
      data.push(eachSerialNumber)
      // eachSerialNumber.value = element
    })
    return data
  }

  // renderSerialNumber(list_serial_number) : string{
  //   let return_serial : '';
  //   list_serial_number.forEach(element=>{
  //     if(CheckNullOrUndefinedOrEmpty(element.serial_number)){
  //       return_serial = element.serial_number;
  //     }
  //   })
  //   return return_serial;
  // }

  renderAttachment(data): string {
    let coverPhotoKey = '';
    if (!isNullOrUndefined(data) && data.length > 0) {
      data.forEach(element => {
        if (element.is_cover_photo === true) {
          coverPhotoKey = element.storage_key;

        }
      });
    }
    return coverPhotoKey;
  }
  /**
   * render Data Orders
   * @param data
   */
  renderDataOrder(data, is_show_naep) {
    if (data.code === 200 && !CheckNullOrUndefinedOrEmpty(data.data)) {
      let order = new Order();
      order.id = data.data.id;
      order.orderIdTmm = data.data.order_id_tmm;
      order.advised_by_customer_id = data.data.customer.advised_by_customer_id;
      order.customerId = data.data.customer_id;
      order.isDeleted = data.data.is_deleted;
      order.subtotal = data.data.subtotal;
      order.shippingFee = data.data.shipping_fee;
      order.tax = data.data.tax;
      order.checkOrderLock = (data.data.orderLocked !== null && data.data.orderLocked !== undefined) ? true : false;
      if(data.data.orderLocked !== null && data.data.orderLocked !== undefined){
        order.dataLock = new DataLock;
        order.dataLock.id = data.data.orderLocked.id;
        order.dataLock.time = data.data.orderLocked.locked_at;
        if(data.data.orderLocked.appUser !== null && data.data.orderLocked.appUser !== undefined){
          order.dataLock.adminEmail = data.data.orderLocked.appUser.email;
        }
      }
      order.is_naep_order = false;
      order.currency = (!CheckNullOrUndefinedOrEmpty(data.data.order_items)&& (data.data.order_items.length > 0)) ? data.data.order_items[0].currency_code : " "
      order.createdAt = data.data.created_at;
      order.need_unbox = data.data.need_unbox;
      order.need_host = data.data.need_host;
      order.updatedAt = data.data.updated_at;
      order.currency = (!CheckNullOrUndefinedOrEmpty(data.data.order_items) && (data.data.order_items.length > 0)) ? data.data.order_items[0].currency_code : " ";
      order.advisorCustomer = this.renderAdvisor(data.data.advisor_customer);
      order.entityId = data.data.entity_id;
      order.status = data.data.status;
      order.totalAmount = data.data.total_amount;
      order.shipping = this.renderShipping(data.data.shipping);
      order.listProduct = this.renderDataProduct(data.data.order_items, is_show_naep);
      order.payment_option = !data.data.payment_option ? null : data.data.payment_option;
      order.paymentInstallment = this.renderPaymentInstallment(data.data.paymentInstallment);
      order.deliveryAddress = this.renderDeliveryAddress(
        data.data.delivery_address
      );
      order.orderTableVerify = this.renderVerifyPaymentTable(order.orderIdTmm, data.data.payments, order.payment_option);
      order.customerInformation = this.renderCustomerInformation(
        data.data.customer_information
      );
      order.listFullProduct = this.renderDataProductFull(data.data.order_items);
      order.history = this.renderOrderHistory(data.data.histories);
      order.payment = this.renderOrderPayment(order.orderIdTmm, data.data.payments, order.payment_option);
      order.arrPaymentBank = this.renderPaymentBank(order.orderIdTmm , data.data.payments);
      //Check order is need advisor or not
      order.is_need_advisor = false;
      order.listProduct.forEach(product=>{
        order.is_need_advisor = order.is_need_advisor || product.hasAdvisor;
        order.is_naep_order = order.is_naep_order || product.is_naep_discount
      });

      order.remark_advisor_id = data.data.remark_advisor_id;
      order.remark_advisor_name = data.data.remark_advisor_name;
      order.remark_advisor_phone = data.data.remark_phone_number;


      data.data.payments.forEach(data => {
        if (data.payment_status === 'success') {
          order.paid = order.paid + Number(data.payment_amount);
        }
        if (data.verified) {
          order.verified = order.verified + Number(data.payment_amount);
        }
        // if (!data.verified) {
        //   order.pendingVerified = order.pendingVerified + Number(data.payment_amount);
        // } else {
        //   order.verified = order.verified + Number(data.payment_amount);
        // }
      });

      order.pendingPayment = order.totalAmount - order.paid;
      order.pendingVerified = order.totalAmount - order.verified;

      //find currency
      if (data.data.order_items.length != 0) {
        order.currency = data.data.order_items[0].currency_code;
      }
      else {
        order.currency = null;
      }

      order.customer = this.renderCustomer(data.data.customer);

      return order;
    }
  }

  /**
   * render Shipping
   * @param shipping
   */
  renderShipping(shipping) {
    if (!isNullOrUndefined(shipping)) {
      let ship = new Shipping();
      ship.id = shipping.id;
      ship.shippingMethod = shipping.shipping_method;
      ship.customerSelectedShippingDate = shipping.customer_selected_shipping_date;
      ship.shipDate = shipping.ship_date;
      ship.receiveDate = shipping.receive_date;
      ship.customerNotes = shipping.customer_notes;
      ship.createdAt = shipping.created_at;
      ship.updatedAt = shipping.updated_at;
      ship.pickupAddressId = shipping.pickup_address_id;
      ship.pickupDateTime = shipping.pickup_date_time;
      ship.shippingAgentId = shipping.shipping_agent_id;
      ship.shipmentId = shipping.shipment_id;
      ship.shipmentLabel = shipping.shipment_label;
      ship.shippingStatus = shipping.shipping_status;
      ship.isManualShipping = shipping.is_manual_shipping;
      if(!CheckNullOrUndefinedOrEmpty(shipping.shippinglocation))
      {
        ship.shipping_location_color = shipping.shippinglocation.color;
        ship.shipping_location_name = shipping.shippinglocation.name;
        ship.shipping_location_full = shipping.shippinglocation;
      }
      ship.specialDelivery = shipping.SpecialDelivery;
      ship.sdId = shipping.sd_id;
     return ship;
    }
  }

  /**
   * render Delivery Address
   * @param deliveryAddress
   */
  renderDeliveryAddress(deliveryAddress: any) {
    if (!isNullOrUndefined(deliveryAddress)) {
      let addressInfo = new DeliveryAddress();
      addressInfo.id = deliveryAddress.id;
      addressInfo.firstName = deliveryAddress.first_name;
      addressInfo.lastName = deliveryAddress.last_name;
      addressInfo.email = deliveryAddress.email;
      addressInfo.phoneDialCode =
        deliveryAddress.phone_dial_code;
      addressInfo.phoneNumber = deliveryAddress.phone_number;

      if (isNullOrUndefined(deliveryAddress.address_line1)) {
        addressInfo.addressLine1 = "";
      } else {
        addressInfo.addressLine1 = deliveryAddress.address_line1;
      }

      if (isNullOrUndefined(deliveryAddress.address_line2)) {
        addressInfo.addressLine2 = "";
      } else {
        addressInfo.addressLine2 = deliveryAddress.address_line2;
      }

      if (isNullOrUndefined(deliveryAddress.address_line3)) {
        addressInfo.addressLine3 = "";
      } else {
        addressInfo.addressLine3 = deliveryAddress.address_line3;
      }

      addressInfo.postalCode = deliveryAddress.postal_code;
      addressInfo.stateCode = deliveryAddress.state_code;
      addressInfo.countryCode = deliveryAddress.country_code;
      addressInfo.createdAt = deliveryAddress.created_at;
      addressInfo.updatedAt = deliveryAddress.updated_at;

      return addressInfo;
    }
  }

  /**
   * render OrderHistory
   * @param history
   */
  renderOrderHistory(history) {
    let listOrderHistory = [];
    if (!isNullOrUndefined(history) && history.length > 0) {
      history.forEach((his) => {
        let orderHistory = new OrderHistory();
        orderHistory.id = his.id;
        orderHistory.action = his.action;
        orderHistory.appUserId = his.app_user_id;
        orderHistory.createdAt = his.created_at;
        orderHistory.comment = his.comment;
        orderHistory.shipping_method = his.shipping_method;
        orderHistory.shipping_note = his.shipping_note;
        orderHistory.comment_receive = his.comment_receive;
        orderHistory.image = his.storage_key;
        if (!isNullOrUndefined(his.appUser)) {
          orderHistory.email = his.appUser.email
          if (!isNullOrUndefined(his.appUser.preferred_name)) {
            orderHistory.appUser = his.appUser.preferred_name;
          }
          else if (!isNullOrUndefined(his.appUser.firt_name && his.appUser.last_name)) {
            orderHistory.appUser = his.appUser.firt_name + " " + his.appUser.last_name;
          }
          else if (isNullOrUndefined(his.appUser.firt_name)) {
            orderHistory.appUser = his.appUser.last_name;
          }
          else if (isNullOrUndefined(his.appUser.last_name)) {
            orderHistory.appUser = his.appUser.firt_name;
          }
          else {
            orderHistory.appUser = " ";
          }
        }

        listOrderHistory.push(orderHistory);
      });
    }
    return listOrderHistory;
  }
  /**
   * render Customer Information
   * @param customerInformation
   */
  renderCustomerInformation(customerInformation) {
    if (!isNullOrUndefined(customerInformation)) {
      let customer = new CustomerInformation();
      customer.id = customerInformation.id;
      customer.firstName = customerInformation.first_name;
      customer.lastName = customerInformation.last_name;
      customer.email = customerInformation.email;
      customer.phoneDialCode = customerInformation.phone_dial_code;
      if (isNullOrUndefined(customerInformation.address_line1)) {
        customer.address_line1 = "";
      } else {
        customer.address_line1 = customerInformation.address_line1;
      }

      if (isNullOrUndefined(customerInformation.address_line2)) {
        customer.address_line2 = "";
      } else {
        customer.address_line2 = customerInformation.address_line2;
      }

      if (isNullOrUndefined(customerInformation.address_line3)) {
        customer.address_line3 = "";
      } else {
        customer.address_line3 = customerInformation.address_line3;
      }
      customer.phoneNumber = customerInformation.phone_number;
      customer.postal_code = customerInformation.postal_code;
      customer.state_code = customerInformation.state_code;
      customer.country_code = customerInformation.country_code;
      customer.createdAt = customerInformation.created_at;
      customer.updatedAt = customerInformation.updated_at;
      return customer;
    }
  }

  renderCustomer(customerInformation) {
    if (!isNullOrUndefined(customerInformation)) {
      let customer = new Customer();
      customer.id = customerInformation.id;

      if (!isNullOrUndefined(customerInformation.preferred_name)) {
        customer.customerName = customerInformation.preferred_name;
      }
      else if (!isNullOrUndefined(customerInformation.firt_name && customerInformation.last_name)) {
        customer.customerName = customerInformation.firt_name + " " + customerInformation.last_name;
      }
      else if (isNullOrUndefined(customerInformation.firt_name)) {
        customer.customerName = customerInformation.last_name;
      }
      else if (isNullOrUndefined(customerInformation.last_name)) {
        customer.customerName = customerInformation.firt_name;
      }
      else {
        customer.customerName = " ";
      }

      customer.email = customerInformation.email;
      customer.phoneNumber = "(+" + customerInformation.phone_dial_code + ") " + customerInformation.phone_number;

      customer.address = this.renderDeliveryAddress(customerInformation.address);
      customer.uuid = customerInformation.public_id;

      return customer;
    }
  }

  renderAdvisor(advisor) {
    if (!isNullOrUndefined(advisor)) {
      let adv = new AdvisorCustomer();
      adv.id = advisor.id;
      adv.entityId = advisor.entity_id;
      adv.publicId = advisor.public_id;
      adv.firtName = advisor.firt_name;
      adv.lastName = advisor.last_name;
      adv.phoneDialCode = advisor.phone_dial_code;
      adv.phoneNumber = advisor.phone_number;
      adv.email = advisor.email;
      adv.designation = advisor.designation;
      adv.languageCode = advisor.language_code;
      adv.password = advisor.password;
      adv.isActive = advisor.is_active;
      adv.isRegistered = advisor.is_registered;
      adv.createdAt = advisor.created_at;
      adv.updatedAt = advisor.updated_at;
      adv.registeredAt = advisor.registered_at;
      adv.advisorIdNumber = advisor.advisor_id_number;
      adv.advisedByCustomerId = advisor.advised_by_customer_id;
      adv.teamLeaderCustomerId = advisor.team_leader_customer_id;
      adv.branchManagerCustomerId = advisor.branch_manager_customer_id;
      // adv.profilePhotoId = advisor.profile_photo_id;
      adv.recruiterId = advisor.recruiter_id;
      adv.preferredName = advisor.preferred_name;
      adv.salt = advisor.salt;
      adv.profilePhotoKey = advisor.profile_photo_key;
      return adv;
    }
  }

  /**
   * render OrderPayment
   * @param payment
   */
  renderOrderPayment(orderId, payment, paymentOption) {
    let ordersPayments = [];
    if (!CheckNullOrUndefinedOrEmpty(payment)) {
      payment.forEach((pay) => {
        let orderPayment = new OrderPayment();
        orderPayment.id = pay.id;
        orderPayment.paymentAgentServiceId = pay.payment_agent_service_id;
        orderPayment.paymentCurrency = pay.payment_currency;
        orderPayment.paymentAmount = pay.payment_amount;
        orderPayment.displayAmount = formatCurrency(orderPayment.paymentAmount, "en-US", orderPayment.paymentCurrency + ' ', "code", "0.2-2");
        orderPayment.paymentMethod = pay.payment_method;
        orderPayment.paymentGateway = pay.payment_gateway;
        orderPayment.paymentReference = (!CheckNullOrUndefinedOrEmpty(pay.payment_reference_by_admin)) ? pay.payment_reference_by_admin :`${pay.uuid}+${orderId}`;
        orderPayment.payment_option = !paymentOption ? '' : paymentOption;
        orderPayment.isDepositPayment = pay.is_deposit_payment;
        orderPayment.payment_response = pay.payment_response;

        if (!pay.payment_status) {
          orderPayment.paymentStatus = 'Pending';
          orderPayment.updatedAt = '';
        }
        else {
          orderPayment.paymentStatus = pay.payment_status.toUpperCase();
          orderPayment.updatedAt = moment(pay.updated_at).local().format('DD-MM-YYYY');
        }
        orderPayment.verified = pay.verified;
        orderPayment.updatedAt = moment(pay.updated_at).local().format('DD-MM-YYYY');
        orderPayment.createdAt = pay.created_at;
        ordersPayments.push(orderPayment);
      });
      return ordersPayments;
    }
  }

  renderPaymentBank(orderId, payment){
    let arrBank = [];
    if(!CheckNullOrUndefinedOrEmpty(payment)){
      payment.forEach(element => {
        if(element.payment_status === 'success' && !CheckNullOrUndefinedOrEmpty(element.payment_response)){

          let bank = new CardBank();
          bank.acct = element.payment_response.CCNo;
          bank.auth = element.payment_response.AuthCode;
          bank.refNo = `${element.uuid}+${orderId}`;
          let strFirst = (!CheckNullOrUndefinedOrEmpty(element.payment_response.CCNo)) ? element.payment_response.CCNo.substr(0,1): '';
          if(strFirst === '5'){
            bank.cardType = 'MASTERCARD';
          }else if(strFirst === '4'){
            bank.cardType = 'VISA';
          }else if(strFirst === '3'){
            bank.cardType = 'AMERICAN EXPRESS';
          }else{
            bank.cardType = 'UNKNOWN'
          }

          arrBank.push(bank);
          // arrBank.push(bank);
          // arrBank.push(bank);
          // arrBank.push(bank);
        }
      });
    }
    return arrBank;
  }

  renderVerifyPaymentTable(orderId, payment, paymentOption) {
    let ordersTablePayments = [];
    if (!CheckNullOrUndefinedOrEmpty(payment)) {
      payment.forEach((pay) => {
        if (pay.payment_status === 'success') {
          let orderPayment = new VerifyOrder();
          orderPayment.id = pay.id;
          orderPayment.payment_currency = pay.payment_currency;
          orderPayment.payment_amount = pay.payment_amount;
          orderPayment.display_amount = formatCurrency(orderPayment.payment_amount, "en-US", orderPayment.payment_currency + ' ', "code", "0.2-2");
          if(pay.payment_method === 'CASH'){
            orderPayment.payment_method = 'OFFICE'
          }else{
            orderPayment.payment_method = pay.payment_method;
          }
          orderPayment.payment_reference = (!CheckNullOrUndefinedOrEmpty(pay.payment_reference_by_admin)) ? pay.payment_reference_by_admin :`${pay.uuid}+${orderId}`;
          orderPayment.doc = !pay.payment_photo_key ? null : pay.payment_photo_key;
          orderPayment.action = pay.verified;
          orderPayment.payment_option = !paymentOption ? null : paymentOption;

          if (!pay.verified) {
            orderPayment.status = "Pending";
            orderPayment.date = "";
          } else {
            orderPayment.status = "Verified";
            orderPayment.date = formatDate(pay.updated_at, "dd/MM/yyyy", "en-US");
          }
          ordersTablePayments.push(orderPayment);
        }
      });
      return ordersTablePayments;
    }
  }

  getOrderCountData(): Observable<any> {
    return this.api.get(countOrder);
  }

  renderCustomerAddress(customerAddr) {

    if (!isNullOrUndefined(customerAddr)) {
      let customerAddress = new CustomerAddress();

      customerAddress.id = customerAddr.id;
      customerAddress.address_line1 = customerAddr.address_line1;
      customerAddress.address_line2 = customerAddr.address_line2;
      customerAddress.address_line3 = customerAddr.address_line3;
      customerAddress.postal_code = customerAddr.postal_code;
      customerAddress.state_code = customerAddr.state_code;
      customerAddress.country_code = customerAddr.country_code;

      return customerAddress;
    }
  }


  getPreSignedUrl(fileName: string, fileType: string) {
    const bodyObj = { name: fileName, type: fileType };
    return this.api.post(saveOrderImage, bodyObj).pipe(retry(3), catchError(this.errorHandler));

  }

  uploadOrderImage(url: string, contentType: string, file) {
    const headers = new HttpHeaders({ 'Content-Type': contentType });
    return this.http.put<any>(url, file, { headers: headers, reportProgress: true }).pipe(retry(3), catchError(this.errorHandler));
  }

  private errorHandler(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occured:', error.error.message);
    }
    else {
      console.error(
        `Back-end return code: ${error.status}\n` +
        `Body content: ${error.status}`
      );
    }

    return throwError(error.message || 'Server Error');
  }




  /**
  * render OrderPayment
  * @param payments
  */
  renderOrderRecurringPayment(order_id, payments) {
    let ordersRecurringPayments = [];
    if (!isNullOrUndefined(payments) && payments.length > 0) {
      payments.forEach((pay) => {

        if (pay.is_recurring_payment === true || pay.is_deposit_payment === true) {
          let orderRecuringPayment = new OrderRecurringPayment();
          orderRecuringPayment.id = pay.id;
          orderRecuringPayment.orderId = order_id;
          orderRecuringPayment.isRecurringPayment = true;
          orderRecuringPayment.paymentCurrency = pay.payment_currency;
          orderRecuringPayment.paymentAmount = pay.payment_amount;
          orderRecuringPayment.displayAmount = formatCurrency(orderRecuringPayment.paymentAmount, "en-US", orderRecuringPayment.paymentCurrency + ' ', "code", "0.2-2");
          // if (!pay.payment_status) {
          //   orderRecuringPayment.paymentStatus = 'Pending';
          //   orderRecuringPayment.updatedAt = '';
          // }
          // else {
          //   orderRecuringPayment.paymentStatus = pay.payment_status.toUpperCase();
          //   orderRecuringPayment.updatedAt = moment(pay.updated_at).local().format('DD-MM-YYYY');
          // }
          orderRecuringPayment.verified = pay.verified;
          orderRecuringPayment.updatedAt = moment(pay.updated_at).local().format('DD-MM-YYYY');
          orderRecuringPayment.createdAt = moment(pay.created_at).local().format('DD-MM-YYYY');

          // status
          const payment_response = pay.payment_response;
          if (pay.is_deposit_payment === true && pay.payment_status === 'success') {
            orderRecuringPayment.paymentStatus = "DEPOSIT - SUCCESS";
          } else if (pay.is_deposit_payment === true && pay.payment_status !== 'success') {
            orderRecuringPayment.paymentStatus = "DEPOSIT - FAILED";
          } else if (payment_response && payment_response.PaymentId === "55" && pay.payment_status === 'success') {
            orderRecuringPayment.paymentStatus = "AUTHORISED - SUCCESS";
          } else if (payment_response && payment_response.PaymentId === "55" && pay.payment_status !== 'success') {
            orderRecuringPayment.paymentStatus = "AUTHORISED - FAILED";
          } else if (payment_response && payment_response.PaymentId !== "55" && pay.payment_status === 'success') {
            orderRecuringPayment.paymentStatus = "SUCCESS";
          } else if (payment_response && payment_response.PaymentId !== "55" && pay.payment_status !== 'success') {
            orderRecuringPayment.paymentStatus = "FAILED";
          }

          ordersRecurringPayments.push(orderRecuringPayment);
        }
      });
    }

    ordersRecurringPayments.sort((a, b) => (a.id > b.id) ? 1 : -1);

    for (let i = 0; i < ordersRecurringPayments.length; i++) {
      ordersRecurringPayments[i].recurringRank = i + 1;
    }
    return ordersRecurringPayments;
  }


  renderOrderWithRecurringPayments(data) {

    if (data.code === 200 && !isNullOrUndefined(data.data)) {
      let order = new OrderWithRecurringPayments();
      // order.id = data.data.id;
      order.id = data.data.order_id_tmm;
      order.customerId = data.data.customer_id;
      order.advised_by_customer_id = data.data.customer.advised_by_customer_id;
      order.advisorCustomer = this.renderAdvisor(data.data.advisor_customer);
      order.createdAt = data.data.created_at;
      order.updatedAt = data.data.updated_at;
      order.entityId = data.data.entity_id;
      order.customerInformation = this.renderCustomerInformation(
        data.data.customer_information
      );
      order.customerAddr = this.renderCustomerAddress(data.data.customer.address);

      // get list Recurring Payment
      order.recurringPayments = this.renderOrderRecurringPayment(order.id, data.data.payments);

      return order;

    }



  }

  getInstallmentByID(id): Observable<any> {
    let url = getInstallmentById.replace("installmentId", id);
    return this.api.get(url).pipe(
      map((data) => {
        if (data.code === 200 && !isNullOrUndefined(data.data)) {
          return data.data;
        }
      }),
      catchError((data) => throwError(data))
    );
  }

  renderPaymentInstallment(data){
    if (!isNull(data) && !isUndefined(data)) {
      // console.log(data);
      let installment = new PaymentInstallment();
      installment.id = data.id;
      installment.frequency = data.frequency;
      installment.installment_amount = data.installment_amount;
      installment.installment_status = data.installment_status;
      installment.number_of_payments = data.number_of_payments;
      installment.subscription_status = data.subscription_status;
      installment.successful_number_of_payments = data.successful_number_of_payments;

      return installment;

    }
  }

  updateHistoryShippingLabel(orderId){
    let param = new HttpParams();
    if(orderId !== null && orderId !== undefined){
      param = param.append("order_id", orderId);
    }
    if(this.api.isEnable()){
      return this.http.post<any>(updateHistoryDownloadShippingLabel, " " ,{ headers: this.api.headers, params: param }).pipe(
        map(data => {
          return data;
        })
      )

    }
  }

  lockOrder(formLockOrder){
    return this.api.post(lockOrderApi , formLockOrder);
  }

  checkLockOrder(orderId): Observable<any>{
    let param = new HttpParams();
    if(orderId !== null && orderId !== undefined){
      param = param.append("order_id", orderId);
    }
    if(this.api.isEnable()){
      let checkLock: number;
      return this.http.get<any>(checkLockOrderApi, { headers: this.api.headers, params: param }).pipe(
        map(data => {
          if(data.code === 200){
            checkLock = 1
          }else if(data.code === 201){
            checkLock = 2
          }else if(data.code === 202){
            checkLock = 3
          }
          return checkLock;
        })
      )

    }
  }

  checkOrderStatus(orderId){
    let param = new HttpParams();
    if(orderId !== null && orderId !== undefined){
      param = param.append("order_id", orderId);
    }
    if(this.api.isEnable()){

      return this.http.get<any>(checkOrderStatus, { headers: this.api.headers, params: param }).pipe(
        map(data => {
          if(data.code ===200){
            return data.data.status
          }
        })
      )

    }
  }

  changeOrderPage(status , orderId, page , pageCheck?){
    if(pageCheck !== status){
      if(status === 'TO_PAY'){
        this.router.navigate(['direct-sales/orders/to-pay'], { queryParams: { id: orderId , page: page } });
      }
      if(status === 'TO_VERIFY'){
        this.router.navigate(['direct-sales/orders/to-verify'], { queryParams: { id: orderId , page: page } });
      }
      if(status === 'TO_SHIP'){
        this.router.navigate(['direct-sales/orders/to-ship'], { queryParams: { id: orderId , page: page } });
      }
      if(status === 'TO_RECEIVE'){
        this.router.navigate(['direct-sales/orders/to-receive'], { queryParams: { id: orderId , page: page } });
      }
      if(status === 'TO_UNBOX'){
        this.router.navigate(['direct-sales/orders/to-unbox'], { queryParams: { id: orderId , page: page } });
      }
      if(status === 'TO_HOST'){
        this.router.navigate(['direct-sales/orders/to-host'], { queryParams: { id: orderId , page: page } });
      }
      if(status === 'COMPLETED'){
        this.router.navigate(['direct-sales/orders/completed'], { queryParams: { id: orderId , page: page } });
      }
      if(status === 'CANCELLED'){
        this.router.navigate(['direct-sales/orders/cancelled'], { queryParams: { id: orderId , page: page } });
      }

    }else {
      return ;
    }
  }

  searchOrderInAllData(order_id_tmm){
    let param = new HttpParams();
    param = param.append("order_id", order_id_tmm);

    if(this.api.isEnable()){

      return this.http.get<any>(searchOrderInAllData, { headers: this.api.headers, params: param }).pipe(
        map(data => {
          // console.log(data)
          if(data.code ===200){
            return data.data
          }else{
            return null;
          }
        })
      )

    }
  }

  //EditPayment
  editPaymentByAdmin(formUpdate, order_id){
    let param = new HttpParams();
    param = param.append("order_id", order_id);

    if(this.api.isEnable()){
      return this.http.put<any>(EditPayment, formUpdate ,{ headers: this.api.headers, params: param })
    }
  }

  sendDataAxway(order_id , prevStatus , status){
    let param = new HttpParams();
    param = param.append("order_id", order_id);
    param = param.append("status", status);
    param = param.append("prevStatus", prevStatus);
    if(this.api.isEnable()){
      return this.http.put<any>(SendDataAxWayApi, '' ,{ headers: this.api.headers, params: param })
    }
  }

  //Update Customer Information
  updateCustmerInformation(customerInformation , id)
    {
        var url = updateCustomerInformationApi.replace(':id',id)
        return this.api.put(url,customerInformation);
    }

   //Download Invoive
   downloadInvoice(uuid): Observable<any>{
    let url = DownloadInvoiceApi.replace(":uuid", uuid);
      return this.api.get(url).pipe(
        map(data => {
            return data;
    })
    )
  }
}

export class Order {
  id: string;
  orderIdTmm: number;
  advised_by_customer_id: number;
  customerId: number;
  isDeleted: boolean;
  subtotal: any;
  shippingFee: any;
  tax: any;
  createdAt: string;
  updatedAt: string;
  advisorCustomer: AdvisorCustomer;
  entityId: number;
  status: string;
  totalAmount: any;
  shipping: Shipping;
  listProduct: Array<Product>;
  deliveryAddress: DeliveryAddress;
  customerInformation: CustomerInformation;
  orderTableVerify: Array<VerifyOrder>;
  pendingVerified: number = 0;
  verified: number = 0;
  history: OrderHistory[];
  payment: OrderPayment[];
  pendingPayment: number = 0;
  paid: number = 0;
  currency: any;
  payment_option: string;
  customer: Customer;
  need_unbox: boolean;
  need_host : boolean;
  properties: any;
  paymentInstallment : Object;
  listFullProduct: Array<Product>;
  checkOrderLock: boolean;
  dataLock: DataLock;
  is_need_advisor : boolean;
  remark_advisor_id : string;
  remark_advisor_name : string;
  remark_advisor_phone : string;
  is_naep_order : boolean;
  arrPaymentBank: Array<CardBank> = [];
  uuid: string;
}

export class DataLock{
  id: number;
  time: string;
  adminEmail: string;
}
export class AdvisorCustomer {
  id: number;
  entityId: number;
  publicId: string;
  firtName: string;
  lastName: string;
  phoneDialCode: number;
  phoneNumber: number;
  email: string;
  designation: string;
  languageCode: string;
  password: string;
  isActive: boolean;
  isRegistered: boolean;
  createdAt: string;
  updatedAt: string;
  registeredAt: string;
  advisorIdNumber: string;
  advisedByCustomerId: number;
  teamLeaderCustomerId: number;
  branchManagerCustomerId: number;
  profilePhotoId: string;
  recruiterId: number;
  preferredName: string;
  salt: string;
  profilePhotoKey: string;
}

export class PaymentInstallment {
  id: number;
  frequency : string;
  installment_amount: string;
  number_of_payments: number;
  subscription_status: string;
  installment_status: string;
  successful_number_of_payments: string;
}
export class DeliveryAddress {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneDialCode: number;
  phoneNumber: number;
  addressLine1: string;
  addressLine2: string;
  addressLine3: string;
  postalCode: string;
  stateCode: string;
  countryCode: string;
  createdAt: string;
  updatedAt: string;
}

export class OrderHistories {
  id: string;
  action: string;
  createdAt: Date;
}

export class CustomerInformation {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneDialCode: number;
  phoneNumber: number;
  createdAt: string;
  updatedAt: string;
  address_line1: string;
  address_line2: string;
  address_line3: string;
  postal_code: string;
  state_code: string;
  country_code: string;
}

export class Shipping {
  id: string;
  shippingMethod: string;
  customerSelectedShippingDate: string;
  shipDate: string;
  receiveDate: string;
  customerNotes: string;
  createdAt: string;
  updatedAt: string;
  pickupAddressId: string;
  pickupDateTime: string;
  shippingAgentId: string;
  shipmentId: string;
  shipmentLabel: any;
  shippingStatus: any;
  shipping_location_color : string;
  shipping_location_full: {};
  shipping_location_name : string;
  isManualShipping: boolean;
  sdId: number;
  specialDelivery: any;
}

export class OrderHistory {
  id: number;
  action: string;
  appUserId: string;
  createdAt: string;
  appUser: string;
  email: string;
  comment: string;
  comment_receive: string;
  image: string;
  shipping_method : string;
  shipping_note : string;
}

export class OrderPayment {
  id: string;
  orderId: string;
  paymentAgentServiceId: string;
  paymentCurrency: string;
  paymentAmount: number;
  displayAmount: any;
  paymentMethod: string;
  paymentGateway: string;
  paymentReference: string;
  payment_response: any;
  paymentStatus: string;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
  payment_option: string;
  isDepositPayment: boolean;
}

export class CardBank{
  cardType: string;
  acct: string;
  refNo: string;
  auth: string;
}

export class VerifyOrder {
  id: any;
  payment_currency: string;
  payment_amount: number;
  display_amount: any;
  payment_method: string;
  payment_reference: string;
  status: string;
  doc: string;
  action: boolean;
  date: string;
  payment_gateway: string;
  payment_option: string;
}



export class OrderWithRecurringPayments {
  id: string;
  customerId: number;
  advised_by_customer_id: number;
  advisorCustomer: AdvisorCustomer;
  createdAt: string;
  updatedAt: string;
  entityId: number;
  customerInformation: CustomerInformation;
  customerAddr: CustomerAddress;
  recurringPayments: OrderRecurringPayment[];
  currency: any;

}

export class CustomerAddress {

  id: number;
  address_line1: string;
  address_line2: string;
  address_line3: string;
  postal_code: string;
  state_code: string;
  country_code: string;

}



export class OrderRecurringPayment {

  id: string;
  orderId: string;
  isRecurringPayment: boolean;
  paymentCurrency: string;
  paymentAmount: number;
  displayAmount: string;
  paymentStatus: string;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
  recurringRank: number;

}

export class Customer {
  id: number;
  uuid: string;
  customerName: string;
  email: string;
  phoneNumber: string;
  address: DeliveryAddress;
}

export class UpdateFormPayment{
  payment_id: number;

  type: string;

  method: string;

  paymentRef: string;

  comment: string;
}
