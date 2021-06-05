import { Component, OnInit } from '@angular/core';
import { Properties, Product } from 'app/core/models/product.model';
import { Location, formatDate } from '@angular/common';
import { OrdersService, Order } from 'app/core/service/orders.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DialogReasonComponent } from 'app/main/_shared/dialog-reason/dialog-reason.component';
import { MatDialog } from '@angular/material/dialog';
import { ProductShippingStatus } from 'app/core/models/product-shipping-status.model';

import HelperFn from '../../helper/helper-fn';
import { environment } from 'environments/environment';
import { isNullOrUndefined } from 'util';
import { FormDataInventory } from 'app/main/direct-sales/products/inventory/create-stock/create-stock.component';
import { InventoryService } from 'app/core/service/inventory.service';
import { ShippingService } from 'app/core/service/shipping.service';
import { ConfirmDialogComponent } from 'app/main/_shared/confirm-dialog/confirm-dialog.component';
import { CreateInvoice } from '../to-ship-action/to-ship-action.component'
import { CommonDialogComponent } from 'app/main/_shared/common-dialog/common-dialog.component';
import { FormLock } from '../to-verify-action/to-verify-action.component';
import { ErrorMessageLock } from 'app/core/enum/error-message.enum';
import { CheckNullOrUndefinedOrEmpty } from 'app/core/utils/common-function';
@Component({
  selector: 'app-to-host-action',
  templateUrl: './to-host-action.component.html',
  styleUrls: ['./to-host-action.component.scss']
})
export class ToHostActionComponent implements OnInit {
  helperFn = new HelperFn();

  order = "";
  order_id;
  orderAt: Date;
  namePage = "To Host";
  currency: any;
  displayAddress: string;
  displayStateCountry: string;
  /** payment method */
  methodPaymentList = new Array<String>();
  advisorImage: any;

  constructor(
    private _location: Location,
    private _orderService: OrdersService,
    private router: Router, private _route: ActivatedRoute,
    private dialog: MatDialog,
    private _inventoryService: InventoryService,
    private shippingService: ShippingService
  ) { }

  fullOrder: Order;
  listProduct: Array<Product> = [];
  listHistories: Array<OrderHistories> = [];
  isShippingSelfCollect: boolean;
  isShippingAgentSelected: boolean;
  shippingAgent: string;
  productIdToNameMap: any;
  shippingStatusTableData: ProductShippingStatus[];
  storageUrl = environment.storageUrl;
  stateCountryCustomer: string;
  addressCustomer: string;
  allProductInventory;
  page: number;

  //LockOrder-----
  checkedLock: boolean;
  lockOrderTitle: string ;
  lockBy : string;
  lockTime: string;
  checkLock;
  style_shipping_location : string;
  isRecurringPayment : boolean ;
  uuid: string;
  invoicePdf: string;

  // -------
  ngOnInit(): void {
    this._route.queryParams.subscribe(params => {
      this.order = params.id;
      this.order_id = this.order.replace("#", '');
      this.page = params.page;
    });
    this._orderService.checkOrderStatus(this.order_id).subscribe(data=>{
      this._orderService.changeOrderPage(data , this.order_id , this.page , 'TO_HOST')
    })
    this.getOrder(this.order_id);
    this._inventoryService.getProductInventoryById(this.order_id).subscribe(data=>{
      if(!isNullOrUndefined(data)){
        this.allProductInventory = data;

      }
    });
    this._orderService.checkLockOrder(this.order_id).subscribe(data=>{
      this.checkLock = data;
    });
  }

