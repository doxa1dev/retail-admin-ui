import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { PeriodConfigService } from 'app/core/service/period-configuration.service';
import { ProductService } from 'app/core/service/product.service';
import { CheckNullOrUndefined, CheckNullOrUndefinedOrEmpty } from 'app/core/utils/common-function';
import { CommonDialogComponent } from 'app/main/_shared/common-dialog/common-dialog.component';
import { ConfirmDialogComponent } from 'app/main/_shared/confirm-dialog/confirm-dialog.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { newsReleaseViewAPi } from 'app/core/service/backend-api';
import { formatDate } from '@angular/common';
import * as moment from "moment";

@Component({
  selector: 'app-create-period-config',
  templateUrl: './create-period-config.component.html',
  styleUrls: ['./create-period-config.component.scss']
})
export class CreatePeriodConfigComponent implements OnInit {

  constructor(
    private location : Location,
    public dialog: MatDialog,
    private router: Router,
    private periodConfigService: PeriodConfigService,
    private activatedRoute: ActivatedRoute,
    private _productService: ProductService,
    private formBuilder: FormBuilder,
  ) {
    this.formPeriodConfig = this.formBuilder.group({
      startTime: ['', [Validators.required]],
      endTime: ['', [Validators.required]]
    });
  }

  updateHistory = [];
  period 
  startTime;
  startTimeTemp;
  period_id;
  endTime;
  endTimeDisplay
  startTimeDisplay
  uuid: string;
  id: string;
  mode: string;
  submitted: boolean = false;
  typeName: string;
  formPeriodConfig: FormGroup;
  periodData = [];
  maxStartDate = new Date();
  minEndDate = new Date();
  maxEndDate 
  checkLastDate = new Date();
  consolidation
  disablePeriod: boolean = false;
  disableStartTime: boolean = false;
  disableEndTime: boolean = false;
  idNext
  periodNext;
  startTimeNext
  endTimeNext;
  positionNextIndex
  test
  checkExist: boolean = false
  isCheckFormat: boolean = false

