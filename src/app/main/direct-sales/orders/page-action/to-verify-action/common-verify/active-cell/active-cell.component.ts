import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { OrdersService } from "app/core/service/orders.service";
import { Router } from "@angular/router";
import Swal from "sweetalert2";
import { saveEPPApprovalCodeApi } from "../../../../../../../core/service/backend-api";
import { PaymentOption } from "app/core/enum/payment-option.enum";
import { isNullOrUndefined } from "util";
import { ConfirmDialogComponent } from 'app/main/_shared/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { NAEPService } from 'app/core/service/naep.service';
import { AuthService } from 'app/core/service/auth.service';
import { SaleHistory } from 'app/core/models/naep.model';
import { CommonDialogComponent } from 'app/main/_shared/common-dialog/common-dialog.component';
import { DialogTextareaCommentComponent } from 'app/main/_shared/dialog-textarea-comment/dialog-textarea-comment.component';
import { OrderHistory } from 'app/core/service/orders.service';
import * as jwt_decode from 'jwt-decode';
import { ErrorMessageLock } from 'app/core/enum/error-message.enum';

@Component({
  selector: "active-cell",
  templateUrl: "./active-cell.component.html",
  styleUrls: ["./active-cell.component.scss"],
})
export class ActiveCellCustomComponent implements OnInit {
  @Output("updateData") sang = new EventEmitter();
  constructor(private orderService: OrdersService,
    private router: Router,
    private dialog: MatDialog,
    private nAEPService: NAEPService,
    private authService: AuthService,
    private _orderService: OrdersService,

    ) {}
  gridApi: any;
  active: any;
  params: any;
  id: any;

  rowNode: any;
  amount: any;
  data: any;
  naep_product_id: string;
  discount_product_id : string;
  is_have_naep: boolean;
  is_have_discount : boolean;
  fullOrder : any;
  isAdvisorRecruitment: any;
  is_recruit_advisor;
  advised_by_customer_id: string;
  listKeyProduct: string[];
  is_recruit: any;
  customer_id: string;
  comments: string;
  decoded: any;
  entityId: number;

  checkLock: number;
  agInit(params) {
    this.gridApi = params.api;
    this.params = params;
    this.id = params.data.id;
    this.active = params.value;
    // console.log(this.params.context.componentParent)

    this.rowNode = this.gridApi.getRowNode(this.params.node.id);
    this.amount = this.rowNode.data.display_amount.split(" ")[1];
    this.data = this.amount.replace(",", "");
    // console.log(this.data);
  }

  ngOnInit() {
    this.fullOrder = this.params.context.componentParent.fullOrder;
    this.checkLock = this.params.context.componentParent.checkLock;
    this.advised_by_customer_id = this.fullOrder.advised_by_customer_id;
    this.nAEPService.checkIsNAEPProduct().subscribe((data) => {
      this.naep_product_id = data[0];
      this.discount_product_id = isNullOrUndefined(data[1]) ? null : data[1];
      // console.log(this.params.context.componentParent.fullOrder)
      this.fullOrder.listProduct.forEach((element, index) => {
        if (element.id === this.naep_product_id) {
          this.is_have_naep = true;
        }else if(element.id === this.discount_product_id)
        {
          this.is_have_discount = true;
        }
      });
    });
    this.customer_id = this.fullOrder.customerId;
    this.nAEPService.checkRecruit(this.customer_id).subscribe((data) => {
      this.is_recruit = data;
    });

    if (!isNullOrUndefined(this.fullOrder.advisorCustomer)) {
      this.nAEPService
        .checkRecruit(this.fullOrder.advisorCustomer.id)
        .subscribe((data) => {
          this.isAdvisorRecruitment = data;
          if (this.isAdvisorRecruitment.isValid) {
            this.nAEPService
              .checkRecruit(this.fullOrder.advisorCustomer.id)
              .subscribe((data) => {
                this.is_recruit_advisor = data;
              });
          }
        });
    }
    this.nAEPService.getKeyProduct().subscribe((data) => {
      this.listKeyProduct = data;
    });

    let token = localStorage.getItem('token');
    if (token !== undefined && token !== null){
        this.decoded = jwt_decode(token);
    }
  }

  async pendingVerify() {
    const payment_option = this.rowNode.data.payment_option;

    if (payment_option === PaymentOption.EPP) {
      const approvalCode = await Swal.fire({
        title: "Enter EPP Approval Code",
        input: "text",
        inputValue: "",
        showCancelButton: true,
        confirmButtonColor: "#7DA863",
        cancelButtonColor: "#999999",
        inputValidator: (value) => {
          return !value && "You need to write something!";
        },
      });
      // console.log(approvalCode);

      let formApprovalCode: any;

      if (approvalCode.value) {
        formApprovalCode = {
          payment_id: this.id,
          epp_approval_code: approvalCode.value,
        };
        this.orderService
          .saveEPPApprovalCode(formApprovalCode)
          .subscribe((response) => {
            if (response.code === 200) {
              this.verifyPayment();
            }
          });
      } else {
        return;
      }
    } else {
      this.verifyPayment();
    }
  }

  async dialogNavigateToShip() {
    // if (isNullOrUndefined(this.params.context.componentParent.fullOrder.advisorCustomer)) {
    //   this.pendingVerify();
    // } else {
      let dataLock;
      await this._orderService.checkLockOrder(this.fullOrder.id).toPromise().then(data=>{
        dataLock = data;
      })
      if(dataLock == 1){
        const dialogRef = this.dialog.open(DialogTextareaCommentComponent, {
          width: '600px',
          data: { message: "Please provide comments to clarify the payment details.", type: "APPROVED" }
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result.state === true) {
            this.comments = result.data;
            this.pendingVerify();
            // console.log(result.data)
          }
        })

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
    // }
  }

