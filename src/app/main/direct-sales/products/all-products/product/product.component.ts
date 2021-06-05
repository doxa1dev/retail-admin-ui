import { CheckNullOrUndefined , CheckNullOrUndefinedOrEmpty } from 'app/core/utils/common-function';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { Location } from '@angular/common';
import { ProductService } from 'app/core/service/product.service';
import * as CURRENCY from 'assets/currency.json';
import { FormControl, FormGroup, Validators, FormBuilder, FormArray, ControlValueAccessor, AbstractControl, ValidationErrors } from '@angular/forms';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { environment } from 'environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { isNullOrUndefined } from 'util';
// import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { CommonDialogComponent } from 'app/main/_shared/common-dialog/common-dialog.component';
import { ConfirmDialogComponent } from 'app/main/_shared/confirm-dialog/confirm-dialog.component';
import { getLocaleDate } from 'app/core/utils/date.util';
import * as jwt_decode from 'jwt-decode';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})


export class ProductComponent implements OnInit {
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
  selectedCurrency: string = "SGD";
  text2: string;
  cart_combination: boolean = false;
  // sku: string = "";
  checkShippingWeight: boolean = false;
  checkVariant: boolean = false;
  checkWarranty: boolean = false;
  checkActive: boolean = true;
  checkDisplay:  boolean = true;
  checkUnbox: boolean = true;
  checkHost: boolean = true;
  hasAvisor: boolean = true;
  hasSpecialPayment: boolean = false;
  files: any[] = [];
  public imagePath;
  imgURL: any;
  imageArray: string[] = [];
  isCreate: boolean = true;
  isCheckPriceDeposit: boolean = false;
  isCheckPriceDeposit2: boolean = false;
  isCheckPriceNaep: boolean = false;

  propertiesArray: FormGroup;
  property: FormGroup;
  propertiesValueArray: string[][] = [];
  submitted: boolean = false;
  currencyPattern = /^[0-9,]+(\.[0-9]{1,2})?$/;
  weightPattern = /^(?:[0-9]+(?:\.[0-9]{0,2})?)?$/;
  inputTag;
  //
  checkCommission: boolean = false;
  allowEPP: boolean = false;
  allowRecurringPayment: boolean = false;

  checkPaymentPromotion: boolean = false;
  paymentPromotionGifts: SelectItem[];
  //
  selectedActiveFor: string [] = [];
  checkCustomerActive: boolean = false;
  checkAdvisorActive: boolean = false;
  checkTeamLeaderActive: boolean = false;
  checkBranchManagerActive: boolean = false;
  //
  selectedInternalDiscountFor: string [] = [];
  checkAdvisorInternalDiscount: boolean = false;
  checkTeamLeaderInternalDiscount: boolean = false;
  checkBranchManagerInternalDiscount: boolean = false;
  internalDiscountPrice: number;
  naepDiscountPrice: number;
  isShowTotal: boolean = false;
  isDisabled: boolean = true;
  isDisabledDiscount : boolean = true;
  isShowDiscountFor: boolean = false;
  isShowSelectDiscountFor: boolean = false;
  isShowSelectActiveFor: boolean = false;
  todayDate;
  isSpecificTimeBefore : boolean = false
  isSpecificTimeAfter : boolean = false
  isCheckPrice: boolean = false;
  isCheckPriceInternal: boolean = false;
  isSpecificDay: boolean = false;
  special_delivery_charge = "0" ;
  chargePrice: string;
  decoded: any;
  promotion_endtime: any;
  arrSKU: Array<string> = [];
  entity: number = 1;
  isHasAdvisor: boolean = false;
  checkPromotionTime: boolean = false;
  checkPromotionPrice: boolean = false;
  constructor(
    private _location: Location,
    private _productService: ProductService,
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
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
      this.selectedCurrency= "SGD";
      this.entity = 1;
    }else if (this.decoded.entity_id === "2"){
      this.selectedCurrency = "MYR";
      this.entity = 2;
    }
    this.checkCustomerActive = true;

    this._productService.getAllCategories().subscribe(data => {
      this.categories = data;
      this.selectedCategory.push(this.categories[0].value);
    });

    this._productService.getAllPaymentPromotionGifts().subscribe(data => {
      this.paymentPromotionGifts = data;
    });