  ngOnInit(): void {

    this.activatedRoute.queryParams.subscribe(params => {
      this.id = params.periodId;
      this.checkMode(this.id)
    });

    this.periodConfigService.getListPeriod().subscribe(data=>{
      this.periodData = data;
      if (!CheckNullOrUndefinedOrEmpty(this.periodData[this.periodData.length - 1].endTime)) {
        this.startTimeDisplay = new Date (this.periodData[this.periodData.length - 1].endTime)
        this.maxStartDate = this.startTimeDisplay
        this.minEndDate = this.startTimeDisplay
        this.disableStartTime = true
      }
      this.periodData.forEach(i => {
        if (i.id == this.id) {
          this.positionNextIndex = this.periodData.indexOf(i) + 1
        }
      })
      if(!CheckNullOrUndefinedOrEmpty(this.positionNextIndex)) {
        this.periodNext = this.periodData[this.positionNextIndex].period;
        this.endTimeNext = this.periodData[this.positionNextIndex].endTime;
        this.maxEndDate = new Date (this.endTimeNext)
        this.idNext = this.periodData[this.positionNextIndex].id;
      }
    })

    if(this.mode === 'UPDATE'){
      this.periodConfigService.getPeriodDetail(this.id).subscribe(data=>{
        this.startTimeDisplay = new Date(data.data.start_time),
        this.endTimeDisplay = new Date(data.data.end_time)
        this.period = data.data.period;
        this.period_id = data.data.id
        this.minEndDate = this.startTimeDisplay
        this.consolidation = data.data.consolidation
        this.updateHistory = this.periodConfigService.renderHistory(data.history);
        if (data.data.status == 'LOCK') {
          this.disablePeriod = true;
          this.disableEndTime = true;
        }
      })
    }

    // this._productService.getAllPaymentPromotionGifts().subscribe(data => {
    //   this.listGifts = data;
    // })

    
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

  createPeriod(){
    this.submitted = true;
    if(CheckNullOrUndefined(this.period)
    ){
      return ;
    }else{
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '700px',
        data: { message: 'Are you sure you want to create this Period configuration?', type: "APPROVED" }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result === true) {
          if((moment(this.period, 'DD/YYYY',true).isValid() == true || moment(this.period, 'D/YYYY',true).isValid() == true)) { 
            this.startTime = new Date(this.formPeriodConfig.value.startTime.getTime() + this.formPeriodConfig.value.startTime.getTimezoneOffset() * 60000);
            this.endTime = new Date(this.formPeriodConfig.value.endTime.getTime() + this.formPeriodConfig.value.endTime.getTimezoneOffset() * 60000);
            this.periodConfigService.createPeriod(this.period , this.startTime, this.endTime).subscribe(data=>{
              if(data.code === 200){
                const dialogNotifi = this.dialog.open(CommonDialogComponent, {
                  width: "600px",
                  data: {
                    message:
                      'Create Period Configuration Success.',
                    title:
                      "NOTIFICATION",
                    colorButton: false
                  },
                });
                dialogNotifi.afterClosed().subscribe(() => {
                  this.router.navigate(['direct-sales/hierarchy-ranking/period-config']);
                });
              }
              else if (data.code === 201) {
                const dialogNotifi = this.dialog.open(CommonDialogComponent, {
                  width: "600px",
                  data: {
                    message:
                      'Priod already exists.',
                    title:
                      "NOTIFICATION",
                    colorButton: true
                  },
                });
              }
              else if (data.code === 203) {
                const dialogNotifi = this.dialog.open(CommonDialogComponent, {
                  width: "600px",
                  data: {
                    message:
                      'Start time must be less than End time.',
                    title:
                      "NOTIFICATION",
                    colorButton: true
                  },
                });
              }
              else{
                const dialogNotifi = this.dialog.open(CommonDialogComponent, {
                  width: "600px",
                  data: {
                    message:
                      'Error When Create Period Configuration.',
                    title:
                      "NOTIFICATION",
                    colorButton: true
                  },
                });
              }
            })
          }
          else {
            const dialogNotifi = this.dialog.open(CommonDialogComponent, {
              width: "600px",
              data: {
                message:
                  'Format of period is required NN/YYYY.',
                title:
                  "NOTIFICATION",
                colorButton: true
              },
            });
          }
        }else {
          dialogRef.close();
        }
      })

    }
  }

  onSelectDate(event) {
    this.startTimeNext = event
  }

  onSelectStartDate(event) {

  }

  updatePeriod(){
    this.submitted = true;
    if(CheckNullOrUndefined(this.period)
    ){
      return ;
    }else{
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '700px',
        data: { message: 'Are you sure you want to update this Period configuration?', type: "APPROVED" }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result === true) {
          if((moment(this.period, 'DD/YYYY',true).isValid() == true || moment(this.period, 'D/YYYY',true).isValid() == true)) {
          this.startTime = new Date(this.formPeriodConfig.value.startTime.getTime() + this.formPeriodConfig.value.startTime.getTimezoneOffset() * 60000);
          this.endTime = new Date(this.formPeriodConfig.value.endTime.getTime() + this.formPeriodConfig.value.endTime.getTimezoneOffset() * 60000);
          if(!CheckNullOrUndefinedOrEmpty(this.startTimeNext)) {
            this.startTimeNext = new Date(this.startTimeNext.getTime() + this.startTimeNext.getTimezoneOffset() * 60000);
          }
          // this.endTimeNext = new Date(this.endTimeNext.getTime() + this.endTimeNext.getTimezoneOffset() * 60000);
            this.periodConfigService.updatePeriod(this.period , this.startTime, this.endTime, this.period_id ).subscribe(data=>{
              if(!CheckNullOrUndefinedOrEmpty(this.idNext)) { 
                this.periodConfigService.updatePeriod(this.periodNext, this.startTimeNext, this.endTimeNext,  this.idNext).subscribe(data=>{})
              }
              if(data.code === 200){
                const dialogNotifi = this.dialog.open(CommonDialogComponent, {
                  width: "600px",
                  data: {
                    message:
                      'Update Period configuration Success.',
                    title:
                      "NOTIFICATION",
                    colorButton: false
                  },
                });
                dialogNotifi.afterClosed().subscribe(() => {
                  this.router.navigate(['direct-sales/hierarchy-ranking/period-config']);
                });
              }
              else if (data.code === 203) {
                const dialogNotifi = this.dialog.open(CommonDialogComponent, {
                  width: "600px",
                  data: {
                    message:
                      'Start time must be less than End time.',
                    title:
                      "NOTIFICATION",
                    colorButton: true
                  },
                });
              }
              else{
                const dialogNotifi = this.dialog.open(CommonDialogComponent, {
                  width: "600px",
                  data: {
                    message:
                      'Error When Update Period Configuration.',
                    title:
                      "NOTIFICATION",
                    colorButton: true
                  },
                });
              }
            })
          }
          else {
            const dialogNotifi = this.dialog.open(CommonDialogComponent, {
              width: "600px",
              data: {
                message:
                'Format of period is required NN/YYYY.',
                title:
                  "NOTIFICATION",
                colorButton: true
              },
            });
          }
        }else {
          dialogRef.close();
        }
      })

    }
  }

  consolidationPeriod() {
    this.submitted = true;
    if(CheckNullOrUndefined(this.period_id)
    ){
      return ;
    }else{
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '700px',
        data: { message: 'Are you sure you want to consolidate this Period configuration?', type: "APPROVED" }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result === true) {
          this.periodConfigService.consolidatePeriod(this.period_id).subscribe(data=>{
            if(data.code === 200){
              const dialogNotifi = this.dialog.open(CommonDialogComponent, {
                width: "600px",
                data: {
                  message:
                    'Consolidate Period configuration Success.',
                  title:
                    "NOTIFICATION",
                  colorButton: false
                },
              });
              dialogNotifi.afterClosed().subscribe(() => {
                this.router.navigate(['direct-sales/hierarchy-ranking/period-config']);
              });
            }else{
              const dialogNotifi = this.dialog.open(CommonDialogComponent, {
                width: "600px",
                data: {
                  message:
                    'Error When Consolidate Period Configuration.',
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


