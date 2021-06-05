import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { OrdersService } from 'app/core/service/orders.service';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { FormDataInventory } from 'app/main/direct-sales/products/inventory/create-stock/create-stock.component';
import { isNullOrUndefined } from 'util';
import { InventoryService, InventoryProduct } from 'app/core/service/inventory.service';
import { WarrantiedService } from 'app/core/service/warrantied.service'
import { DialogReasonComponent } from 'app/main/_shared/dialog-reason/dialog-reason.component';
import { ShippingService } from '../../../../../../../core/service/shipping.service';
import { deleteShippingAgentApi } from '../../../../../../../core/service/backend-api';
import { ConfirmDialogComponent } from 'app/main/_shared/confirm-dialog/confirm-dialog.component';
import { CommonDialogComponent } from 'app/main/_shared/common-dialog/common-dialog.component';
import { ErrorMessageLock } from 'app/core/enum/error-message.enum';
import { DialogTextareaImageCommentComponent } from 'app/main/_shared/dialog-textarea-image-comment/dialog-textarea-image-comment.component';
import { CheckNullOrUndefinedOrEmpty } from 'app/core/utils/common-function';

@Component({
  selector: 'app-button-receive',
  templateUrl: './button-receive.component.html',
  styleUrls: ['./button-receive.component.scss']
})
export class ButtonReceiveComponent implements OnInit {

  @Input() orderId;
  @Input() productList: any[];
  @Input() customerId: number;
  @Input() order;
  @Input() fullOrder: any;
  allProductInventory = [];
  isHaveWarrantyProduct : boolean = false;
  checkLock ;
  constructor(
    private router:Router,
    private _orderService : OrdersService,
    private dialog: MatDialog,
    private _inventoryService: InventoryService,
    private _warrantiedService: WarrantiedService,
    private shippingService: ShippingService
  ) { }

  ngOnInit(): void {
    this.order.listProduct.forEach(element=>{
      if(!CheckNullOrUndefinedOrEmpty(element.warranty_duration_in_days))
      {
        this.isHaveWarrantyProduct = true;
      }
    })
    // console.log(this.order);
    this._inventoryService.getProductInventoryById(this.orderId).subscribe(data=>{
      if(!CheckNullOrUndefinedOrEmpty(data)){
        this.allProductInventory = data;

      }
    });
    this._orderService.checkLockOrder(this.orderId).subscribe(data=>{
      this.checkLock = data;
    })
  }


  async navigateToShip(){
    let dataCheck;
    await this._orderService.checkLockOrder(this.fullOrder.id).toPromise().then(data=>{
      dataCheck = data;
    })
      if(dataCheck == 1){
        const dialogRef = this.dialog.open(DialogReasonComponent, {
          width: '500px',
          data: { message: 'Not Received Reasons:', orderId: this.orderId }
        });

        dialogRef.afterClosed().subscribe(result =>{
          if(result === true){
            let id = "#" + this.orderId
            let inventoryStockCardItem: FormDataInventory[] = []
            this.productList.forEach(element=>{
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
              comment: 'Order ' + this.orderId + ' cancel to receive',
              in_out_date : new Date(),
              inventory_stock_card_item: inventoryStockCardItem,
              inventory_stock_card_attachment: []
            }
            this._inventoryService.createInventory(formData).subscribe(data=>{
              if(data.code === 200){

                // this.shippingService.deleteShippingAgent(this.orderId).subscribe(data=>{
                //   if(data.code === 200){
                    this._orderService.updateStatusOfOrder(this.orderId, 'TO_SHIP').subscribe(data => {
                      if(data.code === 200){
                        if(this.isHaveWarrantyProduct){
                          this._warrantiedService.deleteWarranty(this.orderId).subscribe(dataWarranty => {
                            if(dataWarranty.code ===200){
                              this.router.navigate(['direct-sales/orders/to-ship'], {queryParams: {id: id}})
                            }
                          })
                        }else{
                          this.router.navigate(['direct-sales/orders/to-ship'], {queryParams: {id: id}})
                        }

                        // this.router.navigate(['direct-sales/orders/to-ship'], {queryParams: {id: id}})
                      }
                    })
                  // }
                // })

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

  async navigateToUnbox(){

    let dataCheck;
    await this._orderService.checkLockOrder(this.fullOrder.id).toPromise().then(data=>{
      dataCheck = data;
    })
    if(dataCheck == 1){
      const dialog = this.dialog.open(DialogTextareaImageCommentComponent, {
        width: '700px',
        data: { message: 'Please provide comments to clarify details of receipt.', type: "APPROVED" }
      });
      dialog.afterClosed().subscribe(result => {
        if (result.state  === true) {
          let id = "#" + this.orderId;
          let url = this.order.need_unbox ? 'direct-sales/orders/to-unbox' : this.order.need_host ? 'direct-sales/orders/to-host' : 'direct-sales/orders/completed';
          // const dialogRef = this.dialog.open(ConfirmDialogComponent, {
          //   width: '700px',
          //   data: { message: 'Are you sure you want to Mark As Received?', type: "APPROVED" }
          // });
          // dialogRef.afterClosed().subscribe(result => {
          //   if (result === true) {
          // console.log(result.data)
          this._warrantiedService.updateStatusWarranty(this.customerId, this.orderId).subscribe(data=>{})
          // this.updateStatusOrder(this.orderId, 'TO_UNBOX', result.data.comment , result.data.image)
          // setTimeout(() => {
          //   this.router.navigate([url], {queryParams: {id: id}});
          // }, 500);
          this._orderService.updateStatusOfOrder(this.orderId, 'TO_UNBOX' , result.data.comment , result.data.image).subscribe(data=>{
            if(data.code === 200){
              this.router.navigate([url], {queryParams: {id: id}});
            }
          })
          //   } else {
          //     dialogRef.close();
          //   }
          // });
            } else {
              dialog.close();
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
  updateStatusOrder(order_id, status , comment? , image?){
    this._orderService.updateStatusOfOrder(order_id, status , comment , image).subscribe()
  }

  navigateToCancel(){
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '500px',
      data: { message: 'Do you wish to cancel this order?', type: "REJECTED" }
    });

    dialogRef.afterClosed().subscribe(result =>{
      if(result === true){
        let id = "#" + this.orderId
        let inventoryStockCardItem: FormDataInventory[] = []
        this.productList.forEach(element=>{
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
          comment: 'Order ' + this.orderId + ' cancelled',
          in_out_date : new Date(),
          inventory_stock_card_item: inventoryStockCardItem,
          inventory_stock_card_attachment: []
        }
        this._inventoryService.createInventory(formData).subscribe(data=>{
          if(data.code === 200){

            this.shippingService.deleteShippingAgent(this.orderId).subscribe(data=>{
              if(data.code === 200){
                // this.updateStatusOrder(, )
                this._orderService.updateStatusOfOrder(this.orderId, 'CANCELLED').subscribe(data => {
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
  }
}
