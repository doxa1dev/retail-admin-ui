import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { Location } from '@angular/common';
import { ProductService } from 'app/core/service/product.service';
import * as CURRENCY from 'assets/currency.json';
import { FormControl, FormGroup, Validators, FormBuilder, FormArray, ControlValueAccessor } from '@angular/forms';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { environment } from 'environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { isNullOrUndefined } from 'util';
import { Product, Properties } from 'app/core/models/product.model';
import { MatDialog } from '@angular/material/dialog';
import { CommonDialogComponent } from 'app/main/_shared/common-dialog/common-dialog.component';
// import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { getLocaleDate } from 'app/core/utils/date.util';
import { ConfirmDialogComponent } from 'app/main/_shared/confirm-dialog/confirm-dialog.component';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { TranslationService } from 'app/core/service/translation.service';
import { element } from 'protractor';
import { CheckNullOrUndefinedOrEmpty } from 'app/core/utils/common-function';
import { SkuProduct, SkuProductFrontEnd } from './product.component';
import * as jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-product',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})

export class ProductDetailComponent implements OnInit {
  selectedCategory = [];
  storageUrl = environment.storageUrl;
  categories: SelectItem[];
  title: string;
  productForm: FormGroup;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  times: SelectItem[];
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  options = [];
  minDateStart: Date = new Date();
  minDateEnd: Date = new Date();
  disable: boolean = true;
  currency = (CURRENCY as any).default;
  selectedCurrency: string;
  text2: string;
  // sku: string = "";
  checkShippingWeight: boolean = true;
  checkVariant: boolean = false;
  checkWarranty: boolean;
  warranty_days: number;
  checkActive: boolean = false;
  checkDisplay:  boolean = true;
  checkUnbox: boolean = true;
  checkHost: boolean = true;
  hasAvisor: boolean = false;
  hasSpecialPayment: boolean = false;
  files: any[] = [];
  public imagePath;
  imgURL: any;
  imageArray: string[] = [];
  isCreate: boolean = true;
  arrCategories: any = [];
  weightUpdate = 0;
  ischeckPromotionTime: boolean = false
  // specificTimeAfter: boolean = false;
  // specificTimeBefore: boolean = false;

  propertiesArray: FormGroup;
  property: FormGroup;
  propertiesValueArray: string[][] = [];

  product_id: string;
  ProductName: string;
  product_public_id: string;
  productData: Product;
  promotionStartTimeData: Date;
  promotionEndTimeData: Date;
  arrayLengthInit: number;
  history: [];
  submitted: boolean = false;
  productWeight: number;
  listPrice: string;
  promotionPrice: string;
  plannedPrice: string;
  tax: number;
  isCheckPrice: boolean = false;
  shippingFee: number;
  internalDiscountPrice: number;
  naepDiscountPrice: number;
  currencyPattern = /^[0-9,]+(\.[0-9]{1,2})?$/;
  weightPattern = /^(?:[0-9]+(?:\.[0-9]{0,2})?)?$/;
  //
  hasAdvisor: boolean;
  checkCommission: boolean = false;
  allowEPP: boolean = false;
  allowRecurringPayment: boolean = false;
  deposit_amount: any;
  cart_combination: boolean = false;

  checkPaymentPromotion: boolean = false;
  paymentPromotionGifts: SelectItem[];
  hasSelectedGifts: boolean = false;
  single_paymt_gifts: any[];
  online_bank_transfer_gifts: any[];
  //
  selectedActiveFor: string[] = [];
  checkCustomerActive: boolean = false;
  checkAdvisorActive: boolean = false;
  checkTeamLeaderActive: boolean = false;
  checkBranchManagerActive: boolean = false;
  //
  selectedInternalDiscountFor: string[] = [];
  checkAdvisorInternalDiscount: boolean = false;
  checkTeamLeaderInternalDiscount: boolean = false;
  checkBranchManagerInternalDiscount: boolean = false;
  discountStartDate: Date;
  isCheckPriceDeposit: boolean = false;
  isCheckPriceDeposit2: boolean = false;
  isCheckPriceNaep: boolean = false;
  isDisabled: boolean = false;
  isDisabledDiscount: boolean = true;
  isShowDiscountFor: boolean = false;
  isShowSelectDiscountFor: boolean = false;
  isShowSelectActiveFor: boolean = false;
  todayDate;
  isSpecificTimeBefore : boolean = false
  isSpecificTimeAfter : boolean = false

  isSpecificDay: boolean = false;
  special_delivery_charge ;
  errorMess: string;
  listLanguage: string[];
  isHasAdvisor: boolean = false;
  isCheckPriceInternal: boolean = false;
  //Sku
  arrSKU = [];
  skuData: Array<SkuProduct>;
  skuDataDisplay: Array<SkuProductFrontEnd>=[];
  notEnterAllSku: boolean = false ;
  checkDuplicates: boolean = false;
  skuResponse = [];
  decoded
  entity: number = 1;
  checkPromotionTime: boolean = false;
  checkPromotionPrice: boolean = false;
  constructor(
    private _location: Location,
    private _productService: ProductService,
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    private translationService: TranslationService
  ) {
    this.currency = (CURRENCY as any).default;
  }