    this.propertiesArray = this.formBuilder.group({
      properties: this.formBuilder.array([
        this.createProperty()
      ])
    });
    this.propertiesValueArray.push([]);
    this.productForm = this.formBuilder.group({
      productTitle: ['', Validators.required],
      productDescription: [''],
      termsAndConditionsLink: ["", ],
      delivery_charge: [0,  Validators.pattern("^[0-9.]+$")],
      orderNumber: ["", [Validators.required, Validators.pattern("^[0-9]*$")]],
      listedPrice: ["", [Validators.required, Validators.pattern(this.currencyPattern)]],
      promotionPrice: ["", Validators.pattern(this.currencyPattern)],
      promotionStartDay: [],
      promotionEndDay: [],
      sku : ["",Validators.required],
      tax: ["", Validators.pattern(this.currencyPattern)],
      shippingFee: ["", Validators.pattern(this.currencyPattern)],
      weight: ["", Validators.pattern(this.weightPattern)],
      day: ["", Validators.pattern("^[0-9]*$")],
      optionName: [""],
      // selectedCategory:[""]
      // add fixed deposit if recurring payment is checked
      fixedDeposit: [{ value: '', diabled: true }],
      fullPaymentOptionGifts: this.formBuilder.array([new FormControl('', [Validators.required])]),
      // onlineBankingGifts: this.formBuilder.array([new FormControl('', [Validators.required])]),
      internalDiscount: ["", [Validators.required, Validators.pattern(this.currencyPattern)]],
      naepDiscount: ["", [Validators.pattern(this.currencyPattern)]],
      totalDiscount: [{ value: '', disabled: this.isDisabledDiscount }, [Validators.required, Validators.pattern("^[0-9]*$")]],
      discountStartDate:[]
    });
    this.productForm['controls'].fullPaymentOptionGifts.disable({ onlySelf: true, emitEvent: false });
    // this.productForm['controls'].onlineBankingGifts.disable({ onlySelf: true, emitEvent: false });

    this.times = [
      { label: 'Year(s)', value: 'Year' },
      { label: 'Month(s)', value: 'Month' },
      { label: 'Day(s)', value: 'Day' }
    ];

