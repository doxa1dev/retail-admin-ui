import { Component, OnInit } from '@angular/core';
import { Properties, Product } from 'app/core/models/product.model';
import { formatDate, Location } from '@angular/common';
import { OrdersService, Order } from 'app/core/service/orders.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductShippingStatus } from 'app/core/models/product-shipping-status.model';
import { isNullOrUndefined } from 'util';

import HelperFn from '../../helper/helper-fn';
import { environment } from 'environments/environment';
import { CheckNullOrUndefinedOrEmpty } from 'app/core/utils/common-function';

@Component({
  selector: 'app-cancelled-action',
  templateUrl: './cancelled-action.component.html',
  styleUrls: ['./cancelled-action.component.scss']
})
export class CancelledActionComponent implements OnInit {
  helperFn = new HelperFn();
  order = "";
  order_id;
  orderAt: Date;
  namePage = "Cancelled";
  currency: any;
  storageUrl = environment.storageUrl;
  displayAddress: string;
  displayStateCountry: string;
  /** payment method */
  methodPaymentList = new Array<String>();
  advisorImage: any;
  page: number;
  constructor(
    private _location: Location,
    private _orderService: OrdersService,
    private router: Router, private _route: ActivatedRoute,
  ) { }
  fullOrder: Order;
  listProduct: Array<Product> = [];
  listHistories: Array<OrderHistories> = [];
  isShippingSelfCollect: boolean;
  isShippingAgentSelected: boolean;
  shippingAgent: string;
  isShippingAgentIntegrated: boolean;
  shippingLabels: any;
  productIdToNameMap: any;
  shippingStatusTableData: ProductShippingStatus[];
  addressCustomer: string;
  stateCountryCustomer: string;
  style_shipping_location : string;
  isRecurringPayment : boolean ;

  ngOnInit(): void {
    this._route.queryParams.subscribe(params => {
      this.order = params.id;
      this.order_id = this.order.replace("#", '');
      this.page = params.page;
    });
    this._orderService.checkOrderStatus(this.order_id).subscribe(data=>{
      this._orderService.changeOrderPage(data , this.order_id , this.page, 'CANCELLED')
    })
    this.getOrder(this.order_id);
  }

  back() {
    this.router.navigate(["/direct-sales/orders"], { state: { selectTab: 7 , page: this.page } });
  }

  nextViewCustomer() {
    this.router.navigate(["/direct-sales/customers/details"], { queryParams: { id: this.fullOrder.customer.uuid }});
  }

  getOrder(orderId): Promise<any> {
    return new Promise(resolve => {
      this._orderService.getOrderbyOrderId(orderId).subscribe(respone => {

        if (!isNullOrUndefined(respone.data.payments) && respone.data.payments.length != 0) {

          let methodList = [];

          respone.data.payments.forEach(element => {
            if (!methodList.includes(element.payment_method)&& element.payment_status==='success') {
              methodList.push(element.payment_method);
            }
            if(!CheckNullOrUndefinedOrEmpty(element.is_recurring_payment)) {
              this.isRecurringPayment = true;

            }
          });

          methodList.forEach(element => {

            if (element === "TT") {
              this.methodPaymentList.push("Pay by Telegraphic Transfer (TT)");
            } else if (element === "OFFICE" || element === 'CASH') {
              this.methodPaymentList.push("Pay at Thermomix Office");
            } else if (element === "CREDIT_CARD") {
              this.methodPaymentList.push("Pay with Credit/Debit Card");
            } else if (element === "ONLINE_BANKING") {
              this.methodPaymentList.push("Pay at Online Banking");
            } else if (element === 'EWALLET'){
              this.methodPaymentList.push("Pay at e-Wallets");
            } else if (element === 'CHECK'){
              this.methodPaymentList.push("Pay by cheque");
            }
          });
        }

        this.fullOrder = this._orderService.renderDataOrder(respone,true);
        if(!CheckNullOrUndefinedOrEmpty(this.fullOrder.shipping.shipping_location_color))
        {
          this.style_shipping_location = `border-left: 20px solid ${this.fullOrder.shipping.shipping_location_color};`
        }else{
          this.style_shipping_location = `border-left: 20px solid white;`
        }


        if (!isNullOrUndefined(this.fullOrder.advisorCustomer)) {
          //check null image
          if (isNullOrUndefined(this.fullOrder.advisorCustomer.profilePhotoKey)) {
            this.advisorImage = "assets/icons/doxa-icons/UserMenu.svg";
          } else {
            this.advisorImage = this.storageUrl + this.fullOrder.advisorCustomer.profilePhotoKey;
          }
        }

        this.listProduct = this.fullOrder.listProduct;
        if (this.fullOrder.shipping.shippingMethod === 'BY_COURRIER' && this.fullOrder.shipping.shippingAgentId != null) {
          this.isShippingAgentSelected = true;
          // this.shippingAgent = this.fullOrder.shipping.shippingStatus.shippingAgent;
          // this.isShippingAgentIntegrated = this.fullOrder.shipping.shippingStatus.isIntegrated;
          // this.shippingLabels = this.fullOrder.shipping.shipmentLabel !== null ? this.fullOrder.shipping.shipmentLabel.shipmentLabels : null;
          // this.shippingStatusTableData = this.createShippingStatusTableRows(this.fullOrder.shipping.shippingStatus.shippingStatuses);
          if (this.fullOrder.shipping.shippingStatus.shippingAgent === 'QXPRESS') {
            this.shippingStatusTableData = this.createShippingQXPressStatusTableRows(this.fullOrder.shipping.shippingStatus.shippingStatuses);
          } else {
            this.shippingStatusTableData = this.createShippingStatusTableRows(this.fullOrder.shipping.shippingStatus.shippingStatuses);
          }
        }
        else if (this.fullOrder.shipping.shippingMethod === 'SELF_COLLECT') {
          this.isShippingSelfCollect = true;
        }
        this.currency = !this.fullOrder.currency ? '' : this.fullOrder.currency;
        this.displayAddress = this.helperFn.setDisplayAddressLine(this.fullOrder.deliveryAddress.addressLine1, this.fullOrder.deliveryAddress.addressLine2, this.fullOrder.deliveryAddress.addressLine3, this.fullOrder.deliveryAddress.postalCode);
        this.displayStateCountry = this.helperFn.setStateCountryLine(this.fullOrder.deliveryAddress.stateCode, this.fullOrder.deliveryAddress.countryCode);

        if (!isNullOrUndefined(this.fullOrder.customer.address)) {
          this.addressCustomer = this.helperFn.setDisplayAddressLine(this.fullOrder.customer.address.addressLine1, this.fullOrder.customer.address.addressLine2, this.fullOrder.customer.address.addressLine3, this.fullOrder.customer.address.postalCode);
          this.stateCountryCustomer = this.helperFn.setStateCountryLine(this.fullOrder.customer.address.stateCode, this.fullOrder.customer.address.countryCode);
        } else {
          this.addressCustomer = "";
          this.stateCountryCustomer = "";
        }
      });
    });
  }