  ngOnInit(): void {
    let token = localStorage.getItem('token');
    if (!CheckNullOrUndefinedOrEmpty(token)){
      this.decoded = jwt_decode(token);
    }

    // console.log(this.decoded)
    if(this.decoded.entity_id === "1"){
      this.entity = 1;
    }else if (this.decoded.entity_id === "2"){
      this.entity = 2;
    }
    this._productService.getAllPaymentPromotionGifts().subscribe(data => {
      this.paymentPromotionGifts = data;
      this.productForm = this.formBuilder.group({
        productTitle: ['', Validators.required],
        productDescription: [''],
        termsAndConditionsLink: [""],
        specificTime: [""],
        sku : ["",Validators.required],
        orderNumber: ["", [Validators.required, Validators.pattern("^[0-9]*$")]],
        listedPrice: ["", [Validators.required, Validators.pattern(this.currencyPattern)]],
        promotionPrice: ["", Validators.pattern(this.currencyPattern)],
        promotionStartDay: [],
        promotionEndDay: [],
        tax: ["", Validators.pattern(this.currencyPattern)],
        shippingFee: ["", Validators.pattern(this.currencyPattern)],
        weight: ["", Validators.pattern(this.weightPattern)],
        day: ["", Validators.pattern("^[0-9]*$")],
        fixedDeposit: [{ value: '', diabled: true }],
        internalDiscount: ["", [Validators.required, Validators.pattern(this.currencyPattern)]],
        naepDiscount: ["", [Validators.pattern(this.currencyPattern)]],
        totalDiscount: [{ value: '', disabled: this.isDisabledDiscount },[Validators.required, Validators.pattern("^[0-9]*$")]],
        discountStartDate: []
      });
      this.activatedRoute.queryParams.subscribe(params => {
        this.product_public_id = params.id;
      });
      this.Init();
    });


    // this.times = [
    //     { label: 'Year(s)', value: 'Year' },
    //     { label: 'Month(s)', value: 'Month' },
    //     { label: 'Day(s)', value: 'Day' }
    // ];

  }
  OnKeyDownEven(event){
    if(event.keyCode === 13){
      event.preventDefault();
      // this.updateProduct()
    }
  }
  get f() { return this.productForm.controls; };

  Init() {
    this._productService.GetProductDetailByPublicId(this.product_public_id).subscribe(data => {
      this.productData = data;
      // console.log(data)
      this.product_id = this.productData.id;
      this.ProductName = this.productData.productName;
      this.listPrice = this.productData.listedPrice;
      this.promotionPrice = this.productData.promotionalPrice;
      this.tax = parseInt(this.productData.tax);
      this.shippingFee = parseInt(this.productData.shippingFee);
      this.checkShippingWeight = parseFloat(this.productData.weight) > 0 ? true : false;
      this.checkWarranty = (isNullOrUndefined(this.productData.warranty_duration_in_days)) ? false : true;
      this.promotionStartTimeData = isNullOrUndefined(this.productData.promotionStartTime) ? null : new Date(this.productData.promotionStartTime);
      this.promotionEndTimeData = isNullOrUndefined(this.productData.promotionEndTime) ? null : new Date(this.productData.promotionEndTime);
      this.imageArray = this.productData.images;
      this.arrayLengthInit = this.imageArray.length;
      this.arrCategories = this.productData.arrCategories;
      this.selectedCategory = this.productData.arrCategories;
      this.productWeight = parseFloat(this.productData.weight);
      this.checkVariant = ( CheckNullOrUndefinedOrEmpty(this.productData.properties) || Object.keys(this.productData.properties).length === 0) ? false : true;
      this.checkActive = this.productData.isActive;
      this.selectedCurrency = this.productData.currencyCode;
      this.checkHost = this.productData.need_host;
      this.checkUnbox = this.productData.need_unbox;
      this.warranty_days = this.productData.warranty_duration_in_days;
      this.plannedPrice = this.productData.plannedPrice;
      this.hasAdvisor = this.productData.hasAdvisor;
      this.hasSpecialPayment = this.productData.hasSpecialPayment;
      this.allowEPP = this.productData.allow_epp_payment;
      this.allowRecurringPayment = this.productData.allow_recurring_payment;
      this.checkCommission = this.productData.has_commission;
      this.deposit_amount = this.productData.deposit_amount;
      this.internalDiscountPrice = parseInt(this.productData.internalDiscountPrice);
      this.naepDiscountPrice = parseInt(this.productData.naepDiscountPrice);
      this.productForm.get('totalDiscount').setValue(this.productData.maxTotalDiscount);
      this.productForm.get('internalDiscount').setValue(this.productData.internalDiscountPrice);
      this.productForm.get('sku').setValue(this.productData.sku);
      this.productForm.get('specificTime').setValue(this.productData.sku);
      this.checkDisplay = this.productData.is_display;
      this.isSpecificDay = this.productData.is_sd_only;
      this.isSpecificTimeBefore = this.productData.is_sd_before;
      this.isSpecificTimeAfter = this.productData.is_sd_after;
      this.cart_combination = this.productData.cart_combination;
      this.special_delivery_charge = (this.isSpecificTimeBefore || this.isSpecificTimeAfter) ? this.productData.sd_price : null;
      this.discountStartDate = CheckNullOrUndefinedOrEmpty(this.productData.internal_discount_start_time) ? null : new Date(this.productData.internal_discount_start_time);
      if(!CheckNullOrUndefinedOrEmpty(data.arrSku)){
        this.skuDataDisplay = data.arrSku || [];
        this.skuResponse = data.arrSku;
        this.productForm.get("sku").disable();
      }
      if (!CheckNullOrUndefinedOrEmpty(this.productData.maxTotalDiscount) || this.internalDiscountPrice != 0) {
        this.productForm.get('totalDiscount').enable();
      } else {
        this.productForm.get('totalDiscount').disable();
      }

      if (this.internalDiscountPrice === 0 || isNaN(this.internalDiscountPrice)) {
        this.isDisabled = true;
        this.productForm.get('totalDiscount').disable();
      } else {
        this.isDisabled = false;
      }

      if (this.allowRecurringPayment) {
        // console.log(this.deposit_amount);
        this.productForm.get('fixedDeposit').enable();
        this.productForm.get('fixedDeposit').setValue(this.deposit_amount);
      }

      if (this.checkVariant === true) {
        for (const key in this.productData.properties) {
          if (this.productData.properties.hasOwnProperty(key)) {
            const element = this.productData.properties[key];
            this.addOptionInit(key);
            this.propertiesValueArray.push(element);
          }
        }
      }

      this.history = this.productData.history;

      this.single_paymt_gifts = this.productData.single_paymt_gifts;

      //Update 14-10 for change requirement gift
      // this.online_bank_transfer_gifts = this.productData.online_bank_transfer_gifts;

      if (this.single_paymt_gifts.length > 0) {
        this.hasSelectedGifts = true;
      }

      this.selectedActiveFor = this.productData.activeFor;

      if (!isNullOrUndefined(this.productData.activeFor)) {
        if (this.productData.activeFor.indexOf('CUSTOMER') != -1) {
          this.checkCustomerActive = true;
        }
        if (this.productData.activeFor.indexOf('ADVISOR') != -1) {
          this.checkAdvisorActive = true;
        }
        if (this.productData.activeFor.indexOf('TEAM_LEADER') != -1) {
          this.checkTeamLeaderActive = true;
        }
        if (this.productData.activeFor.indexOf('BRANCH_MANAGER') != -1) {
          this.checkBranchManagerActive = true;
        }
      }

      this.selectedInternalDiscountFor = this.productData.internalDiscountFor || [];

      if (!isNullOrUndefined(this.productData.internalDiscountFor)) {
        if (this.productData.internalDiscountFor.indexOf('ADVISOR') != -1) {
          this.checkAdvisorInternalDiscount = true;
        }
        if (this.productData.internalDiscountFor.indexOf('TEAM_LEADER') != -1) {
          this.checkTeamLeaderInternalDiscount = true;
        }
        if (this.productData.internalDiscountFor.indexOf('BRANCH_MANAGER') != -1) {
          this.checkBranchManagerInternalDiscount = true;
        }
      }

      this.constructPaymentPromotionSelections();
      this.togglePaymentPromotionGiftForm({ checked: this.hasSelectedGifts });

      // get translation of category
      this.translationService.getListTranslationByProductId(this.product_id).subscribe(data => {
        let rowData: any[] = [];
        data.forEach(element => {
          rowData.push(element.language);
        })
        this.listLanguage = rowData;
      });
    });
    this._productService.getAllCategories().subscribe(data => {
      this.categories = data;
    });
    this.propertiesArray = this.formBuilder.group({
      properties: this.formBuilder.array([])
    });
  }

