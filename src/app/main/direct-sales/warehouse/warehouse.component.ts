import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConvertService } from 'app/core/service/convert.service';
import { WarehouseService } from 'app/core/service/warehouse.service';
import { CheckNullOrUndefinedOrEmpty } from 'app/core/utils/common-function';
import * as moment from 'moment';

@Component({
  selector: 'app-warehouse',
  templateUrl: './warehouse.component.html',
  styleUrls: ['./warehouse.component.scss']
})
export class WarehouseComponent implements OnInit {

  listProduct = [];
  productForm: FormGroup;
  orderForm: FormGroup;
  selectedProduct: any = [];
  listProductSelect: any = [];
  isShowOrder: boolean = false;
  isShowProduct: boolean = false;
  // isCheckSelectDay: boolean = true;

  maxDateFrom1: Date = new Date();
  maxDateTo1: Date = new Date();
  minDateStart1: Date = new Date();

  maxDateFrom2: Date = new Date();
  maxDateTo2: Date = new Date();
  minDateStart2: Date = new Date();

  startDayOrder: string;
  endDayOrder: string;

  startDayProduct: string;
  endDayProduct: string;
  //Button loading
  buttonName1: string = "Export ";
  buttonName2: string = " Export";
  active1: boolean = false;
  active2: boolean = false;

  constructor(private warehouseService: WarehouseService,
    private convertService: ConvertService,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.productForm = this.formBuilder.group({
      startDayProduct: ['', Validators.required],
      endDayProduct: ['', Validators.required],
    });

    this.orderForm = this.formBuilder.group({
      startDayOrder: ['', Validators.required],
      endDayOrder: ['', Validators.required],
      product: [{value: '', disabled: true}, Validators.required]
    });
  }

  getAllProduct(start, end) {
    this.warehouseService.getAllProductOrdersPacking(start, end).subscribe(
      data => {
        this.listProduct = data;
      }
    );
  }

  onChangeProduct(event) {
    this.selectedProduct = [];
    event.value.forEach(element => {
      this.selectedProduct.push(element.value)
    });

    this.listProductSelect = this.changInArr(this.selectedProduct);

    // if (this.selectedProduct.length === 0) {
    //   this.isShow1 = true;
    // } else {
    //   this.isShow1 = false;
    // }
  }

  changInArr(arr){
    if (arr.length > 0) {
      let merge = "('"
      for (let index = 0; index < arr.length; index++) {
          if(index === 0){
              merge = merge +  arr[0];
          } else {
              merge = merge + "','" + arr[index]
          }
      }
      return merge + "')"
    } else {
      return;
    }
  }

  //order
  exportOrder() {
    // if (this.selectedProduct.length === 0) {
    //   this.isShow1 = true;
    //   return;
    // }

    this.isShowOrder = true;
    if (this.orderForm.invalid)
    {
      return;
    }

    this.active1 = true;
    this.buttonName1 = "Processing...";
    this.warehouseService.getOrdersPackingList(this.listProductSelect, this.startDayOrder, this.endDayOrder).subscribe(
      data => {
        this.convertService.downloadFile(data, 'Order Packing List from ' + this.startDayOrder + ' to ' + this.endDayOrder, null, null, 'order_packing');
        this.active1 = false;
        this.buttonName1 = "Export ";
      }
    )
  }

  onChangeFromOrder(event) {
    this.startDayOrder = formatDate(event, "yyyy-MM-dd", "en-US");
    this.minDateStart1 = event;

    if (!CheckNullOrUndefinedOrEmpty(this.startDayOrder) && !CheckNullOrUndefinedOrEmpty(this.endDayOrder)) {
      // this.isCheckSelectDay = false;
      this.orderForm.controls.product.enable();

      this.getAllProduct(this.startDayOrder, this.endDayOrder);
    } else {
      // this.isCheckSelectDay = true;
      this.orderForm.controls.product.disable();
    }

    if (this.selectedProduct.length != 0) {
      this.orderForm.get('product').setValue('');
    }
  }

  onChangeToOrder(event) {
    this.endDayOrder = formatDate(event, "yyyy-MM-dd", "en-US");
    this.maxDateFrom1 = event;

    if (!CheckNullOrUndefinedOrEmpty(this.endDayOrder) && !CheckNullOrUndefinedOrEmpty(this.startDayOrder)) {
      // this.isCheckSelectDay = false;
      this.orderForm.controls.product.enable();
      this.getAllProduct(this.startDayOrder, this.endDayOrder);
    } else {
      // this.isCheckSelectDay = true;
      this.orderForm.controls.product.disable();
    }

    if (this.selectedProduct.length != 0) {
      this.orderForm.get('product').setValue('');
    }
  }

  //product
  exportProduct() {
    this.isShowProduct = true;
    if (this.productForm.invalid)
    {
      return;
    }

    this.active2 = true;
    this.buttonName2 = "Processing...";

    this.warehouseService.getPackingListProduct(this.startDayProduct, this.endDayProduct).subscribe(
      data => {
        this.convertService.downloadFile(data, 'Product Packing List from ' + this.startDayProduct + ' to ' + this.endDayProduct, null, null, 'product_packing');
        this.active2 = false;
        this.buttonName2 = " Export";
      }
    )
  }

  onChangeFromProduct(event) {
    this.startDayProduct = formatDate(event, "yyyy-MM-dd", "en-US");
    this.minDateStart2 = event;
  }

  onChangeToProduct(event) {
    this.endDayProduct = formatDate(event, "yyyy-MM-dd", "en-US");
    this.maxDateFrom2 = event;
  }
}
