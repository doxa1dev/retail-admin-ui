import { Component, EventEmitter, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { Properties, Product } from 'app/core/models/product.model';
import { Location, formatDate } from '@angular/common';
import { OrdersService, Order } from 'app/core/service/orders.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductShippingStatus } from 'app/core/models/product-shipping-status.model';
import { isNullOrUndefined } from 'util';
import { CommonDialogComponent } from 'app/main/_shared/common-dialog/common-dialog.component';
import HelperFn from '../../helper/helper-fn';
import { environment } from 'environments/environment';
import { SharedService } from 'app/core/service/shared.service';
import { ShippingService } from 'app/core/service/shipping.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DeliveryAddress } from 'app/core/models/delivery-address';
import { DialCodeComponent } from 'app/main/pages/authentication/dial-code/dial-code.component';
// import  {} from 'app/main/pages/'
import * as jwt_decode from 'jwt-decode';
import { MatDialog } from '@angular/material/dialog';
import { FormLock } from '../to-verify-action/to-verify-action.component';
import { ErrorMessageLock } from 'app/core/enum/error-message.enum';
import { CheckNullOrUndefinedOrEmpty } from 'app/core/utils/common-function';
import { MatRadioButton, MatRadioChange } from '@angular/material/radio';
import { CustomerInformationService } from 'app/core/service/customer-information.service';
import { CreateQuickOrder, DeliveryShipping, DELIVERY_BY, DELIVERY_TYPE, OrderItemsQxpress, SHIPPING_METHOD } from 'app/core/constants/shipping-method';
import { ConfirmDialogComponent } from 'app/main/_shared/confirm-dialog/confirm-dialog.component';
import { mergeMap } from 'rxjs/operators';
// import { animate, state, style, transition, trigger } from '@angular/animations';



@Component({
  selector: 'app-to-ship-action',
  templateUrl: './to-ship-action.component.html',
  styleUrls: ['./to-ship-action.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ToShipActionComponent implements OnInit {

  constructor(
    private _location: Location,
    private _orderService: OrdersService,
    private router: Router,
    private _route: ActivatedRoute,
    private sharedService: SharedService,
    private _formBuilder: FormBuilder,
    public dialog: MatDialog,
    private customerService: CustomerInformationService,
    private shippingService: ShippingService
  ) { }
  helperFn = new HelperFn();
  order = "";
  order_id;
  orderAt: Date;
  namePage = "To Ship/Collect";
  currency: string;
  displayAddress: string;
  displayStateCountry: string;
  /** payment method */
  methodPaymentList = new Array<String>();
  advisorImage: any;
  checkLabelQxpress: boolean = false;
  fullOrder: Order;
  NewOrder: Order;
  is_fullOrder: boolean = true;
  listProduct: Array<Product> = [];
  InitArrayProduct: Array<Product> = [];
  listHistories: Array<OrderHistories> = [];
  isShippingSelfCollect: boolean;
  isShippingAgentSelected: boolean;
  isShowCustomerInformation: boolean = false;
  shippingAgent: string;
  isShippingAgentIntegrated: boolean;
  shippingLabels: any;
  productIdToNameMap: any;
  shippingStatusTableData: ProductShippingStatus[];
  number_serial: number = 0;
  storageUrl = environment.storageUrl;
  addressCustomer: string;
  stateCountryCustomer: string;
  editOrClose : string = "Edit";
  isOpenEditDeliveryAddressForm : boolean = false;
  //Data for qxpress shipping
  customerData: any;
  deliveryAddress: any;
  trackingData: any;
  dataProduct: any;
  page : number;
  email_pattern = /^[a-zA-Z0-9_\.\-\+]{1,32}@[a-zA-Z0-9\-]{2,}(\.[a-zA-Z0-9\-]{2,}){1,}$/;
  deliveryAddressEditForm: FormGroup;
  customerInforEditForm: FormGroup;
  isShowErrorEditDeliveryAddress: boolean = false;
  deliveryDialCode : string;
  deliveryDialCodeInfor
  decoded: any;
  nation_code ;
  stateCodeToNameFormOptions
  city_state_code = new Object();
  city_state_code_infor = new Object();
  cs_state_code = new Object();
  stateCode = new Object();
  @ViewChild(DialCodeComponent) dialcode: DialCodeComponent;
  customerName

  //LockOrder-----
  checkedLock: boolean;
  lockOrderTitle: string ;
  lockBy : string;
  lockTime: string;
  checkLock;
  style_shipping_location : string;

  active: boolean;

  remask_advisor_name : string;
  remask_advisor_id : string;
  remask_advisor_phone : string;

  advisorImg: string = "assets/icons/doxa-icons/UserMenu.svg";

  buttonName: string = "Submit ";
  advisorId: string;
  advisorName: string = '';
  isShow: boolean = false;
  isShowSearch: boolean = false;

  is_shipping_agent : boolean = true;
  @Output()
  change: EventEmitter<MatRadioChange>
  // -------

  isShowEdit: boolean = false;
  isAssign: boolean = false;
  order_id_tmm: number;

  //change shipping
  shippingMethodArr = SHIPPING_METHOD;
  shippingLocationMYArr: Location[];
  shippingMethod;
  shippingLocationMY;
  isShowShipping: boolean = false;
  isShowLocationMY: boolean = false;
  isCheckChangeShipping: boolean = false;
  isRecurringPayment: boolean;

  deliveryTypeArr = DELIVERY_TYPE;
  deliverBy = DELIVERY_BY;
  deliverByFilter = [];
  deliveryTimeArr = DELIVERY_TYPE;
  selectDate: string;
  publicHolidayArr = [];
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
  isShowMaskAsShipped: boolean = false;
  getYear = (new Date()).getFullYear();
  invoicePdf: string;
  uuid: string;
  showStateCountry: string;
  countryName: string;
  white: "white";
  grey: 'none';
  countryCode = new Object();

  ngOnInit(): void {
    this.sharedService.nextCart([]);
    this._route.queryParams.subscribe(params => {
      this.order = params.id;
      this.order_id = this.order.replace("#", '');
      this.page = params.page;
    });
    this._orderService.checkOrderStatus(this.order_id).subscribe(data=>{
      this._orderService.changeOrderPage(data , this.order_id , this.page, 'TO_SHIP')
    })
    this.getOrder(this.order_id);

     //Decoded token for country and city-state list.
    let token = localStorage.getItem('token');
    if (!CheckNullOrUndefinedOrEmpty(token)){
      this.decoded = jwt_decode(token);

    }
    if(this.decoded.entity_id === "2")
    {
      this.nation_code = "MY"
      this.countryName = "Malaysia"
      this.countryCode = "Malaysia"
    }else if (this.decoded.entity_id === "1" || this.decoded.entity_id === "3")
    {
      this.nation_code = "SG"
      this.countryName = "Singapore"
      this.countryCode = "Singapore"
    }
    else{
      this.nation_code = "SG"
    }

    this._orderService.checkLockOrder(this.order_id).subscribe(data=>{
      this.checkLock = data;
    });

    this.shippingService.getPublicHoliday(this.nation_code, this.getYear).subscribe(data => {
      data.forEach(element => {
        this.publicHolidayArr.push(new Date(element));
      });
    });

    this.maxDateShip.getDate();
    this.maxDateShipMAX.setDate(this.maxDateShip.getDate() + 7);

    this.specificDateTimeForm = this._formBuilder.group({
      deliverType: ['', Validators.required],
      deliverMethod: ['', Validators.required],
      specificDate: ['', Validators.required],
      specificTime: ['', Validators.required]
    });

    this.deliveryAddressEditForm = this._formBuilder.group({
      firstName: ['', Validators.required],
      lastName: [''],
      emailAddress: ['', [Validators.required, Validators.pattern(this.email_pattern)]],
      phoneNumber: ['', [Validators.required, phoneNumberValidator]],
      addressLine1: ['', [Validators.required, Validators.maxLength(40)]],
      addressLine2: ['', [Validators.required,Validators.maxLength(40)]],
      addressLine3: ['', Validators.maxLength(40)],
      postalCode: ['', Validators.required],
      stateCode: ['', Validators.required],
      countryCode: ['', Validators.required],
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

  EditDeliveryAddress = () =>{
    this.isOpenEditDeliveryAddressForm = this.isOpenEditDeliveryAddressForm == false ? true : false;
    this.editOrClose = this.editOrClose == "Edit" ? "Close": "Edit";
  }

  async onEditDeliveryAddress(){
    let dataCheck;
    await this._orderService.checkLockOrder(this.fullOrder.id).toPromise().then(data=>{
      dataCheck = data;
    })
    if(dataCheck == 1){
      if(this.deliveryAddressEditForm.invalid){
        this.isShowErrorEditDeliveryAddress = true;
        // console.log('dsdsd',this.deliveryAddressEditForm.value.stateCode)
        return;
      }else{
        let deliveryAddress = new DeliveryAddress();
        deliveryAddress.first_name = this.deliveryAddressEditForm.value.firstName;
        deliveryAddress.last_name =  this.deliveryAddressEditForm.value.lastName;
        deliveryAddress.email =  this.deliveryAddressEditForm.value.emailAddress;
        deliveryAddress.phone_dial_code =  this.dialcode.SelectedDial;
        this.deliveryDialCode = this.dialcode.SelectedDial;
        deliveryAddress.phone_number = this.deliveryAddressEditForm.value.phoneNumber;
        deliveryAddress.address_line1 = this.deliveryAddressEditForm.value.addressLine1;
        deliveryAddress.address_line2 = this.deliveryAddressEditForm.value.addressLine2;
        deliveryAddress.address_line3 = this.deliveryAddressEditForm.value.addressLine3;
        deliveryAddress.postal_code = this.deliveryAddressEditForm.value.postalCode;
        deliveryAddress.country_code = this.deliveryAddressEditForm.value.countryCode;
        deliveryAddress.state_code = this.deliveryAddressEditForm.value.stateCode;
        // console.log('dsdsd',this.deliveryAddressEditForm.value.stateCode)
        return this._orderService.editDeliveryAddress(deliveryAddress,this.fullOrder.id,this.deliveryAddress.id,this.fullOrder.customerId)
        .subscribe(data=>{

          if(data.code === 200)
          {
            const dialogNotifi = this.dialog.open(CommonDialogComponent, {
              width: "500px",
              data: {
                message:
                  'Update delivery address successfully.',
                title:
                  "NOTIFICATION",
                colorButton: false
              },
            });
            dialogNotifi.afterClosed().subscribe(data => {
              this.EditDeliveryAddress();
              this.getOrderAfter(this.order_id)
              return
            });
          }else
          {
            const dialogNotifi = this.dialog.open(CommonDialogComponent, {
              width: "500px",
              data: {
                message:
                  'Error when updating address. Please try again.',
                title:
                  "NOTIFICATION",
                colorButton: false
              },
            });
            dialogNotifi.afterClosed().subscribe(data => {
              this.EditDeliveryAddress();
              this.getOrderAfter(this.order_id)
              return
            });
          }
        })
      }

    }else if(dataCheck == 2){
      const dialogRef = this.dialog.open(CommonDialogComponent, {
        width: '600px',
        data: { message: ErrorMessageLock.ANOTHER_LOCK , type: "back" ,
                colorButton: true , title : 'REMINDER' , buttonName: 'GO BACK' }
      });
    }else if(dataCheck == 3){
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

  getOrder(orderId): Promise<any> {
    return new Promise(resolve => {
      setTimeout(() => {
        this._orderService.getOrderbyOrderId(orderId).subscribe(response => {
          let methodList = [];
          this.uuid = response.data.uuid
          if (!CheckNullOrUndefinedOrEmpty(response.data.payments) && response.data.payments.length !== 0) {
            this.methodPaymentList = [];
            response.data.payments.forEach(element => {
              if (!methodList.includes(element.payment_method) && element.payment_status==='success') {
                methodList.push(element.payment_method);
              }
              if(!CheckNullOrUndefinedOrEmpty(element.is_recurring_payment)) {
                this.isRecurringPayment = true;

              }
            });

            methodList.forEach(element => {

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

          this.fullOrder = this._orderService.renderDataOrder(response,false);
          this.customerName = response.data.customer.firt_name
          this.shippingData = this.fullOrder.shipping;
          this.checkDataShipping(this.shippingData);
          this.shippingLocationMY = this.fullOrder.shipping.shipping_location_full

          if (this.fullOrder.shipping.shippingMethod === 'SELF_COLLECT') {
            this.shippingMethod = this.shippingMethodArr.filter(shipping => shipping.value === 2)[0];
            this.is_shipping_agent = true;
          } else {
            if (this.fullOrder.shipping.isManualShipping) {
              this.shippingMethod = this.shippingMethodArr.filter(shipping => shipping.value === 0)[0];
              this.is_shipping_agent = false;
            } else {
              this.is_shipping_agent = true;
              this.shippingMethod = this.shippingMethodArr.filter(shipping => shipping.value === 1)[0];
            }
          }
          this.remask_advisor_name = this.fullOrder.remark_advisor_name;
          this.remask_advisor_id = this.fullOrder.remark_advisor_id;
          this.remask_advisor_phone = this.fullOrder.remark_advisor_phone;
          this.order_id_tmm = this.fullOrder.orderIdTmm;
          this.cs_state_code= !CheckNullOrUndefinedOrEmpty(this.fullOrder.customerInformation.state_code) ? this.fullOrder.customerInformation.state_code : (this.nation_code !== 'MY' ? 'SG' : '');
          this.showStateCountry = this.helperFn.setStateCountryLine(this.fullOrder.customerInformation.state_code, this.fullOrder.customerInformation.country_code);
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
          this.customerData = this.fullOrder.customerInformation ;
          this.deliveryAddress = this.fullOrder.deliveryAddress;
          this.trackingData = this.fullOrder.shipping.shippingStatus;
          this.dataProduct = this.fullOrder.listProduct
          if (!CheckNullOrUndefinedOrEmpty(this.fullOrder.advisorCustomer)) {
            //check null image
            if (CheckNullOrUndefinedOrEmpty(this.fullOrder.advisorCustomer.profilePhotoKey)) {
              this.advisorImage = "assets/icons/doxa-icons/UserMenu.svg";
            } else {
              this.advisorImage = this.storageUrl + this.fullOrder.advisorCustomer.profilePhotoKey;
            }
          }

          this.number_serial = 0;
          this.fullOrder.listProduct.forEach(product => {
            if (!CheckNullOrUndefinedOrEmpty(product.warranty_duration_in_days) || product.is_kit) {
              this.number_serial += product.quantity;
              product['customer_id'] = response.data.customer_id;
              product['order_id'] = response.data.id;
              product['advisor_customer'] = response.data.advisor_customer;
            }
          });
          this.listProduct = this.fullOrder.listProduct;
          this.InitArrayProduct = this.fullOrder.listProduct;
          if (this.fullOrder.shipping.shippingMethod === 'BY_COURRIER' && this.fullOrder.shipping.shippingAgentId != null) {
            this.isShippingAgentSelected = true;
            this.shippingAgent = this.fullOrder.shipping.shippingStatus.shippingAgent;
            this.isShippingAgentIntegrated = this.fullOrder.shipping.shippingStatus.isIntegrated;
            this.shippingLabels = this.fullOrder.shipping.shipmentLabel !== null ? this.fullOrder.shipping.shipmentLabel.shipmentLabels : null;
            if (!CheckNullOrUndefinedOrEmpty(this.fullOrder.shipping.shippingStatus) &&
                (this.fullOrder.shipping.shippingStatus.shippingAgent === 'QXPRESS' ||
                this.fullOrder.shipping.shippingStatus.shippingAgent === 'MXPRESS')) {
              this.checkLabelQxpress = true;
              this.shippingStatusTableData = this.createShippingQXPressStatusTableRows(this.fullOrder.shipping.shippingStatus.shippingStatuses);
            }
            // else if(!CheckNullOrUndefinedOrEmpty(this.fullOrder.shipping.shippingStatus) && this.fullOrder.shipping.shippingStatus.shippingAgent === 'MXPRESS'){

            // }
            else {
              this.shippingStatusTableData = this.createShippingStatusTableRows(this.fullOrder.shipping.shippingStatus.shippingStatuses);
            }
          }
          else if (this.fullOrder.shipping.shippingMethod === 'SELF_COLLECT') {
            this.isShippingSelfCollect = true;
          }
          this.currency = !this.fullOrder.currency ? '' : this.fullOrder.currency;
          this.displayAddress = this.helperFn.setDisplayAddressLine(this.fullOrder.deliveryAddress.addressLine1, this.fullOrder.deliveryAddress.addressLine2, this.fullOrder.deliveryAddress.addressLine3, this.fullOrder.deliveryAddress.postalCode);
          this.displayStateCountry = this.helperFn.setStateCountryLine(this.fullOrder.deliveryAddress.stateCode, this.fullOrder.deliveryAddress.countryCode);

          if (!CheckNullOrUndefinedOrEmpty(this.fullOrder.customer.address)) {
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

          //Set Infor For Deliveriform

          if (!CheckNullOrUndefinedOrEmpty(this.deliveryAddress.countryCode)) {
            this.deliveryAddressEditForm.get('countryCode').setValue(this.deliveryAddress.countryCode);
          } else {
            this.deliveryAddressEditForm.get('countryCode').setValue(this.nation_code);
          }

          this.deliveryAddressEditForm.get('firstName').setValue(this.deliveryAddress.firstName);
          this.deliveryAddressEditForm.get('lastName').setValue(this.deliveryAddress.lastName);
          this.deliveryAddressEditForm.get('emailAddress').setValue(this.deliveryAddress.email);
          this.deliveryAddressEditForm.get('phoneNumber').setValue(this.deliveryAddress.phoneNumber);
          this.deliveryAddressEditForm.get('addressLine1').setValue(this.deliveryAddress.addressLine1);
          this.deliveryAddressEditForm.get('addressLine2').setValue(this.deliveryAddress.addressLine2);
          this.deliveryAddressEditForm.get('addressLine3').setValue(this.deliveryAddress.addressLine3);
          this.deliveryAddressEditForm.get('postalCode').setValue(this.deliveryAddress.postalCode);
          // this.deliveryAddressEditForm.get('countryCode').setValue(this.deliveryAddress.countryCode);
          this.deliveryDialCode =  !CheckNullOrUndefinedOrEmpty(this.deliveryAddress.phoneDialCode)? this.deliveryAddress.phoneDialCode : (this.nation_code === 'MY' ? '60' : "65");
          this.deliveryDialCodeInfor = !CheckNullOrUndefinedOrEmpty(this.fullOrder.customerInformation.phoneDialCode)? this.fullOrder.customerInformation.phoneDialCode : (this.nation_code === 'MY' ? '60' : "65");
          this.stateCodeToNameFormOptions = environment.countryCodeToStates[this.nation_code];
          this.city_state_code= !CheckNullOrUndefinedOrEmpty(this.deliveryAddress.stateCode) ? this.deliveryAddress.stateCode : (this.nation_code !== 'MY' ? 'SG' : '');
          this.city_state_code_infor = !CheckNullOrUndefinedOrEmpty(this.fullOrder.customerInformation.state_code) ? this.fullOrder.customerInformation.state_code : (this.nation_code !== 'MY' ? 'SG' : '');
          //Get Information of Shipping Location for MY
          this.shippingService.getShippingLocationAdmin().subscribe(
            data => {
              //Shipping location with change position for West MY
              this.shippingLocationMYArr = moveArrayItemToNewIndex(data, 4, 0);
            }
          )

          //Get Customer Information
          this.customerInforEditForm.get('fullNameInfor').setValue(this.fullOrder.customerInformation.firstName);
          this.customerInforEditForm.get('phoneNumberInfor').setValue(this.fullOrder.customerInformation.phoneNumber);
          this.customerInforEditForm.get('addressLine1Infor').setValue(this.fullOrder.customerInformation.address_line1);
          this.customerInforEditForm.get('addressLine2Infor').setValue(this.fullOrder.customerInformation.address_line2);
          this.customerInforEditForm.get('addressLine3Infor').setValue(this.fullOrder.customerInformation.address_line3);
          this.customerInforEditForm.get('postalCodeInfor').setValue(this.fullOrder.customerInformation.postal_code);
        });
      }, 700);
    });
  }

  getOrderAfter(orderId): Promise<any> {
    return new Promise(resolve => {
      setTimeout(() => {
        this._orderService.getOrderbyOrderId(orderId).subscribe(response => {
          this.fullOrder = this._orderService.renderDataOrder(response,false);
          this.shippingData = this.fullOrder.shipping;
          this.checkDataShipping(this.shippingData);
          this.customerData = this.fullOrder.customerInformation ;
          this.deliveryAddress = this.fullOrder.deliveryAddress;
          this.trackingData = this.fullOrder.shipping.shippingStatus;
          this.dataProduct = this.fullOrder.listProduct;
          this.number_serial = 0;
          this.fullOrder.listProduct.forEach(product => {
            if (!CheckNullOrUndefinedOrEmpty(product.warranty_duration_in_days) && product.warranty_duration_in_days !== 0) {
              this.number_serial += product.quantity;
            }
          });
          this.listProduct = this.fullOrder.listProduct;

          if (this.fullOrder.shipping.shippingMethod === 'BY_COURRIER') {
            this.isShippingSelfCollect = false;
            if (this.fullOrder.shipping.isManualShipping) {
              this.is_shipping_agent = false;
            } else {
              this.is_shipping_agent = true;
            }

            if (this.fullOrder.shipping.shippingAgentId != null) {
              this.isShippingAgentSelected = true;
              this.shippingAgent = this.fullOrder.shipping.shippingStatus.shippingAgent;
              this.isShippingAgentIntegrated = this.fullOrder.shipping.shippingStatus.isIntegrated;
              this.shippingLabels = this.fullOrder.shipping.shipmentLabel !== null ? this.fullOrder.shipping.shipmentLabel.shipmentLabels : null;
              if (this.fullOrder.shipping.shippingStatus.shippingAgent === 'QXPRESS' || this.fullOrder.shipping.shippingStatus.shippingAgent === 'MXPRESS') {
                this.checkLabelQxpress = true;
                this.shippingStatusTableData = this.createShippingQXPressStatusTableRows(this.fullOrder.shipping.shippingStatus.shippingStatuses);
              } else {
                this.shippingStatusTableData = this.createShippingStatusTableRows(this.fullOrder.shipping.shippingStatus.shippingStatuses);
              }

            } else {
              this.isShippingAgentSelected = false;
              this.checkLabelQxpress = false;
            }

          }
          else if (this.fullOrder.shipping.shippingMethod === 'SELF_COLLECT') {
            this.isShippingSelfCollect = true;
            this.is_shipping_agent = true;
          }
          this.currency = !this.fullOrder.currency ? '' : this.fullOrder.currency;
          this.displayAddress = this.helperFn.setDisplayAddressLine(this.fullOrder.deliveryAddress.addressLine1, this.fullOrder.deliveryAddress.addressLine2, this.fullOrder.deliveryAddress.addressLine3, this.fullOrder.deliveryAddress.postalCode);
          this.displayStateCountry = this.helperFn.setStateCountryLine(this.fullOrder.deliveryAddress.stateCode, this.fullOrder.deliveryAddress.countryCode);

          if (!CheckNullOrUndefinedOrEmpty(this.fullOrder.customer.address)) {
            this.addressCustomer = this.helperFn.setDisplayAddressLine(this.fullOrder.customer.address.addressLine1, this.fullOrder.customer.address.addressLine2, this.fullOrder.customer.address.addressLine3, this.fullOrder.customer.address.postalCode);
            this.stateCountryCustomer = this.helperFn.setStateCountryLine(this.fullOrder.customer.address.stateCode, this.fullOrder.customer.address.countryCode);
          } else {
            this.addressCustomer = "";
            this.stateCountryCustomer = "";
          }


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

      if (ship.specialDelivery.sd_type == 'SD_ONLY' || ship.specialDelivery.sd_type == 'SD_ONLY_LATER') {
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
    this.router.navigate(["/direct-sales/orders"], { state: { selectTab: 2 , page : this.page } });
  }

  updateStatusOrder(order_id, status) {
    this._orderService.updateStatusOfOrder(order_id, status).subscribe();
  }

  nextViewCustomer() {
    this.router.navigate(["/direct-sales/customers/details"], { queryParams: { id: this.fullOrder.customer.uuid } });
  }

  onShippingAgentSelected() {
    this.getOrderAfter(this.order_id);
  }

  downloadLabel(event){
    if(event === 'download'){
      this.getOrder(this.order_id);
    }
  }

  private createShippingStatusTableRows(shippingStatuses) {
    this.productIdToNameMap = {};
    if(!this.fullOrder.is_naep_order){
      this.listProduct.forEach(product => {
        this.productIdToNameMap[product.id] = product.productName;
        if(product.order_line_online_bank_transfer_gifts.length > 0){
          product.order_line_online_bank_transfer_gifts.forEach(bank_transfer_gifts => {
            this.productIdToNameMap[bank_transfer_gifts.online_bank_transfer_gift_product_id ] =bank_transfer_gifts.online_bank_transfer_gift_product_name;
          });
        }
        if(product.order_line_single_paymt_gifts.length > 0 ){
          // this.productIdToNameMap[product.order_line_single_paymt_gifts[0].single_paymt_gift_product_id] = product.order_line_single_paymt_gifts[0].single_paymt_gift_product_name;
          product.order_line_single_paymt_gifts.forEach(single_paymt_gifts =>{
            this.productIdToNameMap[single_paymt_gifts.single_paymt_gift_product_id ] =single_paymt_gifts.single_paymt_gift_product_name;
          });
        }
      });

    }else{
      this.listProduct.forEach(product => {
        if(product.is_deposit || product.is_kit){
          this.productIdToNameMap[product.id] = product.productName;

        }
      })
    }
    // this.listProduct.forEach(product => {
    //   this.productIdToNameMap[product.id] = product.productName;
    // });
    const shippingStatusData = [];
    shippingStatuses.forEach(status => {
      const productIdAndQtyArr = status.productIdAndQty;
      const shippingLatestEvent = (status.events.length > 0) ? status.events[status.events.length - 1] : null;
      if (productIdAndQtyArr) {
        productIdAndQtyArr.forEach(obj => {
          shippingStatusData.push(new ProductShippingStatus(
            status.shipmentPieceID,
            status.trackingID,
            this.productIdToNameMap[obj.id],
            obj.qty,
            shippingLatestEvent !== null ? shippingLatestEvent.description : '',
            shippingLatestEvent !== null ? shippingLatestEvent.dateTime : ''));
        });
      }
      else {
        shippingStatusData.push(new ProductShippingStatus(
          status.shipmentPieceID,
          status.trackingID,
          'N/A',
          'N/A',
          'Non-Integrated',
          'N/A'));
      }
    });

    return shippingStatusData;
  }

  private createShippingQXPressStatusTableRows(shippingStatuses): ProductShippingStatus[] {
    this.productIdToNameMap = {};
    if(!this.fullOrder.is_naep_order){
      this.listProduct.forEach(product => {
        this.productIdToNameMap[product.id] = product.productName;
        if(product.order_line_online_bank_transfer_gifts.length > 0){
          product.order_line_online_bank_transfer_gifts.forEach(bank_transfer_gifts => {
            this.productIdToNameMap[bank_transfer_gifts.online_bank_transfer_gift_product_id ] =bank_transfer_gifts.online_bank_transfer_gift_product_name;
          });
        }
        // if(product.order_line_single_paymt_gifts.length > 0 ){
        //   this.productIdToNameMap[product.order_line_single_paymt_gifts[0].single_paymt_gift_product_id] = product.order_line_single_paymt_gifts[0].single_paymt_gift_product_name;
        // }

        if(product.order_line_single_paymt_gifts.length > 0 ){
          product.order_line_single_paymt_gifts.forEach(single_paymt_gifts =>{
            this.productIdToNameMap[single_paymt_gifts.single_paymt_gift_product_id ] =single_paymt_gifts.single_paymt_gift_product_name;
          });
        }
      });

    }else{
      this.listProduct.forEach(product => {
        if(product.is_deposit || product.is_kit){
          this.productIdToNameMap[product.id] = product.productName;

        }
      })
    }
    let index = 0
    const shippingStatusData = [];
    shippingStatuses.forEach(status => {
      let quantity = 0
      index = index + 1
      // let trackingMxpress : string
      // if(this.fullOrder.shipping.shippingStatus.shippingAgent === 'MXPRESS'){
      //   this.shippingService.getTrackingMxpress('E000610340').subscribe(data=>{
      //     trackingMxpress = (!CheckNullOrUndefinedOrEmpty(data['xml']) && !CheckNullOrUndefinedOrEmpty(data['xml']['shipmentevent']) && !CheckNullOrUndefinedOrEmpty(data['xml']['shipmentevent'][0]) ) ? data['xml']['shipmentevent'][0].statusname : ''
      //     console.log(data)
      //   })
      // }
      const productIdAndQtyArr = status.productIdAndQty;
      if (productIdAndQtyArr) {
        if (productIdAndQtyArr) {
          productIdAndQtyArr.forEach(obj => {
            shippingStatusData.push(new ProductShippingStatus(
              index.toString(),
              status.trackingID,
              this.productIdToNameMap[obj.productId],
              obj.quantity,
              status.status,
              formatDate(status.registeredDate, "dd/MM/yyyy", "en-US")))
            });
        }
      }
      else {
        shippingStatusData.push(new ProductShippingStatus(
          status.shipmentPieceID,
          status.trackingID,
          'N/A',
          'N/A',
          status.status,
          'N/A'));
      }
    })
    return shippingStatusData;
  }

  createInvoice(){
    let printContents = document.getElementById('printInvoice').innerHTML;
    // var originalContents = document.body.innerHTML;

    document.title = 'Thermomix-Invoice-' + this.order_id_tmm;

    document.body.innerHTML = printContents;

    window.print();

    location.reload()
  }

  fds(){
    document.title = this.order_id
  }

  setFormState(event): void {
    const selectedCountryCode = event.value;
    // this.stateCodeToNameFormOptions = environment.countryCodeToStates[selectedCountryCode];
  }

  keepOriginalOrder = (a, b) => a.key;



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
        if(data.data !== null && data.data !== undefined){
          this.lockTime = data.data.locked_at;
          this.lockBy = data.data.appUser !== null ? data.data.appUser.email : ""
        }
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
      }
      else{
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

    if (this.advisorName.length === 0 || CheckNullOrUndefinedOrEmpty(this.advisorName)) {
      var previous = <HTMLInputElement>document.getElementById('add-advisor');

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

  searchAdvisorId(value) {
    if (value === '' || value % 1 != 0) {
      this.advisorName = '';
      this.advisorImg = "assets/icons/doxa-icons/UserMenu.svg";
      return;
    }
    this.customerService.searchAdvisorByAdvisorId(value).subscribe((data) => {
      if (!CheckNullOrUndefinedOrEmpty(data)) {
        this.advisorName = data.advisorName;
        if (!CheckNullOrUndefinedOrEmpty(data.advisorPhotoKey)) {
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
          this.buttonName = "Submit "

        }   else {

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
      let getYearNow = (new Date()).getFullYear();
      this.shippingService.getPublicHoliday(this.nation_code, getYearNow).subscribe(data => {
        data.forEach(element => {
          this.publicHolidayArr.push(new Date(element));
        });
      });

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

  async showChangeLocationMYForm() {
    let dataLock;
    await this._orderService.checkLockOrder(this.order_id).toPromise().then(data=>{
      dataLock = data;
    })
    if(dataLock == 1){

      if (this.isShowLocationMY) {
        this.isShowLocationMY = false;

        this.checkDataShipping(this.shippingData);
      } else {
        this.isShowLocationMY = true;
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
                  this.getOrderAfter(this.order_id);
                  this.isShowShipping = false;
                }
              }
            )
          }
        }
      )
    }
  }

  changeLocationMY() {
    let shippingLocationMethod = {
      'shippingId': this.fullOrder.shipping.id,
      'orderId': this.fullOrder.id,
      'shippingLocation': this.shippingLocationMY
    }
      this.shippingService.changeShippingLocationMethod(shippingLocationMethod).subscribe(
        data => {
          if (data.code === 200) {

            const dialogNotifi = this.dialog.open(CommonDialogComponent, {
              width: "600px",
              data: {
                message:
                  "Update Shipping Location Success.",
                title:
                  "NOTIFICATION",
                colorButton: false
              },
            });

            dialogNotifi.afterClosed().subscribe(
              data => {
                if (data) {
                  this.getOrderAfter(this.order_id);
                  this.isShowLocationMY = false;
                }
              }
            )
          }
        }
      )
  }

  onChangeShipping(event) {
    this.isCheckChangeShipping = true;
    this.shippingMethod = this.shippingMethodArr.filter(shipping => shipping.value === event.value.value)[0];
  }

  onChangeShippingLocationMY(event) {
    this.isCheckChangeShipping = true;
    this.shippingLocationMY = event.value;
  }

  onChange(mrChange: MatRadioChange) {
    this.is_shipping_agent = !this.is_shipping_agent;
    let method: string;

    if (this.is_shipping_agent) {
      method = 'BY_COURRIER';
    } else {
      method = 'BY_THERMOMIX';
    }

    if (this.nation_code === 'MY') {
      let shippingMethod = {
        'shippingId': this.fullOrder.shipping.id,
        'orderId': this.fullOrder.id,
        'shippingMethod': method
      }

      this.shippingService.changeShippingMethod(shippingMethod).subscribe(
        data => {
          if (data.code === 200) {
            this.getOrderAfter(this.order_id);
          }
        }
      );

    } else if (this.nation_code === 'SG'){
      let formShipping = new DeliveryShipping();

      formShipping.sd_id = this.shippingData.sdId;
      formShipping.shippingId = this.shippingData.id;
      formShipping.orderId = this.order_id;
      formShipping.delivery_type = 'NORMAL';
      formShipping.delivery_date = null;
      formShipping.delivery_time_slot = null;
      formShipping.delivery_by = method;

      this.shippingService.cancelQXpress(this.shippingData.id).pipe(
        mergeMap((data1) => this.shippingService.saveShippingSpecial(formShipping))
      ).subscribe((data2) => {
        if (data2.code === 200) {
          this.getOrderAfter(this.order_id);
          this.isShowShipping = false;
        }
      })
    }

  }

  grandmaHandleClick(event) {
    return this.getOrder(this.order_id);
  }

  async cancelOrder() {

    let dataCheck;
    await this._orderService.checkLockOrder(this.fullOrder.id).toPromise().then(data => {
      dataCheck = data;
    });

    if (dataCheck == 1) {

      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '600px',
        data: { message: 'Are you sure you want to cancel this order?', type: "CANCEL",
        warningMessage: 'The shipping label and/or invoice has been printed. Please make sure the Order is not shipped yet before you cancel.'}
      });

      dialogRef.afterClosed().subscribe(data => {
        if (data) {

          this._orderService.updateStatusOfOrder(this.order_id, 'CANCELLED').subscribe( data => {
            if (data.code === 200) {
              this.router.navigate(['direct-sales/orders/cancelled'], { queryParams: { id: this.order_id }});
            }
          });
        } else {
          dialogRef.close();
        }
      });

    } else if (dataCheck == 2) {
      const dialogRef = this.dialog.open(CommonDialogComponent, {
        width: '600px',
        data: {
          message: ErrorMessageLock.ANOTHER_LOCK, type: "back",
          colorButton: true, title: 'REMINDER', buttonName: 'GO BACK'
        }
      });
    } else if (dataCheck == 3) {
      const dialogRef = this.dialog.open(CommonDialogComponent, {
        width: '600px',
        data: {
          message: ErrorMessageLock.LOCKED_BEFORE_PROCESS, type: "back",
          colorButton: true, title: 'REMINDER', buttonName: 'GO BACK'
        }
      });
    } else {
      const dialogRef = this.dialog.open(CommonDialogComponent, {
        width: '600px',
        data: {
          message: ErrorMessageLock.ERROR_LOCKED, type: "back",
          colorButton: true, title: 'REMINDER', buttonName: 'GO BACK'
        }
      });
    }
  }

  onChangeDeliveryBy() {
    let getYearNow = (new Date()).getFullYear();
    this.shippingService.getPublicHoliday(this.nation_code, getYearNow).subscribe(data => {
      data.forEach(element => {
        this.publicHolidayArr.push(new Date(element));
      });
    });

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
    let getYearNow = (new Date()).getFullYear();
    this.shippingService.getPublicHoliday(this.nation_code, getYearNow).subscribe(data => {
      data.forEach(element => {
        this.publicHolidayArr.push(new Date(element));
      });
    });

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

    if (this.specificDateTimeForm.get('deliverMethod').value.value === 3) {
      let formCreate = new CreateQuickOrder();
      formCreate.orderId = this.order_id;
      formCreate.shipping_id = this.shippingData.id;
      formCreate.customerName = this.fullOrder.deliveryAddress.firstName;
      formCreate.customerPhone = this.fullOrder.deliveryAddress.phoneDialCode + this.fullOrder.deliveryAddress.phoneNumber;
      formCreate.customerZipCode =  this.fullOrder.deliveryAddress.postalCode;
      formCreate.customerAddressLine1 = this.fullOrder.deliveryAddress.addressLine1;
      formCreate.customerAddressLine2 = this.fullOrder.deliveryAddress.addressLine2;
      formCreate.pickUpdate = formatDate(this.specificDateTimeForm.get('specificDate').value, "yyyy-MM-dd", "en-US");
      formCreate.pickUpTime = !CheckNullOrUndefinedOrEmpty(this.specificDateTimeForm.get('specificTime').value.DEL_TIME_SLOT) ?
      this.specificDateTimeForm.get('specificTime').value.DEL_TIME_SLOT : this.specificDateTimeForm.get('specificTime').value.time_slot;

      this.fullOrder.listProduct.forEach(element => {
        let orderItemsQxpress = new OrderItemsQxpress();

        orderItemsQxpress.ITEM_NM = element.productName;
        orderItemsQxpress.ITEM_ID = Number(element.id);
        orderItemsQxpress.QTY = element.quantity;
        orderItemsQxpress.CURRENCY = element.currencyCode;
        orderItemsQxpress.PURCHASE_AMT = element.price;
        formCreate.orderItem.push(orderItemsQxpress);
      });

      this.shippingService.createQXpress(formCreate).subscribe( data => {
        if (data.code === 200) {
          this.shippingService.saveShippingSpecial(formShipping).subscribe(data => {
            if (data.code === 200) {
              this.getOrderAfter(this.order_id);
              this.isShowShipping = false;
            }
          })

        } else if (data.code === 201) {
          const dialogNotifi = this.dialog.open(CommonDialogComponent, {
            width: "500px",
            data: {
              message: data.data.ResultMsg,
              title:
                "NOTIFICATION",
              colorButton: false
            },
          });

          dialogNotifi.afterClosed().subscribe(data => {
            if (data) {
              dialogNotifi.close();
            }
          });
        }
      })
    } else {

      if (!CheckNullOrUndefinedOrEmpty(this.shippingData.specialDelivery)) {
        if (this.shippingData.specialDelivery.sd_type == 'SD_BEFORE') {
          const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            width: '700px',
            data: { message: 'To make a change of this delivery, we have to cancel current booking with Qxpress. Are you sure to proceed?', type: "REJECTED" }
          });

          dialogRef.afterClosed().subscribe(check => {
            if (check) {
              this.shippingService.cancelQXpress(this.shippingData.id).pipe(
                mergeMap((data1) => this.shippingService.saveShippingSpecial(formShipping))
              ).subscribe((data2) => {
                if (data2.code === 200) {
                  this.getOrderAfter(this.order_id);
                  this.isShowShipping = false;
                  this.isShowMaskAsShipped = true;
                }
              })
            } else {
              dialogRef.close();
            }
          })
        } else {
          this.shippingService.cancelQXpress(this.shippingData.id).pipe(
            mergeMap((data1) => this.shippingService.saveShippingSpecial(formShipping))
          ).subscribe((data2) => {
            if (data2.code === 200) {
              this.getOrderAfter(this.order_id);
              this.isShowShipping = false;
              this.isShowMaskAsShipped = true;
            }
          })
        }

      } else {
        this.shippingService.cancelQXpress(this.shippingData.id).pipe(
          mergeMap((data1) => this.shippingService.saveShippingSpecial(formShipping))
        ).subscribe((data2) => {
          if (data2.code === 200) {
            this.getOrderAfter(this.order_id);
            this.isShowShipping = false;
            this.isShowMaskAsShipped = true;
          }
        })
      }

    }
  }

  checkShowShipByThermomix() {
    if (!CheckNullOrUndefinedOrEmpty(this.specificDateTimeForm.get('deliverType').value) &&
        this.fullOrder.shipping.shippingMethod === 'BY_COURRIER' && this.specificDateTimeForm.get('deliverMethod').value.value === 2 &&
        this.fullOrder.shipping.isManualShipping) {

        return true;

    } else return false;
  }

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

  downloadInvoice() {
    this._orderService.downloadInvoice(this.uuid).subscribe(data=>{
      if(data){
        this.invoicePdf = data.data
        this.downloadDataUrlFromJavascript("invoice-pdf", this.invoicePdf)
      }else{
        return
      }
    })
  }

  downloadDataUrlFromJavascript(filename, dataUrl) {

    // Construct the 'a' element
    var link = document.createElement("a");
    link.download = filename;

    // Construct the URI
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();

    // Cleanup the DOM
    document.body.removeChild(link);
  }
}

export class OrderHistories {
  id: string;
  action: string;
  createdAt: Date;
}

export function CreateInvoice(id){
  var printContents = document.getElementById('printInvoice').innerHTML;
    // var originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents;

    document.title = window.parent.document.title = 'Thermomix-Invoice-' + id;

    window.print();

    location.reload()
}

function phoneNumberValidator(checkOutForm: FormControl) {
  if (isNaN(checkOutForm.value) === false && !checkOutForm.value.includes(' ')) {
    return null;
  }
  return { phone_number: true };
}

function moveArrayItemToNewIndex(arr, old_index, new_index) {
  if (new_index >= arr.length) {
      var k = new_index - arr.length + 1;
      while (k--) {
          arr.push(undefined);
      }
  }
  arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
  return arr;
};
