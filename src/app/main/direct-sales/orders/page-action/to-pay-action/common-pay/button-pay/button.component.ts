import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Router } from '@angular/router';
import { OrdersService } from 'app/core/service/orders.service';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { DialCodeComponent } from 'app/main/pages/authentication/dial-code/dial-code.component';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { ConfirmDialogComponent } from 'app/main/_shared/confirm-dialog/confirm-dialog.component';
import { ErrorMessageLock } from 'app/core/enum/error-message.enum';
import { CommonDialogComponent } from 'app/main/_shared/common-dialog/common-dialog.component';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit {
  @Input() orderId;
  @Input() pendingPayment
  @Input() fullOrder
  @Input() checkLock
  // @Input() isOrderFullyPaid: boolean;
  id;
  checkPaid: boolean = false
  // checkLock
  constructor(
    private router: Router, private _orderService: OrdersService,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.id = "#" + this.orderId;
    if(this.pendingPayment === 0){
      this.checkPaid = true
    }

    // this._orderService.checkLockOrder(this.orderId).subscribe(data=>{
    //   this.checkLock = data;
    // })
  }

  async navigateToVerify() {
    let dataLock;
    await this._orderService.checkLockOrder(this.fullOrder.id).toPromise().then(data=>{
      dataLock = data;
    })
    if(dataLock == 1){
      if(this.checkPaid){
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
          width: '700px',
          data: { message: 'Are you sure you want to Mark As Paid?', type: "APPROVED" }
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result === true) {
            this._orderService.updateStatusOfOrder(this.orderId, 'TO_VERIFY').subscribe(data=>{
              if(data.code === 200){
                this.router.navigate(['direct-sales/orders/to-verify'], { queryParams: { id: this.id } });
              }
            });
            // this.updateStatusOrder(this.orderId, 'TO_VERIFY');
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

  // navigateToShip() {
  //   this.router.navigate(['direct-sales/orders/to-ship'], { queryParams: { id: this.id } });
  //   this.updateStatusOrder(this.orderId, 'TO_SHIP');
  // }

  async navigateCancel() {
    let dataLock;
    await this._orderService.checkLockOrder(this.fullOrder.id).toPromise().then(data=>{
      dataLock = data;
    })
    if(dataLock == 1){
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '600px',
        data: { message: 'Are you sure you want to cancel this order?', type: "CANCEL" }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result === true) {
          this._orderService.updateStatusOfOrder(this.orderId, 'CANCELLED').subscribe(data=>{
            if(data.code === 200){
              this.router.navigate(['direct-sales/orders/cancelled'], { queryParams: { id: this.id } });
            }
          });
          // this.updateStatusOrder(this.orderId, 'CANCELLED');
        } else {
          dialogRef.close();
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

  updateStatusOrder(order_id, status) {
    this._orderService.updateStatusOfOrder(order_id, status).subscribe();
  }
}
