import { CheckNullOrUndefinedOrEmpty } from 'app/core/utils/common-function';
import { Shipping } from './../../../../../../../core/service/orders.service';
import { forkJoin, Subject } from 'rxjs';
import { countOrder } from './../../../../../../../core/service/backend-api';
import { forEach } from 'lodash';
import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl, ValidatorFn } from '@angular/forms';
import { OrdersService } from 'app/core/service/orders.service';
import { ShippingService } from 'app/core/service/shipping.service';
import * as moment from 'moment';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';

import { Location} from '@angular/common'
import { CreateShipmentDto } from 'app/core/dto/create-shipment.dto';
import { InventoryService, InventoryProduct } from 'app/core/service/inventory.service';
import { FormDataInventory } from 'app/main/direct-sales/products/inventory/create-stock/create-stock.component';
import { isNullOrUndefined, isNumber } from 'util';
import { CommonDialogComponent } from 'app/main/_shared/common-dialog/common-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { SharedService } from 'app/core/service/shared.service';
import { WarrantiedService } from 'app/core/service/warrantied.service';
import { Serial } from 'app/core/models/Serial.model';
import { Product } from 'app/core/models/product.model';
import { element } from 'protractor';
import * as jwt_decode from 'jwt-decode';
import { ConfirmDialogComponent } from 'app/main/_shared/confirm-dialog/confirm-dialog.component';
import { ErrorMessageLock } from 'app/core/enum/error-message.enum';
import { DialogConfirmComponent } from 'app/main/_shared/dialog-confirm/dialog-confirm.component';

@Component({
  selector: 'app-button-shipping',
  templateUrl: './button-shipping.component.html',
  styleUrls: ['./button-shipping.component.scss']
})
export class ButtonShippingComponent implements OnInit , OnChanges {
  allShippingAgents: any[];
  allPickupAddresses: any[];
  shippingAgentsToPickupAddressesMap: any[];
  shipperPickupAddresses: any[];
  isSelectingShippingAgent: boolean;
  shippingAgentForm: FormGroup;
  minPickupDate = new Date();
  minPickupTime = '09:00';
  maxPickupTime = '17:30';
  isCreatingShipment: boolean;
  isCreatingShipmentError: boolean;
  isUpdatingShipmentError: boolean;
  isTrackingShipmentError: boolean;
  isUpdatingShipmentTrackingError: boolean;
  shipmentCreationErrorMsg: string;

  isCustomShipmentGroups: boolean;
  totalQuantity = 0;
  minNumOfGroups = 1;
  currentNumOfGroups = 0;
  productsFormGroups = {};
  productNameToIdMap = {};

  isShippingAgentChosen: boolean;
  isShippingAgentIntegrated: boolean;
  shipmentIdArray: string[];

  matChipAddOnBlur = true;
  matChipSelectable = true;
  matChipRemovable = true;
  formDataQxpress: any;
  readonly separatorKeysCodes: number[] = [COMMA, ENTER];

  entityId : number;
  decoded: any;
  allInventoryProducts = [];
  checkBalance: boolean = true;
  is_need_advisor: boolean = false;

  qexpressError: boolean = true
  errorQexpress: string;

  listAgent : Array<AgentName> = [];
  test_manual_shipping : string ='';
  is_choose_menual_shipping : boolean = false;

  agentName: string;
  laberOf: string;
  buttonName:string = "Create Shipping Label";
  buttonNameMarkAsShip:string = "Mark As Shipped/Collected";
  active : boolean = false;
  activeMarkAsShip: boolean = false;
  // checkLock
  @Input() orderId;
  @Input() isShippingSelfCollect: boolean;
  @Input() isShippingAgentSelected: boolean;
  @Input() checkLabelQxpress: boolean;
  @Input() shippingLabels: any[];
  @Input() productList: any[];
  @Input() customer_id: number;
  @Input() customerData: any;
  @Input() advisor_customer_id;
  @Input() deliveryAddress : any;
  @Input() trackingData : any;
  @Input() dataProduct : any;
  @Input() product_number_serial: number;
  @Output() shippingAgentSelected = new EventEmitter<boolean>();
  @Input() is_agent_shipping : boolean;
  isValid: boolean = false;
  @Output() downloadLabel = new EventEmitter();
  @Input() fullOrder;
  @Input() checkLock;
  @Input() isShowMaskAsShipped: boolean;

  is_naep_order: boolean;
  isDisable: boolean = false;
  constructor(
    private router: Router,
    private _formBuilder: FormBuilder,
    private _orderService: OrdersService,
    private _shippingService: ShippingService,
    private _inventoryService: InventoryService,
    public dialog: MatDialog,
    private sharedService: SharedService,
    private warrantiedService: WarrantiedService,
    private location : Location
  ) { }

  ngOnChanges(changes: SimpleChanges): void{
    if(!CheckNullOrUndefinedOrEmpty(changes.deliveryAddress)){
      this.deliveryAddress = changes.deliveryAddress.currentValue
    }
  }

