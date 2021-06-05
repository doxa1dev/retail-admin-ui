import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CheckNullOrUndefinedOrEmpty } from 'app/core/utils/common-function';


@Component({
  selector: 'app-dialog-change-payment-type',
  templateUrl: './dialog-change-payment-type.component.html',
  styleUrls: ['./dialog-change-payment-type.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class DialogChangePaymentTypeComponent implements OnInit {

  public confirmMessage: string;
  public type : string;

  checkComments : boolean = false;
  buttonGreen = '#7DA863';
  buttonGrey = 'grey';


  selectedType;
  listType;
  listTypeMY;
  listTypeSG;
  selectedMethod;
  listMethod;
  entity: number;
  paymentType: string;
  paymentMethod: string;


  paymentRef: string;
  typeSubmit: string;
  methodSubmit: string;
  comments : any;
    /**
   * Constructor
   *
   * @param {MatDialogRef<DialogTextareaCommentComponent>} dialogRef
   */
  constructor(
    public dialogRef: MatDialogRef<DialogChangePaymentTypeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any)
  {
    if (data)
    {
      this.confirmMessage = data.message || this.confirmMessage;
      this.type = data.type || this.type;
      this.entity = data.entity;
      this.paymentMethod = data.paymentMethod;
      this.paymentType = data.paymentOption;
      this.paymentRef = data.paymentRef;
    }

    this.listTypeMY = [
      {label:'MOTO' , id: 'DEP'},
      {label:'EPP' , id:'EPP'},
      {label:'FULL' , id: 'FUL'},
    ];
    this.listTypeSG = [
      {label:'IPP' , id:'EPP'},
      {label:'FULL' , id: 'FUL'},
    ];

    this.listMethod = [
      {label:'Cash' , id: 'CASH'},
      {label:'Credit/Debit Card' , id: 'CREDIT_CARD'},
      {label:'Bank Transfer' , id: 'ONLINE_BANKING'},
      {label:'PayNow' , id: 'TT'},
      {label:'e-Wallets' , id: 'EWALLET'},
      {label:'Cheque' , id: 'CHECK'},
      {label:'Office' , id: 'OFFICE'}
    ]
  }

  ngOnInit(): void {

    if(this.paymentMethod == 'TT'){
      this.selectedMethod = {label:'PayNow' , id: 'TT'};
    }else if(this.paymentMethod == 'CREDIT_CARD'){
      this.selectedMethod = {label:'Credit/Debit Card' , id: 'CREDIT_CARD'};
    }else if(this.paymentMethod == 'OFFICE'){
      this.selectedMethod = {label:'Office' , id: 'OFFICE'};
    }else if(this.paymentMethod == 'ONLINE_BANKING'){
      this.selectedMethod = {label:'Bank Transfer' , id: 'ONLINE_BANKING'};
    }

    if(this.paymentType == 'FUL'){
      this.selectedType = {label:'FULL' , id: 'FUL'}
    }else if(this.paymentType == 'DEP'){
      this.selectedType = {label:'MOTO' , id: 'DEP'}
    }else if(this.paymentType == 'EPP' && this.entity == 2){
      this.selectedType = {label:'EPP' , id: 'EPP'}
    }else if(this.paymentType == 'EPP' && this.entity != 2){
      this.selectedType = {label:'IPP' , id: 'EPP'}
    }

  }

  submitData(){
    if((this.paymentRef.length == 0 && this.selectedMethod.id != 'CASH') || CheckNullOrUndefinedOrEmpty(this.comments) ){
      this.checkComments = CheckNullOrUndefinedOrEmpty(this.comments) ? true : false ;
      return;
    }else{
      this.dialogRef.close({state:true , data: {comment: this.comments , paymentRef: this.paymentRef, type: this.typeSubmit, method: this.methodSubmit}})
    }
  }


  changeType(event){
    if(this.paymentType != event.value.id){
      this.typeSubmit = event.value.id;
    }else{
      this.typeSubmit = '';
    }
  }

  checkReference: boolean = true;

  changeMethod(event){
    // console.log(this.selectedMethod)
    if(event.value.id == 'CASH'){
      this.checkReference = false;
    }else{
      this.checkReference = true;
    }

    if(this.paymentMethod != event.value.id){
      this.methodSubmit = event.value.id;
    }else{
      this.methodSubmit = '';
    }
  }

}
