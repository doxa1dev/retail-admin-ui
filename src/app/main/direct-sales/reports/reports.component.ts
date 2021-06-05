import { reportNAEPRecruitment } from './../../../core/service/backend-api';
import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { GridSizeChangedEvent, Color } from "ag-grid-community";
import { ReportsService } from 'app/core/service/reports.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { formatCurrency, formatDate } from '@angular/common';
import { ConvertService, Report } from 'app/core/service/convert.service';
import { isNullOrUndefined } from 'util';
import { getLocaleDate  } from 'app/core/utils/date.util';
import * as jwt_decode from 'jwt-decode';
import { CheckNullOrUndefinedOrEmpty } from 'app/core/utils/common-function';
import { CustomerInformationService } from 'app/core/service/customer-information.service';

@Component({
  selector: "app-reports",
  templateUrl: "./reports.component.html",
  styleUrls: ["./reports.component.scss"],
})
export class ReportsComponent implements OnInit {

  //select
  listMultiSelect = [];
  listBranch = [];
  listTeam = [];
  listReports = [];
  listProduct = [];
  listSegment = [];
  listSalesPeriod = []

  //get value select
  typeReportValue: any;
  branchValue: any;
  teamValue: any;
  categoryValue: any;
  reportsValue: any;
  segmentValue: any;
  salesPeriodValue: any;

  reportsForm: FormGroup;
  maxDateFrom: Date = new Date();
  minDateStart: Date = new Date();
  minDateEnd: Date  = new Date();
  isShow: boolean = false;
  startDay: string;
  endDay: Date = new Date();
  DateEndFormat: string;
  endDate: string;
  branchName: string;
  teamName: string;
  totalQuantity: number;
  totalPrice: number;
  branch = [];
  listTeamSelect = [];
  listBranchSelect = [];
  isShowNAEPRecruitment: boolean = false;
  isShowNAEPSuccess: boolean = false;
  isDisabled: boolean = true;

  //Select
  selectedBranch: any = [];
  selectedTeam: any = [];
  selectedProduct: any = [];

  buttonName:string = "Export";
  active: boolean = false;

  decoded: any;
  entityId: number;
  constructor( private reportsService: ReportsService,
    private formBuilder: FormBuilder,
    private customerInformationService : CustomerInformationService,
    private convertService: ConvertService) {

    // this.listTeam = [
    //   {
    //     name: 'All',
    //     value: 'all'
    //   }
    // ]

    this.listProduct = []

    this.listSegment = [
      {
        name: 'All',
        value: 'all'
      }
    ]

    this.listMultiSelect = [
      {
        name: 'Total sales',
        value: 'total_sales'
      },
      {
        name: 'Total recruitments',
        value: 'naep_recruitment'
      },
      {
        name: 'Stock Sold Summary',
        value: 'stock_sold'
      },
      {
        name: 'Daily Collection Report',
        value: 'daily_collection'
      },
      {
        name: 'NAEP First sales',
        value: 'first_sales'
      },
      {
        name: 'NAEP Success',
        value: 'naep_success'
      },
      {
        name: 'Customer Update History',
        value: 'customer_update_history'
      }
    ]

    this.listSalesPeriod = [
      {
        name: 'All',
        value: 0
      },
      {
        name: 'Under 45 days',
        value: 45
      },
      {
        name: 'Under 90 days',
        value: 90
      }
    ]

  }

  ngOnInit(): void {
    this.reportsForm = this.formBuilder.group({
      type: ['', Validators.required],
      startDay: ['', Validators.required],
      endDay: ['', Validators.required],
      branch: ['', Validators.required],
      team: [{value: '', disabled: true}],
      product: [{value: '', disabled: false}, Validators.required],
      period: [{value: '', disabled: true}, Validators.required]
    })

    let token = localStorage.getItem('token');
    if (!CheckNullOrUndefinedOrEmpty(token)){
        this.decoded = jwt_decode(token);
        if(!CheckNullOrUndefinedOrEmpty(this.decoded)){
          this.entityId = this.decoded.entity_id
        }
    }

    this.reportsService.getBranchManager().subscribe(
      data => {
        this.listBranch = data
      }
    )

    this.getTeamLeaderOfBranch(this.branch);

    this.reportsService.getListProduct().subscribe(data=>{
      this.listProduct = data;
    })
  }

  getTeamLeaderOfBranch(branchName) {
    branchName = this.changInArr(branchName)
    this.reportsService.getTeamLeaderOfBranch(branchName).subscribe(data=>{
      this.listTeam = data;
    })
  }