  private createShippingStatusTableRows(shippingStatuses) {
    this.productIdToNameMap = {};
    this.listProduct.forEach(product => {
      this.productIdToNameMap[product.id] = product.productName;
      if(product.order_line_online_bank_transfer_gifts.length > 0){
        product.order_line_online_bank_transfer_gifts.forEach(bank_transfer_gifts => {
          this.productIdToNameMap[bank_transfer_gifts.online_bank_transfer_gift_product_id ] =bank_transfer_gifts.online_bank_transfer_gift_product_name;
        });
      }
      // if(product.order_line_single_paymt_gifts.length > 0 ){
      //   this.productIdToNameMap[product.order_line_single_paymt_gifts[0].single_paymt_gift_product_id] = product.order_line_single_paymt_gifts[0].single_paymt_gift_product_name;
      // }
      if(product.order_line_single_paymt_gifts.length > 0 ){
        product.order_line_single_paymt_gifts.forEach(single_paymt_gifts =>{
          this.productIdToNameMap[single_paymt_gifts.single_paymt_gift_product_id ] =single_paymt_gifts.single_paymt_gift_product_name;
        });
      }
    });
    // this.listProduct.forEach(product => {
    //   this.productIdToNameMap[product.id] = product.productName;
    // });
    const shippingStatusData = [];
    shippingStatuses.forEach(status => {
      const productIdAndQtyArr = status.productIdAndQty;
      const shippingLatestEvent = (status.events.length > 0) ? status.events[status.events.length - 1] : null;
      if (productIdAndQtyArr) {
        productIdAndQtyArr.forEach(obj => {
          shippingStatusData.push(new ProductShippingStatus(
            status.shipmentPieceID,
            status.trackingID,
            this.productIdToNameMap[obj.id],
            obj.qty,
            shippingLatestEvent !== null ? shippingLatestEvent.description : '',
            shippingLatestEvent !== null ? shippingLatestEvent.dateTime : ''));
        });
      }
      else {
        shippingStatusData.push(new ProductShippingStatus(
          status.shipmentPieceID,
          status.trackingID,
          'N/A',
          'N/A',
          'Non-Integrated',
          'N/A'));
      }
    });

    return shippingStatusData;
  }

  private createShippingQXPressStatusTableRows(shippingStatuses): ProductShippingStatus[] {
    this.productIdToNameMap = {};
    this.listProduct.forEach(product => {
      this.productIdToNameMap[product.id] = product.productName;
      if(product.order_line_online_bank_transfer_gifts.length > 0){
        product.order_line_online_bank_transfer_gifts.forEach(bank_transfer_gifts => {
          this.productIdToNameMap[bank_transfer_gifts.online_bank_transfer_gift_product_id ] =bank_transfer_gifts.online_bank_transfer_gift_product_name;
        });
      }
      // if(product.order_line_single_paymt_gifts.length > 0 ){
      //   this.productIdToNameMap[product.order_line_single_paymt_gifts[0].single_paymt_gift_product_id] = product.order_line_single_paymt_gifts[0].single_paymt_gift_product_name;
      // }
      if(product.order_line_single_paymt_gifts.length > 0 ){
        product.order_line_single_paymt_gifts.forEach(single_paymt_gifts =>{
          this.productIdToNameMap[single_paymt_gifts.single_paymt_gift_product_id ] =single_paymt_gifts.single_paymt_gift_product_name;
        });
      }
    });
    let index = 0
    const shippingStatusData = [];
    shippingStatuses.forEach(status => {
      let quantity = 0
      index = index + 1
      const productIdAndQtyArr = status.productIdAndQty;
      if (productIdAndQtyArr) {
        if (productIdAndQtyArr) {
          productIdAndQtyArr.forEach(obj => {
            shippingStatusData.push(new ProductShippingStatus(
              index.toString(),
              status.trackingID,
              this.productIdToNameMap[obj.productId],
              obj.quantity,
              status.status,
              formatDate(status.registeredDate, "dd/MM/yyyy", "en-US")))
            });
        }
      }
      else {
        shippingStatusData.push(new ProductShippingStatus(
          status.shipmentPieceID,
          status.trackingID,
          'N/A',
          'N/A',
          status.status,
          'N/A'));
      }
    })
    return shippingStatusData;
  }
}
export class OrderHistories {
  id: string;
  action: string;
  createdAt: Date;
}
