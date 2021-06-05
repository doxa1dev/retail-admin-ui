import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { Product } from "app/core/models/product.model";
import { environment } from "environments/environment";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { DialogConfirmComponent } from "app/main/_shared/dialog-confirm/dialog-confirm.component";
import { OrdersService } from "app/core/service/orders.service";
import { CommonDialogComponent } from "app/main/_shared/common-dialog/common-dialog.component";

import * as ProductGiftHelper from './product-gift-helper';
import { ErrorMessageLock } from 'app/core/enum/error-message.enum';

@Component({
  selector: "app-product",
  templateUrl: "./product.component.html",
  styleUrls: ["./product.component.scss"],
})
export class ProductComponent implements OnInit {
  SINGLE_FULL_PAYMENT_GIFT = ProductGiftHelper.SINGLE_FULL_PAYMENT_GIFT;
  ONLINE_BANK_TRANSFER_PAYMENT_GIFT = ProductGiftHelper.ONLINE_BANK_TRANSFER_PAYMENT_GIFT;
  priceForm: FormGroup;
  storageUrl = environment.storageUrl;
  @Input() product: Product;
  @Input() paid;
  @Input() checkOrderLock : boolean;
  @Input() checkLock : number;
  @Input() orderId
  isShow: boolean = false;
  @Output() onChangePrice = new EventEmitter<boolean>();

  single_full_paymt_gifts: ProductGiftHelper.GiftDisplay[];
  online_bank_transfer_gifts: ProductGiftHelper.GiftDisplay[];
  checkProduct: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private _orderService: OrdersService
  ) { }

  ngOnInit(): void {
    this.priceForm = this.formBuilder.group({
      changePrice: ["", [Validators.required, phoneNumberValidator, Validators.min(Number(this.paid))]],
    });

    if (this.product.id != undefined) {
      this.checkProduct = false;

      if (this.product.order_line_single_paymt_gifts.length > 0) {
        this.single_full_paymt_gifts = ProductGiftHelper.aggregateGifts(this.product.order_line_single_paymt_gifts);
        this.online_bank_transfer_gifts = ProductGiftHelper.aggregateGifts(this.product.order_line_online_bank_transfer_gifts);
      }
    } else {
      this.checkProduct = true;
    }

    // console.log(this.checkOrderLock , " " , this.checkLock)
  }

  async changePrice() {
    let dataLock;
    await this._orderService.checkLockOrder(this.orderId).toPromise().then(data=>{
      dataLock = data;
    })
    if(dataLock == 1){
      this.isShow = true;

      if (this.priceForm.invalid) {
        return;
      } else {
        const dialogRef = this.dialog.open(DialogConfirmComponent, {
          width: "800px",
          data: {
            message:
              "Your new price will be recorded on system and notify the relevant parities. Do you wish to proceed?",
          },
        });

        dialogRef.afterClosed().subscribe((data) => {
          if (data === true) {

            var form = {
              order_id: this.product.orderLineId,
              new_price: this.priceForm.value.changePrice,
            };
            this._orderService.updatePrice(form).subscribe((data) => {
              if (data.code === 200) {
                //Show dialog success
                const dialogNotifi = this.dialog.open(CommonDialogComponent, {
                  width: "500px",
                  data: {
                    message: "Change price successfully",
                    title: "NOTIFICATION",
                    colorButton: false,
                  },
                });

                dialogNotifi.afterClosed().subscribe((data) => {
                  if (data === true) {
                    // this.product.promotionalPrice = this.priceForm.value.changePrice;
                    this.priceForm.setValue({ changePrice: "" });
                    this.isShow = false;

                    this.onChangePrice.emit(true);
                  }
                });
              }
            });
          } else {
            dialogRef.close();
          }
        });
      }

    }else if(dataLock == 2){
      const dialogRef = this.dialog.open(CommonDialogComponent, {
        width: '600px',
        data: { message: ErrorMessageLock.ANOTHER_LOCK , type: "back" ,
                colorButton: true , title : 'REMINDER' , buttonName: 'GO BACK' }
      });
    }else if(dataLock == 3){
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
}

function phoneNumberValidator(checkOutForm: FormControl) {
  if (
    isNaN(checkOutForm.value) === false &&
    !checkOutForm.value.includes(" ")
  ) {
    return null;
  }
  return { changePrice: true };
}
