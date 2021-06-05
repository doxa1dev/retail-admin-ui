import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { Product, Properties } from 'app/core/models/product.model';
import { formatDate, Location } from '@angular/common';
import { OrdersService, Order } from 'app/core/service/orders.service';
import { HttpClient } from '@angular/common/http';
import { Routes, Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { async } from '@angular/core/testing';
import { RowEvent, GridOptions, GridApi, AgGridEvent, IGetRowsParams, ColDef, ColumnApi, GridSizeChangedEvent } from 'ag-grid-community';
import { ActiveCellCustomComponent } from './common-pay/active-cell/active-cell.component';

import HelperFn from '../../helper/helper-fn';
import { environment } from 'environments/environment';
import { isNullOrUndefined } from 'util';
import { ErrorMessageLock } from 'app/core/enum/error-message.enum';

import { AllModules } from '@ag-grid-enterprise/all-modules';
import '@ag-grid-community/all-modules/dist/styles/ag-grid.css';
import '@ag-grid-community/all-modules/dist/styles/ag-theme-alpine.css';
import { CommonDialogComponent } from 'app/main/_shared/common-dialog/common-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { FormLock } from '../to-verify-action/to-verify-action.component';
import { CheckNullOrUndefinedOrEmpty } from 'app/core/utils/common-function';
import { CustomerInformationService } from 'app/core/service/customer-information.service';
import { DELIVERY_TYPE, SHIPPING_METHOD, DELIVERY_BY, DeliveryShipping } from 'app/core/constants/shipping-method';
import { ShippingService } from 'app/core/service/shipping.service';
import * as jwt_decode from 'jwt-decode';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerInformation } from "app/core/models/customer-information.model";
import { DialCodeComponent } from 'app/main/pages/authentication/dial-code/dial-code.component';

