import { type } from 'jquery';
import { InventoryService } from 'app/core/service/inventory.service';
import { WarrantiedService } from 'app/core/service/warrantied.service';
import { Value } from './../../../../../../../core/service/inventory.service';
import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { Product, SerialNumberShipping } from 'app/core/models/product.model';
import { environment } from 'environments/environment';
import { SharedService } from 'app/core/service/shared.service';
import { isNullOrUndefined } from 'util';
import { element } from 'protractor';

import * as ProductGiftHelper from './product-gift-helper';
import { OrdersService } from 'app/core/service/orders.service';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonDialogComponent } from 'app/main/_shared/common-dialog/common-dialog.component';
import { DialogConfirmComponent } from 'app/main/_shared/dialog-confirm/dialog-confirm.component';
import { ErrorMessageLock } from 'app/core/enum/error-message.enum';
import { Serial } from 'app/core/models/Serial.model';
import { FormDataInventory } from 'app/main/direct-sales/products/inventory/create-stock/create-stock.component';
import { CheckNullOrUndefinedOrEmpty } from 'app/core/utils/common-function';
import { ConfirmDialogComponent } from 'app/main/_shared/confirm-dialog/confirm-dialog.component';


@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  SINGLE_FULL_PAYMENT_GIFT = ProductGiftHelper.SINGLE_FULL_PAYMENT_GIFT;
  ONLINE_BANK_TRANSFER_PAYMENT_GIFT = ProductGiftHelper.ONLINE_BANK_TRANSFER_PAYMENT_GIFT;
  storageUrl = environment.storageUrl;
  serialForm: FormGroup;
  SerialFormEdit: FormGroup;

  @Input() product: Product;
  @Input() orderId
  @Output() serialNumber = new EventEmitter<any>();
  @Output() handleSubmit = new EventEmitter<any>();

  isShowform: boolean;
  imageProduct: string;
  arrayInput = [];
  list_Serial = [];
  allInventoryProducts = [];
  serial_number: string;
  ishave = false;
  isWarranty: boolean;
  isShow: boolean = false;
  single_full_paymt_gifts: ProductGiftHelper.GiftDisplay[];
  online_bank_transfer_gifts: ProductGiftHelper.GiftDisplay[];
  checkProduct: boolean = false;
  order_id;
  btnEdit: boolean = false;
  checkBalance: boolean = true;
  @Input() fullOrder;
  @Input() checkLock;
  @Input() productList: any[];
  @Input() advisor_customer_id;
  is_need_advisor: boolean = false;
  @Input() customer_id: number;
  buttonName:boolean=false;
  buttonNameEdit:boolean=false;
  isDisplay : boolean = false ;
  isShowSerial : boolean = false;
  active: boolean = false;
  buttonSaveSerial : string = "Save"
  buttonCount = 0;


  constructor(
    private sharedService: SharedService,
    private _orderService: OrdersService,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private warrantiedService: WarrantiedService,
    private _inventoryService: InventoryService
  ) { }

  ngOnInit(): void {
    this.serialForm = this.formBuilder.group({
      serial_number: ['', [Validators.required]],
    });

    this.isWarranty = (isNullOrUndefined(this.product.warranty_duration_in_days) ) ? false : true;
    if (this.isWarranty) {
      for (let i = 0; i < this.product.quantity-this.product.list_serial_number_shipping.length; i++) {
        this.arrayInput.push(i);
      }
    }

    if (this.product.id != undefined) {
      this.checkProduct = false;

      if (this.product.order_line_single_paymt_gifts?.length > 0) {
        this.single_full_paymt_gifts = ProductGiftHelper.aggregateGifts(this.product.order_line_single_paymt_gifts);
        this.online_bank_transfer_gifts = ProductGiftHelper.aggregateGifts(this.product.order_line_online_bank_transfer_gifts);
      }

    } else {
      this.checkProduct = true;
    }


  }

  async saveSerialNumber(i,product_id,orderLineId,event,warranty_duration_in_days){

        let dataCheck;

        await this._orderService.checkLockOrder(this.product.order_id).toPromise().then(data=>{
          dataCheck = data;
        })

        if(dataCheck === 1){
          let serial_value = event.value.split(" ")[0];

          let checkSerialNumber = [serial_value];

          this.warrantiedService.checkSerialNumber(checkSerialNumber).subscribe(response=>{
          if(response.code === 200)
          {
            let serial = new Serial();
            serial.serial_number = serial_value;
            serial.product_id = product_id;
            serial.warranty_duration_in_days = warranty_duration_in_days;
            serial.customer_id = this.product.customer_id;
            serial.advisor_customer_id = isNullOrUndefined(this.product.advisor_customer) ? null : this.product.advisor_customer.id;
            serial.order_id = this.product.order_id;
            serial.order_line_id = orderLineId;

            this.warrantiedService.createSerialNumber(serial).subscribe(data=>{
              if(data.code === 200)
              {
                this.handleSubmit.emit(true);
                this.sharedService.sharedMessage.subscribe(
                  (message) => {
                    this.list_Serial = message;
                  }
                );

                this.list_Serial = [];
                this.sharedService.nextCart(this.list_Serial);

                const dialogNotifi = this.dialog.open(CommonDialogComponent, {
                  width: "500px",
                  data: {
                    message: "Update serial number successfully.",
                    title:
                      "NOTIFICATION",
                    colorButton: false,
                  },
                });
              }
            });
          }else {
            let message = response.message + event.value;
            const dialogNotifi = this.dialog.open(CommonDialogComponent, {
              width: "500px",
              data: {
                message: message,
                title:
                  "NOTIFICATION",
                colorButton: true
              },
            });
          }
        })
        } // datalock = 1
        else if(dataCheck == 2){
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

  async updateSerialNumber(i, Id, indexKit) {

    if (this.product.is_kit) {
      var evt = this.product.productKit[indexKit].list_serial_number_shipping[i].value.split(" ")[0];

    } else {
      var evt = this.product.list_serial_number_shipping[i].value.split(" ")[0];
    }

        let dataCheck;
        await this._orderService.checkLockOrder(this.product.order_id).toPromise().then(data=>{
          dataCheck = data;
        })
        if(dataCheck === 1){
            let serial_value = evt;
            let checkSerialNumber = [serial_value];

            this.warrantiedService.checkSerialNumber(checkSerialNumber).subscribe(response=>{
              if(response.code === 200) {
                let serial = new SerialNumberShipping();
                serial.value = serial_value;
                serial.id = Id;

                this.warrantiedService.updateSerialNumber(Id, serial_value).subscribe(data=>{

                  if(data.code === 200)
                  {
                    if (this.product.is_kit) {
                      this.product.productKit[indexKit].list_serial_number_shipping[i].display = false;

                    } else {
                      this.product.list_serial_number_shipping[i].display = false;
                    }

                    let message = data.message;

                      const dialogNotifi = this.dialog.open(CommonDialogComponent, {
                        width: "500px",
                        data: {
                          message: message,
                          title:
                            "NOTIFICATION",
                          colorButton: false,

                        },
                      });

                  } else if (data.code === 201 ) {
                    let message = data.data;

                      const dialogNotifi = this.dialog.open(CommonDialogComponent, {
                        width: "500px",
                        data: {
                          message: message,
                          title:
                            "NOTIFICATION",
                            colorButton: true,
                        },
                      });


                  } else if (data.code === 204) {
                    let message = data.message + evt;
                      const dialogNotifi = this.dialog.open(CommonDialogComponent, {
                        width: "500px",
                        data: {
                          message: message,
                          title:
                            "NOTIFICATION",
                            colorButton: true
                        },
                      });
                  }

                });
              } else {
                let message = response.message + evt;

                  const dialogNotifi = this.dialog.open(CommonDialogComponent, {
                    width: "500px",
                    data: {
                      message: message,
                      title:
                        "NOTIFICATION",
                      colorButton: true
                    },
                  });
              }

            })

        }
        else if(dataCheck == 2){
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

  editSerial(i, indexKit) {

    if (this.product.is_kit) {
      this.product.productKit[indexKit].list_serial_number_shipping[i].display = true;

    } else {
      this.product.list_serial_number_shipping[i].display = true;
    }
  }


  getInput(index, id, orderLineId, event, warranty_day) {
    // console.log(event.srcElement.value);
    if (event.srcElement.value !== '') {
      let valueInput = event.srcElement.value.split(" ")[0];
      event.srcElement.value = valueInput;
      this.sharedService.sharedMessage.subscribe(
        (message) => {
          this.list_Serial = message;
        }
      );
      if (this.list_Serial.length > 0) {
        var x = 0;
        this.list_Serial.forEach(element => {
          if (element.index == index && element.orderLineId == orderLineId) {
            element.serial = valueInput;
            x = 1;
          }
        });
        // console.log(x);
        if (x == 1) {
          this.sharedService.nextCart(this.list_Serial);
        } else {
          this.sharedService.sharedMessage.subscribe(
            (message) => {
              this.list_Serial = message;
            }
          );
          this.list_Serial.push({ index: index, id: id, orderLineId: orderLineId, serial: valueInput, warranty_day: warranty_day });
          this.sharedService.nextCart(this.list_Serial);
          //console.log(serial);
        }
      }
      else {
        this.sharedService.sharedMessage.subscribe(
          (message) => {
            this.list_Serial = message;
          }
        );
        this.list_Serial.push({ index: index, id: id, orderLineId: orderLineId, serial: valueInput, warranty_day: warranty_day });

        this.sharedService.nextCart(this.list_Serial);
      }
    }
    else {
      this.sharedService.sharedMessage.subscribe(
        (message) => {
          this.list_Serial = message;
        }
      );
      let pos = this.list_Serial.findIndex(element => {
        return (element.index == index && element.id == id);
      });
      if (pos != -1) {
        this.list_Serial.splice(pos, 1);
      }
      this.sharedService.nextCart(this.list_Serial);
    }
  }
}
