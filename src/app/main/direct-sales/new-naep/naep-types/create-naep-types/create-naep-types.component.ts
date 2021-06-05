import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NewNaepService } from 'app/core/service/new-naep.service';
import { ProductService } from 'app/core/service/product.service';
import { CheckNullOrUndefined, CheckNullOrUndefinedOrEmpty } from 'app/core/utils/common-function';
import { CommonDialogComponent } from 'app/main/_shared/common-dialog/common-dialog.component';
import { ConfirmDialogComponent } from 'app/main/_shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-create-naep-types',
  templateUrl: './create-naep-types.component.html',
  styleUrls: ['./create-naep-types.component.scss']
})
export class CreateNaepTypesComponent implements OnInit {

  constructor(
    private location : Location,
    public dialog: MatDialog,
    private router: Router,
    private newNaepService: NewNaepService,
    private activatedRoute: ActivatedRoute,
    private _productService: ProductService
  ) { }

  updateHistory = [];
  title : string;
  periodLength : number = 1;
  uuid: string;
  mode: string;
  submitted: boolean = false;
  typeName: string;
  listGifts: ItemGift[];
  valueGift: ItemGift;

  ngOnInit(): void {

    this.activatedRoute.queryParams.subscribe(params => {
      this.uuid = params.uuid;
      this.checkMode(this.uuid)
    });

    this._productService.getAllPaymentPromotionGifts().subscribe(data => {
      this.listGifts = data;
    })

    if(this.mode === 'UPDATE'){
      this.newNaepService.getNaepTypeDetail(this.uuid).subscribe(data=>{
        this.title = data.name;
        this.typeName = data.name;
        this.periodLength = data.period_length;
        this.updateHistory = this.newNaepService.renderHistory(data.history);

        if (!CheckNullOrUndefinedOrEmpty(data.gift_product_id)) {
          this.valueGift = this.listGifts.filter(gift => gift.value === data.gift_product_id)[0];
        }
      })
    }
  }

  back(){
    this.location.back();
  }

  checkMode(data){
    if(CheckNullOrUndefined(data)){
      this.mode = "CREATE";
    }else{
      this.mode = "UPDATE"
    }
  }

  createNAEP(){
    this.submitted = true;
    if((CheckNullOrUndefined(this.title) || this.title.length == 0) ||
      (CheckNullOrUndefined(this.periodLength))
    ){
      return ;
    }else{
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '700px',
        data: { message: 'Are you sure you want to create this NAEP type?', type: "APPROVED" }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result === true) {
          this.newNaepService.createNaepType(this.title , this.periodLength, this.valueGift === undefined ? undefined : this.valueGift.value).subscribe(data=>{
            if(data.code === 200){
              const dialogNotifi = this.dialog.open(CommonDialogComponent, {
                width: "600px",
                data: {
                  message:
                    'Create NAEP Type Success.',
                  title:
                    "NOTIFICATION",
                  colorButton: false
                },
              });
              dialogNotifi.afterClosed().subscribe(() => {
                this.router.navigate(['direct-sales/configuration/naep-types']);
              });
            }else{
              const dialogNotifi = this.dialog.open(CommonDialogComponent, {
                width: "600px",
                data: {
                  message:
                    'Error When Create NAEP Type.',
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

  updateNAEP(){
    this.submitted = true;
    if((CheckNullOrUndefined(this.title) || this.title.length == 0) ||
      (CheckNullOrUndefined(this.periodLength))
    ){
      return ;
    }else{
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '700px',
        data: { message: 'Are you sure you want to update this NAEP type?', type: "APPROVED" }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result === true) {
          this.newNaepService.updateNaepType(this.title , this.periodLength, this.uuid, this.valueGift === undefined ? undefined : this.valueGift.value).subscribe(data=>{
            if(data.code === 200){
              const dialogNotifi = this.dialog.open(CommonDialogComponent, {
                width: "600px",
                data: {
                  message:
                    'Update NAEP Type Success.',
                  title:
                    "NOTIFICATION",
                  colorButton: false
                },
              });
              dialogNotifi.afterClosed().subscribe(() => {
                this.router.navigate(['direct-sales/configuration/naep-types']);
              });
            }else{
              const dialogNotifi = this.dialog.open(CommonDialogComponent, {
                width: "600px",
                data: {
                  message:
                    'Error When Update NAEP Type.',
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

  deleteNAEP(){
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '700px',
      data: { message: 'Are you sure you want to delete this NAEP type?', type: "REJECTED" }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.newNaepService.deleteNaepType(this.uuid).subscribe(data=>{
          if (data.code === 200) {
            const dialogNotifi = this.dialog.open(CommonDialogComponent, {
              width: "600px",
              data: {
                message:
                  'Delete NAEP Type Success.',
                title:
                  "NOTIFICATION",
                colorButton: false
              },
            });
            dialogNotifi.afterClosed().subscribe(() => {
              this.router.navigate(['direct-sales/configuration/naep-types']);
            });
          }else{
            const dialogNotifi = this.dialog.open(CommonDialogComponent, {
              width: "600px",
              data: {
                message:
                  'Error When Delete NAEP Type.',
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

  selectGift(event) {
    this.valueGift = event.value;
  }
}

export class ItemGift {
  value: number;
  label: string;
}
