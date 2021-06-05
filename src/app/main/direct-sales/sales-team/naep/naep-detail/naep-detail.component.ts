import { CheckNullOrUndefinedOrEmpty } from 'app/core/utils/common-function';
import { data } from 'jquery';
import { Component, OnInit } from '@angular/core';
import { Location, formatDate } from '@angular/common';
import { NAEPAdvisorDetail , NAEPRecruiter, NAEPDetailStatus, SalesHistory } from 'app/core/models/naep.model'
import { MatDialog } from '@angular/material/dialog';
import { DialogSelectDateNaepComponent } from 'app/main/_shared/dialog-select-date-naep/dialog-select-date-naep.component';
import { ActivatedRoute, Router } from '@angular/router';
import { NAEPService } from 'app/core/service/naep.service';
import { result } from 'lodash';
import { CommonDialogComponent } from 'app/main/_shared/common-dialog/common-dialog.component';
import * as _ from 'lodash';
import { ConfirmDialogComponent } from 'app/main/_shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-naep-detail',
  templateUrl: './naep-detail.component.html',
  styleUrls: ['./naep-detail.component.scss']
})
export class NaepDetailComponent implements OnInit {

  advisorDetail = new NAEPAdvisorDetail();
  recruiterDetail = new NAEPRecruiter();
  detailNAEP = new  NAEPDetailStatus();
  saleHistory : [];
  naepUuid: string;
  is_advisor : boolean;
  page: string;
  is_show_refund : boolean;
  balance : number
  isShowRefund : boolean ;
  purchaseDiscount : boolean ;
  adminRefund: boolean = false;
  history;
  is_need_payback_product : boolean = false;
  constructor(
    private location: Location,
    public dialog: MatDialog,
    private router : ActivatedRoute,
    private _naepService : NAEPService,
    private _router: Router
  ) { }

  ngOnInit(): void {
    this.router.queryParams.subscribe(params=>{
      this.naepUuid = params.uuid,
      this.page = params.page
    })
    this.getInitData()

  }

  getInitData()
  {
    this._naepService.getNAEPbyUuid(this.naepUuid).subscribe(data => {
      this.advisorDetail = data[0]
      this.recruiterDetail = data[1]
      this.detailNAEP = data[2];
      this.history = data[4]
      if ( data[2].is_deposite_package == true ) {
        this.detailNAEP.package_name =  "Deposit Product - " + [!CheckNullOrUndefinedOrEmpty(data[2].package_name) ?
                                        data[2].package_name : " " ];
      } else if (data[2].is_deposite_package == false) {
        this.purchaseDiscount = true;
        this.detailNAEP.package_name =  "Advisor Kit - " + [!CheckNullOrUndefinedOrEmpty(data[2].package_name) ?
        data[2].package_name : " " ];
      }

      this.adminRefund = (this.detailNAEP.balance < 0 ) ? true : false ;

      if (data[2].status == "IN PROCESS") {
        this.isShowRefund = false;
      } else if (data[2].status == "COMPLETED") {
        this.isShowRefund = true;
      }

      this.saleHistory = data[3].salesHistory
      this.is_advisor = !_.isEmpty(this.detailNAEP);
      // this.is_show_refund = (this.detailNAEP.is_deposite_package  && this.detailNAEP.balance < 0) ;
      this.balance = Math.abs(this.detailNAEP.balance )
      this.is_need_payback_product = !CheckNullOrUndefinedOrEmpty(this.detailNAEP.payback_product) 
    })

  }

  back(){
    if(this.page == 'rl'){
      this._router.navigate(["/direct-sales/sales-team/naep"], { state: { selectTab: 1 } });
    }else{
      this._router.navigate(["/direct-sales/sales-team/naep"], { state: { selectTab: 0 } });
    }
  }