  verifyPayment() {
    // if (this.params.context.componentParent.fullOrder.advisorCustomer != undefined) {
      // if (this.params.context.componentParent.fullOrder.advisorCustomer.advisorIdNumber == "0") {

      //   this.params.context.componentParent.isShow = true;
      //   return;
      // } else {
        this.params.context.componentParent.isShow = false;
        this.active = !this.active;
        this.orderService.updateVerifyPayment(this.id , this.comments).subscribe(data =>{
          if(data.code === 200){
            this.params.context.componentParent.getOrder(this.fullOrder.id)
          }
        });
        this.rowNode.setDataValue("status", "Verified");
        this.params.context.componentParent.pendingVerified =
          this.params.context.componentParent.pendingVerified - Number(this.data);

        this.params.context.componentParent.verified =
          this.params.context.componentParent.verified + Number(this.data);

        this.params.context.componentParent.rowDataLength = this.params.context.componentParent.rowDataLength - 1;

        // if (this.params.context.componentParent.pendingVerified === 0) {
        //   if (this.is_have_naep && this.is_recruit.isValid) {
        //     this.authService.becomeAdvisor(this.customer_id, this.advised_by_customer_id, this.is_have_discount).subscribe(data=>{
        //       if(data.code === 200)
        //       {
        //         let saleForm = new SaleHistory();
        //         saleForm.is_naep_product = true;
        //         saleForm.order_id = this.fullOrder.id;
        //         saleForm.product_id = this.naep_product_id;
        //         saleForm.approved_recruitment_id = data.data
        //         this.nAEPService.createSalesHistory(saleForm).subscribe(data=>{})
        //       }
        //     })
        //   } else if (!isNullOrUndefined(this.isAdvisorRecruitment) && this.isAdvisorRecruitment.isValid) {
        //     this.fullOrder.listProduct.forEach((product) => {
        //       var productId = product.id;
        //       var isKey = this.listKeyProduct.find((key) => (key == productId));
        //       var quantity = product.quantity;
        //       for (let index = 0; index < quantity; index++) {
        //         if (!isNullOrUndefined(isKey)) {
        //           let saleForm = new SaleHistory();
        //           saleForm.is_naep_product = false;
        //           saleForm.order_id = this.fullOrder.id;
        //           saleForm.product_id = isKey;
        //           saleForm.approved_recruitment_id = this.is_recruit_advisor.recruitmentId;
        //           this.nAEPService
        //             .createSalesHistory(saleForm)
        //             .subscribe((data) => {
        //               console.log('key:',data)
        //             });
        //         }
        //       }
        //     });
        //   }
        //   let id = this.params.context.componentParent.order.replace('#','');
        //   if (
        //     this.fullOrder.listProduct.length == 1 &&
        //     this.is_have_naep &&
        //     this.is_recruit.isValid &&
        //     this.fullOrder.listProduct[0].is_naep_discount == true
        //   ) {
        //     this._orderService.updateStatusOfOrder(id,  "COMPLETED").subscribe(data=>{
        //       if(data.code === 200){
        //         this.router.navigate(["direct-sales/orders/completed"], {
        //           queryParams: { id: id },
        //         });
        //       }else{
        //         this.showErrorMessage();
        //       }
        //     });
        //   } else {
        //     this._orderService.updateStatusOfOrder(id,  "TO_SHIP").subscribe(data=>{
        //       if(data.code === 200){
        //         this.router.navigate(["direct-sales/orders/to-ship"], {
        //           queryParams: { id: id},
        //         });
        //       }else{
        //         this.showErrorMessage();
        //       }
        //     });
        //   }
        // }
    // }
    //case advisor undefined
    // else {
    //   this.params.context.componentParent.isShow = false;
    //   this.active = !this.active;
    //   this.orderService.updateVerifyPayment(this.id).subscribe();
    //   this.rowNode.setDataValue("status", "Verified");
    //   this.params.context.componentParent.pendingVerified =
    //     this.params.context.componentParent.pendingVerified - Number(this.data);

    //   this.params.context.componentParent.verified =
    //     this.params.context.componentParent.verified + Number(this.data);

    //   this.params.context.componentParent.rowDataLength = this.params.context.componentParent.rowDataLength - 1;

      // if (this.params.context.componentParent.pendingVerified === 0) {
      //   let id = this.params.context.componentParent.order.replace('#','');
      //   this._orderService.updateStatusOfOrder(id,"TO_SHIP").subscribe(data=>{
      //     if(data.code === 200){
      //       this.router.navigate(["direct-sales/orders/to-ship"], {
      //         queryParams: { id: id },
      //       });
      //     }else{
      //       this.showErrorMessage();
      //     }
      //   })
      // }

    // }
  }

  updateStatusOrder(order_id, status) {
    this._orderService.updateStatusOfOrder(order_id, status).subscribe();
  }

  showErrorMessage(){
    const dialogNotifi = this.dialog.open(CommonDialogComponent, {
      width: "500px",
      data: {
        message:
          'System error when update status, please try again later.',
        title:
          "NOTIFICATION",
        colorButton: false
      },
    });
    dialogNotifi.afterClosed().subscribe(data => {
      return;
    });
  }


}
