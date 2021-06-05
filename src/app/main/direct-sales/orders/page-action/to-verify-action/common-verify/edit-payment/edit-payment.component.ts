import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ErrorMessageLock } from 'app/core/enum/error-message.enum';
import { OrdersService, UpdateFormPayment } from 'app/core/service/orders.service';
import { CheckNullOrUndefined, CheckNullOrUndefinedOrEmpty } from 'app/core/utils/common-function';
import { CommonDialogComponent } from 'app/main/_shared/common-dialog/common-dialog.component';
import { DialogChangePaymentTypeComponent } from 'app/main/_shared/dialog-change-payment-type/dialog-change-payment-type.component';
import * as jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-edit-payment',
  templateUrl: './edit-payment.component.html',
  styleUrls: ['./edit-payment.component.scss']
})
export class EditPaymentComponent implements OnInit {

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private _orderService: OrdersService,
  ) { }

  gridApi: any;
  active: any;
  params: any;
  id: any;
  rowNode: any;
  amount: any;
  data: any;
  fullOrder;
  decoded: any;
  entity: number;
  agInit(params) {
    this.gridApi = params.api;
    this.params = params;
    this.id = params.data.id;
    this.active = params.value;
    // console.log(this.params.context.componentParent)

    this.rowNode = this.gridApi.getRowNode(this.params.node.id);
    this.amount = this.rowNode.data.display_amount.split(" ")[1];
    this.data = this.amount.replace(",", "");
    // console.log(this.params.data);
  }

  ngOnInit(): void {
    let token = localStorage.getItem('token');
    if (!CheckNullOrUndefinedOrEmpty(token)){
        this.decoded = jwt_decode(token);
        this.entity = Number(this.decoded.entity_id)
        // console.log(this.decoded)
    }
    this.fullOrder = this.params.context.componentParent.fullOrder;
  }

  async editAction(){
    let dataLock;
    await this._orderService.checkLockOrder(this.fullOrder.id).toPromise().then(data=>{
      dataLock = data;
    })
    if(dataLock == 1){
      const dialogRef = this.dialog.open(DialogChangePaymentTypeComponent, {
        width: '600px',
        data: { message: "Please verify the payment detail.",entity: this.entity ,type: "APPROVED" ,
            paymentOption : this.fullOrder.payment_option , paymentMethod: this.params.data.payment_method ,
            paymentRef : this.params.data.payment_reference
          }
      });

      dialogRef.afterClosed().subscribe(result => {
        if ( !CheckNullOrUndefinedOrEmpty(result) && result.state === true) {
          // console.log(result.data.paymentRef)
          let updateFormPayment = new UpdateFormPayment;
          updateFormPayment.payment_id = this.params.data.id;
          updateFormPayment.type = !CheckNullOrUndefinedOrEmpty(result.data.type) ? result.data.type : '';
          updateFormPayment.method = !CheckNullOrUndefinedOrEmpty(result.data.method) ? result.data.method : '';
          updateFormPayment.paymentRef = (!CheckNullOrUndefinedOrEmpty(result.data.paymentRef) && result.data.paymentRef.trim() !== this.params.data.payment_reference) ? result.data.paymentRef : '';
          updateFormPayment.comment = !CheckNullOrUndefinedOrEmpty(result.data.comment) ? result.data.comment : '';
          this._orderService.editPaymentByAdmin(updateFormPayment , this.fullOrder.id).subscribe(data=>{
            // console.log(data)
            if(data.code === 200){
              this.params.context.componentParent.getOrder(this.fullOrder.id)
            }
          })
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
  }

}
