import { Component, Inject , ViewEncapsulation, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder } from '@angular/forms';
import { REASONS_FOR_ADVISOR_TO_NOT_UNBOX , REASONS_FOR_ADVISOR_TO_NOT_HOST} from 'app/core/constants/reason-host-and-unbox'
import { OrdersService } from 'app/core/service/orders.service'
import { isNullOrUndefined } from 'util';
@Component({
    selector   : 'common-dialog',
    templateUrl: './dialog-reason.component.html',
    styleUrls  : ['./dialog-reason.component.scss'],
    encapsulation: ViewEncapsulation.Emulated
})
export class DialogReasonComponent
{
    public confirmMessage: string;
    public colorButton: boolean;
    input: string = '';
    buttonRed = '#de3535';
    buttonGreen = '#7DA863';
    buttonGrey = 'grey'
    form: FormGroup;
    reasonList = [];
    disableInput:boolean = true;
    reasonInput: string ;
    orderId: number;
    reason: string;
    ortherReason: boolean = false;
    noUnbox: boolean = false;
    disableButton: boolean = true;
    noHost : boolean = false;
    /**
     * Constructor
     *
     * @param {MatDialogRef<DialogReasonComponent>} dialogRef
     */
    constructor(
        public dialogRef: MatDialogRef<DialogReasonComponent>, private fb: FormBuilder, private orderSevice : OrdersService,
        @Inject(MAT_DIALOG_DATA) public data: any) {
          if(data){

            this.confirmMessage = data.message || this.confirmMessage;
            this.orderId = data.orderId || this.orderId
            if(this.confirmMessage === "Not Unboxed Reasons:"){
              this.reasonList = REASONS_FOR_ADVISOR_TO_NOT_UNBOX;
              this.noUnbox = true;
            }else if(this.confirmMessage === "Not Hosted Reasons:"){
              this.reasonList = REASONS_FOR_ADVISOR_TO_NOT_HOST;
              this.noHost = true;
            }else{
              this.reasonList = REASONS_FOR_ADVISOR_TO_NOT_HOST;
            }
          }
        }

        onChange(event){
          if(event.target.value==="100"){
            this.disableInput = false;
            this.ortherReason = true;
            this.disableButton = true;
            $("#input").keyup(()=>{
              // console.log($("#input").val())
                if(!isNullOrUndefined($("#input").val()) && ($("#input").val()) != '' ){
                this.disableButton = false
                }else{
                  this.disableButton = true;
                }
            })

          }else{
            this.disableButton = false
            this.disableInput = true;
            this.reason = this.reasonList[Number(event.target.value)-1].label
          }
        }

        updateReason(){

          if(this.noUnbox){
            if(!this.ortherReason){
              this.orderSevice.updateReason(this.reason, this.orderId, true).subscribe();
            }else{
              this.reasonInput =  $("#input").val().toString();
              this.orderSevice.updateReason(this.reasonInput, this.orderId, true).subscribe();
            }
          }else if(this.noHost){
            if(!this.ortherReason){
              this.orderSevice.updateReason(this.reason.toString(), this.orderId, false).subscribe();
            }else{
              this.reasonInput =  $("#input").val().toString();
              this.orderSevice.updateReason(this.reasonInput, this.orderId, false).subscribe();
            }
          }else{
            this.dialogRef.close(true);
          }
          this.dialogRef.close(true);
        }

}