  SelectedTypeReports(event) {
    this.typeReportValue = event.value.value;
    this.isShow = false;

    if (event.value.value === "naep_recruitment") {
      this.reportsForm.get('product').disable();
      this.reportsForm.get('period').disable();
      this.reportsForm.get('branch').enable();
      this.reportsForm.get('team').enable();
      this.isShowNAEPRecruitment = true;
      this.isShowNAEPSuccess = false;
    } else if (event.value.value === "naep_success") {
      this.reportsForm.get('product').disable();
      this.reportsForm.get('period').enable();
      this.reportsForm.get('branch').enable();
      this.reportsForm.get('team').enable();
      this.isShowNAEPRecruitment = true;
      this.isShowNAEPSuccess = true;
    } else if (event.value.value === "total_sales") {
      this.reportsForm.get('product').enable();
      this.reportsForm.get('period').disable();
      this.reportsForm.get('branch').enable();
      this.reportsForm.get('team').enable();
      this.isShowNAEPRecruitment = false;
      this.isShowNAEPSuccess = false;
    } else if (event.value.value === "first_sales") {
      this.reportsForm.get('product').enable();
      this.reportsForm.get('period').disable();
      this.reportsForm.get('branch').enable();
      this.reportsForm.get('team').enable();
      this.isShowNAEPRecruitment = false;
      this.isShowNAEPSuccess = false;
    }else if (event.value.value === "stock_sold" || event.value.value === "daily_collection" || event.value.value === "customer_update_history") {
      this.reportsForm.get('product').disable();
      this.reportsForm.get('period').disable();
      this.reportsForm.get('branch').disable();
      this.reportsForm.get('team').disable();
      this.isShowNAEPRecruitment = true;
      this.isShowNAEPSuccess = false;
    }
  }

  onChangeFrom(event) {
    // this.startDay = getLocaleDate(event);
    this.startDay = formatDate(event, "yyyy-MM-dd", "en-US");
    this.minDateEnd = event;
  }

  onChangeTo(event) {
    this.endDay.setDate(event.getDate()+1)
    this.endDate = formatDate(this.endDay, "yyyy-MM-dd", "en-US");
    this.DateEndFormat = formatDate(event, "yyyy-MM-dd", "en-US");
    // this.DateEndFormat = getLocaleDate(event)
  }

  SelectedBranch(event) {
    this.reportsForm.get('team').setValue('');
    this.teamValue = '';
    this.selectedTeam = [];

    if (event.value.length != 0) {
      this.reportsForm.get('team').enable();
      // this.isDisabled = false;
    } else {
      this.reportsForm.get('team').disable();
      // this.isDisabled = true;
      this.reportsForm.get('team').setValue('');
      this.teamValue = '';
      this.selectedTeam = [];
    }
    // this.branchValue = event.value.customerId;
    let listBranchName = [];
    event.value.forEach(element => {
      listBranchName.push(element.name)
    });
    this.branchName = listBranchName.toString();

    //get data team by branch
    let listIdBranchSelect = [];
    event.value.forEach(element => {
      listIdBranchSelect.push(element.id)
    });
    this.getTeamLeaderOfBranch(listIdBranchSelect);

    //get list data id branch
    this.selectedBranch = [];
    event.value.forEach(element => {
      this.selectedBranch.push(element.id)
    });

    this.branchValue = this.changInArr(this.selectedBranch);
  }

  SelectedTeam(event) {
    // this.teamValue = event.value.value;

    //get list data id team
    this.selectedTeam = [];
    event.value.forEach(element => {
      this.selectedTeam.push(element.id)
    });

    this.teamValue = this.changInArr(this.selectedTeam);

    let listTeamName = [];
    event.value.forEach(element => {
      listTeamName.push(element.name)
    });
    this.teamName = listTeamName.toString();
  }

  SelectedSalesPeriod(event) {
    this.salesPeriodValue = event.value.value;
  }

  SelectedProduct(event) {
    // this.categoryValue = event.value.value;

    //get list data id product
    this.selectedProduct = [];
    event.value.forEach(element => {
      this.selectedProduct.push(element.id)
    });

    this.categoryValue = this.changInArr(this.selectedProduct);
  }