    // this.paymentPromotionGifts = [
    //   { label: 'TMM Carry Bag', value: '1' },
    //   { label: 'TMM Fountain Pen', value: '2' },
    //   { label: 'TMM Water Bottle', value: '3' },
    // ];
    if (this.selectedActiveFor.length === 0) {
      this.selectedActiveFor.push("CUSTOMER")
    }
  }
  OnKeyDownEven(event){
    if(event.keyCode === 13){
      event.preventDefault();
      // this.createProduct()
    }
  }


  get f() { return this.productForm.controls };
  showProduct()
  {

  }
  //Variant
  createProperty(): FormGroup {
    return this.formBuilder.group({
      property_name: ['', Validators.required],
      property_option: this.formBuilder.array([]),
    });
  }

  createVariantSku(name): FormGroup{
    return this.formBuilder.group({
      variant:[name],
      sku: ["", Validators.required]
    })
  }
  //warranty

  get properties(): FormArray {
    return this.propertiesArray.get('properties') as FormArray;
  }
  get property_option(): FormArray {
    return this.propertiesArray.get('properties').get('property_option') as FormArray;
  }

  checkHasVariant(event){
    if(event.checked){
      this.productForm.get("sku").disable();
    }else{
      this.productForm.get("sku").enable();
    }
  }

  addOption() {
    (<FormArray> this.propertiesArray.get('properties')).push(this.createProperty());
    this.propertiesValueArray.push([]);
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
  skuData: Array<SkuProduct>;
  skuDataDisplay: Array<SkuProductFrontEnd> = [];
  skuProduct(properties){
    this.arrSKU = this.combine(properties);
    this.skuData = [];
    this.skuDataDisplay = [];
    this.arrSKU.forEach(e=>{
      let newSku = new SkuProduct();
      let display = new SkuProductFrontEnd();
      newSku.variant = e;
      display.variant = e;
      this.skuDataDisplay.push(display);
      this.skuData.push(newSku)
    })
    // console.log("hrhihaiur",this.arrSKU);
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

  //End Variants

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.imageArray, event.previousIndex, event.currentIndex);
  }

  back() {
    this._location.back();
  }

  checkInvalidValue(value){
    return CheckNullOrUndefinedOrEmpty(value)
  }

  notEnterAllSku: boolean = false;
  checkDuplicates: boolean = false;
  checkEnterSku(arr){
    this.checkDuplicates = false;
    arr.forEach(element => {
      if(CheckNullOrUndefinedOrEmpty(element.sku)){
        element.display = true;
      }else{
        element.display = false;
      }
    });
    this.notEnterAllSku = !CheckNullOrUndefinedOrEmpty(arr.find(e=>e.display==true))? true : false ;
    console.log(this.notEnterAllSku)
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

  checkInputType(arr1 , arr2){
    let checkInput : boolean = false
    arr1.forEach(element => {
      if(CheckNullOrUndefinedOrEmpty(element.property_name)){
        checkInput =  true;
      }
    });
    arr2.forEach(e => {
      if(CheckNullOrUndefinedOrEmpty(e)){
        checkInput =  true;
      }
    });
    return checkInput;
  }

  createProduct() {
    this.submitted = true;

    this.productForm.controls["promotionPrice"].markAsPristine();
    this.productForm.controls["naepDiscount"].markAsPristine();
    // this.productForm.controls["fixedDeposit"].markAsPristine();
    this.productForm.controls["internalDiscount"].markAsPristine();
    this.productForm.controls["promotionStartDay"].markAsPristine();
    this.productForm.controls["promotionEndDay"].markAsPristine();

    if (CheckNullOrUndefinedOrEmpty(this.productForm.get('internalDiscount').value) ||  this.productForm.get('internalDiscount').value === "") {
      this.productForm.get('internalDiscount').clearValidators();
      this.productForm.get('internalDiscount').setValidators(Validators.pattern(this.currencyPattern))
      this.productForm.get('internalDiscount').updateValueAndValidity();
    }

    let checkSpecialDelivery  =  (this.isSpecificTimeBefore || this.isSpecificTimeAfter ) && CheckNullOrUndefinedOrEmpty(this.special_delivery_charge)

    // console.log('hahah',this.checkInputType(this.propertiesArray.value.properties));
    // console.log(this.propertiesValueArray)
    // console.log(this.checkVariant)
    if (this.productForm.invalid ||
      this.imageArray.length == 0 ||
      (this.checkVariant && (this.checkInputType(this.propertiesArray.value.properties , this.propertiesValueArray) || this.checkEnterSku(this.skuDataDisplay) || this.findDuplicates(this.skuDataDisplay))) ||
      this.isShowSelectActiveFor === true ||
      this.isShowSelectDiscountFor === true || checkSpecialDelivery ||
      (this.hasSpecialPayment && !this.allowRecurringPayment && !this.allowEPP)
      ) {
        return;
    }

   // console.log( Number(this.productForm.value.internalDiscount))
    const listedPrice = Number(this.productForm.value.listedPrice);
    const depositPrice = Number(this.productForm.value.naepDiscount)
    const fixedDepositPrice = Number(this.productForm.value.fixedDeposit);
    const promotionPrice = parseFloat(this.productForm.value.promotionPrice);
    const internalPrice =  Number(this.productForm.value.internalDiscount);
   // this.promotion_endtime = this.productForm.value.promotionEndDay

    if (listedPrice < promotionPrice) {
      this.isCheckPrice = true;
      this.checkPromotionPrice = false;
      this.checkPromotionTime = false;
      return;
    } else {
      this.isCheckPrice = false;

    }
    if (listedPrice < depositPrice) {
      this.isCheckPriceNaep = true;
      return;

    } else {
      this.isCheckPriceNaep = false;

    }


    if (  promotionPrice < fixedDepositPrice || listedPrice < fixedDepositPrice ) {
      this.isCheckPriceDeposit = true;
      this.checkPromotionPrice = false;
      this.checkPromotionTime = false;

      return;

    } else {
      this.isCheckPriceDeposit = false;

    }

    if ( listedPrice < internalPrice ) {
      this.isCheckPriceInternal = true;
      return;
    } else {
      this.isCheckPriceInternal = false;
    }

    if(this.checkUnbox || this.checkHost ) {
      if(this.hasAvisor == false) {
        this.isHasAdvisor = true;
        return;
      } else {
        this.isHasAdvisor = false;
      }

    }

    if (!CheckNullOrUndefinedOrEmpty(this.productForm.value.promotionPrice)) {
      // this.checkPromotionTime = true;
      // console.log(this.productForm.value.promotionPrice)
        // return
        if ( CheckNullOrUndefinedOrEmpty(this.productForm.value.promotionStartDay) || CheckNullOrUndefinedOrEmpty(this.productForm.value.promotionEndDay) ) {
          // this.checkPromotionPrice = true
           this.checkPromotionTime = true;
          this.checkPromotionPrice = false
          return;
        } else {
          this.checkPromotionTime = false;
        }

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

    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '500px',
      data: { message: 'Do you wish to create the product?', type: "APPROVED" }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        let option = new Object;

        this.propertiesArray.value.properties.forEach((property, index) => {
          if (property.property_name !== '') {
            option[property.property_name] = this.propertiesValueArray[index];
          }
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
          listed_price: this.productForm.value.listedPrice,
          promotional_price:  (CheckNullOrUndefinedOrEmpty(this.productForm.value.promotionPrice) || this.productForm.value.promotionPrice === '') ? null : parseFloat(this.productForm.value.promotionPrice),
          promotion_start_time: this.productForm.value.promotionStartDay === null ? null : getLocaleDate(this.productForm.value.promotionStartDay),
          promotion_end_time: this.productForm.value.promotionEndDay === null ? null : getLocaleDate(this.productForm.value.promotionEndDay),
          currency_code: this.selectedCurrency,
          has_advisor: this.hasAvisor,
          terms_and_conditions_link: this.productForm.value.termsAndConditionsLink,
          max_order_number: (CheckNullOrUndefinedOrEmpty(this.productForm.value.orderNumber) || this.productForm.value.orderNumber === '') ? 0 : parseInt(this.productForm.value.orderNumber),
          has_special_payment: this.hasSpecialPayment,
          tax: (CheckNullOrUndefinedOrEmpty(this.productForm.value.tax) || this.productForm.value.tax === '') ? 0 : parseFloat(this.productForm.value.tax),
          shipping_fee: (CheckNullOrUndefinedOrEmpty(this.productForm.value.shippingFee) || this.productForm.value.shippingFee === '') ? 0 : parseFloat(this.productForm.value.shippingFee),
          storage_key: SubmitImage,
          properties: option,
          allow_epp_payment: this.allowEPP,
          allow_recurring_payment: this.allowRecurringPayment,
          product_weight: (CheckNullOrUndefinedOrEmpty(this.productForm.value.weight) || this.productForm.value.weight === '') ? 0 : parseFloat(this.productForm.value.weight),
          is_deleted: false,
          need_unbox: this.checkUnbox,
          need_host: this.checkHost,
          warranty_duration_in_days: (CheckNullOrUndefinedOrEmpty(this.productForm.value.day) || this.productForm.value.day === '') ? null : parseInt(this.productForm.value.day),
          has_commission: this.checkCommission,
          deposit_amount: this.allowRecurringPayment ? Number(this.productForm.value.fixedDeposit) : null,
          has_payment_promotion_gift: this.checkPaymentPromotion,
          full_payment_gifts: this.productForm.value.fullPaymentOptionGifts,
          // online_banking_gifts: this.productForm.value.onlineBankingGifts,
          active_for: this.selectedActiveFor,
          internal_discount_price: Number(this.productForm.value.internalDiscount),
          naep_discount_price: !CheckNullOrUndefinedOrEmpty(this.productForm.value.naepDiscount) ? Number(this.productForm.value.naepDiscount) : null,
          internal_discount_for: this.selectedInternalDiscountFor,
          max_total_discount: Number(this.productForm.value.totalDiscount),
          cart_combination : this.cart_combination,
          internal_discount_start_time : (this.productForm.value.discountStartDate === null ||isNullOrUndefined(this.productForm.value.discountStartDate) )? null : getLocaleDate(this.productForm.value.discountStartDate),
          is_display : this.checkDisplay,
          is_sd_only : this.isSpecificDay,
          is_sd_before : this.isSpecificTimeBefore,
          is_sd_after : this.isSpecificTimeAfter,
          sd_price : (this.isSpecificTimeBefore || this.isSpecificTimeAfter) ? this.special_delivery_charge : null ,
          arrSku : this.skuDataDisplay
        };

        this._productService.createProduct(formProduct).subscribe(data => {
          if (data.code === 200) {
            const dialogNotifi = this.dialog.open(CommonDialogComponent, {
              width: "500px",
              data: {
                message:
                  'Product created successfully.',
                title:
                  "NOTIFICATION",
                colorButton: false
              },
            });
            dialogNotifi.afterClosed().subscribe(data => {
              this.router.navigate(['direct-sales/products/all']);
            });
          }
          else {
            const dialogNotifi = this.dialog.open(CommonDialogComponent, {
              width: "500px",
              data: {
                message: data.message,
                title:
                  "NOTIFICATION",
                colorButton: false
              },
            });
            dialogNotifi.afterClosed().subscribe(() => {
              if(!CheckNullOrUndefinedOrEmpty(this.skuDataDisplay) && !CheckNullOrUndefinedOrEmpty(data?.data) && !CheckNullOrUndefinedOrEmpty(data?.data.sku)){
                let index = this.skuDataDisplay.findIndex(x=>x.sku === data?.data.sku);
                this.skuDataDisplay[index].display = true;
              }
              return;
            });
          }
        });

      } else {
        dialogRef.close();
      }
    });

  }

  notCreateProduct() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '500px',
      data: { message: 'Your changes will not be saved, do you wish to leave?', type: "REJECTED" }
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
    let reader = new FileReader();
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
          });
        }
      });

      this.imgURL = reader.result;
      return this.imageArray;
    };
  }
  onFileDropped($event) {
    if ($event.length === 0)
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
    if ($event[0].size > 4 * 1024 * 1024) {
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

    this.preview($event);
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
      data: { message: 'Do you wish to do delete this image?'}
    });
    dialogRef.afterClosed().subscribe(result =>
    {
      if (result === true)
      {
        this.files.splice(index, 1);
        this.imageArray.splice(index, 1)
      } else
      {
        dialogRef.close();
      }
    })
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
            this.files[index].progress += 10;
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
  clickSpecificTime(){

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
      // this.productForm['controls'].onlineBankingGifts.enable({ onlySelf: true, emitEvent: false });
      this.productForm['controls'].fullPaymentOptionGifts.updateValueAndValidity();
      this.productForm['controls'].fullPaymentOptionGifts.updateValueAndValidity();
    }
    else {

      // Update 14-10 for change requirement gift
      // if (this.productForm.contains('onlineBankingGifts')) {
      //   this.productForm.removeControl('onlineBankingGifts');
      //   this.productForm.addControl('onlineBankingGifts', this.formBuilder.array([new FormControl('', [Validators.required])]));
      // }

      if (this.productForm.contains('fullPaymentOptionGifts')) {
        this.productForm.removeControl('fullPaymentOptionGifts');
        this.productForm.addControl('fullPaymentOptionGifts', this.formBuilder.array([new FormControl('', [Validators.required])]));
      }
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

    // Internal discount for
    changeAdvisorInternalDiscount(event) {
      if (event.checked) {
        this.selectedInternalDiscountFor.push("ADVISOR")
      } else {
        for (var i = 0; i < this.selectedInternalDiscountFor.length; i++){
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
        this.selectedInternalDiscountFor.push("TEAM_LEADER")
      } else {
        for (var i = 0; i < this.selectedInternalDiscountFor.length; i++){
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
        this.selectedInternalDiscountFor.push("BRANCH_MANAGER")
      } else {
        for (var i = 0; i < this.selectedInternalDiscountFor.length; i++){
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
        this.selectedActiveFor.push("CUSTOMER")
      } else {
        for (var i = 0; i < this.selectedActiveFor.length; i++){
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
        this.selectedActiveFor.push("ADVISOR")
      } else {
        for (var i = 0; i < this.selectedActiveFor.length; i++){
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
        this.selectedActiveFor.push("TEAM_LEADER")
      } else {
        for (var i = 0; i < this.selectedActiveFor.length; i++){
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
        this.selectedActiveFor.push("BRANCH_MANAGER")
      } else {
        for (var i = 0; i < this.selectedActiveFor.length; i++){
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
        this.todayDate = new Date()
      } else {
        this.isDisabled = true;
      }

      if ((isNullOrUndefined(this.productForm.get('internalDiscount').value) ||
      this.productForm.get('internalDiscount').value === "") &&
      this.selectedInternalDiscountFor.length === 0)
      {
        this.productForm.get('totalDiscount').setValue('')
        this.productForm.get('discountStartDate').setValue(null)
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

export class SkuProduct{
  sku: string;
  variant: string;
}

export class SkuProductFrontEnd{
  sku: string;
  variant: string;
  display: boolean = false;
}