  getOrder(orderId): Promise<any> {
    return new Promise(resolve => {
      setTimeout(() => {
        this._orderService.getOrderbyOrderId(orderId).subscribe(response => {
          this.uuid = response.data.uuid
          if (!isNullOrUndefined(response.data.payments) && response.data.payments.length != 0) {

            let methodList = [];

            response.data.payments.forEach(element => {
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

          this.fullOrder = this._orderService.renderDataOrder(response,false);
          if(!CheckNullOrUndefinedOrEmpty(this.fullOrder.shipping.shipping_location_color))
          {
            this.style_shipping_location = `border-left: 20px solid ${this.fullOrder.shipping.shipping_location_color};`
          }else{
            this.style_shipping_location = `border-left: 20px solid white;`
          }
          // Detail of Lock order--------------------
          this.checkedLock = this.fullOrder.checkOrderLock
          if(this.checkedLock){
            this.lockOrderTitle = "LOCKED"
          }else{
            this.lockOrderTitle = "LOCK ORDER"
          }
          if(this.fullOrder.dataLock !== null && this.fullOrder.dataLock !== undefined){
            this.lockBy = this.fullOrder.dataLock.adminEmail;
            this.lockTime = this.fullOrder.dataLock.time;
          }

          //----------------------------------------------
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
            this.shippingAgent = this.fullOrder.shipping.shippingStatus.shippingAgent;
            // this.shippingStatusTableData = this.createShippingStatusTableRows(this.fullOrder.shipping.shippingStatus.shippingStatuses);
            if (!CheckNullOrUndefinedOrEmpty(this.fullOrder.shipping.shippingStatus) &&
              this.fullOrder.shipping.shippingStatus.shippingAgent === 'QXPRESS' ||
              this.fullOrder.shipping.shippingStatus.shippingAgent === 'MXPRESS'
              ) {
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
      }, 500);
    });
  }

  back() {
    this.router.navigate(["/direct-sales/orders"], { state: { selectTab: 5 , page : this.page } });
  }

  nextViewCustomer() {
    this.router.navigate(["/direct-sales/customers/details"], { queryParams: { id: this.fullOrder.customer.uuid }});
  }

  private createShippingStatusTableRows(shippingStatuses) {
    this.productIdToNameMap = {};
    if(!this.fullOrder.is_naep_order){
      this.listProduct.forEach(product => {
        this.productIdToNameMap[product.id] = product.productName;
        if(product.order_line_online_bank_transfer_gifts.length > 0){
          product.order_line_online_bank_transfer_gifts.forEach(bank_transfer_gifts => {
            this.productIdToNameMap[bank_transfer_gifts.online_bank_transfer_gift_product_id ] =bank_transfer_gifts.online_bank_transfer_gift_product_name;
          });
        }
        if(product.order_line_single_paymt_gifts.length > 0 ){
          // this.productIdToNameMap[product.order_line_single_paymt_gifts[0].single_paymt_gift_product_id] = product.order_line_single_paymt_gifts[0].single_paymt_gift_product_name;
          product.order_line_single_paymt_gifts.forEach(single_paymt_gifts =>{
            this.productIdToNameMap[single_paymt_gifts.single_paymt_gift_product_id ] =single_paymt_gifts.single_paymt_gift_product_name;
          });
        }
      });

    }else{
      this.listProduct.forEach(product => {
        if(product.is_deposit || product.is_kit){
          this.productIdToNameMap[product.id] = product.productName;

        }
      })
    }
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
    if(!this.fullOrder.is_naep_order){
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

    }else{
      this.listProduct.forEach(product => {
        if(product.is_deposit || product.is_kit){
          this.productIdToNameMap[product.id] = product.productName;

        }
      })
    }
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


  updateStatusOrder(order_id, status) {
    this._orderService.updateStatusOfOrder(order_id, status).subscribe();
  }
  async nohosted() {
    let dataCheck;
    await this._orderService.checkLockOrder(this.fullOrder.id).toPromise().then(data=>{
      dataCheck = data;
    })
    if(dataCheck === 1){
      const dialogRef = this.dialog.open(DialogReasonComponent, {
        width: '500px',
        data: { message: 'Not Hosted Reasons:', orderId: this.order_id }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result === true) {
          this.router.navigate(['direct-sales/orders/completed'], { queryParams: { id: this.order } });
          // this.updateStatusOrder(this.order_id, 'COMPLETED');
        } else {
          dialogRef.close();
        }
      });
    }else if(dataCheck == 2){
      const dialogRef = this.dialog.open(CommonDialogComponent, {
        width: '600px',
        data: { message: ErrorMessageLock.ANOTHER_LOCK , type: "back" ,
                colorButton: true , title : 'REMINDER' , buttonName: 'GO BACK' }
      });
    }else if(dataCheck == 3){
      const dialogRef = this.dialog.open(CommonDialogComponent, {
        width: '600px',
        data: { message: ErrorMessageLock.LOCKED_BEFORE_PROCESS, type: "back" ,
                colorButton: true , title : 'REMINDER' , buttonName: 'GO BACK' }
      });
    }else{
      const dialogRef = this.dialog.open(CommonDialogComponent, {
        width: '600px',
        data: { message: ErrorMessageLock.ERROR_LOCKED, type: "back" ,
                colorButton: true , title : 'REMINDER' , buttonName: 'GO BACK' }
      });
    }
  }

  async navigateToCompleted() {
    let dataCheck;
    await this._orderService.checkLockOrder(this.fullOrder.id).toPromise().then(data=>{
      dataCheck = data;
    })
    if(dataCheck === 1){
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '700px',
        data: { message: 'Are you sure you want to Mark As Hosted?', type: "APPROVED" }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result === true) {
          this._orderService.updateStatusOfOrder(this.order_id, 'COMPLETED').subscribe(data=>{
            if(data.code === 200){
              this.router.navigate(['direct-sales/orders/completed'], { queryParams: { id: this.order } });
            }
          });
          // this.updateStatusOrder(this.order_id, 'COMPLETED');
        } else {
          dialogRef.close();
        }
      });
    }else if(dataCheck == 2){
      const dialogRef = this.dialog.open(CommonDialogComponent, {
        width: '600px',
        data: { message: ErrorMessageLock.ANOTHER_LOCK , type: "back" ,
                colorButton: true , title : 'REMINDER' , buttonName: 'GO BACK' }
      });
    }else if(dataCheck == 3){
      const dialogRef = this.dialog.open(CommonDialogComponent, {
        width: '600px',
        data: { message: ErrorMessageLock.LOCKED_BEFORE_PROCESS, type: "back" ,
                colorButton: true , title : 'REMINDER' , buttonName: 'GO BACK' }
      });
    }else{
      const dialogRef = this.dialog.open(CommonDialogComponent, {
        width: '600px',
        data: { message: ErrorMessageLock.ERROR_LOCKED, type: "back" ,
                colorButton: true , title : 'REMINDER' , buttonName: 'GO BACK' }
      });
    }

  }

  async navigateToCancel(){
    let dataCheck;
    await this._orderService.checkLockOrder(this.fullOrder.id).toPromise().then(data=>{
      dataCheck = data;
    })

    if(dataCheck === 1){
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '600px',
        data: { message: 'Are you sure you want to cancel this order?', type: "CANCEL" }
      });

      dialogRef.afterClosed().subscribe(result =>{
        if(result === true){
          let id = "#" + this.order_id
          let inventoryStockCardItem: FormDataInventory[] = []
          this.fullOrder.listProduct.forEach(element=>{
            if(element.is_host_gift){
              let formDataInventory = new FormDataInventory();
              formDataInventory.in_out_type = 'IN';
              formDataInventory.moving_quantity = element.quantity;
              formDataInventory.product_id = element.id;
              let orderItem = this.allProductInventory.find(e => e.product.id == element.id);
              if (!CheckNullOrUndefinedOrEmpty(orderItem)) {
                formDataInventory.stock_quantity = orderItem.product.product_inventory.stock_quantity;
                formDataInventory.balance = + Number(formDataInventory.stock_quantity) - Number(element.quantity);
                inventoryStockCardItem.push(formDataInventory);
                if(!CheckNullOrUndefinedOrEmpty(element.productGift)){
                  element.productGift.forEach(gift => {
                    let formDataGiftInventory = new FormDataInventory();
                    formDataGiftInventory.in_out_type = 'IN';
                    formDataGiftInventory.moving_quantity = gift.quantity;
                    formDataGiftInventory.product_id = gift.id;
                    let giftItem = orderItem?.host_gift_item?.host_gift_item_component?.find(el => el.gift_product_id == gift.id);
                    if (!CheckNullOrUndefinedOrEmpty(giftItem)) {
                      formDataGiftInventory.stock_quantity = orderItem.product.product_inventory.stock_quantity;
                      formDataGiftInventory.balance = + Number(formDataGiftInventory.stock_quantity) - Number(gift.quantity);
                      inventoryStockCardItem.push(formDataGiftInventory);
                    }
                  });
                }
              }
            }else{
              let formDataInventory = new FormDataInventory()
              formDataInventory.in_out_type = 'IN'
              formDataInventory.moving_quantity = element.quantity
              formDataInventory.product_id = element.id
              let orderItem = this.allProductInventory.find(e=>e.product.id == element.id)
              if(!CheckNullOrUndefinedOrEmpty(orderItem) ){
                formDataInventory.stock_quantity = orderItem.product.product_inventory.stock_quantity;
                formDataInventory.balance = + Number(formDataInventory.stock_quantity) + Number(element.quantity)
                inventoryStockCardItem.push(formDataInventory)
              }
            }
          })

          let formData = {
            comment: 'Order ' + this.order_id + ' cancelled',
            in_out_date : new Date(),
            inventory_stock_card_item: inventoryStockCardItem,
            inventory_stock_card_attachment: []
          }
          this._inventoryService.createInventory(formData).subscribe(data=>{
            if(data.code === 200){

              this.shippingService.deleteShippingAgent(this.order_id).subscribe(data=>{
                if(data.code === 200){
                  // this.updateStatusOrder(, )
                  this._orderService.updateStatusOfOrder(this.order_id, 'CANCELLED').subscribe(data => {
                    if(data.code === 200){
                      this.router.navigate(['direct-sales/orders/cancelled'], {queryParams: {id: id}})
                    }
                  })
                }
              })

            }
          })
        }else{
          dialogRef.close();
        }
      })
    }else if(dataCheck == 2){
      const dialogRef = this.dialog.open(CommonDialogComponent, {
        width: '600px',
        data: { message: ErrorMessageLock.ANOTHER_LOCK , type: "back" ,
                colorButton: true , title : 'REMINDER' , buttonName: 'GO BACK' }
      });
    }else if(dataCheck == 3){
      const dialogRef = this.dialog.open(CommonDialogComponent, {
        width: '600px',
        data: { message: ErrorMessageLock.LOCKED_BEFORE_PROCESS, type: "back" ,
                colorButton: true , title : 'REMINDER' , buttonName: 'GO BACK' }
      });
    }else{
      const dialogRef = this.dialog.open(CommonDialogComponent, {
        width: '600px',
        data: { message: ErrorMessageLock.ERROR_LOCKED, type: "back" ,
                colorButton: true , title : 'REMINDER' , buttonName: 'GO BACK' }
      });
    }

  }

  createInvoice(){
    CreateInvoice(this.fullOrder.orderIdTmm)
  }

  checkLockOrder(event){
    // console.log(event)
    if(event.checked){
      this.lockOrderTitle = "LOCKED";
    }else{
      this.lockOrderTitle = "LOCK ORDER";
    }
    this.checkedLock = event.checked;
    let formLockOrder = new FormLock;
    formLockOrder.order_id = Number(this.order_id)
    formLockOrder.locked_status = event.checked;
    this._orderService.lockOrder(formLockOrder).subscribe(data=>{
      if(data.code === 200){
        this.lockTime = data.data.locked_at;
        this.lockBy = data.data.appUser !== null ? data.data.appUser.email : ""
      }else if(data.code ===201){
        this.checkedLock = false;
        this.lockOrderTitle = "LOCK ORDER"
        const dialogNotifi = this.dialog.open(CommonDialogComponent, {
          width: "600px",
          data: {
            message:
              data.message,
            title:
              "NOTIFICATION",
            colorButton: true
          },
        });
      }else if(data.code === 202){
        this.checkedLock = true;
        this.lockOrderTitle = "LOCKED"
        const dialogNotifi = this.dialog.open(CommonDialogComponent, {
          width: "600px",
          data: {
            message:
              data.message,
            title:
              "NOTIFICATION",
            colorButton: true
          },
        });
      }else if(data.code === 203){
        this.checkedLock = false;
        this.lockOrderTitle = "LOCK ORDER"
        const dialogNotifi = this.dialog.open(CommonDialogComponent, {
          width: "600px",
          data: {
            message:
              data.message,
            title:
              "NOTIFICATION",
            colorButton: true
          },
        });
        dialogNotifi.afterClosed().subscribe(state => {
          if(data.code == 203){
            this.getOrder(this.order_id)
            return

          }
        });
      }else{
        this.checkedLock = false;
        this.lockOrderTitle = "LOCK ORDER"
        const dialogNotifi = this.dialog.open(CommonDialogComponent, {
          width: "600px",
          data: {
            message:
              "Locked error!",
            title:
              "NOTIFICATION",
            colorButton: true
          },
        });
      }
    })
  }

  downloadInvoice() {
    this._orderService.downloadInvoice(this.uuid).subscribe(data=>{
      if(data){
        this.invoicePdf = data.data
        this.downloadDataUrlFromJavascript("invoice-pdf", this.invoicePdf)
      }else{
        return
      }
    })
  }

  downloadDataUrlFromJavascript(filename, dataUrl) {

    // Construct the 'a' element
    var link = document.createElement("a");
    link.download = filename;

    // Construct the URI
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();

    // Cleanup the DOM
    document.body.removeChild(link);
  }
}

export class OrderHistories {
  id: string;
  action: string;
  createdAt: Date;
}