  SelectedSegment(event) {
    this.segmentValue = event.value.value;
  }
  totalAmountDaily: string = '0';
  TTonline: string = '0';
  mpgsCc: string = '0';
  ipp: string = '0';
  payAtOffice: string = '0';
  ipay88 : string = '0';
  exports() {
    this.isShow = true;
    if (this.reportsForm.invalid)
    {
      return;
    }

    this.active = true;
    this.buttonName = "Processing...";
    if(this.typeReportValue ==='stock_sold'){
      this.reportsService.getDateReportStock(this.startDay, this.endDate).subscribe(data=>{
        if(data.code === 200){
          this.active = false;
          this.buttonName = "Export";
          let dataGet;
          dataGet = this.reportsService.renderDataStockReport(data.data);
          this.totalQuantity = data.sub_total;
          this.convertService.downloadFile(dataGet, 'Stock Sold Summary from  ' + this.startDay + ' to ' + this.DateEndFormat , this.totalQuantity, this.totalPrice, this.typeReportValue)
        }
      })
    }else if(this.typeReportValue ==='customer_update_history'){
      this.customerInformationService.getDataReportCustomerHistory(this.startDay, this.endDate).subscribe(data=>{
        if(data.code === 200){
          this.active = false;
          this.buttonName = "Export";
          // console.log(data)
          let dataGet;
          dataGet = this.customerInformationService.renderDataReport(data.data);
          console.log(dataGet)
          this.convertService.downloadFile(dataGet, 'Customer update history from  ' + this.startDay + ' to ' + this.DateEndFormat , this.totalQuantity, this.totalPrice, this.typeReportValue)
        }
      })
    }
    else if(this.typeReportValue === 'daily_collection'){
      this.reportsService.getDataDailyCollectionReport(this.startDay, this.endDate).subscribe(data=>{
        if(data.code === 200){
          this.active = false;
          this.buttonName = "Export";
          let dataGet;
          dataGet = this.reportsService.renderDailyCollectionReport(data.data);
          let result = dataGet.fileCSV
          // '"' + formatCurrency(dataGet.totalIpp, "en-US",'', "code", "0.2-2") + '"';
          this.totalAmountDaily = dataGet.totalAmount;
          this.payAtOffice = dataGet.totalPayAtOffice;
          this.ipay88 = dataGet.totalIpay88;
          this.mpgsCc = dataGet.totalMPGS;
          this.TTonline = dataGet.totalTT;
          this.ipp = dataGet.totalIpp;
          this.convertService.downloadFileCSVDailyReport(result, 'Daily Collection Report from  ' + this.startDay + ' to ' + this.DateEndFormat , this.TTonline , this.mpgsCc , this.ipp , this.payAtOffice, this.totalAmountDaily , this.ipay88 , this.entityId)
        }
      })
    }
    else{
      this.reportsService.reportData(this.typeReportValue, this.startDay, this.endDate,
          this.branchValue, this.teamValue, this.categoryValue, this.salesPeriodValue).subscribe(
        data => {

          if (data.code === 200) {

            this.active = false;
            this.buttonName = "Export";

            let dataGet;
            if (this.typeReportValue === 'total_sales') {
              dataGet = this.reportsService.renderTotalSalesReports(data);
            }
            else {
              dataGet = this.reportsService.renderNAEPReports(data);
            }

            let result = dataGet.fileCSV
            this.totalQuantity = dataGet.sumQuantity;
            this.totalPrice = dataGet.sumTotal;

            if (this.typeReportValue === 'total_sales') {
              // this.convertService.downloadFile(result, 'Sales of specific products at ' + this.branchName + ' branch from ' + this.startDay + ' to ' + this.DateEndFormat , this.totalQuantity, this.totalPrice, this.typeReportValue)
              this.convertService.downloadFile(result, 'Sales of specific products from ' + this.startDay + ' to ' + this.DateEndFormat , this.totalQuantity, this.totalPrice, this.typeReportValue)
            } else if (this.typeReportValue === 'naep_recruitment'){
              // this.convertService.downloadFile(result, 'NAEP recruitment at ' + this.branchName + ' branch from ' + this.startDay + ' to ' + this.DateEndFormat , this.totalQuantity, this.totalPrice, this.typeReportValue)
              this.convertService.downloadFile(result, 'NAEP recruitment from ' + this.startDay + ' to ' + this.DateEndFormat , this.totalQuantity, this.totalPrice, this.typeReportValue)
            } else if (this.typeReportValue === 'first_sales'){
              // this.convertService.downloadFile(result, 'First sales of specific products at ' + this.teamName + " of " + this.branchName + ' branch from ' + this.startDay + ' to ' + this.DateEndFormat , this.totalQuantity, this.totalPrice, this.typeReportValue)
              this.convertService.downloadFile(result, 'First sales of specific products from ' + this.startDay + ' to ' + this.DateEndFormat , this.totalQuantity, this.totalPrice, this.typeReportValue)
            } else if (this.typeReportValue === 'naep_success'){
              // this.convertService.downloadFile(result, '45/90 days NAEP winners at ' + this.teamName + " of " + this.branchName + ' branch from ' + this.startDay + ' to ' + this.DateEndFormat , this.totalQuantity, this.totalPrice, this.typeReportValue)
              this.convertService.downloadFile(result, '45/90 days NAEP winners from ' + this.startDay + ' to ' + this.DateEndFormat , this.totalQuantity, this.totalPrice, this.typeReportValue)
            }
          }
        }
      )

    }
  }

  changInArr(arr){
    if (arr.length > 0) {
    let merge = '('
    for (let index = 0; index < arr.length; index++) {
        if(index === 0){
            merge = merge +  arr[0];
        } else {
            merge = merge + ',' + arr[index]
        }

    }
    return merge + ')'
  } else {
    return;
  }
}

}