  //Variant
  createProperty(): FormGroup {
    return this.formBuilder.group({
      property_name: ['', Validators.required],
      property_option: this.formBuilder.array([]),
    });
  }
  createPropertyInit(pro: string): FormGroup {
    return this.formBuilder.group({
      property_name: [pro, Validators.required],
      property_option: this.formBuilder.array([]),
    });
  }

  checkHasVariant(event){
    if(event.checked){
      this.productForm.get("sku").disable();
    }else{
      this.productForm.get("sku").enable();
    }
  }

  get properties(): FormArray {
    return this.propertiesArray.get('properties') as FormArray;
  }
  get property_option(): FormArray {
    return this.propertiesArray.get('properties').get('property_option') as FormArray;
  }
  addOption() {
    (<FormArray> this.propertiesArray.get('properties')).push(this.createProperty());
    this.propertiesValueArray.push([]);
  }
  addOptionInit(input: string) {
    (<FormArray> this.propertiesArray.get('properties')).push(this.createPropertyInit(input));
  }
  removeOption(index: number) {
    this.properties.removeAt(index);
    this.propertiesValueArray.splice(index, 1);
    this.skuProduct(this.propertiesValueArray);
  }
  add(event: MatChipInputEvent, index: number) {
    const input = event.input;
    const value = event.value;
    if ((value || '').trim()) {
      this.propertiesValueArray[index].push(value.trim());
    }
    if (input) {
      input.value = '';
    }
    this.skuProduct(this.propertiesValueArray);
  }

  skuProduct(properties){
    this.arrSKU = this.combine(properties);
    this.skuData = [];
    this.skuDataDisplay = [];
    this.arrSKU.forEach(e=>{
      let display = new SkuProductFrontEnd();
      display.variant = e;
      const getSku = this.skuResponse.find(sku => sku.variant === e);
      display.sku = getSku?.sku || "";
      this.skuDataDisplay.push(display);
    })
  }

  combine(arr){
    if(arr.length <= 1){
      return (arr.length == 1) ? arr[0] : [];
    }
    let result = arr.reduce((a, b) => a.reduce((r, v) => r.concat(b.map(w => [].concat(v, w))), []));
    return result.map(a => a.sort().join(' - '));
  }

  remove(option, i: number): void {
    const optIndex = this.propertiesValueArray[i].indexOf(option);
    if (optIndex >= 0) {
      this.propertiesValueArray[i].splice(optIndex, 1);
    }
    this.skuProduct(this.propertiesValueArray);
  }

  checkEnterSku(arr){
    this.checkDuplicates = false;
    arr.forEach(element => {
      if(CheckNullOrUndefinedOrEmpty(element.sku)){
        element.display = true;
      }else{
        element.display = false;
      }
    });
    this.notEnterAllSku = !CheckNullOrUndefinedOrEmpty(arr.find(e=>e.display==true)) ? true : false ;
    return (this.checkVariant && this.notEnterAllSku) ? true : false;
  }

  findDuplicates(arr){
    let sku=[];
    arr.forEach(element => {
      sku.push(element.sku);
      element.display = false;
    });
    let result = sku.filter((item, index) => sku.indexOf(item) != index)
    let indexfind = result.length > 0 ? result[0].trim() : "";
    if(!CheckNullOrUndefinedOrEmpty(indexfind)){
      let indexes = sku.reduce(function(a, e, i) {
        if (e.trim() === indexfind)
          a.push(i);
        return a;
      }, [])
      if(!CheckNullOrUndefinedOrEmpty(indexes)){
        indexes.forEach(element => {
          arr[element].display = true;
        });
        this.checkDuplicates = true;
      }
      return (this.checkVariant && (indexes.length > 0)) ? true : false;
    }
    this.checkDuplicates = false;
    return false;
  }

  //End Variants

