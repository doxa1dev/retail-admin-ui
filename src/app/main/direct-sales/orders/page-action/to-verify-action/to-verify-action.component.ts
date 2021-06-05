import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { Product, Properties } from 'app/core/models/product.model';
import { Location, formatCurrency } from '@angular/common';
import { OrdersService, Order } from 'app/core/service/orders.service';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { RowEvent, GridOptions, GridApi, AgGridEvent, IGetRowsParams, ColDef, ColumnApi, GridSizeChangedEvent } from 'ag-grid-community';
import { ActiveCellCustomComponent } from './common-verify/active-cell/active-cell.component';
import { async } from '@angular/core/testing';
import { state } from '@angular/animations';
import { ViewPaymentDocComponent } from './common-verify/view-payment-doc/view-payment-doc.component';

import HelperFn from '../../helper/helper-fn';
import { environment } from 'environments/environment';
import { isNullOrUndefined } from 'util';

import { AllModules } from '@ag-grid-enterprise/all-modules';
import '@ag-grid-community/all-modules/dist/styles/ag-grid.css';
import '@ag-grid-community/all-modules/dist/styles/ag-theme-alpine.css';

//
import { CustomerInformationService } from "app/core/service/customer-information.service";
import { CommonDialogComponent } from 'app/main/_shared/common-dialog/common-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ErrorMessageLock } from 'app/core/enum/error-message.enum';
import { CheckNullOrUndefinedOrEmpty } from 'app/core/utils/common-function';
import { ToHostActionComponent } from '../to-host-action/to-host-action.component';
import { SHIPPING_METHOD } from 'app/core/constants/shipping-method';
import { ShippingService } from 'app/core/service/shipping.service';
import { EditPaymentComponent } from './common-verify/edit-payment/edit-payment.component';
import * as jwt_decode from 'jwt-decode';
import { DialCodeComponent } from 'app/main/pages/authentication/dial-code/dial-code.component';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-to-verify-action',
  templateUrl: './to-verify-action.component.html',
  styleUrls: ['./to-verify-action.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ToVerifyActionComponent implements OnInit {
  helperFn = new HelperFn();

  order = "";
  order_id;
  orderAt: Date;
  namePage = "To Verify";

  pendingPayment = 0;
  paid = 0;
  pendingVerified = 0;
  verified = 0;

  columnApi;
  gridApi: any;
  gridOptions: any;
  rowDataLength: number = 0;
  paymentInstallment : string ;
  // isOrderFullyPaid: boolean;

  currency: any;

  displayAddress: string;
  displayStateCountry: string;
  storageUrl = environment.storageUrl;
  advisorCustomer = 0;
  isShowSearch: boolean = false;
  advisorId: string;
  advisorName: string='';
  //
  advisorImg: string = "assets/icons/doxa-icons/UserMenu.svg";
  //
  /** payment method */
  methodPaymentList = new Array<String>();
  advisorImage: any;
  isShow: boolean = false;
  isShowCustomerInformation: boolean = false;
  modules = AllModules;

  buttonName:string = "Submit ";
  active: boolean = false;
  histories: any;

  //LockOrder-----
  checkedLock: boolean;
  lockOrderTitle: string ;
  lockBy : string;
  lockTime: string;
  checkLock;
  style_shipping_location : string;
  remask_advisor_name : string;
  remask_advisor_id : string;
  remask_advisor_phone : string;
  // -------

  isShowEdit: boolean = false;
  isAssign: boolean = false;
  isRecurringPayment : boolean ;
  countryName: string;
  @ViewChild(DialCodeComponent) dialcode: DialCodeComponent;
  customerInforEditForm: FormGroup;
  deliveryDialCodeInfor;
  nation_code;
  city_state_code_infor = new Object();
  stateCodeToNameFormOptions
  customerName

  constructor(
    private _location: Location,
    private _orderService: OrdersService,
    private router: Router, private _route: ActivatedRoute,
    private customerService: CustomerInformationService,
    public dialog: MatDialog,
    private shippingService: ShippingService,
    private _formBuilder: FormBuilder,
  ) {
    this.gridOptions = <GridOptions> {
      context: {
        componentParent: this
      }
    };
  }

  columnDefs = [
    { headerName: "Amount", field: "display_amount", sortable: true, filter: true, width: 120, resizable: false },
    { headerName: "Type", field: "payment_option", sortable: true, filter: true, width: 80, resizable: false },
    { headerName: "Method", field: "payment_method", sortable: true, filter: true, width: 90, resizable: false },
    { headerName: "Reference No.", field: "payment_reference", sortable: true, filter: 'agTextColumnFilter', width: 120, resizable: true },
    { headerName: "Status", field: "status", sortable: true, filter: true, width: 95, resizable: true },
    { headerName: "Doc", field: "doc", sortable: true, filter: true, width: 75, resizable: true, "cellRendererFramework": ViewPaymentDocComponent },
    { headerName: "Edit", field: "action", sortable: true, filter: true, width: 130, resizable: false, "cellRendererFramework": EditPaymentComponent },
    // { headerName: "Action", field: "action", sortable: true, filter: true, width: 130, resizable: false, "cellRendererFramework": ActiveCellCustomComponent },
  ];

  rowData: any = [];
  fullOrder: Order;
  listProduct: Array<Product> = [];
  listHistories: Array<OrderHistories> = [];
  listDataPayment: Array<VerifyOrder> = [];
  addressCustomer: string;
  stateCountryCustomer: string;
  page : number;
  showStateCountry: string;
  decoded: any;

  //change shipping
  shippingMethodArr = SHIPPING_METHOD;
  shippingMethod;
  isShowShipping: boolean = false;
  isCheckChangeShipping: boolean = false;

  ngOnInit(): void {

      //Decoded token for country and city-state list.
    let token = localStorage.getItem('token');
    if (!CheckNullOrUndefinedOrEmpty(token)){
      this.decoded = jwt_decode(token);

    }
    if(this.decoded.entity_id === "2")
    {
      this.nation_code = "MY"
      this.countryName = "Malaysia"
    }else if (this.decoded.entity_id === "1")
    {
      this.nation_code = "SG"
      this.countryName = "Singapore"
    }
    else{
      this.nation_code = "SG"
    }

    this._route.queryParams.subscribe(params => {
      this.order = params.id;
      this.order_id = this.order.replace("#", '');
      this.page = params.page;
    });
    this._orderService.checkOrderStatus(this.order_id).subscribe(data=>{
      this._orderService.changeOrderPage(data , this.order_id , this.page , 'TO_VERIFY')
    })
    this.getOrder(this.order_id);
    this._orderService.checkLockOrder(this.order_id).subscribe(data=>{
      this.checkLock = data;
    });
    this.customerInforEditForm = this._formBuilder.group({
      fullNameInfor: [''],
      phoneNumberInfor: [''],
      addressLine1Infor: [''],
      addressLine2Infor: [''],
      addressLine3Infor: [''],
      stateCodeInfor: [''],
      postalCodeInfor: [''],
      countryCodeInfor: ['']
    });
  }

  getOrder(orderId): Promise<any> {
    return new Promise(resolve => {
      setTimeout(() => {
        this._orderService.getOrderbyOrderId(orderId).subscribe(respone => {

          if (!isNullOrUndefined(respone.data.payments) && respone.data.payments.length != 0) {

            let methodList = [];
            //  console.log(respone.data.payments)
            respone.data.payments.forEach(element => {
              if (!methodList.includes(element.payment_method) && element.payment_status === "success") {
                methodList.push(element.payment_method);
              }
              if(!CheckNullOrUndefinedOrEmpty(element.is_recurring_payment)) {
                this.isRecurringPayment = true;

              }

            });

            this.methodPaymentList = new Array<String>();
            methodList.forEach(element => {
              // console.log(methodList)
              if (element === "TT") {
                this.methodPaymentList.push("Pay by Telegraphic Transfer (TT)");
              } else if (element === "OFFICE" || element === 'CASH') {
                this.methodPaymentList.push("Pay at Thermomix Office");
              } else if (element === "CREDIT_CARD") {
                this.methodPaymentList.push("Pay with Credit/Debit Card");
              } else if (element === "ONLINE_BANKING") {
                this.methodPaymentList.push("Pay at Online Banking");
              } else if (element === 'EWALLET'){
                this.methodPaymentList.push("Pay at e-Wallets");
              } else if (element === 'CHECK'){
                this.methodPaymentList.push("Pay by cheque");
              }
            });
          }


          this.fullOrder = this._orderService.renderDataOrder(respone,true);
          this.customerName = respone.data.customer.firt_name
          if (this.fullOrder.shipping.shippingMethod === 'SELF_COLLECT') {
            this.shippingMethod = this.shippingMethodArr.filter(shipping => shipping.value === 2)[0];
          } else {
            if (this.fullOrder.shipping.isManualShipping) {
              this.shippingMethod = this.shippingMethodArr.filter(shipping => shipping.value === 0)[0];
            } else {
              this.shippingMethod = this.shippingMethodArr.filter(shipping => shipping.value === 1)[0];
            }
          }
          this.showStateCountry = this.helperFn.setStateCountryLine(this.fullOrder.customerInformation.state_code, this.fullOrder.customerInformation.country_code);
          this.remask_advisor_name = this.fullOrder.remark_advisor_name;
          this.remask_advisor_id = this.fullOrder.remark_advisor_id;
          this.remask_advisor_phone = this.fullOrder.remark_advisor_phone;
          if(!CheckNullOrUndefinedOrEmpty(this.fullOrder.shipping.shipping_location_color))
          {
            this.style_shipping_location = `border-left: 20px solid ${this.fullOrder.shipping.shipping_location_color};`
          }else{
            this.style_shipping_location = `border-left: 20px solid white;`
          }
          // Detail of Lock order--------------------
          this.checkedLock = this.fullOrder.checkOrderLock
          if(this.checkedLock){
            this.lockOrderTitle = "LOCKED"
          }else{
            this.lockOrderTitle = "LOCK ORDER"
          }
          if(this.fullOrder.dataLock !== null && this.fullOrder.dataLock !== undefined){
            this.lockBy = this.fullOrder.dataLock.adminEmail;
            this.lockTime = this.fullOrder.dataLock.time;
          }

          //----------------------------------------------
          if (!isNullOrUndefined(this.fullOrder.advisorCustomer)) {
            //check null image
            if (isNullOrUndefined(this.fullOrder.advisorCustomer.profilePhotoKey)) {
              this.advisorImage = "assets/icons/doxa-icons/UserMenu.svg";
            } else {
              this.advisorImage = this.storageUrl + this.fullOrder.advisorCustomer.profilePhotoKey;
            }
          }
          this.histories = this.fullOrder.history;
          this.pendingPayment = this.fullOrder.pendingPayment;
          this.paid = this.fullOrder.paid;
          this.pendingVerified = this.fullOrder.pendingVerified;
          this.verified = this.fullOrder.verified;
          // if (Number(this.fullOrder.totalAmount) !== this.paid) {
          //   this.isOrderFullyPaid = false;
          // }
          this.currency = !this.fullOrder.currency ? '' : this.fullOrder.currency;
          this.displayAddress = this.helperFn.setDisplayAddressLine(this.fullOrder.deliveryAddress.addressLine1, this.fullOrder.deliveryAddress.addressLine2, this.fullOrder.deliveryAddress.addressLine3, this.fullOrder.deliveryAddress.postalCode);
          this.deliveryDialCodeInfor = !CheckNullOrUndefinedOrEmpty(this.fullOrder.customerInformation.phoneDialCode)? this.fullOrder.customerInformation.phoneDialCode : (this.nation_code === 'MY' ? '60' : "65");
          this.city_state_code_infor = !CheckNullOrUndefinedOrEmpty(this.fullOrder.customerInformation.state_code) ? this.fullOrder.customerInformation.state_code : (this.nation_code !== 'MY' ? 'SG' : '');
          this.stateCodeToNameFormOptions = environment.countryCodeToStates[this.nation_code];
          this.displayStateCountry = this.helperFn.setStateCountryLine(this.fullOrder.deliveryAddress.stateCode, this.fullOrder.deliveryAddress.countryCode);

          if (!isNullOrUndefined(this.fullOrder.customer.address)) {
            this.addressCustomer = this.helperFn.setDisplayAddressLine(this.fullOrder.customer.address.addressLine1, this.fullOrder.customer.address.addressLine2, this.fullOrder.customer.address.addressLine3, this.fullOrder.customer.address.postalCode);
            this.stateCountryCustomer = this.helperFn.setStateCountryLine(this.fullOrder.customer.address.stateCode, this.fullOrder.customer.address.countryCode);
          } else {
            this.addressCustomer = "";
            this.stateCountryCustomer = "";
          }

          if(!CheckNullOrUndefinedOrEmpty(this.remask_advisor_name) && !CheckNullOrUndefinedOrEmpty(this.fullOrder.advisorCustomer)) {
            this.isAssign = true;
          }else {
            this.isAssign = false;
           }
          
           //Get Customer Information
           this.customerInforEditForm.get('fullNameInfor').setValue(this.fullOrder.customerInformation.firstName);
           this.customerInforEditForm.get('phoneNumberInfor').setValue(this.fullOrder.customerInformation.phoneNumber);
           this.customerInforEditForm.get('addressLine1Infor').setValue(this.fullOrder.customerInformation.address_line1);
           this.customerInforEditForm.get('addressLine2Infor').setValue(this.fullOrder.customerInformation.address_line2);
           this.customerInforEditForm.get('addressLine3Infor').setValue(this.fullOrder.customerInformation.address_line3);
           this.customerInforEditForm.get('postalCodeInfor').setValue(this.fullOrder.customerInformation.postal_code);


        });
      }, 500);
    });
  }

  back() {
    this.router.navigate(["/direct-sales/orders"], { state: { selectTab: 1 , page : this.page } });
  }

  nextViewCustomer() {
    this.router.navigate(["/direct-sales/customers/details"], { queryParams: { id: this.fullOrder.customer.uuid }});
  }

  updateStatusOrder(order_id, status) {
    this._orderService.updateStatusOfOrder(order_id, status).subscribe();
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
    params.api.sizeColumnsToFit();
  }

  onGridSizeChanged(params: GridSizeChangedEvent) {
    params.api.sizeColumnsToFit();
  }

  async assignAdvisor() {
    let dataLock;
    await this._orderService.checkLockOrder(this.order_id).toPromise().then(data=>{
      dataLock = data;
    })
    if(dataLock == 1){
      if (this.isShowSearch) {
        this.isShowSearch = false;
      } else {
        this.advisorId = '';
        this.advisorName = '';
        this.isShowSearch = true;
        this.advisorImg = "assets/icons/doxa-icons/UserMenu.svg";
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

  addAdvisor() {

    if (CheckNullOrUndefinedOrEmpty(this.advisorName)) {
      var previous = <HTMLInputElement>document.getElementById('#edit-advisor');

      previous.disabled = true;
    }

    this.active = true;
    this.buttonName = "Processing...";

    var formAdvisor = {
      order_id: Number(this.order_id),
      advisor_id: Number(this.advisorId)
    };
    this._orderService.addAssignAdvisor(formAdvisor).subscribe(
      data => {

        if (data.code === 200) {
          this.isShowSearch = false;
          // this.fullOrder.advisorCustomer.advisorIdNumber = this.advisorId;
          // this.fullOrder.advisorCustomer.preferredName = this.advisorName;
          this.getOrder(this.order_id);
          this.advisorName = '';
          this.isShow = false;
          this.advisorId = "";
          this.active = false;
          this.buttonName = "Submit "

         // this.buttonName = "Add Assign Advisor";
        }
      }
    );
  }

  // searchAdvisorId(value) {
  //   this.advisorId = value;

  //   this._orderService.searchAdvisorByAdvisorId(this.advisorId).subscribe(
  //     data => {
  //       this.advisorName = data.advisorName;
  //     }
  //   );
  // }
  searchAdvisorId(value) {
    if (value === '') {
      this.advisorName = '';
      this.advisorImg = "assets/icons/doxa-icons/UserMenu.svg";
      return;
    }
    this.customerService.searchAdvisorByAdvisorId(value).subscribe((data) => {
      if (!isNullOrUndefined(data)) {
        this.advisorName = data.advisorName;
        if (!isNullOrUndefined(data.advisorPhotoKey)) {
          this.advisorImg = this.storageUrl + data.advisorPhotoKey;
        }
      } else {
        this.advisorName = '';
        this.advisorImg = "assets/icons/doxa-icons/UserMenu.svg";
      }
    });
  }


  async showEditAdvisor() {
    let dataLock;
    await this._orderService.checkLockOrder(this.order_id).toPromise().then(data=>{
      dataLock = data;
    })

    if(dataLock == 1){
      if (this.isShowEdit) {
        this.isShowEdit = false;
      } else {
        this.isShowEdit = true;
        this.isAssign = false;
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


  editAdvisor() {

    if (this.advisorName.length === 0 || CheckNullOrUndefinedOrEmpty(this.advisorName)) {
      var previous = <HTMLInputElement>document.getElementById('edit-advisor');

      previous.disabled = true;
    }

    this.active = true;
    this.buttonName = "Processing...";

    var formAdvisor = {
      order_id: Number(this.order_id),
      advisor_id: Number(this.advisorId),
      is_edit: true
    };
    this._orderService.addAssignAdvisor(formAdvisor).subscribe(
      data => {

        if (data.code === 200) {
          this.isShowEdit = false;
          this.getOrder(this.order_id);
          this.advisorName = '';
          this.isShow = false;
          this.advisorId = "";
          this.active = false;
        }

      }
    );
  }

  async showChangeShippingForm() {

    let dataLock;
    await this._orderService.checkLockOrder(this.order_id).toPromise().then(data=>{
      dataLock = data;
    })
    if(dataLock == 1){

      if (this.isShowShipping) {
        this.isShowShipping = false;
      } else {
        this.isShowShipping = true;
      }
    } else if(dataLock == 2){

      const dialogRef = this.dialog.open(CommonDialogComponent, {
        width: '600px',
        data: { message: ErrorMessageLock.ANOTHER_LOCK , type: "back" ,
                colorButton: true , title : 'REMINDER' , buttonName: 'GO BACK' }
      });
    } else if(dataLock == 3){

      const dialogRef = this.dialog.open(CommonDialogComponent, {
        width: '600px',
        data: { message: ErrorMessageLock.LOCKED_BEFORE_PROCESS, type: "back" ,
                colorButton: true , title : 'REMINDER' , buttonName: 'GO BACK' }
      });
    } else{

      const dialogRef = this.dialog.open(CommonDialogComponent, {
        width: '600px',
        data: { message: ErrorMessageLock.ERROR_LOCKED, type: "back" ,
                colorButton: true , title : 'REMINDER' , buttonName: 'GO BACK' }
      });
    }
  }

  async showCustomerInformation() {
    let dataLock;
    await this._orderService.checkLockOrder(this.order_id).toPromise().then(data=>{
      dataLock = data;
    })
    if(dataLock == 1){

      if (this.isShowCustomerInformation) {
        this.isShowCustomerInformation = false;
      } else {
        this.isShowCustomerInformation = true;
      }
    } else if(dataLock == 2){

      const dialogRef = this.dialog.open(CommonDialogComponent, {
        width: '600px',
        data: { message: ErrorMessageLock.ANOTHER_LOCK , type: "back" ,
                colorButton: true , title : 'REMINDER' , buttonName: 'GO BACK' }
      });
    } else if(dataLock == 3){

      const dialogRef = this.dialog.open(CommonDialogComponent, {
        width: '600px',
        data: { message: ErrorMessageLock.LOCKED_BEFORE_PROCESS, type: "back" ,
                colorButton: true , title : 'REMINDER' , buttonName: 'GO BACK' }
      });
    } else{

      const dialogRef = this.dialog.open(CommonDialogComponent, {
        width: '600px',
        data: { message: ErrorMessageLock.ERROR_LOCKED, type: "back" ,
                colorButton: true , title : 'REMINDER' , buttonName: 'GO BACK' }
      });
    }
  }

  updateCustomerInfor() {

    let customerInfor = {
      'first_name':  this.customerInforEditForm.value.fullNameInfor,
      'phone_number': this.customerInforEditForm.value.phoneNumberInfor,
      'phone_dial_code': this.dialcode.SelectedDial,
      'address_line1': this.customerInforEditForm.value.addressLine1Infor,
      'address_line2': this.customerInforEditForm.value.addressLine2Infor,
      'address_line3': this.customerInforEditForm.value.addressLine3Infor,
      'postal_code':  this.customerInforEditForm.value.postalCodeInfor,
      'state_code': this.customerInforEditForm.value.stateCodeInfor,
      'is_update_profile': false
    }

    this._orderService.updateCustmerInformation(customerInfor,  this.fullOrder.customerInformation.id).subscribe(
      data => {
        if (data.code === 200) {

          const dialogNotifi = this.dialog.open(CommonDialogComponent, {
            width: "600px",
            data: {
              message:
                "Update Customer Information Success.",
              title:
                "NOTIFICATION",
              colorButton: false
            },
          });

          dialogNotifi.afterClosed().subscribe(
            data => {
              if (data) {
                this.getOrder(this.order_id);
                this.isShowCustomerInformation = false;
              }
            }
          )
        }
      }
    )
  }

  changeShipping() {
    if (!this.isCheckChangeShipping) {
      this.isShowShipping = false;
    } else {
      this.isCheckChangeShipping = false;

    let shippingMethod = {
      'shippingId': this.fullOrder.shipping.id,
      'orderId': this.fullOrder.id,
      'shippingMethod': this.shippingMethod.data
    }

    this.shippingService.changeShippingMethod(shippingMethod).subscribe(
      data => {
        if (data.code === 200) {

          const dialogNotifi = this.dialog.open(CommonDialogComponent, {
            width: "600px",
            data: {
              message:
                "Update Shipping Method Success.",
              title:
                "NOTIFICATION",
              colorButton: false
            },
          });

          dialogNotifi.afterClosed().subscribe(
            data => {
              if (data) {
                this.getOrder(this.order_id);
                this.isShowShipping = false;
              }
            }
          )
        }
      }
    )}
  }

  keepOriginalOrder = (a, b) => a.key;

  onChangeShipping(event) {
    this.isCheckChangeShipping = true;
    this.shippingMethod = this.shippingMethodArr.filter(shipping => shipping.value === event.value.value)[0];
  }

  checkLockOrder(event){

    if(event.checked){
      this.lockOrderTitle = "LOCKED";
    }else{
      this.lockOrderTitle = "LOCK ORDER";
    }
    this.checkedLock = event.checked;
    let formLockOrder = new FormLock;
    formLockOrder.order_id = Number(this.order_id)
    formLockOrder.locked_status = event.checked;
    this._orderService.lockOrder(formLockOrder).subscribe(data=>{
      if(data.code === 200){
        this.lockTime = data.data.locked_at;
        this.lockBy = data.data.appUser !== null ? data.data.appUser.email : ""
      }else if(data.code ===201){
        this.checkedLock = false;
        this.lockOrderTitle = "LOCK ORDER"
        const dialogNotifi = this.dialog.open(CommonDialogComponent, {
          width: "600px",
          data: {
            message:
              data.message,
            title:
              "NOTIFICATION",
            colorButton: true
          },
        });
      }else if(data.code === 202){
        this.checkedLock = true;
        this.lockOrderTitle = "LOCKED"
        const dialogNotifi = this.dialog.open(CommonDialogComponent, {
          width: "600px",
          data: {
            message:
              data.message,
            title:
              "NOTIFICATION",
            colorButton: true
          },
        });
      }else if(data.code === 203){
        this.checkedLock = false;
        this.lockOrderTitle = "LOCK ORDER"
        const dialogNotifi = this.dialog.open(CommonDialogComponent, {
          width: "600px",
          data: {
            message:
              data.message,
            title:
              "NOTIFICATION",
            colorButton: true
          },
        });
        dialogNotifi.afterClosed().subscribe(state => {
          if(data.code == 203){
            this.getOrder(this.order_id)
            return

          }
        });
      }else{
        this.checkedLock = false;
        this.lockOrderTitle = "LOCK ORDER"
        const dialogNotifi = this.dialog.open(CommonDialogComponent, {
          width: "600px",
          data: {
            message:
              "Locked error!",
            title:
              "NOTIFICATION",
            colorButton: true
          },
        });
      }
    })
  }
}

export class OrderHistories {
  id: string;
  action: string;
  createdAt: Date;
}

export class VerifyOrder {
  id: any;
  amount: any;
  payment_method: string;
  payment_reference: string;
  status: string;
  doc: string;
  action: boolean;
}

export class FormLock {
  order_id: number;
  locked_status: boolean;
}
