import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import * as jwt_decode from 'jwt-decode';
import { formatCurrency } from '@angular/common';
import { isUndefined } from 'lodash';
import { CheckNullOrUndefinedOrEmpty } from 'app/core/utils/common-function';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent implements OnChanges {

  constructor() { }
  @Input() orderDetail

  listProduct: Array<ProductDetail> = [];
  product: ProductDetail;

  listPayment: Array<PaymentDetail> = [];
  payment1: PaymentDetail;
  payment2: PaymentDetail;

  informationInvoice = new CustomerInfo();

  decoded: any;
  entityId : number;

  totalAmount: string;
  totalPurchasePrice: string ='12,3456'
  balance: string = '0.00';
  gst: string = '123'
  instalmentRate : string ='0.00';
  handlingCharge : string ='0.00';
  depositCollected : string = '0.00';
  issuedDate: string = '8/9/2020 12:45';
  note: string = '';
  cardType: string = 'VISA';
  acct: string = '2121212xxxx22221';
  refNo: string = 'asdfstgweiuderuihew-112122';
  auth: string = '123456';
  currency: string;
  page: number = 1;
  checkBreakPoint: boolean = false;

  arrBank = [];

  totalPaymentSG : number = 0;
  //MY
  noOfInstalments : number = 0;
  monthlyInstalment : number = 0;

  newPageBreak: boolean = false;
  newPageBreak2: boolean = false;
  checkEaep: boolean;
  checkEnv: boolean = false;
  ngOnChanges(changes: SimpleChanges): void {
    if(!isUndefined(changes.orderDetail) && changes.orderDetail !== null){
      this.orderDetail = changes.orderDetail.currentValue
    }
    // console.log(this.orderDetail)
    let token = localStorage.getItem('token');
    if (!isUndefined(token) && token !== null){
        this.decoded = jwt_decode(token);
        if(!isUndefined(this.decoded) && this.decoded !== null){
          this.entityId = Number(this.decoded.entity_id);
          if(this.entityId == 2){
            this.checkEnv = false
          }else{
            this.checkEnv = true
          }
        }
    }

    if(!CheckNullOrUndefinedOrEmpty(this.orderDetail)){
      this.checkEaep = this.orderDetail.is_naep_order
      this.listProduct = [];
      this.arrBank = (this.entityId == 2) ? this.orderDetail.arrPaymentBank: [];
      if((!this.orderDetail.is_naep_order)  && !CheckNullOrUndefinedOrEmpty(this.orderDetail.listFullProduct) ){
        this.orderDetail.listFullProduct.forEach(element => {
          let product = new ProductDetail();
          product.sku = element.sku ;
          product.quantity = element.quantity;
          product.description = element.productName;
          product.unitPrice = formatCurrency(element.promotionalPrice,"en-US", " ", "code", "0.2-2");
          product.amount = formatCurrency(Number(element.quantity) * Number( element.promotionalPrice.split(',').join("")),"en-US", " ", "code", "0.2-2");
          this.listProduct.push(product)

          // this.listProduct.push(product)
          if(!CheckNullOrUndefinedOrEmpty(element.order_line_single_paymt_gifts)){
            let single_paymt_gifts = [];
            element.order_line_single_paymt_gifts.forEach(gift => {
              if (!single_paymt_gifts.includes(gift.single_paymt_gift_product_id)) {
                single_paymt_gifts.push(gift.single_paymt_gift_product_id);
              }
            });
            single_paymt_gifts.forEach(e => {
              let itemGift = element.order_line_single_paymt_gifts.filter(obj =>{ return obj.single_paymt_gift_product_id === e});
              let product2 = new ProductDetail();
              product2.sku = (!CheckNullOrUndefinedOrEmpty(itemGift[0]) && !CheckNullOrUndefinedOrEmpty(itemGift[0].product)) ? itemGift[0].product.sku : " "
              product2.quantity = itemGift.length;
              product2.description = (!isUndefined(itemGift[0]) && itemGift[0] !== null) ? itemGift[0].single_paymt_gift_product_name : " "
              product2.unitPrice = '0.00';
              product2.amount = '0.00';
              this.listProduct.push(product2)
            });
          }

          // if(!isUndefined(element.order_line_single_paymt_gifts) && element.order_line_single_paymt_gifts !== null && element.order_line_single_paymt_gifts.length > 0){
          //     let product1 = new ProductDetail();
          //     product1.sku = '';
          //     product1.quantity = element.order_line_single_paymt_gifts.length;
          //     product1.description = element.order_line_single_paymt_gifts[0].single_paymt_gift_product_name;
          //     product1.unitPrice = '0.00';
          //     product1.amount = '0.00';
          //     this.listProduct.push(product1)
          // }

          // if(!isUndefined(element.order_line_online_bank_transfer_gifts) && element.order_line_online_bank_transfer_gifts !== null && element.order_line_online_bank_transfer_gifts.length > 0){
          //   let giftList = [];
          //   element.order_line_online_bank_transfer_gifts.forEach(gift => {
          //     if (!giftList.includes(gift.online_bank_transfer_gift_product_id)) {
          //       giftList.push(gift.online_bank_transfer_gift_product_id);
          //     }
          //   });
          //   giftList.forEach(e => {
          //     let itemGift = element.order_line_online_bank_transfer_gifts.filter(obj =>{ return obj.online_bank_transfer_gift_product_id === e});
          //     let product2 = new ProductDetail();
          //     product2.sku = '';
          //     product2.quantity = itemGift.length;
          //     // product2.description = e.online_bank_transfer_gift_product_name;
          //     product2.description = (!isUndefined(itemGift[0]) && itemGift[0] !== null) ? itemGift[0].online_bank_transfer_gift_product_name : " "
          //     product2.unitPrice = '0.00';
          //     product2.amount = '0.00';
          //     this.listProduct.push(product2)
          //   });
          // }
        });

      }else if(this.orderDetail.is_naep_order  && !CheckNullOrUndefinedOrEmpty(this.orderDetail.listProduct)){
        this.orderDetail.listProduct.forEach(element => {
          if(element.is_deposit || element.is_kit){
            let product = new ProductDetail();
            product.sku = element.sku ;
            product.quantity = element.quantity;
            product.description = element.productName;
            product.remarks = (element.is_deposit) ? 'DEPOSIT' : '';
            product.unitPrice = formatCurrency(element.price,"en-US", " ", "code", "0.2-2");
            product.amount = formatCurrency(Number(element.quantity) * Number( element.promotionalPrice.split(',').join("")),"en-US", " ", "code", "0.2-2");
            this.listProduct.push(product)

          }
        });
      }
    }

    if(this.orderDetail !== null && !isUndefined(this.orderDetail)){
      // console.log(this.orderDetail)
      this.informationInvoice.orderNumber = this.orderDetail.orderIdTmm;
      this.currency = (this.orderDetail.currency === "MYR") ? "RM" : this.orderDetail.currency;
      this.informationInvoice.orderDate = this.orderDetail.createdAt;
      this.balance = formatCurrency(this.orderDetail.totalAmount,"en-US", " ", "code", "0.2-2");
      this.totalAmount =  formatCurrency(this.orderDetail.totalAmount,"en-US", " ", "code", "0.2-2");
      this.gst = formatCurrency((Number(this.orderDetail.totalAmount.split(',').join("")) - (Number(this.orderDetail.totalAmount.split(',').join(""))/1.07)),"en-US", " ", "code", "0.2-2");
      if(!isUndefined(this.orderDetail.shipping) && this.orderDetail.shipping !== null){
        this.informationInvoice.shippingMethod = this.orderDetail.shipping.shippingMethod.replace('_', ' ').replace('R', '');
      }
      if(this.orderDetail.advisorCustomer !== null && !isUndefined(this.orderDetail.advisorCustomer)){
        this.informationInvoice.advisorId = this.orderDetail.advisorCustomer.advisorIdNumber
      }
      // if(this.entityId == 1){
      //   this.informationInvoice.locationWH = 'SINGAPORE WH';
      // }else if(this.entityId == 2){
      //   this.informationInvoice.locationWH = 'MALAYSIA WH';
      // }
      if(this.orderDetail.shipping !== null && this.orderDetail.shipping !== undefined){
        this.informationInvoice.locationWH = this.orderDetail.shipping.shipping_location_name
      }
      // console.log(this.orderDetail.customerInformation)

      // if(this.orderDetail.customerInformation !== null && !isUndefined(this.orderDetail.customerInformation)){
      //   this.informationInvoice.name = this.orderDetail.customerInformation.firstName + ' ' + this.orderDetail.customerInformation.lastName;
      //   this.informationInvoice.phoneNumber = '('+ this.orderDetail.customerInformation.phoneDialCode + ') '+ this.orderDetail.customerInformation.phoneNumber;
      //   this.informationInvoice.postalCode = this.orderDetail.customer.address.postalCode;
      //   this.informationInvoice.address1 = this.orderDetail.customer.address.addressLine1;
      //   this.informationInvoice.address2 = this.orderDetail.customer.address.addressLine2;
      //   this.informationInvoice.address3 = this.orderDetail.customer.address.addressLine3;
      //   this.informationInvoice.email = this.orderDetail.customer.email;
      //   this.informationInvoice.stateCountry = this.stateCode(this.orderDetail.customer.address.stateCode) + ' , ' + this.countryCode(this.orderDetail.customer.address.countryCode);
      // }

      if(this.orderDetail.payment !== null && !isUndefined(this.orderDetail.payment) && this.orderDetail.payment.length > 0){
        this.listPayment = [];
        this.totalPaymentSG = 0;
        this.orderDetail.payment.forEach(item => {
          if(item.paymentStatus === 'SUCCESS'){
            let payment = new PaymentDetail();
            // payment.type = 'DEPOSIT';
            this.totalPaymentSG += Number(item.paymentAmount.split(',').join(""))
            if(item.isDepositPayment === true){
              payment.type = "DEPOSIT";
              this.depositCollected = formatCurrency((Number(this.depositCollected.split(',').join(""))+Number(item.paymentAmount.split(',').join(""))),"en-US", " ", "code", "0.2-2");
              this.balance = formatCurrency(Number(this.totalAmount.split(',').join("")) - Number(this.depositCollected.split(',').join("")),"en-US", " ", "code", "0.2-2") ;
            }else {
              payment.type = item.payment_option === 'FUL' ? 'FULL' : item.payment_option;
              this.balance = formatCurrency(Number(this.totalAmount.split(',').join("")) - Number(this.totalPaymentSG),"en-US", " ", "code", "0.2-2")
            }
            if(item.paymentMethod === 'CASH'){
              payment.paymentMethod = 'OFFICE'
            }else{
              payment.paymentMethod = item.paymentMethod.replace('_', ' ');
            }
            payment.bank = this.bank(item.paymentGateway);
            payment.paymentReference = item.paymentReference;
            payment.paymentAmount = formatCurrency(item.paymentAmount,"en-US", " ", "code", "0.2-2");
            this.listPayment.push(payment);
          }
        });
      }

      if(this.orderDetail.paymentInstallment !== null && !isUndefined(this.orderDetail.paymentInstallment)){
        this.noOfInstalments = this.orderDetail.paymentInstallment.number_of_payments;
        this.monthlyInstalment = Number(this.balance)/Number(this.noOfInstalments);
      }
    }
    // this.totalAmount = '2,000';

    if(this.listProduct.length + this.listPayment.length >= 20){
      this.page = 2;
      this.checkBreakPoint = true;
    }else if(this.arrBank.length > 2 ){
      this.page = 2;
    }
    if((this.listProduct.length ==3 && this.arrBank.length >=2)){
      this.newPageBreak = true;
      this.page = 2;
    }else if(this.listProduct.length >=4 && this.arrBank.length >=2){
      this.newPageBreak2 = true;
      this.page = 2;
    }
  }


  stateCode(key){
    let state = {
      W: 'Kuala Lumpur',
      L: 'Labuan',
      F: 'Putrajaya',
      J: 'Johor',
      K: 'Kedah',
      D: 'Kelantan',
      M: 'Malacca',
      N: 'Negeri Sembilan',
      C: 'Pahang',
      A: 'Perak',
      R: 'Perlis',
      P: 'Penang',
      S: 'Sabah',
      Q: 'Sarawak',
      B: 'Selangor',
      T: 'Terengganu',
      SG: 'Singapore'
    }
    if(key in state){
      return state[key]
    }else{
      return ""
    }
  }

  countryCode(key){
    let country = {
      MY: 'Malaysia',
      SG: 'Singapore',
    }
    if(key in country){
      return country[key]
    }else{
      return ""
    }
  }

  bank(key){
    let bank = {
      IPAY88: 'IPAY88',
      '2C2P': '2C2P',
      MPGS : 'MPGS'
    }
    if(key in bank){
      return bank[key]
    }else{
      return ""
    }
  }
}

export class ProductDetail{
  sku: string;
  quantity: number;
  description: string;
  unitPrice: string;
  amount: string;
  remarks: string;
}

export class PaymentDetail{
  type: string;
  bank: string;
  paymentMethod: string;
  paymentReference: string;
  paymentAmount: string;
}

export class CustomerInfo{
  name: string;
  address1: string;
  address2: string;
  address3: string;
  postalCode: string;
  stateCountry: string;
  phoneNumber: string;
  orderNumber: string;
  orderDate: string;
  advisorId: string;
  locationWH: string;
  shippingMethod: string;
  email: string;
}