  ngOnInit(): void {
    this.laberOf = (!CheckNullOrUndefinedOrEmpty(this.fullOrder) && !CheckNullOrUndefinedOrEmpty(this.fullOrder.shipping)
                    && !CheckNullOrUndefinedOrEmpty(this.fullOrder.shipping.shippingStatus)) ? this.fullOrder.shipping.shippingStatus.shippingAgent : "";
    this.is_naep_order = this.fullOrder.is_naep_order;
    this.minPickupDate.setDate(this.minPickupDate.getDate() + 1);
    if(!this.is_naep_order){
      this.productList.forEach(product => {

        if (product.id != undefined) {
          this.totalQuantity += product.quantity;
          this.productsFormGroups[product.id] = [];
          this.productNameToIdMap[product.productName] = product.id;
          if(!CheckNullOrUndefinedOrEmpty(product.order_line_online_bank_transfer_gifts)){
            this.totalQuantity += product.order_line_online_bank_transfer_gifts.length
            product.order_line_online_bank_transfer_gifts.forEach(bank_transfer_gifts => {
              this.productsFormGroups[bank_transfer_gifts.online_bank_transfer_gift_product_id] = [];
              this.productNameToIdMap[bank_transfer_gifts.online_bank_transfer_gift_product_name] =bank_transfer_gifts.online_bank_transfer_gift_product_id;
            });
            // this.productsFormGroups[product.order_line_online_bank_transfer_gifts[0].online_bank_transfer_gift_product_id] = [];
            // this.productNameToIdMap[product.order_line_online_bank_transfer_gifts[0].online_bank_transfer_gift_product_name] = product.order_line_online_bank_transfer_gifts[0].online_bank_transfer_gift_product_id;
          }
          if(!CheckNullOrUndefinedOrEmpty(product.order_line_single_paymt_gifts) ){
            // this.productsFormGroups[product.order_line_single_paymt_gifts[0].single_paymt_gift_product_id] = [];
            // this.productNameToIdMap[product.order_line_single_paymt_gifts[0].single_paymt_gift_product_name] = product.order_line_single_paymt_gifts[0].single_paymt_gift_product_id;
            this.totalQuantity += product.order_line_single_paymt_gifts.length;
            product.order_line_single_paymt_gifts.forEach(single_paymt_gifts => {
              this.productsFormGroups[single_paymt_gifts.single_paymt_gift_product_id] = [];
              this.productNameToIdMap[single_paymt_gifts.single_paymt_gift_product_name] =single_paymt_gifts.single_paymt_gift_product_id;
            });
          }

          this.is_need_advisor = this.is_need_advisor || product.hasAdvisor;
        }

      });

    }else{
      this.productList.forEach(product => {
        if(product.is_deposit || product.is_kit){
          this.totalQuantity += product.quantity;
          this.productsFormGroups[product.id] = [];
          this.productNameToIdMap[product.productName] = product.id;
          this.is_need_advisor = this.is_need_advisor || product.hasAdvisor;
        }
      })
    }
    // console.log(this.productNameToIdMap)
    // console.log(this.productsFormGroups)
    // console.log(this.totalQuantity)
    this.shippingAgentForm = this._formBuilder.group({
      shippingAgentId: ['', Validators.required],
      shipmentIdArr: [{ value: [], disabled: true }, Validators.required],
      pickupAddressId: [{ value: '', disabled: true }, Validators.required],
      // remarks: [''],
      pickupDate: [{ value: '', disabled: true }, Validators.required],
      pickupTime: [{ value: '', disabled: true }, Validators.required],
      customShipmentGroups: [{ value: false, disabled: true }],
      numOfGroups: [{ value: 0, disabled: true }, {
      validators: [Validators.required, this.numOfGroupsValidator.bind(this)]
      }],
      //shipmentGroups: this._formBuilder.array([], [this.productQuantityValidator.bind(this), this.emptyShipmentValidator.bind(this)])
    });
    this.shippingAgentForm['controls'].customShipmentGroups.valueChanges.subscribe(val => {
      this.setShipmentGroupingSubForm(val);
    });
    this.shippingAgentForm['controls'].numOfGroups.valueChanges.subscribe(val => {
      if (val === null || val < 0) {
        val = this.currentNumOfGroups;
        return;
      }
      this.addOrRemoveShipmentGroups(val);
    });
    this.shippingAgentForm.valueChanges.subscribe(val => {
      // console.log(this.shippingAgentForm);
      // console.log(this.findInvalidControlsRecursive(this.shippingAgentForm));
    });
    if (!this.isShippingAgentSelected) {
      this.getShippingAgentsFormData();
    }

    this._inventoryService.getProductInventoryById(this.orderId).subscribe(data => {
      if (!CheckNullOrUndefinedOrEmpty(data)) {
        this.allInventoryProducts = data;
      }
    });
    // this._shippingService.getTrackingDataForQxpress('13333').subscribe(data=>{
    //   console.log(data)
    // })
    let token = localStorage.getItem('token');
    if (!CheckNullOrUndefinedOrEmpty(token)){
        this.decoded = jwt_decode(token);
        if(!CheckNullOrUndefinedOrEmpty(this.decoded)){
          this.entityId = Number(this.decoded.entity_id);
        }
    }

    // this._orderService.checkLockOrder(this.orderId).subscribe(data=>{
    //   this.checkLock = data;
    // });
  }

  setFormState(event) {
    let agent = this.listAgent.filter(e=>e.id === event.value)[0].name;
    this.agentName = (agent === "DHL eCommerce Malaysia") ? "DHL" : ((agent === "MXpress Malaysia") ? "MXPRESS" : ((agent === "QXpress Singapore" || agent === "QXPRESS Vietnames") ? "QXPRESS" : ""));
    this.shipperPickupAddresses = [];
    this.shippingAgentsToPickupAddressesMap
      .filter(obj => obj.et_shipping_agent_id === event.value)
      .forEach(obj => {
        const address = this.allPickupAddresses.find(address => address.id === obj.et_address_id);
        this.shipperPickupAddresses.push(address);
      });
    const shipper = this.allShippingAgents.find(obj => obj.id === event.value);
    // console.log(this.shipperPickupAddresses)
    this.isShippingAgentChosen = true;
    this.shipmentIdArray = [];
    this.shipperPickupAddresses.sort(function(a,b){ return (a.id - b.id)})
    if (shipper.mtShippingAgent.is_integrated) {
      this.isShippingAgentIntegrated = true;
      this.toggleShipmentIdInput(false);
      this.togglePickupAddressInput(true);
      if (shipper.is_pickup_daily) {
        this.togglePickupDateAndTimeInput(false);
      }
      else {
        this.togglePickupDateAndTimeInput(true);
      }
      if (shipper.mtShippingAgent.can_group_shipment) {
        this.toggleCustomShipmentGroupInput(true);
      }
      else {
        this.toggleCustomShipmentGroupInput(false);
      }
    }
    else {
      this.isShippingAgentIntegrated = false;
      this.toggleShipmentIdInput(true);
      this.togglePickupAddressInput(false);
      this.togglePickupDateAndTimeInput(false);
      this.toggleCustomShipmentGroupInput(false);
    }
  }

  addShipmentId(event: MatChipInputEvent) {
    const input = event.input;
    const value = event.value;
    if ((value || '').trim()) {
      this.shippingAgentForm['controls'].shipmentIdArr.value.push(value.trim());
    }
    if (input) {
      input.value = '';
    }
    this.shippingAgentForm['controls'].shipmentIdArr.updateValueAndValidity();
  }

  removeShipmentId(shipmentId: string) {
    const shipmentIdIndex = this.shippingAgentForm['controls'].shipmentIdArr.value.indexOf(shipmentId);
    if (shipmentIdIndex !== -1) {
      this.shippingAgentForm['controls'].shipmentIdArr.value.splice(shipmentIdIndex, 1);
    }
    this.shippingAgentForm['controls'].shipmentIdArr.updateValueAndValidity();
  }

  updateDateField(event) {
    let convertDate = new Date(event.target.value).toISOString().substring(0, 10);
    this.shippingAgentForm.get('pickupDate').setValue(convertDate, {
      onlyself: true
    });
  }