  extendDate(){
    const dialogRef = this.dialog.open(DialogSelectDateNaepComponent, {
      width: "700px",
      height: 'auto',
      data: {
        message:
          'Please select time to extend NAEP date',
        title:
          "NOTIFICATION",
        colorButton: true,
        date: this.detailNAEP.dateEndNotFormat
      },
    });
    dialogRef.afterClosed().subscribe(result=>{
      if (result.state === true)
        {
          // console.log(result.date)
          this._naepService.updateDateNAEP(result.date , this.naepUuid).subscribe(data=>{
            if(data.code === 200){
              this.detailNAEP.end = formatDate(result.date,"dd/MM/yyyy","en-US");
              const dialogNotifi = this.dialog.open(CommonDialogComponent, {
                width: "500px",
                data: {
                  message:
                    'Extend NAEP date successfully.',
                  title:
                    "NOTIFICATION",
                  colorButton: false
                },
              });
              dialogNotifi.afterClosed().subscribe(data =>
              {
                this.getInitData()
              })
            }
          })
        } else
        {
            dialogRef.close();
        }
    })
  }
  markAsCandidateRefund(){
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '500px',
      data: { message: 'Do you wish to confirm this advisor was ?', type: "APPROVED" }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        return this._naepService.markAsRefund(this.detailNAEP.id).subscribe(data=>{
          if(data.code === 200)
          {
            const dialogNotifi = this.dialog.open(CommonDialogComponent, {
              width: "500px",
              data: {
                message:
                  'Mark refund successfully.',
                title:
                  "NOTIFICATION",
                colorButton: false
              },
            });
            dialogNotifi.afterClosed().subscribe(result=>{
               this.getInitData()
            })
          }else{
            const dialogNotifi = this.dialog.open(CommonDialogComponent, {
              width: "500px",
              data: {
                message:
                  'Mark refund error.' + data.data,
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
  markAsRefund(){

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '500px',
      data: { message: 'Do you wish to confirm refund to this advisor?', type: "APPROVED" }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        return this._naepService.markAsRefund(this.detailNAEP.id).subscribe(data=>{
          if(data.code === 200)
          {
            const dialogNotifi = this.dialog.open(CommonDialogComponent, {
              width: "500px",
              data: {
                message:
                  'Mark refund successfully.',
                title:
                  "NOTIFICATION",
                colorButton: false
              },
            });
            dialogNotifi.afterClosed().subscribe(result=>{
               this.getInitData()
            })
          }else{
            const dialogNotifi = this.dialog.open(CommonDialogComponent, {
              width: "500px",
              data: {
                message:
                  'Mark refund error.' + data.data,
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

  markAsPurchase(){
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '500px',
      data: { message: 'Do you wish to confirm this customer already get discount product?', type: "APPROVED" }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        return this._naepService.markAsPurchase(this.detailNAEP.id.toString()).subscribe(data=>{
          if(data.code === 200)
          {
            const dialogNotifi = this.dialog.open(CommonDialogComponent, {
              width: "500px",
              data: {
                message:
                  'Update reward successfully.',
                title:
                  "NOTIFICATION",
                colorButton: false
              },
            });
            dialogNotifi.afterClosed().subscribe(result=>{
               this.getInitData()
            })
          }else{
            const dialogNotifi = this.dialog.open(CommonDialogComponent, {
              width: "500px",
              data: {
                message:
                  'update reward error.' + data.message,
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

  markAsGetReward(){

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '500px',
      data: { message: 'Do you wish to confirm this customer already get reward?', type: "APPROVED" }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        return this._naepService.markAsReward(this.detailNAEP.id.toString()).subscribe(data=>{
          if(data.code === 200)
          {
            const dialogNotifi = this.dialog.open(CommonDialogComponent, {
              width: "500px",
              data: {
                message:
                  'Update reward successfully.',
                title:
                  "NOTIFICATION",
                colorButton: false
              },
            });
            dialogNotifi.afterClosed().subscribe(result=>{
               this.getInitData()
            })
          }else{
            const dialogNotifi = this.dialog.open(CommonDialogComponent, {
              width: "500px",
              data: {
                message:
                  'update reward error.' + data.message,
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

}
