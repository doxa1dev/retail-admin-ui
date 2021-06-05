import { Component, OnInit, Output, EventEmitter, Input } from "@angular/core";
import { Router } from "@angular/router";
import { OrdersService } from "app/core/service/orders.service";
import { HttpClient } from "@angular/common/http";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { NAEPService } from "app/core/service/naep.service";
import Swal from "sweetalert2";
import { forEach, stubFalse } from "lodash";
import { element } from "protractor";
import { SaleHistory } from "app/core/models/naep.model";
import { AuthService } from "app/core/service/auth.service";
import { isNullOrUndefined } from "util";
import { PaymentOption } from "app/core/enum/payment-option.enum";
import { ConfirmDialogComponent } from 'app/main/_shared/confirm-dialog/confirm-dialog.component';
import { DialogTextareaCommentComponent } from 'app/main/_shared/dialog-textarea-comment/dialog-textarea-comment.component';
import { CommonDialogComponent } from 'app/main/_shared/common-dialog/common-dialog.component';
import { checkLockOrderApi } from 'app/core/service/backend-api';
import { ErrorMessageLock } from 'app/core/enum/error-message.enum';
import { CheckNullOrUndefinedOrEmpty } from "app/core/utils/common-function";
import { forkJoin } from "rxjs";
@Component({
  selector: "app-button-verify",
  templateUrl: "./button-verify.component.html",
  styleUrls: ["./button-verify.component.scss"],
})
export class ButtonVerifyComponent implements OnInit {
  @Input() orderId: Number;
  @Input() orderData: any;
  @Input() fullOrder: any;

  naep_product_id: string;
  discount_product_id : string;
  is_have_naep: boolean;
  is_have_discount : boolean;
  customer_id: string;
  is_recruit: any;
  product_naep: number;
  advised_by_customer_id: string;
  listKeyProduct: string[];
  isAdvisorRecruitment: any;
  is_recruit_advisor;
  @Input() isShow: boolean;

  checkLock ;
  active: boolean = false;
  buttonName: string = 'Mark As Verified';
  disableButton: boolean = false;
  @Input() checkParentLock: boolean;
  constructor(
    private router: Router,
    private _orderService: OrdersService,
    private dialog: MatDialog,
    private nAEPService: NAEPService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this._orderService.checkLockOrder(this.orderId).subscribe(data=>{
      this.checkLock = data;
    })
  }

  checkAllPayment(){
    let checkPayment = this.fullOrder.payment.find(e => e.paymentStatus === 'SUCCESS' && e.verified === false)
    if(checkPayment){
      return false;
    }else{
      return true;
    }

  }