  drop(event: CdkDragDrop<string[]>) {
    if (event.currentIndex != 0) {
      return;
    }
    moveItemInArray(this.imageArray, event.previousIndex, event.currentIndex);

    // console.log(this.imageArray);
    let SubmitImage = [];
    this.imageArray.forEach(image => {
      let Image = image.slice(this.storageUrl.length, image.length);
      SubmitImage.push(Image);
    });
    return this._productService.updateAttachments(this.product_public_id, { storage_key: SubmitImage }).subscribe(data => {
      return this.imageArray;
    });
  }

  // translation
  translate() {
    this.router.navigate(['direct-sales/products/translation'], { queryParams: { id: this.product_id, type: 'product'} });
  }

  back() {
    this._location.back();
  }
  checkInvalidValue(value){
    return CheckNullOrUndefinedOrEmpty(value)
  }

   checkNumber(value)
  {
    if( !Number.isInteger(Number(value)) ) {
     return this.errorMess=" Additional charge must be a number"
   }

  }

  is_show_has_advisor : boolean = false;

  updateProduct() {

    this.submitted = true;

    if(this.checkUnbox || this.checkHost ) {
      if(this.hasAdvisor == true)
      {
        this.is_show_has_advisor = false;
      }
      else{
        this.is_show_has_advisor = true;
        return;
      }

    }

    this.productForm.controls["promotionPrice"].markAsPristine();
    this.productForm.controls["naepDiscount"].markAsPristine();
    // this.productForm.controls["fixedDeposit"].markAsPristine();
    this.productForm.controls["internalDiscount"].markAsPristine();
    this.productForm.controls["promotionStartDay"].markAsPristine();
    this.productForm.controls["promotionEndDay"].markAsPristine();
    if (CheckNullOrUndefinedOrEmpty(this.productForm.get('internalDiscount').value) || (this.productForm.get('internalDiscount').value === "" && this.selectedInternalDiscountFor.length == 0)) {
      this.productForm.get('internalDiscount').clearValidators();
      this.productForm.get('internalDiscount').setValidators(Validators.pattern(this.currencyPattern));
      this.productForm.get('internalDiscount').updateValueAndValidity();
    }

    let checkSpecialDelivery  =  (this.isSpecificTimeBefore || this.isSpecificTimeAfter ) && CheckNullOrUndefinedOrEmpty(this.special_delivery_charge)

    if (this.productForm.invalid || this.imageArray.length == 0 ||
      (this.checkVariant && this.propertiesArray.value.properties.length == 0) ||
      this.checkEnterSku(this.skuDataDisplay) || this.findDuplicates(this.skuDataDisplay) ||
      this.isShowSelectActiveFor === true || this.isShowSelectDiscountFor === true || checkSpecialDelivery ||
      (this.hasSpecialPayment && !this.allowRecurringPayment && !this.allowEPP)
      ) {
      return;
    }


    const listedPrice = parseFloat(this.productForm.controls["listedPrice"].value.replace(',', ''))
    const depositPrice = parseFloat(this.productForm.controls["naepDiscount"].value)
    const fixedDepositPrice = parseFloat(this.productForm.controls["fixedDeposit"].value)

    let internal_price;
      if (!CheckNullOrUndefinedOrEmpty(this.productForm.controls["internalDiscount"].value)) {
        internal_price = parseInt(this.productForm.controls["internalDiscount"].value.replace(',', ''))
      } else {
        internal_price = parseInt(this.productForm.controls["internalDiscount"].value)
      }
    const internalPrice = internal_price

    let promotion_price;
      if (!CheckNullOrUndefinedOrEmpty(this.productForm.controls["promotionPrice"].value)) {
        promotion_price = parseInt(this.productForm.controls["promotionPrice"].value.replace(',', ''))
      } else {
        promotion_price = parseInt(this.productForm.controls["promotionPrice"].value)
      }
    const promotionPrice = promotion_price




    if (listedPrice < promotionPrice) {
      this.isCheckPrice = true;
      this.checkPromotionPrice = false;
      this.checkPromotionTime = false;

      return;
    } else {
      this.isCheckPrice = false;

    }
    if (listedPrice < depositPrice ) {
      this.isCheckPriceNaep = true;
      return;

    } else {
      this.isCheckPriceNaep = false;

    }
    if (listedPrice < internalPrice) {
      this.isCheckPriceInternal = true;
      return;

    } else {
      this.isCheckPriceInternal = false;

    }

    if (  promotionPrice < fixedDepositPrice || listedPrice < fixedDepositPrice ) {
      this.isCheckPriceDeposit = true;
      this.checkPromotionPrice = false;
      this.checkPromotionTime = false;

      return;

    } else {
      this.isCheckPriceDeposit = false;

    }


    if (!CheckNullOrUndefinedOrEmpty(this.productForm.value.promotionPrice)) {
      // console.log(this.productForm.value.promotionPrice)
        // return
        if ( CheckNullOrUndefinedOrEmpty(this.productForm.value.promotionStartDay) || CheckNullOrUndefinedOrEmpty(this.productForm.value.promotionEndDay) ) {
          // this.checkPromotionPrice = true
           this.checkPromotionTime = true;
           this.checkPromotionPrice = false
           this.ischeckPromotionTime = false
          return;
        } else {
          this.checkPromotionTime = false;
        }

        if(!CheckNullOrUndefinedOrEmpty(this.productForm.value.promotionStartDay) || !CheckNullOrUndefinedOrEmpty(this.productForm.value.promotionEndDay)) {
          this.checkPromotionTime = false;

          if ( (this.productForm.value.promotionStartDay.getTime()) > (this.productForm.value.promotionEndDay.getTime())  ) {
            this.ischeckPromotionTime = true;

            return
          } else {
            this.ischeckPromotionTime = false
          }
        }
        this.checkPromotionPrice = false
    }
    if (!CheckNullOrUndefinedOrEmpty(this.productForm.value.promotionStartDay) || !CheckNullOrUndefinedOrEmpty(this.productForm.value.promotionEndDay)) {
        if( CheckNullOrUndefinedOrEmpty(this.productForm.value.promotionPrice)) {
          this.checkPromotionPrice = true;
          this.checkPromotionTime = false;
          return;
          } else {
          this.checkPromotionPrice = false;

           }
    }

    if(CheckNullOrUndefinedOrEmpty(this.productForm.value.promotionStartDay) && CheckNullOrUndefinedOrEmpty(this.productForm.value.promotionEndDay) && CheckNullOrUndefinedOrEmpty(this.productForm.value.promotionPrice)) {
      this.checkPromotionPrice = false;
      this.checkPromotionTime = false;
      this.ischeckPromotionTime = false

    }


    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '500px',
      data: { message: 'Do you wish to update this product?', type: "APPROVED" }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {


        if(this.checkActive === false)
        {
          this._productService.checkBeforeDeleteProduct(this.product_id).subscribe(data=>{
            if(data.code === 200){
              this.updateProductProcess()
            }
            else if(data.code === 201)
            {
              const dialogNotifi = this.dialog.open(CommonDialogComponent, {
                width: "500px",
                data: {
                  message:
                    `You can not inactive this product because it's linked to: ${data.message}. Please remove this product from NAEP configuration first.`,
                  title:
                    "NOTIFICATION",
                  colorButton: false
                },
              });
            }else{
              const dialogNotifi = this.dialog.open(CommonDialogComponent, {
                width: "500px",
                data: {
                  message:
                    'Error when update product. Please try later.',
                  title:
                    "NOTIFICATION",
                  colorButton: false
                },
              });
            }
          })

        }else{
          this.updateProductProcess()
        }


      } else {
        dialogRef.close();
      }
    });
  }

  updateProductProcess(){
    let option = new Object;
    this.propertiesArray.value.properties.forEach((property, index) => {
      option[property.property_name] = this.propertiesValueArray[index];
    });
    let SubmitImage = [];
    this.imageArray.forEach(image => {
      let Image = image.slice(this.storageUrl.length, image.length);
      SubmitImage.push(Image);
    });
    let formProduct = {
      product_uri: Date.now().toString(),
      is_active: this.checkActive,
      product_name: this.productForm.value.productTitle,
      product_description: this.productForm.value.productDescription,
      sku: !this.checkVariant ? this.productForm.value.sku : '',
      categories: this.selectedCategory,
      listed_price: parseFloat(this.productForm.value.listedPrice.replace(',', '')),
      promotional_price: (CheckNullOrUndefinedOrEmpty(this.productForm.value.promotionPrice) || this.productForm.value.promotionPrice === '') ? null : parseFloat(this.productForm.value.promotionPrice.replace(',', '')),
      promotion_start_time: CheckNullOrUndefinedOrEmpty(this.productForm.value.promotionStartDay) ? null : getLocaleDate(this.productForm.value.promotionStartDay),
      promotion_end_time: CheckNullOrUndefinedOrEmpty(this.productForm.value.promotionEndDay) ? null : getLocaleDate(this.productForm.value.promotionEndDay),
      currency_code: this.selectedCurrency,
      has_advisor: this.hasAdvisor,
      terms_and_conditions_link: this.productForm.value.termsAndConditionsLink,
      max_order_number: this.productForm.value.orderNumber,
      has_special_payment: this.hasSpecialPayment,
      tax: (CheckNullOrUndefinedOrEmpty(this.productForm.value.tax) || this.productForm.value.tax === '') ? 0 : parseFloat(this.productForm.value.tax),
      shipping_fee: (CheckNullOrUndefinedOrEmpty(this.productForm.value.shippingFee) || this.productForm.value.shippingFee === '') ? 0 : parseFloat(this.productForm.value.shippingFee.replace(',', '')),
      storage_key: SubmitImage,
      properties: this.checkVariant ? option : {} ,
      allow_epp_payment: this.allowEPP,
      allow_recurring_payment: this.allowRecurringPayment,
      product_weight: (this.checkShippingWeight == false || CheckNullOrUndefinedOrEmpty(this.productForm.value.weight) || this.productForm.value.weight === '') ? 0 : parseFloat(this.productForm.value.weight),
      is_deleted: false,
      need_unbox: this.checkUnbox,
      need_host: this.checkHost,
      warranty_duration_in_days: (CheckNullOrUndefinedOrEmpty(this.productForm.value.day) || this.productForm.value.day === '' || this.checkWarranty === false) ? null : this.productForm.value.day,
      has_commission: this.checkCommission,
      deposit_amount: this.allowRecurringPayment ? Number(this.productForm.value.fixedDeposit) : null,
      has_payment_promotion_gift: this.checkPaymentPromotion,
      full_payment_gifts: this.productForm.value.fullPaymentOptionGifts,
      active_for: this.selectedActiveFor,
      internal_discount_price: !CheckNullOrUndefinedOrEmpty(this.productForm.value.internalDiscount) ? parseFloat(this.productForm.value.internalDiscount.replace(',', '')) : null,
      naep_discount_price: !CheckNullOrUndefinedOrEmpty(this.productForm.value.naepDiscount) ? parseFloat(this.productForm.value.naepDiscount.replace(',', '')) : null,
      internal_discount_for: this.selectedInternalDiscountFor,
      max_total_discount: Number(this.productForm.value.totalDiscount),
      cart_combination : this.cart_combination,
      internal_discount_start_time: (this.productForm.value.discountStartDate === null || isNullOrUndefined(this.productForm.value.discountStartDate)) ? null : getLocaleDate(this.productForm.value.discountStartDate),
      is_display : this.checkDisplay,
      is_sd_only : this.isSpecificDay,
      is_sd_before : this.isSpecificTimeBefore,
      is_sd_after : this.isSpecificTimeAfter,
      sd_price : (this.isSpecificTimeBefore || this.isSpecificTimeAfter) ? this.special_delivery_charge : null,
      arrSku : this.checkVariant ? this.skuDataDisplay : []

    };

    // console.log(this.productForm)



    if(formProduct.need_unbox || formProduct.need_host ) {
      if(formProduct.has_advisor == false) {
        this.isHasAdvisor = true;
        return;
      } else {
        this.isHasAdvisor = false;
      }

    }

    // console.log(formProduct)
    this._productService.updateProduct(this.product_public_id, formProduct).subscribe(data => {
      if (data.code === 200) {
        const dialogNotifi = this.dialog.open(CommonDialogComponent, {
          width: "500px",
          data: {
            message:
              'Update product successfully.',
            title:
              "NOTIFICATION",
            colorButton: false
          },
        });
        dialogNotifi.afterClosed().subscribe(data => {
          this.router.navigate(['direct-sales/products/all']);
        });
      }else {
        const dialogNotifi = this.dialog.open(CommonDialogComponent, {
          width: "500px",
          data: {
            message: data.message,
            title:
              "NOTIFICATION",
            colorButton: false
          },
        });
        dialogNotifi.afterClosed().subscribe(data => {
          return;
        });
      }
    });
  }

  deleteProduct() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '500px',
      data: { message: 'Do you wish to delete this product?', type: "REJECTED" }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this._productService.checkBeforeDeleteProduct(this.product_id).subscribe(data=>{
          if(data.code === 200){
            this._productService.deleteProduct(this.product_public_id).subscribe(data => {
              if (data.code === 200) {
                const dialogNotifi = this.dialog.open(CommonDialogComponent, {
                  width: "500px",
                  data: {
                    message:
                      'Delete Product Success.',
                    title:
                      "NOTIFICATION",
                    colorButton: false
                  },
                });
                dialogNotifi.afterClosed().subscribe(data => {
                  this.router.navigate(['direct-sales/products/all']);
                });
              }
            });
          }
          else if(data.code === 201)
          {
            const dialogNotifi = this.dialog.open(CommonDialogComponent, {
              width: "500px",
              data: {
                message:
                  `You can not delete this product because it's linked to: ${data.message}. Please remove this product from NAEP configuration first.`,
                title:
                  "NOTIFICATION",
                colorButton: false
              },
            });
          }else{
            const dialogNotifi = this.dialog.open(CommonDialogComponent, {
              width: "500px",
              data: {
                message:
                  'Error when delete product. Please try later.',
                title:
                  "NOTIFICATION",
                colorButton: false
              },
            });
          }
        })


      } else {
        dialogRef.close();
      }
    });
  }
  notUpdateProduct() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '500px',
      data: { message: 'Do you wish to cancel update and lose all changes?', type: "REJECTED" }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.router.navigate(['direct-sales/products/all']);
      } else {
        dialogRef.close();
      }
    });
  }
  onChangeStart(event) {
    this.minDateEnd = event;
    this.disable = false;
  }

  preview(files) {
    var reader = new FileReader();
    this.imagePath = files;
    let file = files[0];
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      let preSignedUrl: string;
      let profilePhotoKey: string;
      this._productService.getPreSignedUrl(Date.now().toString() + file.name, file.type).subscribe(response => {
        if (response.code === 200) {
          profilePhotoKey = response.key;
          preSignedUrl = response.url;
          this._productService.uploadActivityImage(preSignedUrl, file.type, file).subscribe(data => {
            this.imageArray.push(this.storageUrl + profilePhotoKey);
            let formImage;
            // console.log(this.imageArray)
            if (this.imageArray.length === 1) {
              formImage = {
                product_uuid: this.product_public_id,
                storage_key: profilePhotoKey,
                is_cover_photo: true
              };
            }
            else {
              formImage = {
                product_uuid: this.product_public_id,
                storage_key: profilePhotoKey,
                is_cover_photo: false
              };
            }

            this._productService.updateProductImage(formImage).subscribe(response => {
              if (response.code == 200) {
                // console.log("Update success");
                // console.log(response.data)
              } else {
                // console.log("Update error");
              }
            });

          });
        }
      });

      this.imgURL = reader.result;
      // console.log(this.imageArray);
      return this.imageArray;
    };
  }
  onFileDropped($event) {
    this.prepareFilesList($event);

  }
  /**
  * handle file from browsing
  */
  fileBrowseHandler(files) {
    if (files.length === 0)
      return;

    if (this.imageArray.length >= 6) {
      const dialogNotifi = this.dialog.open(CommonDialogComponent, {
        width: "500px",
        data: {
          message:
            'Maximum pictures  is 6',
          title:
            "NOTIFICATION",
          colorButton: false
        },
      });
      dialogNotifi.afterClosed().subscribe(data => {

      });
      return false;
    }
    if (files[0].size > 4 * 1024 * 1024) {
      // console.log(files[0].size);
      const dialogNotifi = this.dialog.open(CommonDialogComponent, {
        width: "500px",
        data: {
          message:
            'Maximum File Size 4.00 MB. Please choose another picture',
          title:
            "NOTIFICATION",
          colorButton: false
        },
      });
      dialogNotifi.afterClosed().subscribe(data => {

      });
      return false;
    }
    this.preview(files);
    this.prepareFilesList(files);
  }

  /**
   * Delete file from files list
   * @param index (File index)
   */
  deleteFile(index: number) {
    const dialogRef = this.dialog.open(FuseConfirmDialogComponent, {
      width: '500px',
      data: { message: 'Do you wish to do delete this image?' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.files.splice(index, 1);
        this.imageArray.splice(index, 1);
        let SubmitImage = [];
        this.imageArray.forEach(image => {
          let Image = image.slice(this.storageUrl.length, image.length);
          SubmitImage.push(Image);
        });
        return this._productService.updateAttachments(this.product_public_id, { storage_key: SubmitImage }).subscribe(data => {
        });
      } else {
        dialogRef.close();
      }
    });
  }

  /**
   * Simulate the upload process
   */
  uploadFilesSimulator(index: number) {
    setTimeout(() => {
      if (index === this.files.length) {
        return;
      } else {
        const progressInterval = setInterval(() => {
          if (this.files[index].progress === 100) {
            clearInterval(progressInterval);
            this.uploadFilesSimulator(index + 1);
          } else {
            this.files[index].progress += 5;
          }
        }, 200);
      }
    }, 1000);
  }

  /**
   * Convert Files list to normal array list
   * @param files (Files List)
   */
  prepareFilesList(files: Array<any>) {
    for (const item of files) {
      item.progress = 0;
      this.files.push(item);
    }
    this.uploadFilesSimulator(0);
  }

  /**
   * format bytes
   * @param bytes (File size in bytes)
   * @param decimals (Decimals point)
   */
  formatBytes(bytes, decimals) {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  clickSpecialPayment() {
    if (this.allowRecurringPayment == true) {
      this.allowEPP = false;
      this.allowRecurringPayment = false;
      this.productForm.get('fixedDeposit').disable();
      this.productForm.get('fixedDeposit').clearValidators();
    }
  }

  clickSpecificDate() {

  }
  clickSpecificTime() {

  }
  checkRecurring() {
    if (this.allowRecurringPayment == false) {
      this.productForm.get('fixedDeposit').enable();
      this.productForm.get('fixedDeposit').reset('');
      this.productForm.get('fixedDeposit').clearValidators();
      this.productForm.get('fixedDeposit').setValidators([Validators.required, Validators.pattern(this.currencyPattern)]);
    }
    else {
      this.productForm.get('fixedDeposit').disable();
      this.productForm.get('fixedDeposit').clearValidators();
    }
  }

  togglePaymentPromotionGiftForm(event) {
    this.checkPaymentPromotion = event.checked;
    if (this.checkPaymentPromotion) {
      this.productForm['controls'].fullPaymentOptionGifts.enable({ onlySelf: true, emitEvent: false });

      // Update 14-10 for change requirement gift
      // this.productForm['controls'].onlineBankingGifts.enable({ onlySelf: true, emitEvent: false });
    }
    else {
      this.constructPaymentPromotionSelections();
      this.productForm['controls'].fullPaymentOptionGifts.disable({ onlySelf: true, emitEvent: false });

      // Update 14-10 for change requirement gift
      // this.productForm['controls'].onlineBankingGifts.disable({ onlySelf: true, emitEvent: false });
    }
  }

  addOrRemoveOnlineBankingGiftOption(action: string, index: number) {
    const onlineBankingGifts = this.productForm['controls'].onlineBankingGifts as FormArray;
    if (action === 'add') {
      onlineBankingGifts.push(new FormControl('', [Validators.required]));
    }
    else {
      if (onlineBankingGifts.length === 1) {
        return;
      }
      onlineBankingGifts.removeAt(index);
    }
  }


  addOrRemoveSinglePaymentGiftOption(action: string, index: number) {
    const fullPaymentOptionGifts = this.productForm['controls'].fullPaymentOptionGifts as FormArray;
    if (action === 'add') {
      fullPaymentOptionGifts.push(new FormControl('', [Validators.required]));
    }
    else {
      if (fullPaymentOptionGifts.length === 1) {
        return;
      }
      fullPaymentOptionGifts.removeAt(index);
    }
  }

  constructPaymentPromotionSelections() {
    if (!this.hasSelectedGifts) {
      //Update 14-10 for change requirement gift

      this.productForm.addControl('fullPaymentOptionGifts', this.formBuilder.array([new FormControl('', [Validators.required])]));
      // this.productForm.addControl('onlineBankingGifts', this.formBuilder.array([new FormControl('', [Validators.required])]));
      this.productForm['controls'].fullPaymentOptionGifts.disable({ onlySelf: true, emitEvent: false });
      // this.productForm['controls'].onlineBankingGifts.disable({ onlySelf: true, emitEvent: false });
    }
    else {
      if (this.productForm.contains('fullPaymentOptionGifts')) {
        this.productForm.removeControl('fullPaymentOptionGifts');
      }

      //Update 14-10 for change requirement gift
      // if (this.productForm.contains('onlineBankingGifts')) {
      //   this.productForm.removeControl('onlineBankingGifts');
      // }

      if (!this.productForm.contains('fullPaymentOptionGifts')) {
        const singlePaymtFormArray = this.formBuilder.array([]);
        this.single_paymt_gifts.forEach(gift => {
          const selectedGift = this.paymentPromotionGifts.find(promotionGift => promotionGift.value === gift.single_paymt_gift_product_id);
          singlePaymtFormArray.push(new FormControl(selectedGift, [Validators.required]));
        });
        this.productForm.addControl('fullPaymentOptionGifts', singlePaymtFormArray);
      }

      //Update 14-10 for change requirement gift
      // if (!this.productForm.contains('onlineBankingGifts')) {
      //   const onlineBankTransferGifts = this.formBuilder.array([]);
      //   this.online_bank_transfer_gifts.forEach(gift => {
      //     const selectedGift = this.paymentPromotionGifts.find(promotionGift => promotionGift.value === gift.online_bank_transfer_gift_product_id);
      //     onlineBankTransferGifts.push(new FormControl(selectedGift, [Validators.required]));
      //   });
      //   this.productForm.addControl('onlineBankingGifts', onlineBankTransferGifts);
      // }

    }
  }

  // Internal discount for
  changeAdvisorInternalDiscount(event) {
    if (event.checked) {
      this.selectedInternalDiscountFor.push("ADVISOR");
    } else {
      for (var i = 0; i < this.selectedInternalDiscountFor.length; i++) {
        if (this.selectedInternalDiscountFor[i] === "ADVISOR") {
          this.selectedInternalDiscountFor.splice(i, 1);
          break;
        }
      }
    }

    if (!isNullOrUndefined(this.selectedInternalDiscountFor) && this.selectedInternalDiscountFor.length != 0) {
      this.productForm.get('totalDiscount').enable();

      if (!isNullOrUndefined(this.productForm.get('internalDiscount').value)) {
        this.isShowDiscountFor = true;
        this.isShowSelectDiscountFor = false;
      }
    } else {
      this.productForm.get('totalDiscount').disable();

      if ((isNullOrUndefined(this.productForm.get('internalDiscount').value) ||
        this.productForm.get('internalDiscount').value === "")) {
        this.productForm.get('totalDiscount').setValue('');
        this.isShowDiscountFor = false;
        this.isDisabled = true;
      } else {
        this.isShowSelectDiscountFor = true;
      }
    }
  }

  changeTeamLeaderInternalDiscount(event) {
    if (event.checked) {
      this.selectedInternalDiscountFor.push("TEAM_LEADER");
    } else {
      for (var i = 0; i < this.selectedInternalDiscountFor.length; i++) {
        if (this.selectedInternalDiscountFor[i] === "TEAM_LEADER") {
          this.selectedInternalDiscountFor.splice(i, 1);
          break;
        }
      }
    }

    if (!isNullOrUndefined(this.selectedInternalDiscountFor) && this.selectedInternalDiscountFor.length != 0) {
      this.productForm.get('totalDiscount').enable();

      if (!isNullOrUndefined(this.productForm.get('internalDiscount').value)) {
        this.isShowDiscountFor = true;
        this.isShowSelectDiscountFor = false;
      }
    } else {
      this.productForm.get('totalDiscount').disable();

      if ((isNullOrUndefined(this.productForm.get('internalDiscount').value) ||
        this.productForm.get('internalDiscount').value === "")) {
        this.productForm.get('totalDiscount').setValue('');
        this.isShowDiscountFor = false;
        this.isDisabled = true;
      } else {
        this.isShowSelectDiscountFor = true;
      }
    }
  }

  changeBranchManagerInternalDiscount(event) {
    if (event.checked) {
      this.selectedInternalDiscountFor.push("BRANCH_MANAGER");
    } else {
      for (var i = 0; i < this.selectedInternalDiscountFor.length; i++) {
        if (this.selectedInternalDiscountFor[i] === "BRANCH_MANAGER") {
          this.selectedInternalDiscountFor.splice(i, 1);
          break;
        }
      }
    }

    if (!isNullOrUndefined(this.selectedInternalDiscountFor) && this.selectedInternalDiscountFor.length != 0) {
      this.productForm.get('totalDiscount').enable();

      if (!isNullOrUndefined(this.productForm.get('internalDiscount').value)) {
        this.isShowDiscountFor = true;
        this.isShowSelectDiscountFor = false;
      }
    } else {
      this.productForm.get('totalDiscount').disable();

      if ((isNullOrUndefined(this.productForm.get('internalDiscount').value) ||
        this.productForm.get('internalDiscount').value === "")) {
        this.productForm.get('totalDiscount').setValue('');
        this.isShowDiscountFor = false;
        this.isDisabled = true;
      } else {
        this.isShowSelectDiscountFor = true;
      }
    }
  }

  //Active for:
  changeCustomerActive(event) {
    if (event.checked) {
      this.selectedActiveFor.push("CUSTOMER");
    } else {
      for (var i = 0; i < this.selectedActiveFor.length; i++) {
        if (this.selectedActiveFor[i] === "CUSTOMER") {
          this.selectedActiveFor.splice(i, 1);
          break;
        }
      }
    }

    if (this.selectedActiveFor.length === 0) {
      this.isShowSelectActiveFor = true;
    } else {
      this.isShowSelectActiveFor = false;
    }
  }

  changeAdvisorActive(event) {
    if (event.checked) {
      this.selectedActiveFor.push("ADVISOR");
    } else {
      for (var i = 0; i < this.selectedActiveFor.length; i++) {
        if (this.selectedActiveFor[i] === "ADVISOR") {
          this.selectedActiveFor.splice(i, 1);
          break;
        }
      }
    }

    if (this.selectedActiveFor.length === 0) {
      this.isShowSelectActiveFor = true;
    } else {
      this.isShowSelectActiveFor = false;
    }
  }

  changeTeamLeaderActive(event) {
    if (event.checked) {
      this.selectedActiveFor.push("TEAM_LEADER");
    } else {
      for (var i = 0; i < this.selectedActiveFor.length; i++) {
        if (this.selectedActiveFor[i] === "TEAM_LEADER") {
          this.selectedActiveFor.splice(i, 1);
          break;
        }
      }
    }

    if (this.selectedActiveFor.length === 0) {
      this.isShowSelectActiveFor = true;
    } else {
      this.isShowSelectActiveFor = false;
    }
  }

  changeBranchManagerActive(event) {
    if (event.checked) {
      this.selectedActiveFor.push("BRANCH_MANAGER");
    } else {
      for (var i = 0; i < this.selectedActiveFor.length; i++) {
        if (this.selectedActiveFor[i] === "BRANCH_MANAGER") {
          this.selectedActiveFor.splice(i, 1);
          break;
        }
      }
    }

    if (this.selectedActiveFor.length === 0) {
      this.isShowSelectActiveFor = true;
    } else {
      this.isShowSelectActiveFor = false;
    }
  }

  changeDiscount() {
    if (!isNullOrUndefined(this.internalDiscountPrice)) {
      this.isDisabled = false;
      this.todayDate = new Date();
    } else {
      this.isDisabled = true;
    }

    if ((isNullOrUndefined(this.productForm.get('internalDiscount').value) ||
      this.productForm.get('internalDiscount').value === "") &&
      this.selectedInternalDiscountFor.length === 0) {
      this.productForm.get('totalDiscount').setValue('');
      this.productForm.get('discountStartDate').setValue(null);
      this.isShowSelectDiscountFor = false;
      this.isShowDiscountFor = false;
      this.isDisabled = true;
    }
    else if (!isNullOrUndefined(this.selectedInternalDiscountFor) &&
      this.selectedInternalDiscountFor.length != 0) {
      this.isShowDiscountFor = true;
    } else if (this.selectedInternalDiscountFor.length === 0) {
      this.isShowSelectDiscountFor = true;
    }
  }

}