@Component({
  selector: 'app-to-pay-action',
  templateUrl: './to-pay-action.component.html',
  styleUrls: ['./to-pay-action.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class ToPayActionComponent implements OnInit {
  helperFn = new HelperFn();

  order = "";
  order_id;
  orderAt: Date;
  namePage = "To Pay";

  pendingPayment = 0;
  paid = 0;
  pendingVerified = 0;
  verified = 0;

  columnApi;
  gridApi: any;
  gridOptions: any;

  // isOrderFullyPaid: boolean;
  isRequeryingPaymentStatus: boolean;
  isPaymentStatusRequeryError: boolean;

  currency: any;

  displayAddress: string;
  displayStateCountry: string;
  storageUrl = environment.storageUrl;
  addressCustomer: string;
  stateCountryCustomer: string;
  /** payment method */
  methodPaymentList = new Array<String>();
  advisorImage: any;
  noRowsTemplate: any;

  modules = AllModules;
  page: number;
  hasAdvisor: boolean;
  //toggle
  colorToggle: 'warn';
  checked = false;
  disabled = false;
  active: boolean;
  //LockOrder-----
  checkedLock: boolean;
  lockOrderTitle: string ;
  lockBy : string;
  lockTime: string;
  checkLock;
  style_shipping_location : string;
  arrCategories: [];
  remask_advisor_name : string;
  remask_advisor_id : string;
  remask_advisor_phone : string;
  advisorImg: string = "assets/icons/doxa-icons/UserMenu.svg";
  buttonName:string = "Submit";
  advisorId: string;
  advisorName: string='';
  isShow: boolean = false;
  isShowSearch: boolean = false;
  isShowEdit: boolean = false;
  isAssign: boolean = false;
  // -------
  //change shipping
  shippingMethodArr = SHIPPING_METHOD;
  shippingMethod;
  isShowShipping: boolean = false;
  isShowCustomerInformation: boolean = false;
  isCheckChangeShipping: boolean = false;

  deliveryTypeArr = DELIVERY_TYPE;
  deliverBy = DELIVERY_BY;
  deliverByFilter = [];
  deliveryTimeArr = DELIVERY_TYPE;
  selectDate: string;
  publicHolidayArr = [];
  decoded: any;
  nation_code: string;
  maxDateShip = new Date();
  isCheckDeliveryType: boolean = false;
  deliveryType: string;
  deliveryMethod: string;
  timeOption = [];
  shippingData: any;
  specificDateTimeForm: FormGroup;
  isShowTime: boolean = false;
  deliveryTypeText: string;
  isShowShippingError: boolean = false;
  maxDateShipMAX = new Date();
  getYear = (new Date()).getFullYear();
  showStateCountry: string;
  countryName: string;
  @ViewChild(DialCodeComponent) dialcode: DialCodeComponent;
  customerInforEditForm: FormGroup;
  deliveryDialCodeInfor;
  city_state_code_infor = new Object();
  stateCodeToNameFormOptions
  customerName

  constructor(
    private _location: Location,
    private _orderService: OrdersService,
    private _route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private customerService: CustomerInformationService,
    private shippingService: ShippingService,
    private _formBuilder: FormBuilder
  ) {
    this.noRowsTemplate = `<span>No data</span>`;

    this.gridOptions = <GridOptions> {
      context: {
        componentParent: this
      }
    };
  }

  columnDefs = [
    { headerName: "Amount", field: "displayAmount", sortable: true, filter: true, width: 120, resizable: false },
    { headerName: "Method", field: "paymentMethod", sortable: true, filter: true, width: 130, resizable: false },
    { headerName: "Option", field: "payment_option", sortable: true, filter: true, width: 130, resizable: false },
    { headerName: "Reference No.", field: "paymentReference", sortable: true, filter: 'agTextColumnFilter', resizable: true },
    { headerName: "Status", field: "paymentStatus", sortable: true, filter: true, width: 100, resizable: false },
    { headerName: "Date", field: "updatedAt", sortable: true, filter: true, width: 150, resizable: true },
    { headerName: "Action", field: "action", sortable: true, filter: true, width: 150, resizable: false, "cellRendererFramework": ActiveCellCustomComponent },
  ];
  fullOrder: Order;
  listProduct: Array<Product> = [];
  listHistories: Array<OrderHistories> = [];
  listOrders: Array<Order> = [];

  ngOnInit(): void {
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

    this.specificDateTimeForm = this._formBuilder.group({
      deliverType: ['', Validators.required],
      deliverMethod: ['', Validators.required],
      specificDate: ['', Validators.required],
      specificTime: ['', Validators.required]
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

    this._route.queryParams.subscribe(params => {
      this.order = params.id;
      this.order_id = this.order.replace("#", '');
      this.page = params.page
    });
    this._orderService.checkOrderStatus(this.order_id).subscribe(data=>{
      this._orderService.changeOrderPage(data , this.order_id , this.page , 'TO_PAY')
    })
    this.getOrder(this.order_id);
    this._orderService.checkLockOrder(this.order_id).subscribe(data=>{
      this.checkLock = data;
    });

    this.shippingService.getPublicHoliday(this.nation_code, this.getYear).subscribe(data => {
      data.forEach(element => {
        this.publicHolidayArr.push(new Date(element));
      });
    });

    // this.maxDateShip.setDate(this.maxDateShip.getDate() + 3);
    this.maxDateShip.getDate();
    this.maxDateShipMAX.setDate(this.maxDateShip.getDate() + 7);
  }

  onChangePrice() {
    this.getOrder(this.order_id);
  }

  getOrder(orderId): Promise<any> {
    return new Promise(resolve => {
      setTimeout(() => {
        this._orderService.getOrderbyOrderId(orderId).subscribe(respone => {
          if (!isNullOrUndefined(respone.data.payments) && respone.data.payments.length != 0) {

            let methodList = [];

            respone.data.payments.forEach(element => {
              if (!methodList.includes(element.payment_method) && element.payment_status==='success') {
                methodList.push(element.payment_method);
              }
            });

            this.methodPaymentList = new Array<String>();
            methodList.forEach(element => {

              if (element === "TT") {
                this.methodPaymentList.push("Pay by Telegraphic Transfer (TT)");
              } else if (element === "OFFICE") {
                this.methodPaymentList.push("Pay at Thermomix Office");
              } else if (element === "CREDIT_CARD") {
                this.methodPaymentList.push("Pay with Credit/Debit Card");
              } else if (element === "ONLINE_BANKING") {
                this.methodPaymentList.push("Pay at Online Banking");
              }
            });
          }

          this.fullOrder = this._orderService.renderDataOrder(respone,true);
          this.shippingData = this.fullOrder.shipping;
          this.checkDataShipping(this.shippingData);

          if (this.fullOrder.shipping.shippingMethod === 'SELF_COLLECT') {
            this.shippingMethod = this.shippingMethodArr.filter(shipping => shipping.value === 2)[0];
          } else {
            if (this.fullOrder.shipping.isManualShipping) {
              this.shippingMethod = this.shippingMethodArr.filter(shipping => shipping.value === 0)[0];
            } else {
              this.shippingMethod = this.shippingMethodArr.filter(shipping => shipping.value === 1)[0];
            }
          }
          this.customerName = respone.data.customer.firt_name
          this.remask_advisor_name = this.fullOrder.remark_advisor_name;
          this.remask_advisor_id = this.fullOrder.remark_advisor_id;
          this.remask_advisor_phone = this.fullOrder.remark_advisor_phone;
          this.showStateCountry = this.helperFn.setStateCountryLine(this.fullOrder.customerInformation.state_code, this.fullOrder.customerInformation.country_code);
          this.deliveryDialCodeInfor = !CheckNullOrUndefinedOrEmpty(this.fullOrder.customerInformation.phoneDialCode)? this.fullOrder.customerInformation.phoneDialCode : (this.nation_code === 'MY' ? '60' : "65");
          this.city_state_code_infor = !CheckNullOrUndefinedOrEmpty(this.fullOrder.customerInformation.state_code) ? this.fullOrder.customerInformation.state_code : (this.nation_code !== 'MY' ? 'SG' : '');
          this.stateCodeToNameFormOptions = environment.countryCodeToStates[this.nation_code];
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

          this.pendingPayment = this.fullOrder.pendingPayment;
          this.paid = this.fullOrder.paid;
          this.pendingVerified = this.fullOrder.pendingVerified;
          this.verified = this.fullOrder.verified;
          // if (Number(this.fullOrder.totalAmount) !== this.paid) {
          //   this.isOrderFullyPaid = false;
          // }
          this.currency = !this.fullOrder.currency ? '' : this.fullOrder.currency;
          this.displayAddress = this.helperFn.setDisplayAddressLine(this.fullOrder.deliveryAddress.addressLine1, this.fullOrder.deliveryAddress.addressLine2, this.fullOrder.deliveryAddress.addressLine3, this.fullOrder.deliveryAddress.postalCode);
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

  checkDataShipping(ship) {
    if (CheckNullOrUndefinedOrEmpty(ship.sdId)) {
      this.specificDateTimeForm.get('specificDate').disable();
      this.specificDateTimeForm.get('specificTime').disable();
      this.specificDateTimeForm.get('deliverType').setValue(this.deliveryTypeArr.find(e => e.value == 0));
      this.deliveryTypeText = this.deliveryTypeArr[0].label;
      this.deliverByFilter = this.deliverBy.filter(element => element.value != 3);
      this.isCheckDeliveryType = true;
      this.isShowTime = true;

      if (ship.shippingMethod == "SELF_COLLECT") {
        this.specificDateTimeForm.get('deliverMethod').setValue(this.deliverByFilter.find(item => item.value == 0));

      } else if (ship.shippingMethod == "BY_COURRIER") {

        if (ship.isManualShipping) {
          this.specificDateTimeForm.get('deliverMethod').setValue(this.deliverByFilter.find(item => item.value == 2));
        } else {
          this.specificDateTimeForm.get('deliverMethod').setValue(this.deliverByFilter.find(item => item.value == 1));
        }

      }

    } else if (!CheckNullOrUndefinedOrEmpty(ship.sdId)) {
      this.isCheckDeliveryType = false;

      if (ship.specialDelivery.sd_type == 'SD_ONLY') {
        this.specificDateTimeForm.get('specificTime').disable();
        this.specificDateTimeForm.get('deliverType').setValue(this.deliveryTypeArr.find(e => e.value == 1));
        this.deliveryTypeText = this.deliveryTypeArr[1].label;
        this.deliverByFilter = this.deliverBy.filter(element => (element.value != 3 && element.value != 0));
        this.isShowTime = true;

        if (!CheckNullOrUndefinedOrEmpty(ship.specialDelivery.select_date)) {
          this.specificDateTimeForm.get('specificDate').setValue(new Date(ship.specialDelivery.select_date));
        }

        if (ship.isManualShipping) {
          this.specificDateTimeForm.get('deliverMethod').setValue(this.deliverByFilter.find(item => item.data === 'BY_THERMOMIX'));
        } else {
          this.specificDateTimeForm.get('deliverMethod').setValue(this.deliverByFilter.find(item => item.data === 'BY_COURRIER'));
        }

      } else {
        this.specificDateTimeForm.get('specificDate').setValue(new Date(ship.specialDelivery.select_date));
        this.specificDateTimeForm.get('deliverType').setValue(this.deliveryTypeArr.find(e => e.value == 2));
        this.deliveryTypeText = this.deliveryTypeArr[2].label;
        this.deliverByFilter = this.deliverBy.filter(element =>(element.value != 1 && element.value != 0));
        this.isShowTime = false;

        if (ship.specialDelivery.sd_type == 'SD_BEFORE') {
          this.specificDateTimeForm.get('deliverMethod').setValue(this.deliverByFilter.find(item => item.data === 'BY_QXPRESS'));
          this.shippingService.getQuickTimeSlotQXpress(ship.specialDelivery.select_date).subscribe(data => {
            this.timeOption = data;
            this.specificDateTimeForm.get('specificTime').setValue(this.timeOption.find(time => time.DEL_TIME_SLOT == ship.specialDelivery.select_time));
          });

        } else if (ship.specialDelivery.sd_type == 'SD_AFTER'){
          this.specificDateTimeForm.get('deliverMethod').setValue(this.deliverByFilter.find(item => item.data === 'BY_THERMOMIX'));
          this.shippingService.getSpTimeAfterByDate(ship.specialDelivery.select_date).subscribe(data => {
            this.timeOption = data;
            this.specificDateTimeForm.get('specificTime').setValue(this.timeOption.find(time => time.time_slot == ship.specialDelivery.select_time));
          });

        }
      }
    }
  }

  back() {
    this.router.navigate(["/direct-sales/orders"], { state: {page : this.page } });
  }

  nextViewCustomer() {
    this.router.navigate(["/direct-sales/customers/details"], { queryParams: { id: this.fullOrder.customer.uuid }});
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
    params.api.sizeColumnsToFit();

    if (isNullOrUndefined(this.fullOrder.payment)) {
      this.gridApi.showNoRowsOverlay();
    }
  }

  onGridSizeChanged(params: GridSizeChangedEvent) {
    params.api.sizeColumnsToFit();
  }

  onPaymentStatusUpdated() {
    this.getOrder(this.order_id);
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
          this.getOrder(this.order_id);
          this.advisorName = '';
          this.isShow = false;
          this.advisorId = "";
          this.active = false;
         // this.buttonName = "Add Assign Advisor";
        }
      }
    );
  }
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
    this.active = true;
    this.buttonName = "Processing...";

    var formAdvisor = {
      order_id: Number(this.order_id),
      advisor_id: Number(this.advisorId),
      is_edit : true
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
      }
      else if(data.code === 203){
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

  async showChangeShippingForm() {

    let dataLock;
    await this._orderService.checkLockOrder(this.order_id).toPromise().then(data=>{
      dataLock = data;
    })
    if(dataLock == 1){

      if (this.isShowShipping) {
        this.isShowShipping = false;

        this.checkDataShipping(this.shippingData);
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

        this.checkDataShipping(this.shippingData);
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

  onChangeShipping(event) {
    this.isCheckChangeShipping = true;
    this.shippingMethod = this.shippingMethodArr.filter(shipping => shipping.value === event.value.value)[0];
  }

  onChangeDeliveryBy() {
    if (this.specificDateTimeForm.get('deliverType').value.value != 0) {
      this.specificDateTimeForm.get('specificDate').enable();
      this.specificDateTimeForm.get('specificDate').setValue('');
      this.specificDateTimeForm.get('specificTime').disable();
      this.specificDateTimeForm.get('specificTime').setValue('');
    } else {
      this.specificDateTimeForm.get('specificDate').disable();
    }
  }

  onChangeDeliveryType(event) {
    this.specificDateTimeForm.get('deliverMethod').setValue('');
    if (event.value.value == 0) {
      this.deliverByFilter = this.deliverBy.filter(element => element.value != 3);
      this.isCheckDeliveryType = true;
      this.isShowTime = true;
      this.specificDateTimeForm.get('specificDate').disable();
      this.specificDateTimeForm.get('specificTime').disable();
      this.isShowShippingError = false;

    } else if (event.value.value == 1) {
      this.deliverByFilter = this.deliverBy.filter(element => (element.value != 3 && element.value != 0));
      this.isCheckDeliveryType = false;
      this.isShowTime = true;
      this.specificDateTimeForm.get('specificDate').setValue('');
      this.specificDateTimeForm.get('specificDate').disable();
      this.specificDateTimeForm.get('specificTime').disable();
      this.isShowShippingError = false;

    } else if (event.value.value == 2) {
      this.deliverByFilter = this.deliverBy.filter(element =>(element.value != 1 && element.value != 0));
      this.isCheckDeliveryType = false;
      this.isShowTime = false;
      this.specificDateTimeForm.get('specificDate').setValue('');
      this.specificDateTimeForm.get('specificDate').disable();
      this.specificDateTimeForm.get('specificTime').setValue('');
      this.specificDateTimeForm.get('specificTime').disable();
      this.isShowShippingError = false;

    }
  }

  onChangeDate(event) {
    this.selectDate = formatDate(event, "yyyy-MM-dd", "en-US");

    if (this.specificDateTimeForm.get('deliverType').value.value == 2) {
      this.specificDateTimeForm.get('specificTime').enable();

      if (this.specificDateTimeForm.get('deliverMethod').value.value === 3) {
        this.shippingService.getQuickTimeSlotQXpress(this.selectDate).subscribe(data => {
          this.timeOption = data;
        });

      } else if (this.specificDateTimeForm.get('deliverMethod').value.value === 2) {
        this.shippingService.getSpTimeAfterByDate(this.selectDate).subscribe(data => {
          this.timeOption = data;
          this.specificDateTimeForm.get('specificTime').enable();
        });
      }
    }
  }

  saveShippingSpecial() {
    this.isShowShippingError = true;
    if (this.specificDateTimeForm.invalid) {
      return;
    }

    let formShipping = new DeliveryShipping();

    if (this.specificDateTimeForm.get('deliverType').value.value == 0) {
      formShipping.sd_id = this.shippingData.sdId
      formShipping.shippingId = this.shippingData.id
      formShipping.orderId = this.order_id
      formShipping.delivery_type = this.specificDateTimeForm.get('deliverType').value.data;
      formShipping.delivery_date = null;
      formShipping.delivery_time_slot = null;
      formShipping.delivery_by = this.specificDateTimeForm.get('deliverMethod').value.data;

    } else if (this.specificDateTimeForm.get('deliverType').value.value == 1) {

      formShipping.sd_id = this.shippingData.sdId
      formShipping.shippingId = this.shippingData.id
      formShipping.orderId = this.order_id
      formShipping.delivery_type = this.specificDateTimeForm.get('deliverType').value.data;
      formShipping.delivery_date = formatDate(this.specificDateTimeForm.get('specificDate').value, "yyyy-MM-dd", "en-US");;
      formShipping.delivery_time_slot = null;
      formShipping.delivery_by = this.specificDateTimeForm.get('deliverMethod').value.data;

    } else if (this.specificDateTimeForm.get('deliverType').value.value == 2) {
      formShipping.sd_id = this.shippingData.sdId
      formShipping.shippingId = this.shippingData.id
      formShipping.orderId = this.order_id
      formShipping.delivery_type = this.specificDateTimeForm.get('deliverMethod').value.value == 2 ? 'SD_AFTER' : 'SD_BEFORE';
      formShipping.delivery_date = formatDate(this.specificDateTimeForm.get('specificDate').value, "yyyy-MM-dd", "en-US");
      formShipping.delivery_time_slot = !CheckNullOrUndefinedOrEmpty(this.specificDateTimeForm.get('specificTime').value.DEL_TIME_SLOT) ?
      this.specificDateTimeForm.get('specificTime').value.DEL_TIME_SLOT : this.specificDateTimeForm.get('specificTime').value.time_slot;
      formShipping.delivery_by = this.specificDateTimeForm.get('deliverMethod').value.value == 2 ? 'BY_THERMOMIX' : 'BY_COURRIER';
    }

    this.shippingService.saveShippingSpecial(formShipping).subscribe(data => {
      if (data.code === 200) {
        this.getOrder(this.order_id);
        this.isShowShipping = false;
      }
    })
  }

  checkShowShipByThermomix() {
    if (!CheckNullOrUndefinedOrEmpty(this.specificDateTimeForm.get('deliverType').value) &&
        this.fullOrder.shipping.shippingMethod === 'BY_COURRIER' && this.specificDateTimeForm.get('deliverMethod').value.value === 2 &&
        this.fullOrder.shipping.isManualShipping) {

        return true;

    } else return false;
  }

  keepOriginalOrder = (a, b) => a.key;

  checkShowShipByCourier() {
    if ((this.specificDateTimeForm.get('deliverType').value.value === 0 ||
        this.specificDateTimeForm.get('deliverType').value.value === 1) &&
        this.fullOrder.shipping.shippingMethod === 'BY_COURRIER' &&
        !this.fullOrder.shipping.isManualShipping ) {
      return true;

    } else return false;
  }

  onYearChange(event) {
    if (Number(event.year) != this.getYear) {
      this.getYear = event.year;
      this.publicHolidayArr = [];
      this.shippingService.getPublicHoliday(this.nation_code, event.year).subscribe(data => {
        data.forEach(element => {
          this.publicHolidayArr.push(new Date(element));
        });
      });
    }
  }
}

export class OrderHistories {
  id: string;
  action: string;
  createdAt: Date;
}
