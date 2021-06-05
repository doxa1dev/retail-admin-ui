import { Component, OnInit} from '@angular/core';
import { Location } from '@angular/common';
import { NAEPService } from 'app/core/service/naep.service';
import { InventoryService, UpdateHistory } from 'app/core/service/inventory.service'
import { isNullOrUndefined } from 'util';
import { CommonDialogComponent } from 'app/main/_shared/common-dialog/common-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { getDiscountProduct } from 'app/core/service/backend-api';
import { element } from 'protractor';
import { ConfirmDialogComponent } from './../../../_shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-special-products',
  templateUrl: './special-products.component.html',
  styleUrls: ['./special-products.component.scss']
})

// @Injectable({
//   providedIn: 'root'
// })

export class SpecialProductsComponent implements OnInit {

  listMultiSelect = [];
  listMultiSelectKeyProduct = [];
  listKeyProduct = new Array();

  selectedProduct: string;
  //
  listMultiSelectDiscount = [];
  selecteddiscountProduct: number;
  listed_price: number = 0;
  naep_price: number = 0;
  //
  selectedKeyProduct: any = [];
  updateHistory: UpdateHistory;
  history: [];
  //isDisabled: boolean = true;

  // get product naep
  dataNAEPProduct: string;
  naepProduct: any = {};

  dataDiscountProduct: number;
  discountProduct: any = {};

  dataKeyProduct = new Array();

  //
  isShowError: boolean = false;
  isGetData: boolean = false;

  constructor(
    private location: Location,
    private naep: NAEPService,
    private invetoryService : InventoryService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {

    this.naep.getDataNAEP().subscribe(data => {
      data.forEach(element => {
        if (element.isNaepProduct) {
          this.dataNAEPProduct = element.id;
        }
        else if (element.isDiscountProduct){
          this.dataDiscountProduct = element.id;
        }
        else {
          this.dataKeyProduct.push(element.id);
        }
      });

      this.invetoryService.getProductDiscount().subscribe( data => {
        this.listMultiSelectDiscount = data;
        if (!isNullOrUndefined(this.dataDiscountProduct)) {
          this.discountProduct = this.listMultiSelectDiscount.filter(item => item.value.id === this.dataDiscountProduct)[0].value;
          this.selecteddiscountProduct = this.discountProduct.id;
          this.listed_price = this.discountProduct.listed_price;
          this.naep_price = this.discountProduct.naep_price;
        }
        else {
          this.dataDiscountProduct = -1;
          this.discountProduct = this.listMultiSelectDiscount.filter(item => item.value.id === this.dataDiscountProduct)[0].value;
          this.selecteddiscountProduct = this.discountProduct.id;
          this.listed_price = this.discountProduct.listed_price;
          this.naep_price = this.discountProduct.naep_price;
        }
      })

      this.invetoryService.getDataKeyProduct().subscribe( data => {
        this.listMultiSelectKeyProduct = data;

        this.dataKeyProduct.forEach( element => {
          let item = this.listMultiSelectKeyProduct.filter(item => item.value == element)[0];

          this.selectedKeyProduct.push(item.value)
          this.listKeyProduct.push(item)
        })

      })
    })

    this.invetoryService.getProductInventory().subscribe( data => {
      this.listMultiSelect = data.listtypeMultiSelect

      if (!isNullOrUndefined(this.dataNAEPProduct)) {
        this.naepProduct = this.listMultiSelect.filter(item => item.value.id == this.dataNAEPProduct)[0].value;
        this.selectedProduct = this.naepProduct.id;

        // this.dataKeyProduct.forEach(element => {
        //   let item =  this.listMultiSelect.filter(item => item.value.id == element)[0].value;

        //   this.selectedKeyProduct.push(item.id)
        //   this.listKeyProduct.push(item)
        // });
      }
    })



    this.invetoryService.getSpecialProduct().subscribe( data => {
      this.updateHistory = data.history
    })

  }

  back(){
    this.location.back();
  }

  checkSelectedProduct(event){
    this.selectedProduct = event.value.id
  }

  checkSelectedProductDiscount(event) {
    this.selecteddiscountProduct = event.value.id;
    this.listMultiSelectDiscount.forEach(element => {
      if (element.value.id === this.selecteddiscountProduct) {
        this.listed_price = element.value.listed_price;
        this.naep_price = element.value.naep_price;
      }
    })
  }

  updateSpecialProducts(){
    if ((this.selectedKeyProduct.length > 0) && !isNullOrUndefined(this.selectedProduct)) {
      this.isShowError = false;

      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '500px',
        data: { message: 'Do you wish to update special products?', type: "APPROVED" }
      });

      dialogRef.afterClosed().subscribe(result =>{
        if (result === true) {
          const formNAEPProuduct = {
            naep_discount_product: this.selecteddiscountProduct,
            naep_product: this.selectedProduct,
            key_product: this.selectedKeyProduct
          }

          this.invetoryService.updateSpecialProduct(formNAEPProuduct).subscribe(
            data => {
              if (data.dataCode === 200) {
                const dialogNotifi = this.dialog.open(CommonDialogComponent, {
                  width: "500px",
                  data: {
                      message:
                          'Update special products success.',
                      title:
                          "NOTIFICATION",
                      colorButton: false
                  },
                });

                this.updateHistory = data.historyList.history
              }
            }
          )
        } else {
          dialogRef.close();
        }
      })
    } else {
      this.isShowError = true;
      return;
    }
  }

  checkSelectedKeyProduct(event) {
    this.selectedKeyProduct = [];
    event.value.forEach(element => {
      this.selectedKeyProduct.push(element.value)
    })
  }

  myIsNullOrUndefined(value) {
     return isNullOrUndefined(value);
  }
}