  async toggleForm() {
    let dataCheck;
    await this._orderService.checkLockOrder(this.fullOrder.id).toPromise().then(data=>{
      dataCheck = data;
    })
      if(dataCheck == 1){
        this.isSelectingShippingAgent = !this.isSelectingShippingAgent;
        this.isShippingAgentChosen = false;
        this.isShippingAgentIntegrated = false;
        if (!this.isSelectingShippingAgent) {
          this.shippingAgentForm.reset({
            shippingAgent: '',
            pickupAddress: '',
            // remarks: '',
            pickupDate: { value: '', disabled: true },
            pickupTime: { value: '', disabled: true },
            customShipmentGroups: { value: false, disabled: true },
            numOfGroups: { value: 0, disabled: true }
          });
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

  onSubmit() {
    this.active = true;
    if(this.entityId==2 && this.agentName === "DHL"){
      const createShipmentDto = this.createShipment(this.isShippingAgentIntegrated);
      this.isCreatingShipment = true;
      this.isCreatingShipmentError = false;
      this.isUpdatingShipmentError = false;
      this.isTrackingShipmentError = false;
      this.isUpdatingShipmentTrackingError = false;
      // console.log(createShipmentDto);
      this._shippingService.createShippingLabels(createShipmentDto).subscribe(response => {
        if (this.isShippingAgentIntegrated) {
          if (response === null || response.createShipmentResult.code === 500) {
            this.isCreatingShipmentError = true;
            this.shipmentCreationErrorMsg = response.createShipmentResult.error.messageDetails[0].messageDetail;
          }
          else if (!response.updateCreateShipmentResult || response.updateCreateShipmentResult.code === 500) {
            this.isUpdatingShipmentError = true;
          }
          // else if (response.trackShipmentResult.code === 500) {
          //   this.isTrackingShipmentError = true;
          // }
          // else if (response.updateTrackShipmentResult.code === 500) {
          //   this.isUpdatingShipmentTrackingError = true;
          // }
          else {
            if (!response.trackShipmentResult || response.trackShipmentResult.code === 500) {
              this.isTrackingShipmentError = true;
            }
            else if (!response.updateTrackShipmentResult || response.updateTrackShipmentResult.code === 500) {
              this.isUpdatingShipmentTrackingError = true;
            }
            this.agentName = '';
            this.isSelectingShippingAgent = false;
            this.isCreatingShipment = false;
            this.shippingAgentSelected.emit(true);
          }
          this.active = false;
        }
        else {
          if (response === null || response.code === 500) {
            this.isCreatingShipmentError = true;
          }
          else {
            this.isSelectingShippingAgent = false;
            this.isCreatingShipment = false;
            this.shippingAgentSelected.emit(true);
          }
          this.active = false;
        }
      }, err => {
          console.log(err);
          this.isCreatingShipmentError = true;
          this.shipmentCreationErrorMsg = "Server is unavailable.";
      });
    }else if(this.entityId==2 && this.agentName === "MXPRESS"){
      let formData = new FormData()
      const createShipmentDto = this.createShipment(this.isShippingAgentIntegrated);
      // console.log('hahahahahah',createShipmentDto)
      formData.shippingAgent = "MXPRESS";
      formData.refOrderNo = this.orderId;
      formData.shipmentGroups = createShipmentDto.shipmentGroups;
      formData.pickupAddressId = Number(createShipmentDto.pickupAddressId)
      // console.log(formData)
      this.isDisable = true;
      this._shippingService.createMpxressShipping(formData).subscribe(data=>{
        // console.log(data)
        if(data.code === 200){
          // if(data.data.SureReachAPI_Response.strResponseMsg === "Success"){
          //   let id =  data.data.SureReachAPI_Response.strResponseData.split('<cnnumber>')[1].split('</cnnumber>')[0]
          this.isSelectingShippingAgent = false;
          this.isCreatingShipment = false;
          this.shippingAgentSelected.emit(true);
          this.isCreatingShipmentError = false;
          this.shipmentCreationErrorMsg = '';
          this.isDisable = false;
          this.active = false;
          this.agentName = '';
          // }
        }else if(data.code === 202){
          this.isCreatingShipmentError = true;
          this.shipmentCreationErrorMsg = data.data
          this.isDisable = false;
          this.active = false;
        }else{
          this.isDisable = false;
          this.isCreatingShipmentError = true;
          this.active = false;
        }
      })

    }else if((this.entityId == 1 || this.entityId == 3) && this.agentName === "QXPRESS"){
      let formData = new FormData()
      const createShipmentDto = this.createShipment(this.isShippingAgentIntegrated);
      formData.shippingAgent = "QXPRESS";
      formData.refOrderNo = this.orderId;
      formData.shipmentGroups = createShipmentDto.shipmentGroups
      this._shippingService.createTrackingForQxpress(formData).subscribe(response=>{
        if (response.code === 201) {
          this.isCreatingShipment = true;
          this.qexpressError = false;
          this.errorQexpress = response.errors;
        } else if (response.code === 200){
          this.isSelectingShippingAgent = false;
          this.isCreatingShipment = false;
          this.shippingAgentSelected.emit(true);
          this.errorQexpress = null;
          this.qexpressError = true;
          this.agentName = '';
        }
      })
    }

  }

  async downloadShippingLabels() {
    let dataCheck;
    await this._orderService.checkLockOrder(this.fullOrder.id).toPromise().then(data=>{
      dataCheck = data;
    })
      if(dataCheck == 1){
        const shipmentLabels = this.shippingLabels;

        // Source: https://stackoverflow.com/questions/2339440/download-multiple-files-with-a-single-action/9425731#9425731
        function download_next(i) {
          if (i >= shipmentLabels.length) {
            return;
          }
          let a = document.createElement('a');
          a.href = shipmentLabels[i].labelURL;
          a.target = '_blank';
          // Use a.download if available, it prevents plugins from opening.
          if ('download' in a) {
            a.download = shipmentLabels[i].deliveryConfirmationNo;
          }
          // Add a to the doc for click to work.
          (document.body || document.documentElement).appendChild(a);
          if (a.click) {
            a.click(); // The click method is supported by most browsers.
          } else {
            $(a).click(); // Backup using jquery
          }
          // Delete the temporary link.
          a.parentNode.removeChild(a);
          // Download the next file with a small timeout. The timeout is necessary
          // for IE, which will otherwise only download the first file.
          setTimeout(function () {
            download_next(i + 1);
          }, 1000);
        }
        // Initiate the first download.
        download_next(0);
        this._orderService.updateHistoryShippingLabel(this.orderId).subscribe(data=>{
          if(data.code === 200){
            this.downloadLabel.emit("download");
          }
        })
      }
      // else if(dataCheck == 1 && this.laberOf == "MXPRESS"){
      //   this._orderService.updateHistoryShippingLabel(this.orderId).subscribe(data=>{})
      //   let printContents = document.getElementById('printArea').innerHTML;
      //   document.title = 'Ship_Order#'+this.orderId;

      //   document.body.innerHTML = printContents;

      //   window.print();
      //   location.reload()
      // }
      else if(dataCheck == 2){
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

  arry = [];
  checkNumberQuantity = false;
  disableButtonMarkAsShip: boolean = false;
  async navigateToReceive() {
    let dataCheck;
    await this._orderService.checkLockOrder(this.fullOrder.id).toPromise().then(data=>{
      dataCheck = data;
    })
      if(dataCheck == 1){
        if(this.disableButtonMarkAsShip){
          return;
        }else{
          if (!CheckNullOrUndefinedOrEmpty(this.fullOrder.deliveryAddress) && !CheckNullOrUndefinedOrEmpty(this.fullOrder.shipping)) {
            if (CheckNullOrUndefinedOrEmpty(this.fullOrder.deliveryAddress.email) && this.fullOrder.shipping.shippingMethod === 'BY_COURRIER') {
              const dialogNotifi = this.dialog.open(CommonDialogComponent, {
                width: "500px",
                data: {
                  message:
                    'Please key in delivery address.',
                  title:
                    "NOTIFICATION",
                  colorButton: false
                },
              });

              return;
            }
          }

          let countNumberSerial = 0;
          this.productList.forEach(product => {
           if (!CheckNullOrUndefinedOrEmpty(product.warranty_duration_in_days)) {
             countNumberSerial += product.quantity;
             countNumberSerial -= product.list_serial_number_shipping.length;
           }
         });
          // console.log(this.productList,'product_list')
           this.sharedService.sharedMessage.subscribe(
             (message) => {
               this.arry = message;
             });

            //  console.log(this.arry);
           if (this.arry.length < countNumberSerial) {

             const dialogNotifi = this.dialog.open(CommonDialogComponent, {
               width: "500px",
               data: {
                 message:
                   'Please fill in all serial number.',
                 title:
                   "NOTIFICATION",
                 colorButton: true
               },
             });
             // dialogNotifi.afterClosed().subscribe()
           }

           else {
            if (this.advisor_customer_id == undefined && this.is_need_advisor) {

              const dialogNotifi = this.dialog.open(CommonDialogComponent, {
                width: "500px",
                data: {
                  message:
                    'Please assign advisor before Mark as Shipped/Collected.',
                  title:
                    "NOTIFICATION",
                  colorButton: true
                },
              });
            } else {
                if (this.arry.length == 0) {
                  let id = "#" + this.orderId;
                  let inventoryStockCardItem: FormDataInventory[] = [];


                  this.productList.forEach(element => {
                    if(!CheckNullOrUndefinedOrEmpty(element.productKit))
                    {
                      element.productKit.forEach(kit=>{
                        let formDataInventory = new FormDataInventory();
                        formDataInventory.in_out_type = 'OUT';
                        formDataInventory.moving_quantity = kit.quantity;
                        formDataInventory.product_id = kit.id;
                        let orderItem = this.allInventoryProducts.find(e => e.product.id == kit.id);
                        if (!CheckNullOrUndefinedOrEmpty(orderItem)) {
                          formDataInventory.stock_quantity = orderItem.product.product_inventory.stock_quantity;
                          formDataInventory.balance = + Number(formDataInventory.stock_quantity) - Number(kit.quantity);
                          inventoryStockCardItem.push(formDataInventory);
                        } else {
                          this.checkNumberQuantity = true;
                        }
                      })
                    }else if(element.is_host_gift){
                      let formDataInventory = new FormDataInventory();
                      formDataInventory.in_out_type = 'OUT';
                      formDataInventory.moving_quantity = element.quantity;
                      formDataInventory.product_id = element.id;
                      let orderItem = this.allInventoryProducts.find(e => e.product.id == element.id);
                      if (!CheckNullOrUndefinedOrEmpty(orderItem)) {
                        formDataInventory.stock_quantity = orderItem.product.product_inventory.stock_quantity;
                        formDataInventory.balance = + Number(formDataInventory.stock_quantity) - Number(element.quantity);
                        inventoryStockCardItem.push(formDataInventory);
                        if(!CheckNullOrUndefinedOrEmpty(element.productGift)){
                          element.productGift.forEach(gift => {
                            let formDataGiftInventory = new FormDataInventory();
                            formDataGiftInventory.in_out_type = 'OUT';
                            formDataGiftInventory.moving_quantity = gift.quantity;
                            formDataGiftInventory.product_id = gift.id;
                            let giftItem = orderItem?.host_gift_item?.host_gift_item_component?.find(el => el.gift_product_id == gift.id);
                            if (!CheckNullOrUndefinedOrEmpty(giftItem)) {
                              formDataGiftInventory.stock_quantity = orderItem.product.product_inventory.stock_quantity;
                              formDataGiftInventory.balance = + Number(formDataGiftInventory.stock_quantity) - Number(gift.quantity);
                              inventoryStockCardItem.push(formDataGiftInventory);
                            }else {
                              this.checkNumberQuantity = true;
                            }
                          });
                        }
                      } else {
                        this.checkNumberQuantity = true;
                      }
                    }else{
                      if(!CheckNullOrUndefinedOrEmpty(element.id))
                      {
                        let formDataInventory = new FormDataInventory();
                        formDataInventory.in_out_type = 'OUT';
                        formDataInventory.moving_quantity = element.quantity;
                        formDataInventory.product_id = element.id;
                        let orderItem = this.allInventoryProducts.find(e => e.product.id == element.id);
                        if (!CheckNullOrUndefinedOrEmpty(orderItem)) {
                          formDataInventory.stock_quantity = orderItem.product.product_inventory.stock_quantity;
                          formDataInventory.balance = + Number(formDataInventory.stock_quantity) - Number(element.quantity);
                          inventoryStockCardItem.push(formDataInventory);
                        } else {
                          this.checkNumberQuantity = true;
                        }
                      }
                    }
                  });

                  inventoryStockCardItem.forEach(e => {
                    if (e.balance < 0) {
                      this.checkBalance = false;
                    }

                  });
                  if (!this.checkBalance || this.checkNumberQuantity) {
                    const dialogNotifi = this.dialog.open(CommonDialogComponent, {
                      width: "500px",
                      data: {
                        message:
                          'Balance of product not enough.',
                        title:
                          "NOTIFICATION",
                        colorButton: true
                      },
                    });
                  }


                  if (this.checkBalance && !this.checkNumberQuantity) {
                    let formData = {
                      comment: 'Order ' + this.orderId + ' update status to TO_RECEIVE',
                      in_out_date: new Date(),
                      inventory_stock_card_item: inventoryStockCardItem,
                      inventory_stock_card_attachment: []
                    };

                    this._inventoryService.createInventory(formData).subscribe(data => {
                      if (data.code === 200) {
                        let dialogNotifi;

                        if (!CheckNullOrUndefinedOrEmpty(this.fullOrder.shipping.specialDelivery) && CheckNullOrUndefinedOrEmpty(this.fullOrder.shipping.specialDelivery.select_date)) {
                          dialogNotifi = this.dialog.open(DialogConfirmComponent, {
                            disableClose: true,
                            width: "500px",
                            data: {
                              message:
                                'This order needs customer to select delivery date. Do you still want to proceed to mark as shipped/collected?',
                              title: 'NOTICE',
                              buttonLeft: 'NO',
                              buttonRight: 'YES',
                            },
                          });

                        } else {
                          dialogNotifi = this.dialog.open(ConfirmDialogComponent, {
                            disableClose: true,
                            width: '700px',
                            data: { message: 'Are you sure you want to Mark As Shipped/Collected?', type: "APPROVED" }
                          });
                        }

                        dialogNotifi.afterClosed().subscribe(result => {
                          if (result === true) {
                            this.activeMarkAsShip = true;
                            this.disableButtonMarkAsShip = true;

                            // -----------------------
                            this.sharedService.sharedMessage.subscribe(
                              (message) => {
                                this.arry = message;
                              }
                            );
                            if (this.arry.length > 0) {
                              // console.log(this.advisor_customer_id);
                              this.arry.forEach(element => {
                                // console.log(element);
                                let serial = new Serial();
                                serial.serial_number = element.serial;
                                serial.product_id = element.id;
                                serial.warranty_duration_in_days = element.warranty_day;
                                serial.customer_id = this.customer_id;
                                serial.advisor_customer_id = CheckNullOrUndefinedOrEmpty(this.advisor_customer_id) ? null : this.advisor_customer_id.id;
                                serial.order_id = this.orderId;
                                serial.order_line_id = element.orderLineId;
                                this.warrantiedService.createSerialNumber(serial).subscribe();
                              });
                            }
                            this.sharedService.nextCart([]);
                            // -------------------

                            if(this.is_choose_menual_shipping)
                            {
                                // forkJoin({
                                //   requestOne: this._orderService.sendDataAxway(this.orderId, "TO_SHIP" , "TO_RECEIVE"),
                                //   requestTwo: this.updateStatusOrder(this.orderId, "TO_RECEIVE",null,null,"Manual Shipping", this.test_manual_shipping)
                                // }).subscribe(({requestOne , requestTwo})=>{
                                //   this.activeMarkAsShip = false;
                                //   this.disableButtonMarkAsShip = false;
                                //   this.router.navigate(['direct-sales/orders/to-receive'], { queryParams: { id: id } });
                                // })
                                this.updateStatusOrder(this.orderId, "TO_RECEIVE",null,null,"Manual Shipping", this.test_manual_shipping);
                            }
                            else{
                             if(this.fullOrder.shipping.shippingMethod === 'SELF_COLLECT')
                              {
                                // forkJoin({
                                //   requestOne: this._orderService.sendDataAxway(this.orderId, "TO_SHIP" , "TO_RECEIVE"),
                                //   requestTwo: this.updateStatusOrder(this.orderId, "TO_RECEIVE")
                                // }).subscribe(({requestOne , requestTwo})=>{
                                //   this.activeMarkAsShip = false;
                                //   this.disableButtonMarkAsShip = false;
                                //   this.router.navigate(['direct-sales/orders/to-receive'], { queryParams: { id: id } });
                                // })
                                 this.updateStatusOrder(this.orderId, "TO_RECEIVE");
                              }else{
                                  // forkJoin({
                                  //   requestOne: this._orderService.sendDataAxway(this.orderId, "TO_SHIP" , "TO_RECEIVE"),
                                  //   requestTwo: this.updateStatusOrder(this.orderId, "TO_RECEIVE", null, null,`Shipping Agent - ${this.fullOrder.shipping.shippingStatus.shippingAgent}`)
                                  // }).subscribe(({requestOne , requestTwo})=>{
                                  //   this.activeMarkAsShip = false;
                                  //   this.disableButtonMarkAsShip = false;
                                  //   this.router.navigate(['direct-sales/orders/to-receive'], { queryParams: { id: id } });
                                  // })
                                  this.updateStatusOrder(this.orderId, "TO_RECEIVE", null, null,`Shipping Agent - ${this.fullOrder.shipping.shippingStatus.shippingAgent}`);
                              }
                            }
                          } else {
                            dialogNotifi.close();
                          }
                        });
                      }
                    });
                  }
                }
                else {
                  let list_serial_number = [];
                  this.arry.forEach(element => {
                    list_serial_number.push(element.serial);
                  });

                  list_serial_number.sort();
                  for (let i = 0; i < list_serial_number.length - 1; i++) {
                    if (list_serial_number[i] === list_serial_number[i + 1]) {
                      const dialogNotifi = this.dialog.open(CommonDialogComponent, {
                        width: "500px",
                        data: {
                          message: "Duplicate entries. Only unique data allowed.",
                          title:
                            "NOTIFICATION",
                          colorButton: true
                        },
                      });
                      return;
                    }
                  }

                  this.warrantiedService.checkSerialNumber(list_serial_number).subscribe(response => {
                    if (response.code === 200) {

                      let id = "#" + this.orderId;
                      let inventoryStockCardItem: FormDataInventory[] = [];
                      this.productList.forEach(element => {
                        if(!CheckNullOrUndefinedOrEmpty(element.productKit))
                        {
                          element.productKit.forEach(kit=>{
                            let formDataInventory = new FormDataInventory();
                            formDataInventory.in_out_type = 'OUT';
                            formDataInventory.moving_quantity = kit.quantity;
                            formDataInventory.product_id = kit.id;
                            let orderItem = this.allInventoryProducts.find(e => e.product.id == kit.id);
                            if (!CheckNullOrUndefinedOrEmpty(orderItem)) {
                              formDataInventory.stock_quantity = orderItem.product.product_inventory.stock_quantity;
                              formDataInventory.balance = + Number(formDataInventory.stock_quantity) - Number(kit.quantity);
                              inventoryStockCardItem.push(formDataInventory);
                            } else {
                              this.checkNumberQuantity = true;
                            }
                          })
                        }else if(element.is_host_gift){
                          let formDataInventory = new FormDataInventory();
                          formDataInventory.in_out_type = 'OUT';
                          formDataInventory.moving_quantity = element.quantity;
                          formDataInventory.product_id = element.id;
                          let orderItem = this.allInventoryProducts.find(e => e.product.id == element.id);
                          if (!CheckNullOrUndefinedOrEmpty(orderItem)) {
                            formDataInventory.stock_quantity = orderItem.product.product_inventory.stock_quantity;
                            formDataInventory.balance = + Number(formDataInventory.stock_quantity) - Number(element.quantity);
                            inventoryStockCardItem.push(formDataInventory);
                            if(!CheckNullOrUndefinedOrEmpty(element.productGift)){
                              element.productGift.forEach(gift => {
                                let formDataGiftInventory = new FormDataInventory();
                                formDataGiftInventory.in_out_type = 'OUT';
                                formDataGiftInventory.moving_quantity = gift.quantity;
                                formDataGiftInventory.product_id = gift.id;
                                let giftItem = orderItem?.host_gift_item?.host_gift_item_component?.find(e => e.product.id == gift.id);
                                if (!CheckNullOrUndefinedOrEmpty(giftItem)) {
                                  formDataGiftInventory.stock_quantity = orderItem.product.product_inventory.stock_quantity;
                                  formDataGiftInventory.balance = + Number(formDataGiftInventory.stock_quantity) - Number(gift.quantity);
                                  inventoryStockCardItem.push(formDataGiftInventory);
                                }else {
                                  this.checkNumberQuantity = true;
                                }
                              });
                            }
                          } else {
                            this.checkNumberQuantity = true;
                          }
                        }else{
                          if(!CheckNullOrUndefinedOrEmpty(element.id))
                          {
                            let formDataInventory = new FormDataInventory();
                            formDataInventory.in_out_type = 'OUT';
                            formDataInventory.moving_quantity = element.quantity;
                            formDataInventory.product_id = element.id;
                            let orderItem = this.allInventoryProducts.find(e => e.product.id == element.id);
                            if (!CheckNullOrUndefinedOrEmpty(orderItem)) {
                              formDataInventory.stock_quantity = orderItem.product.product_inventory.stock_quantity;
                              formDataInventory.balance = + Number(formDataInventory.stock_quantity) - Number(element.quantity);
                              inventoryStockCardItem.push(formDataInventory);
                            } else {
                              this.checkNumberQuantity = true;
                            }
                          }
                        }
                        // var formDataInventory = new FormDataInventory();
                        // formDataInventory.in_out_type = 'OUT';
                        // formDataInventory.moving_quantity = element.quantity;
                        // formDataInventory.product_id = element.id;
                        // var orderItem = this.allInventoryProducts.find(e => e.product.id == element.id);
                        // if (!isNullOrUndefined(orderItem)) {
                        //   formDataInventory.stock_quantity = orderItem.product.product_inventory.stock_quantity;
                        //   formDataInventory.balance = + Number(formDataInventory.stock_quantity) - Number(element.quantity);
                        //   inventoryStockCardItem.push(formDataInventory);
                        // } else {
                        //   this.checkNumberQuantity = true;
                        // }

                      });

                      inventoryStockCardItem.forEach(e => {
                        if (e.balance < 0) {
                          this.checkBalance = false;
                        }

                      });
                      if (!this.checkBalance || this.checkNumberQuantity) {
                        const dialogNotifi = this.dialog.open(CommonDialogComponent, {
                          width: "500px",
                          data: {
                            message:
                              'Balance of product not enough.',
                            title:
                              "NOTIFICATION",
                            colorButton: true
                          },
                        });
                      }

                      if (this.checkBalance && !this.checkNumberQuantity) {
                        let formData = {
                          comment: 'Order ' + this.orderId + ' update status to TO_RECEIVE',
                          in_out_date: new Date(),
                          inventory_stock_card_item: inventoryStockCardItem,
                          inventory_stock_card_attachment: []
                        };

                        this._inventoryService.createInventory(formData).subscribe(data => {
                          if (data.code === 200) {

                            let dialogNotifi;

                            if (!CheckNullOrUndefinedOrEmpty(this.fullOrder.shipping.specialDelivery) && CheckNullOrUndefinedOrEmpty(this.fullOrder.shipping.specialDelivery.select_date)) {
                              dialogNotifi = this.dialog.open(DialogConfirmComponent, {
                                disableClose: true,
                                width: "500px",
                                data: {
                                  message:
                                    'This order needs customer to select delivery date. Do you still want to proceed to mark as shipped/collected?',
                                  title: 'NOTICE',
                                  buttonLeft: 'NO',
                                  buttonRight: 'YES',
                                },
                              });
                            } else {
                              dialogNotifi = this.dialog.open(ConfirmDialogComponent, {
                                disableClose: true,
                                width: '700px',
                                data: { message: 'Are you sure you want to Mark As Shipped/Collected?', type: "APPROVED" }
                              });
                            }

                            dialogNotifi.afterClosed().subscribe(result => {
                              if (result === true) {
                                this.activeMarkAsShip = true;
                                this.disableButtonMarkAsShip = true;

                                // ---------------------
                                this.sharedService.sharedMessage.subscribe(
                                  (message) => {
                                    this.arry = message;
                                  }
                                );
                                if (this.arry.length > 0) {
                                  // console.log(this.advisor_customer_id);
                                  this.arry.forEach(element => {
                                    let serial = new Serial();
                                    serial.serial_number = element.serial;
                                    serial.product_id = element.id;
                                    serial.warranty_duration_in_days = element.warranty_day;
                                    serial.customer_id = this.customer_id;
                                    serial.advisor_customer_id = isNullOrUndefined(this.advisor_customer_id) ? null : this.advisor_customer_id.id;
                                    serial.order_id = this.orderId;
                                    serial.order_line_id = element.orderLineId;
                                    // console.log(serial);
                                    this.warrantiedService.createSerialNumber(serial).subscribe();
                                  });
                                }
                                this.sharedService.nextCart([]);
                                // ---------------------

                               //  this.updateStatusOrder(this.orderId, "TO_RECEIVE");
                                 if(this.is_choose_menual_shipping)
                                  {
                                    // forkJoin({
                                    //   requestOne: this._orderService.sendDataAxway(this.orderId, "TO_SHIP" , "TO_RECEIVE"),
                                    //   requestTwo: this.updateStatusOrder(this.orderId, "TO_RECEIVE",null,null,"Manual Shipping", this.test_manual_shipping)
                                    // }).subscribe(({requestOne , requestTwo})=>{
                                    //   this.activeMarkAsShip = false;
                                    //   this.disableButtonMarkAsShip = false;
                                    //   this.router.navigate(['direct-sales/orders/to-receive'], { queryParams: { id: id } });
                                    // })
                                    this.updateStatusOrder(this.orderId, "TO_RECEIVE",null,null,"Manual Shipping", this.test_manual_shipping);
                                  }
                                  else{
                                    if(this.fullOrder.shipping.shippingMethod === 'SELF_COLLECT')
                                    {
                                      // forkJoin({
                                      //   requestOne: this._orderService.sendDataAxway(this.orderId, "TO_SHIP" , "TO_RECEIVE"),
                                      //   requestTwo: this.updateStatusOrder(this.orderId, "TO_RECEIVE")
                                      // }).subscribe(({requestOne , requestTwo})=>{
                                      //   this.activeMarkAsShip = false;
                                      //   this.disableButtonMarkAsShip = false;
                                      //   this.router.navigate(['direct-sales/orders/to-receive'], { queryParams: { id: id } });
                                      // })
                                      this.updateStatusOrder(this.orderId, "TO_RECEIVE");
                                    }else{
                                      // forkJoin({
                                      //   requestOne: this._orderService.sendDataAxway(this.orderId, "TO_SHIP" , "TO_RECEIVE"),
                                      //   requestTwo: this.updateStatusOrder(this.orderId, "TO_RECEIVE", null, null,`Shipping Agent - ${this.fullOrder.shipping.shippingStatus.shippingAgent}`)
                                      // }).subscribe(({requestOne , requestTwo})=>{
                                      //   this.activeMarkAsShip = false;
                                      //   this.disableButtonMarkAsShip = false;
                                      //   this.router.navigate(['direct-sales/orders/to-receive'], { queryParams: { id: id } });
                                      // })
                                      this.updateStatusOrder(this.orderId, "TO_RECEIVE", null, null,`Shipping Agent - ${this.fullOrder.shipping.shippingStatus.shippingAgent}`)
                                    }
                                  }
                              } else {
                                dialogNotifi.close();
                              }
                            });
                          }
                        });
                      }
                    }
                    else {
                      let message = response.message + ' ';
                      if (!CheckNullOrUndefinedOrEmpty(response.data)) {
                        for (let i = 0; i < response.data.length; i++) {
                          if (i == 0) {
                            message += response.data[i].serial_number;
                          } else {
                            message += ', ' + response.data[i].serial_number;
                          }
                        }
                      }
                      const dialogNotifi = this.dialog.open(CommonDialogComponent, {
                        width: "500px",
                        data: {
                          message: message,
                          title:
                            "NOTIFICATION",
                          colorButton: true
                        },
                      });
                    }
                  });
                }
              }



           }

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

  updateStatusOrder(order_id, status, comment?, image?, shipping_method?, shipping_note? ) {
    return this._orderService.updateStatusOfOrder(order_id, status, comment,image, shipping_method,shipping_note ).subscribe(data=>{
      if(data.code == 200){
        let id = "#" + this.orderId;
        this._orderService.sendDataAxway(this.orderId, "TO_SHIP" , "TO_RECEIVE").subscribe();
        this.activeMarkAsShip = false;
        this.disableButtonMarkAsShip = false;
        this.router.navigate(['direct-sales/orders/to-receive'], { queryParams: { id: id } });
      }
    });
  }

  private getShippingAgentsFormData(): Promise<any> {
    return new Promise(resolve => {
      setTimeout(() => {
        this._shippingService.getShippingAgentsFormData().subscribe(response => {
          this.allShippingAgents = response.etShippingAgents;
          this.allPickupAddresses = response.etAddresses;
          this.shippingAgentsToPickupAddressesMap = response.etShippingPickupAddresses;
          this.allShippingAgents.forEach(e=>{
            let item = new AgentName();
            item.id = e.id;
            if(e.mtShippingAgent.agent_name === 'QXPRESS Singapore'){
              item.name = 'QXpress Singapore';
            }else{
              item.name = e.mtShippingAgent.agent_name;
            }
            this.listAgent.push(item)
          });
          this.allPickupAddresses.forEach(element=>{
            element.addr_label = element.city == "Petaling Jaya" ? "West Malaysia" : (element.city == "Kuching" ? "Kuching": (element.city == "Miri" ? "Miri" : (element.city == "Sibu" ? "Sibu" : (element.city == "Kota Kinabalu" ? "Sabah" : element.addr_label))))
          })
        });
      }, 500);
    });
  }

  private toggleShipmentIdInput(toggleOn: boolean) {
    if (toggleOn) {
      this.shippingAgentForm['controls'].shipmentIdArr.enable({ onlySelf: true, emitEvent: false });
    }
    else {
      this.shippingAgentForm['controls'].shipmentIdArr.setValue([]);
      this.shippingAgentForm['controls'].shipmentIdArr.disable({ onlySelf: true, emitEvent: false });
    }
  }

  private togglePickupAddressInput(toggleOn: boolean) {
    if (toggleOn) {
      this.shippingAgentForm['controls'].pickupAddressId.setValue('');
      this.shippingAgentForm['controls'].pickupAddressId.enable({ onlySelf: true, emitEvent: false });
    }
    else {
      this.shippingAgentForm['controls'].pickupAddressId.setValue('');
      this.shippingAgentForm['controls'].pickupAddressId.disable({ onlySelf: true, emitEvent: false });
    }
  }

  private togglePickupDateAndTimeInput(toggleOn: boolean) {
    if (toggleOn) {
      this.shippingAgentForm['controls'].pickupDate.enable({ onlySelf: true, emitEvent: false });
      this.shippingAgentForm['controls'].pickupTime.enable({ onlySelf: true, emitEvent: false });
    }
    else {
      this.shippingAgentForm['controls'].pickupDate.setValue('');
      this.shippingAgentForm['controls'].pickupDate.disable({ onlySelf: true, emitEvent: false });
      this.shippingAgentForm['controls'].pickupTime.setValue('');
      this.shippingAgentForm['controls'].pickupTime.disable({ onlySelf: true, emitEvent: false });
    }
  }

  private toggleCustomShipmentGroupInput(toggleOn: boolean) {
    if (toggleOn) {
      this.shippingAgentForm['controls'].customShipmentGroups.enable({ onlySelf: true, emitEvent: false });
    }
    else {
      this.shippingAgentForm['controls'].customShipmentGroups.disable({ onlySelf: true, emitEvent: false });
      if (this.shippingAgentForm['controls'].customShipmentGroups.value === true) {
        this.shippingAgentForm['controls'].customShipmentGroups.setValue(false);
      }
    }
  }

  private setShipmentGroupingSubForm(val: boolean) {
    if (val === true) {
      if (!this.shippingAgentForm.contains('shipmentGroups')) {
        this.shippingAgentForm.addControl('shipmentGroups', this._formBuilder.array([], [this.productTotalQuantityValidator.bind(this), this.emptyShipmentValidator.bind(this)]));
      }
      this.isCustomShipmentGroups = true;
      this.shippingAgentForm['controls'].numOfGroups.enable({ onlySelf: true, emitEvent: false });
      this.shippingAgentForm['controls'].numOfGroups.setValue(this.minNumOfGroups);
    }
    else {
      if (!this.shippingAgentForm.contains('shipmentGroups')) {
        this.shippingAgentForm.removeControl('shipmentGroups');
      }
      this.isCustomShipmentGroups = false;
      this.shippingAgentForm['controls'].numOfGroups.setValue(0);
      this.shippingAgentForm['controls'].numOfGroups.disable({ onlySelf: true, emitEvent: false });
    }
  }

  private addOrRemoveShipmentGroups(val: number) {
    const shipmentGroups = this.shippingAgentForm['controls'].shipmentGroups as FormArray;
    if (val === 0) {
      if (shipmentGroups) {
        shipmentGroups.clear();
      }
      const productIds = Object.keys(this.productsFormGroups);
      productIds.forEach(id => {
        this.productsFormGroups[id] = [];
      });
      this.currentNumOfGroups = val;
    }
    else if (val <= this.totalQuantity) {
      const numOfGroupsDiff = val - this.currentNumOfGroups;
      if (numOfGroupsDiff > 0) {
        for (let i = 1; i <= numOfGroupsDiff; i++) {
          const shipmentProducts = this._formBuilder.array([]);
          // console.log(this.productList)
          let orderProduct = [];
          if(!this.is_naep_order){
            this.productList.forEach(e=>{
              let pro = new ProductOrders();
              pro.productName = e.productName;
              pro.quantityProduct = e.quantity
              pro.id = e.id
              orderProduct.push(pro)
              if(!CheckNullOrUndefinedOrEmpty(e.order_line_online_bank_transfer_gifts)){
                e.order_line_online_bank_transfer_gifts.forEach(element => {
                  let giftLine = new ProductOrders();
                  giftLine.id = element.online_bank_transfer_gift_product_id
                  let item = orderProduct.find(obj=> { return obj.id === element.online_bank_transfer_gift_product_id })
                  if(!CheckNullOrUndefinedOrEmpty(item)){
                    item.quantityProduct += 1
                  }else{
                    giftLine.quantityProduct = 1
                    giftLine.productName = element.online_bank_transfer_gift_product_name
                    orderProduct.push(giftLine)
                  }
                });
              }
              if(!CheckNullOrUndefinedOrEmpty(e.order_line_single_paymt_gifts)){

                e.order_line_single_paymt_gifts.forEach( order_line_single_paymt => {
                  let giftLine = new ProductOrders();
                  giftLine.id = order_line_single_paymt.single_paymt_gift_product_id;
                  let item = orderProduct.find(obj=> { return obj.id === order_line_single_paymt.single_paymt_gift_product_id })
                  if(item !== null && item !== undefined){
                    item.quantityProduct += 1
                  }else{
                    giftLine.quantityProduct = 1;
                    giftLine.productName = order_line_single_paymt.single_paymt_gift_product_name;
                    orderProduct.push(giftLine)
                  }
                });
              }
            })

          }else{
            this.productList.forEach(e=>{
              if(e.is_kit || e.is_deposit){
                let pro = new ProductOrders();
                pro.productName = e.productName;
                pro.quantityProduct = e.quantity;
                pro.id = e.id;
                orderProduct.push(pro);

              }
            })
          }

            // chang request gift 15-10
            // let giftLine = new ProductOrders();
            // giftLine.productName = e.order_line_single_paymt_gifts[0].single_paymt_gift_product_name
            // giftLine.id = e.order_line_single_paymt_gifts[0].single_paymt_gift_product_id
            // let item = orderProduct.find(obj=> { return obj.id === giftLine.id })
            // if(!isNullOrUndefined(item)){
            //   item.quantityProduct += e.order_line_single_paymt_gifts.length
            // }else{
            //   giftLine.quantityProduct = e.order_line_single_paymt_gifts.length
            //   orderProduct.push(giftLine)
            // }
          // console.log(orderProduct)
          orderProduct.forEach(product => {
            if(CheckNullOrUndefinedOrEmpty(this.productsFormGroups[product.id])){
              this.productsFormGroups[product.id] =[]
            }

            const shipmentProduct = this._formBuilder.group({
              productName: [product.productName, Validators.required],
              quantity: [(val === 1) ? product.quantityProduct : 0, [Validators.required, this.productShipmentQuantityValidator.bind(this)]]
            });
            this.productsFormGroups[product.id].push(shipmentProduct);
            shipmentProducts.push(shipmentProduct);
          });
          shipmentGroups.push(this._formBuilder.group({
            shipmentProducts: shipmentProducts
          }));
        }
      }
      else {
        const productIds = Object.keys(this.productsFormGroups);
        const removedQuantity = {};
        productIds.forEach(id => {
          removedQuantity[id] = 0;
          const productFormGroupsArr = this.productsFormGroups[id];
          for (let i = 1; i <= Math.abs(numOfGroupsDiff); i++) {
            const lastFormGroup = productFormGroupsArr[productFormGroupsArr.length - 1];
            removedQuantity[id] += lastFormGroup.value.quantity;
            productFormGroupsArr.pop();
          }
        });
        for (let i = 1; i <= Math.abs(numOfGroupsDiff); i++) {
          shipmentGroups.removeAt(shipmentGroups.length - 1);
        }
        productIds.forEach(id => {
          const productFormGroupsArr = this.productsFormGroups[id];
          const lastFormGroup = productFormGroupsArr[productFormGroupsArr.length - 1];
          lastFormGroup['controls'].quantity.setValue(lastFormGroup.value.quantity + removedQuantity[id]);
        });
      }
      this.currentNumOfGroups = val;
    }
  }

  private numOfGroupsValidator(formControl: FormControl) {
    if (formControl.value <= 0) {
      return { negativeOrZeroNumOfGroups: true };
    }
    if (formControl.value > this.totalQuantity) {
      return { tooManyGroups: true };
    }
    return null;
  };

  private productTotalQuantityValidator(formControl: FormControl) {
    if (this.shippingAgentForm['controls'].shipmentGroups) {
      let isIncorrectQty = false;
      const productIds = Object.keys(this.productsFormGroups);
      // console.log(productIds)

      productIds.forEach(id => {
        // console.log(id)
        const qty = this.productList.filter(obj => obj.id === id);
        let productQty = 0
        if(qty.length > 0){
          qty.forEach(proQty => {
            productQty += proQty.quantity
          });
        } else {
          this.productList.forEach(e=>{
            // console.log(e.id)
            let gift = e.order_line_online_bank_transfer_gifts.filter(bank_transfer_gift=> bank_transfer_gift.online_bank_transfer_gift_product_id === id)

            let giftSinglePayment = e.order_line_single_paymt_gifts.filter(single_paymt_gifts=> single_paymt_gifts.single_paymt_gift_product_id === id)
            // if(e.order_line_single_paymt_gifts.length > 0
            //   && e.order_line_single_paymt_gifts[0].single_paymt_gift_product_id === id){
            //   productQty += e.order_line_single_paymt_gifts.length
            // }

            if(e.order_line_single_paymt_gifts.length > 0 && giftSinglePayment.length > 0 ){
              let count = giftSinglePayment.length > 0 ? giftSinglePayment.length : null
              if(count !== null && count !== undefined){
                productQty += count
              }
            }
            if(e.order_line_online_bank_transfer_gifts.length > 0
              && gift.length > 0
              ){
                let count = gift.length > 0 ? gift.length : null
                if(!isNullOrUndefined(count)){
                  productQty += count
                }

            }
          })
        }
        const productFormGroupsArr = this.productsFormGroups[id];
        // console.log(id)
        // console.log(productFormGroupsArr)
        const enteredTotalQuantity = productFormGroupsArr.map(item => item.value.quantity).reduce((prev, curr) => prev + curr, 0);
        if (enteredTotalQuantity !== productQty) {
          isIncorrectQty = true;
        }
      });
      return isIncorrectQty ? { incorrectQty: isIncorrectQty } : null;
    }
    return null;
  };

  private emptyShipmentValidator(formControl: FormControl) {
    if (this.shippingAgentForm['controls'].shipmentGroups) {
      let isEmptyShipmentGroup = false;
      const shipmentGroupsValues = this.shippingAgentForm['controls'].shipmentGroups.value;
      let shipmentGroupsQtyArr = new Array(shipmentGroupsValues.length).fill(0);
      for (let i = 0; i < shipmentGroupsValues.length; i++) {
        const shipmentGroupQty = shipmentGroupsValues[i].shipmentProducts.map(item => item.quantity).reduce((prev, curr) => prev + curr, 0);
        shipmentGroupsQtyArr[i] = shipmentGroupQty;
      }
      if (shipmentGroupsQtyArr.findIndex(x => x === 0) !== -1) {
        isEmptyShipmentGroup = true;
      }
      return isEmptyShipmentGroup ? { emptyShipmentGroup: isEmptyShipmentGroup } : null;
    }
    return null;
  };

  private productShipmentQuantityValidator(formControl: FormControl) {
    if (this.shippingAgentForm['controls'].shipmentGroups) {
      if (formControl.value < 0) {
        return { negativeQty: true };
      }
      return null;
    }
  }

  private createShipment(isIntegratedShipper: boolean) {
    const createShipmentDto = new CreateShipmentDto();
    createShipmentDto.orderId = this.orderId;
    createShipmentDto.etShippingAgentId = this.shippingAgentForm.value.shippingAgentId;
    createShipmentDto.agentCode = this.allShippingAgents.find(obj => obj.id === this.shippingAgentForm.value.shippingAgentId).mtShippingAgent.agent_code;
    if (isIntegratedShipper) {
      createShipmentDto.isIntegratedShipper = true;
      createShipmentDto.pickupAddressId = this.shippingAgentForm.value.pickupAddressId;
      const date = this.shippingAgentForm.value.pickupDate;
      const time = this.shippingAgentForm.value.pickupTime;
      const momentObj = moment(date + time, 'YYYY-MM-DDLT');
      const dateTime = momentObj.format('YYYY-MM-DDTHH:mm:ssZ');
      createShipmentDto.pickupDateTime = dateTime;
      createShipmentDto.isCustomShipmentGroups = this.shippingAgentForm.value.customShipmentGroups;
      if (this.shippingAgentForm.value.customShipmentGroups) {
        createShipmentDto.numOfShipmentGroups = this.shippingAgentForm.value.numOfGroups;
        createShipmentDto.shipmentGroups = JSON.parse(JSON.stringify(this.shippingAgentForm.value.shipmentGroups));
        createShipmentDto.shipmentGroups.forEach(group => {
          const filteredShipmentProducts = group.shipmentProducts.filter(product => product.quantity !== 0);
          filteredShipmentProducts.forEach(product => {
            product['productId'] = this.productNameToIdMap[product.productName];
            delete product.productName;
          });
          group.shipmentProducts = filteredShipmentProducts;
        });
      }
    }
    else {
      createShipmentDto.isIntegratedShipper = false;
      createShipmentDto.shipmentIdArr = this.shippingAgentForm.value.shipmentIdArr;
    }

    return createShipmentDto;
  }

  // Source: https://stackoverflow.com/questions/45220073/how-to-find-the-invalid-controls-in-angular-4-reactive-form
  private findInvalidControlsRecursive(formToInvestigate: FormGroup | FormArray): string[] {
    let invalidControls: string[] = [];
    let recursiveFunc = (form: FormGroup | FormArray) => {
      Object.keys(form.controls).forEach(field => {
        const control = form.get(field);
        if (control.invalid) invalidControls.push(field);
        if (control instanceof FormGroup) {
          recursiveFunc(control);
        } else if (control instanceof FormArray) {
          recursiveFunc(control);
        }
      });
    };
    recursiveFunc(formToInvestigate);
    return invalidControls;
  }

  async downloadQxpress(){
    let dataCheck;
    await this._orderService.checkLockOrder(this.fullOrder.id).toPromise().then(data=>{
      dataCheck = data;
    })
      if(dataCheck == 1){
        this._orderService.updateHistoryShippingLabel(this.orderId).subscribe(data=>{})
        var printContents = document.getElementById('printArea').innerHTML;
        // var originalContents = document.body.innerHTML;
        document.title = 'Ship_Order#'+this.orderId;

        document.body.innerHTML = printContents;

        window.print();
        // let printEvent = window.matchMedia('print');
        // let cancle = window.matchMedia('cancle');
        // console.log("print", printEvent)
        // console.log("cancle", cancle)
        // let sang = document.addEventListener("click", "")
        // if(printEvent.matches){
        //   this._orderService.updateHistoryShippingLabel(this.orderId).subscribe(data=>{
        //     console.log(data)
        //   })
        // }
        location.reload()

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

  myScript(){
    console.log('hahaha')
  }

  manualShipping(){
    this.is_choose_menual_shipping = true;
    this.navigateToReceive();
  }

}

export class FormData{
  shippingAgent:string;
  refOrderNo: string;
  shipmentGroups: any;
  pickupAddressId: number;
}

export class ProductOrders{
  id: number;
  productName: string;
  quantityProduct: number;
}

export class AgentName{
  id: number;
  name: string;
}
