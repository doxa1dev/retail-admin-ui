import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { NewNaepService, TimeLineNaep } from 'app/core/service/new-naep.service';
import { ActivatedRoute } from '@angular/router';
import { CheckNullOrUndefinedOrEmpty } from 'app/core/utils/common-function';
import { NaepAdvisoryProduct, NaepProcessForm } from 'app/core/models/naep.model';
import { CommonDialogComponent } from 'app/main/_shared/common-dialog/common-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'app/main/_shared/confirm-dialog/confirm-dialog.component';
import { Value } from 'app/core/service/inventory.service';

@Component({
  selector: 'app-advisory-product',
  templateUrl: './advisory-product.component.html',
  styleUrls: ['./advisory-product.component.scss']
})
export class AdvisoryProductComponent implements OnInit {
  selectedProduct = [];
  products=[];
  updateHistory = [];
  submitted: boolean = false;
  constructor(
    // private location : Location,
    private newNaepService: NewNaepService,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog,

  ) { }

  ngOnInit(): void {

    this.newNaepService.getAllProductHasAdvisor().subscribe(data => {
      setTimeout(() => { this.products = data; }, 500);
    })

      this.newNaepService.getAdvisoryProduct().subscribe(data => {
        this.updateHistory = this.newNaepService.renderHistory(data.history)
        if(!CheckNullOrUndefinedOrEmpty(data.data)){
          data.data.forEach(element => {

            let value = new Value()
            value.id = element.product_id ;
            value.name = !CheckNullOrUndefinedOrEmpty(element.product) ? element.product.product_name: "";
            this.selectedProduct.push(value);

          });

        }

    })

  }

  renderHistory() {
    this.newNaepService.getAdvisoryProduct().subscribe(data => {
      this.updateHistory = this.newNaepService.renderHistory(data.history)
    });
  }

  saveAdvisoryProduct() {
    this.submitted = true;
    if( this.selectedProduct.length == 0 ){

      const dialogNotifi = this.dialog.open(CommonDialogComponent, {
        width: "600px",
        data: {
          message:
           'Please select Advisory Product',
          title:
            "NOTIFICATION",
          colorButton: false
        },
        });

    }else{

      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '700px',
        data: { message: 'Are you sure you want to update this Advisory Product?', type: "APPROVED" }
      });
      dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        let advisoryProduct= new NaepAdvisoryProduct();
        if(this.selectedProduct.length > 0){
          this.selectedProduct.forEach(e=>{
            advisoryProduct.products.push(e.id);
          })
        }
      this.newNaepService.createAdvisorProduct(advisoryProduct).subscribe(data=> {

           if(data.code === 200){
          const dialogNotifi = this.dialog.open(CommonDialogComponent, {
            width: "600px",
            data: {
              message:
               data.message,
              title:
                "NOTIFICATION",
              colorButton: false
            },
            });
            this.renderHistory();
          }else{
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
        })
      }else {
        dialogRef.close();
      }
      })
    }

  }
}

