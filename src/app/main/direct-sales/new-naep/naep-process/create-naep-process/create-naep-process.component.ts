import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmDialogComponent } from 'app/main/_shared/confirm-dialog/confirm-dialog.component';
import { Location } from '@angular/common';
import { NewNaepService } from 'app/core/service/new-naep.service';
import { ListDiscountPrice, NaepProcessForm, UpdateNaepProcessForm } from 'app/core/models/naep.model'
import { ReportsService, Value } from 'app/core/service/reports.service';
import { CheckNullOrUndefined, CheckNullOrUndefinedOrEmpty } from 'app/core/utils/common-function';
import { CommonDialogComponent } from 'app/main/_shared/common-dialog/common-dialog.component';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as CURRENCY from 'assets/currency.json';
import * as jwt_decode from 'jwt-decode';
import { data } from 'jquery';

@Component({
  selector: 'app-create-naep-process',
  templateUrl: './create-naep-process.component.html',
  styleUrls: ['./create-naep-process.component.scss']
})
export class CreateNaepProcessComponent implements OnInit {

  constructor(
    private location : Location,
    public dialog: MatDialog,
    private router: Router,
    private newNaepService: NewNaepService,
    private reportsService : ReportsService,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder
  ) { }

  updateHistory = [];
  title : string;
  // number_sale: number = 1;
  description: string;
  selectedProduct = [];
  submitted: boolean = false;
  products=[];
  uuid: string;
  mode: string;
  processName: string;
  priceForm: FormGroup;
  currency = (CURRENCY as any).default;
  selectedCurrency: string = "SGD";
  decoded: any;
  currencyPattern = /^[0-9,]+(\.[0-9]{1,2})?$/;

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.uuid = params.uuid;
      this.checkMode(this.uuid)
    });

    let token = localStorage.getItem('token');
    if (!CheckNullOrUndefinedOrEmpty(token)){
      this.decoded = jwt_decode(token);
    }
    if(this.decoded.entity_id === "1"){
      this.selectedCurrency= "SGD";
    }else if (this.decoded.entity_id === "2"){
      this.selectedCurrency = "MYR";
    }

    this.newNaepService.getAllProductHasAdvisor().subscribe(data => {
      setTimeout(() => { this.products = data; }, 500);
    })

    this.priceForm = this.formBuilder.group({
      number_sale: [1, Validators.required],
      description: ['', Validators.required],
      listPrice: this.formBuilder.array([])
    })

    if(this.mode === 'UPDATE'){
      this.newNaepService.getNaepProcessDetail(this.uuid).subscribe(data=>{
        this.title = data.name;
        this.processName = data.name;
        this.priceForm.controls['number_sale'].setValue(data.complete_sales_number);
        this.priceForm.controls['description'].setValue(data.description);

        if (!CheckNullOrUndefinedOrEmpty(data.naep_process_discount)) {
          // const list = this.priceForm.controls.listPrice as FormArray;
          this.list.clear();

          data.naep_process_discount.forEach(element => {
            let discountPrice = new ListDiscountPrice();

            discountPrice.value = Number(element.value);
            discountPrice.index_sale = Number(element.index_sale);


            this.list.push(this.dataListPrice(discountPrice));
          });
          this.priceForm.controls['listPrice'].setValue(this.list.value);
        }

        if(!CheckNullOrUndefinedOrEmpty(data.naep_item)){
          data.naep_item.forEach(element => {
            console.log(element)
            let value = new Value()
            value.id = element.product_id ;
            value.name = !CheckNullOrUndefined(element.product) ? element.product.product_name: "";
            this.selectedProduct.push(value);
          });
        }
          this.updateHistory = this.newNaepService.renderHistory(data.history)
          // console.log(data.history)
      })

    } else {
      this.onChange();
    }
  }

  checkMode(data){
    if(CheckNullOrUndefined(data)){
      this.mode = "CREATE";
    }else{
      this.mode = "UPDATE"
    }
  }

  createNAEPProcess(){
    this.submitted = true;
    if(CheckNullOrUndefined(this.title) || this.title.length == 0 || this.selectedProduct.length == 0
    || this.priceForm.invalid || this.checkListPrice()
    ){
      return;
    }else{
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '700px',
        data: { message: 'Are you sure you want to create this NAEP type?', type: "APPROVED" }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result === true) {
          let naepProcessForm = new NaepProcessForm();
          naepProcessForm.name = this.title;
          naepProcessForm.description = this.priceForm.value.description;
          naepProcessForm.number_sale = this.priceForm.value.number_sale;
          naepProcessForm.list_discount_price = this.priceForm.value.listPrice;

          if(this.selectedProduct.length > 0){
            this.selectedProduct.forEach(e=>{
              naepProcessForm.list_key_product.push(e.id)
            })
          }

          this.newNaepService.createNaepProcess(naepProcessForm).subscribe(data=>{
            if(data.code === 200){
              const dialogNotifi = this.dialog.open(CommonDialogComponent, {
                width: "600px",
                data: {
                  message:
                    'Create NAEP Process Success.',
                  title:
                    "NOTIFICATION",
                  colorButton: false
                },
              });
              dialogNotifi.afterClosed().subscribe(() => {
                this.router.navigate(['direct-sales/configuration/naep-process']);
              });
            }else{
              const dialogNotifi = this.dialog.open(CommonDialogComponent, {
                width: "600px",
                data: {
                  message:
                    'Error When Create NAEP Process.',
                  title:
                    "NOTIFICATION",
                  colorButton: true
                },
              });
            }
          })
        }else {
          dialogRef.close();
        }
      })

    }
  }

  back(){
    this.location.back();
  }

  selectedChange(event){
    // console.log(this.selectedProduct)
  }

  deleteNAEP(){
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '700px',
      data: { message: 'Are you sure you want to delete this NAEP process?', type: "REJECTED" }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.newNaepService.deleteNaepProcess(this.uuid).subscribe(data=>{
          if (data.code === 200) {
            const dialogNotifi = this.dialog.open(CommonDialogComponent, {
              width: "600px",
              data: {
                message:
                  'Delete NAEP Process Success.',
                title:
                  "NOTIFICATION",
                colorButton: false
              },
            });
            dialogNotifi.afterClosed().subscribe(() => {
              this.router.navigate(['direct-sales/configuration/naep-process']);
            });
          }else{
            const dialogNotifi = this.dialog.open(CommonDialogComponent, {
              width: "600px",
              data: {
                message:
                  'Error When Delete NAEP Process.',
                title:
                  "NOTIFICATION",
                colorButton: true
              },
            });
          }
        })
      }else {
        dialogRef.close();
      }
    })
  }

  checkListPrice() {
    let listPrice = this.priceForm.get('listPrice').value;

    for (let index = 0; index < listPrice.length; index++) {
      if (index != 0) {
        if (listPrice[index].value >= listPrice[index - 1].value) {
          return true;
        }
      }
    }
  }

  updateNAEP(){
    this.submitted = true;

    if(CheckNullOrUndefined(this.title) || this.title.length == 0 || this.selectedProduct.length == 0
    || this.priceForm.invalid || this.checkListPrice()
  ){
    return ;
  }else{
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '700px',
      data: { message: 'Are you sure you want to update this NAEP process?', type: "APPROVED" }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        let updateForm = new UpdateNaepProcessForm()
        updateForm.uuid = this.uuid;
        updateForm.name = this.title;
        updateForm.description = this.priceForm.value.description;
        updateForm.number_sale = Number(this.priceForm.value.number_sale);
        updateForm.list_discount_price = this.priceForm.value.listPrice;

        if(this.selectedProduct.length > 0){
          this.selectedProduct.forEach(e=>{
            updateForm.list_key_product.push(Number(e.id))
          })
        }

        this.newNaepService.updateNaepProcess(updateForm).subscribe(data=>{
          if(data.code === 200){
            const dialogNotifi = this.dialog.open(CommonDialogComponent, {
              width: "600px",
              data: {
                message:
                  'Update NAEP Process Success.',
                title:
                  "NOTIFICATION",
                colorButton: false
              },
            });
            dialogNotifi.afterClosed().subscribe(() => {
              this.router.navigate(['direct-sales/configuration/naep-process']);
            });
          }else{
            const dialogNotifi = this.dialog.open(CommonDialogComponent, {
              width: "600px",
              data: {
                message:
                  'Error When Update NAEP Process.',
                title:
                  "NOTIFICATION",
                colorButton: true
              },
            });
          }
        })
      }else {
        dialogRef.close();
      }
    })

    }
  }

  onChange() {
    const dataList = this.priceForm.value.listPrice;

    if (!CheckNullOrUndefinedOrEmpty(dataList)) {

      if (dataList.length - 1 < this.priceForm.value.number_sale) {
        for (let i = 0; i <= this.priceForm.value.number_sale; i++) {
          if (dataList.length <= i) {
            this.list.push(this.formBuilder.group({
              index_sale: [i, Validators.required],
              value: [null, [Validators.required, Validators.min(0), Validators.pattern(this.currencyPattern)]]
            }));
          }
        }

      } else if (dataList.length - 1 === this.priceForm.value.number_sale) {
        return;

      } else {

        const itemRemove = dataList.length - this.priceForm.value.number_sale - 1;

        for (let i = 0; i <= itemRemove; i++) {
          this.list.removeAt(dataList.length - i);
        }
      }

    } else {

      for (let i = 0; i <= this.priceForm.value.number_sale; i++) {
        this.list.push(this.formBuilder.group({
          index_sale: [i, Validators.required],
          value: [null, [Validators.required, Validators.min(0), Validators.pattern(this.currencyPattern)]]
        }));
      }
    }
  }

  dataListPrice(data): FormGroup {
    return this.formBuilder.group({
      index_sale: [data.index_sale, Validators.required],
      value: [data.value, [Validators.required, Validators.min(0), Validators.pattern(this.currencyPattern)]]
    })
  }

  get list(): FormArray {
    return this.priceForm.controls.listPrice as FormArray;
  }

  changeValue(event, i) {
    this.priceForm.get('listPrice')['controls'][i].controls['value'].setValue(Number(event.target.value));
  }
}