  async dialogNavigateToShip() {
      let dataLock;
      await this._orderService.checkLockOrder(this.orderId).toPromise().then(data=>{
        dataLock = data;
      })
        if(dataLock == 1){
          if(this.disableButton){
            return;
          }else{
            if(this.checkAllPayment()){
              if (CheckNullOrUndefinedOrEmpty(this.fullOrder.advisorCustomer)) {
                this.navigateToShip();
              } else {
                const dialogRef = this.dialog.open(ConfirmDialogComponent, {
                  width: '600px',
                  data: { message: 'Please confirm that this order will be handled by advisor ID = ' + this.fullOrder.advisorCustomer.advisorIdNumber + ' to proceed', type: "APPROVED" }
                });

                dialogRef.afterClosed().subscribe(result => {
                  if (result === true) {
                    this.navigateToShip();
                  }
                })
              }
            }else{
              const dialogRef = this.dialog.open(CommonDialogComponent, {
                width: '600px',
                data: { message: 'Please verify all component payments before proceeding.', type: "back" ,
                        colorButton: true , title : 'REMINDER' , buttonName: 'GO BACK' }
              });
            }
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



  async navigateToShip() {
    let id = "#" + this.orderId;
    // if (this.orderData[0].payment_option === PaymentOption.EPP) {
    //   const approvalCode = await Swal.fire({
    //     title: "Enter EPP Approval Code",
    //     input: "text",
    //     inputValue: "",
    //     showCancelButton: true,
    //     confirmButtonColor: "#7DA863",
    //     cancelButtonColor: "#999999",
    //     inputValidator: (value) => {
    //       return !value && "You need to write something!";
    //     },
    //   });
    //   let formApprovalCode: any;

    //   if (approvalCode.value) {
    //     formApprovalCode = {
    //       payment_id: this.orderData[0].id,
    //       epp_approval_code: approvalCode.value,
    //     };
    //     this.active = true;
    //     this.disableButton = true;
    //     this._orderService
    //       .saveEPPApprovalCode(formApprovalCode)
    //       .subscribe((response) => {
    //         if (response.code === 200) {
    //           forkJoin({
    //             requestOne: this._orderService.sendDataAxway(this.orderId, "TO_VERIFY" , "TO_SHIP"),
    //             requestTwo: this._orderService.updateStatusOfOrder(this.orderId, "TO_SHIP")
    //           }).subscribe(({requestOne , requestTwo})=>{
    //             if(requestTwo.code === 200){
    //               this.active = false;
    //               this.disableButton = false;
    //               this.router.navigate(["direct-sales/orders/to-ship"], {
    //                 queryParams: { id: this.orderId },
    //               });
    //             }
    //           })
    //         } else {
    //           return;
    //         }
    //       });
    //   } else {
    //     return;
    //   }
    // } else {
      this.active = true;
      this.disableButton = true;
      // forkJoin({
      //   requestOne: this._orderService.sendDataAxway(this.orderId, "TO_VERIFY" , "TO_SHIP"),
      //   requestTwo: this._orderService.updateStatusOfOrder(this.orderId, "TO_SHIP")
      // }).subscribe(({requestOne , requestTwo})=>{
      //   // console.log(requestOne , requestTwo)
      //   if(requestTwo.code === 200){
      //     this.active = false;
      //     this.disableButton = false;
      //     this.router.navigate(["direct-sales/orders/to-ship"], {
      //       queryParams: { id: this.orderId },
      //     });
      //   }
      // })
      this._orderService.updateStatusOfOrder(this.orderId, "TO_SHIP").subscribe(data=>{
        if(data.code === 200){
          this.active = false;
          this.disableButton = false;
          this._orderService.sendDataAxway(this.orderId, "TO_VERIFY" , "TO_SHIP").subscribe();
          this.router.navigate(["direct-sales/orders/to-ship"], {
            queryParams: { id: this.orderId },
          });
        }
      })
      // this._orderService.updateStatusOfOrder(this.orderId, "TO_SHIP").subscribe(data=>{
      //   if(data.code === 200){
      //     this.active = false;
      //     this.disableButton = false;
      //     this.router.navigate(["direct-sales/orders/to-ship"], {
      //       queryParams: { id: this.orderId },
      //     });
      //   }
      // })

    // }
  }


  async navigateToCancel() {
      let dataLock;
      await this._orderService.checkLockOrder(this.orderId).toPromise().then(data=>{
        dataLock = data;
      })
        if(dataLock === 1){
          const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            width: '600px',
            data: { message: 'Are you sure you want to cancel this order?', type: "CANCEL" }
          });
          dialogRef.afterClosed().subscribe((result) => {
            if (result === true) {
              this._orderService.updateStatusOfOrder(this.orderId, "CANCELLED").subscribe(data=>{
                if(data.code === 200){
                  this.router.navigate(["direct-sales/orders/cancelled"], {
                    queryParams: { id: this.orderId },
                  });
                }
              })
            } else {
              dialogRef.close();
            }
          });

        }else if(dataLock === 2){
          const dialogRef = this.dialog.open(CommonDialogComponent, {
            width: '600px',
            data: { message: 'Order has been locked by another admin.', type: "back" ,
                    colorButton: true , title : 'REMINDER' , buttonName: 'GO BACK' }
          });
        }else if(dataLock == 3){
          const dialogRef = this.dialog.open(CommonDialogComponent, {
            width: '600px',
            data: { message: 'Please lock order before proceeding.', type: "back" ,
                    colorButton: true , title : 'REMINDER' , buttonName: 'GO BACK' }
          });
        }else{
          const dialogRef = this.dialog.open(CommonDialogComponent, {
            width: '600px',
            data: { message: 'Error in proceeding.', type: "back" ,
                    colorButton: true , title : 'REMINDER' , buttonName: 'GO BACK' }
          });
        }
  }

  async updateStatusOrder(order_id, status) {
    this._orderService.updateStatusOfOrder(order_id, status).subscribe(data=>{
      return data
    });
  }
}
