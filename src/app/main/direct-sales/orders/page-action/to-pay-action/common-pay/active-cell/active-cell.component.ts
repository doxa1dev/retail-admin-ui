import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { OrderPayment, OrdersService } from 'app/core/service/orders.service';
import { Router } from '@angular/router';
import { PaymentService } from '../../../../../../../core/service/payment.service';
import { RequeryPaymentStatus } from '../../../../../../../core/models/requery-payment-status.model';
import { ErrorMessageLock } from 'app/core/enum/error-message.enum';
import { CommonDialogComponent } from 'app/main/_shared/common-dialog/common-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'active-cell',
  templateUrl: './active-cell.component.html',
  styleUrls: ['./active-cell.component.scss'],
})

export class ActiveCellCustomComponent implements OnInit {
  constructor(
    private paymentService: PaymentService,
    private router: Router,
    private _orderService : OrdersService,
    private dialog: MatDialog,
  ) { }

  params: any;
  // gridApi: any;
  // id: any;
  // active: any;
  rowData: OrderPayment;

  agInit(params) {
    this.params = params;
    // this.gridApi = params.api;
    // this.id = params.data.id;
    // this.active = params.value;
    // console.log(this.params.context.componentParent);
    this.rowData = params.data;
  }

  ngOnInit() { }

  async requeryPaymentStatus() {
    let dataLock;
    await this._orderService.checkLockOrder(this.params.context.componentParent.fullOrder.id).toPromise().then(data=>{
      dataLock = data;
    })
    if(dataLock == 1){
      this.params.context.componentParent.isRequeryingPaymentStatus = true;
      this.params.context.componentParent.isPaymentStatusRequeryError = false;
      this.params.context.componentParent.paymentErrorMsg = '';

      const requeryPaymentStatus: RequeryPaymentStatus = new RequeryPaymentStatus();
      requeryPaymentStatus.etPaymentServiceAgentId = this.rowData.paymentAgentServiceId;
      requeryPaymentStatus.refNo = this.rowData.paymentReference;
      requeryPaymentStatus.amount = this.rowData.paymentAmount;

      this.paymentService.requeryPaymentStatus(requeryPaymentStatus).subscribe(response => {
        this.params.context.componentParent.isRequeryingPaymentStatus = false;
        if (response === null || response.code === '500') {
          this.params.context.componentParent.isPaymentStatusRequeryError = true;
          this.params.context.componentParent.paymentErrorMsg = response.msg;
        }
        else {
          this.params.context.componentParent.onPaymentStatusUpdated();
        }
      });

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
