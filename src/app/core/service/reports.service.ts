import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { HttpClient, HttpParams } from "@angular/common/http";
import {  getBranchManager, getDataReport , getProductReportApi ,
          getTeamLeaderOfBranchApi, reportNAEPRecruitment, reportFirstSalesRecruitment,
          reportNAEPReport, reportStock, reportDailyCollection
  } from './backend-api';
import { Observable, throwError } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import { isNullOrUndefined } from 'util';
import { DailyCollectionReport, Report, ReportStock } from './convert.service';
import { formatCurrency, formatDate } from '@angular/common';
import * as moment from "moment";
import { CheckNullOrUndefinedOrEmpty } from '../utils/common-function';


@Injectable({
  providedIn: "root",
})
export class ReportsService {
  constructor(
    private api: ApiService,
    private http: HttpClient) {}

    getBranchManager(): Observable<any> {
      return this.api.get(getBranchManager).pipe(
        map( data => {

          if(data.code === 200){
            let result = [];
            result = this.renderTypeMultiSelectBranch(data.data)
            return result
          }
        }), catchError(value => throwError(value))
      )
    }

    getListProduct(): Observable<any>{
      return this.api.get(getProductReportApi).pipe(
        map(data=>{
          if(data.code === 200){
            let result = [];
            result = this.renderTypeMultiSelectProduct(data.data)
            return result;
          }
        }), catchError(value => throwError(value))
      )
    }

    getTeamLeaderOfBranch(branch): Observable<any>{
      let param = new HttpParams();
      if(!isNullOrUndefined(branch)){
        param = param.append('branch', branch);
      }
      if(this.api.isEnable()){
        return this.http.get<any>(getTeamLeaderOfBranchApi, { headers: this.api.headers, params: param }).pipe(
          map(data=>{

            if(data.code === 200){
              let result = []
              result = this.renderTypeMultiSelectTeamLeader(data.data)
              return result
            }
          }), catchError(value => throwError(value))
        )
      }
    }

    getDataReport(formReport) {
      return this.api.post(getDataReport, formReport);
    }

    reportData(type, start, end, branch, team, product, period): Observable<any>{
      let param = new HttpParams();
      if(!CheckNullOrUndefinedOrEmpty(start)){
        param = param.append('start', start);
      }
      if(!CheckNullOrUndefinedOrEmpty(end)){
        param = param.append('end', end);
      }
      if(!CheckNullOrUndefinedOrEmpty(branch)){
        param = param.append('branch', branch);
      }
      if(!CheckNullOrUndefinedOrEmpty(team)){
        param = param.append('team', team);
      }
      if(!CheckNullOrUndefinedOrEmpty(product)){
        param = param.append('category', product);
      }

      if(!CheckNullOrUndefinedOrEmpty(period)){
        if(period !== 0){
          param = param.append('day', period);
        }
      }

      let url: string
      if(!CheckNullOrUndefinedOrEmpty(type)){
        if (type === 'total_sales') {
          url = getDataReport
        } else if (type === 'naep_recruitment'){
          url = reportNAEPRecruitment
        } else if (type === 'first_sales'){
          url = reportFirstSalesRecruitment
        } else if (type === 'naep_success'){
          url = reportNAEPReport
        }
      }

      if(this.api.isEnable()){
        return this.http.get<any>(url, { headers: this.api.headers, params: param }).pipe(
          map( data => {
            return data;
          }), catchError(value => throwError(value))
        )
      }
    }

    renderTotalSalesReports(data) {

      let fileCSV = [];
      let sumTotal: number = 0;
      let sumQuantity: number = 0;

      if (data.code === 200 && !CheckNullOrUndefinedOrEmpty(data.data)) {
        data.data.forEach(element => {

          element.orderItems.forEach(e => {
            let report = new Report();
            report.quantity = e.quantity;
            report.product ='"' + e.product_name + '"';
            report.shippingLocation = '"' + element.shippingLocation + '"';
            report.orderID = element.orderIdTmm;
            report.customerFirstName = '"' + element.customerFirstName + '"';
            report.customerLastName = '"' + element.customerLastName + '"';
            report.phoneNumber = element.phoneNumber;
            report.email = element.email;
            report.customerID =  CheckNullOrUndefinedOrEmpty(element.customerID) ? " " :'="'+ element.customerID+ '"';
            report.advisorName = CheckNullOrUndefinedOrEmpty(element.advisorName) ? " " :('"' + element.advisorName + '"');
            report.advisorID = CheckNullOrUndefinedOrEmpty(element.advisorID) ? " " : '="' + element.advisorID + '"';
            report.teamManagerName = '"' + element.teamManagerName + '"';
            report.teamManagerID = '="' + element.teamManagerID + '"';
            report.branchName = '"' + element.branchName + '"';
            report.orderStatus = element.orderStatus;
            report.totalAmount = element.totalAmount;
            report.startDay =  moment(element.startDay).format('MM/DD/YYYY')
            report.lastUpdate = moment(element.lastUpdate).format('MM/DD/YYYY')
            report.toVerifyComment =  CheckNullOrUndefinedOrEmpty(element.toVerify) ? "Skipped To verify" : element.toVerify ;

         //   console.log(report.toVerifyComment);
            if (e.is_naep_discount) {
              report.salesType = 'NAEP Register';
            } else {
              report.salesType = 'Product Sales';
            }

            sumTotal += Number(report.totalAmount);
            sumQuantity += Number(report.quantity);
            fileCSV.push(report)
          })
        });
        return {fileCSV, sumTotal, sumQuantity};
      } else {
        return {fileCSV, sumTotal, sumQuantity}
      }
    }

    renderNAEPReports(data) {
      let fileCSV = [];
      let sumTotal: number = 0;
      let sumQuantity: number = 0;
      if (data.code === 200 && !CheckNullOrUndefinedOrEmpty(data.data)) {
        data.data.forEach(element => {
          let report = new Report();

          //Advisor
          if (!CheckNullOrUndefinedOrEmpty(element.customer)) {
            report.advisorID = '="' + element.customer.advisor_id_number + '"';
            report.advisorName  = '"' + element.customer.firt_name + '"'


            // if (!CheckNullOrUndefinedOrEmpty(element.customer.preferred_name)){
            //   report.advisorName  = '"' +  element.customer.preferred_name + '"';
            // }
            // else if (!CheckNullOrUndefinedOrEmpty(element.customer.firt_name && element.customer.last_name)){
            //   report.advisorName  = '"' +  element.customer.firt_name + " " + element.customer.last_name + '"';
            // }
            // else if (CheckNullOrUndefinedOrEmpty(element.customer.firt_name)) {
            //     report.advisorName  = '"' + element.customer.last_name +'"';
            // }
            // else if (CheckNullOrUndefinedOrEmpty(element.customer.last_name)){
            //     report.advisorName  = '"' + element.customer.firt_name + '"'
            // }
            // else {
            //     report.advisorName  = " ";
            // }

            report.email = element.customer.email;
            report.mobilePhone = "(+" + element.customer.phone_dial_code + ") " + element.customer.phone_number;

            if (!CheckNullOrUndefinedOrEmpty(element.customer.address)) {
              report.addressLine1 = '"' + element.customer.address.address_line1 + '"';
              report.addressLine2 = '"' + element.customer.address.address_line2 + '"';
              report.addressLine3 = '"' + element.customer.address.address_line3 + '"';
            } else {
              report.addressLine1 = ""
              report.addressLine2 = ""
              report.addressLine3 = ""
            }

            report.bankCode = element.customer.bank_code;
            report.bankAccountNumber = Number(element.customer.bank_account);
            report.bankHolder = '"' + element.customer.bank_holder + '"';
            // report.bankHolderIC = element.customer.bank_holder_ic;
          }

          if (!CheckNullOrUndefinedOrEmpty(element.naepSalesCustomerProcess) ) {
            if (!CheckNullOrUndefinedOrEmpty(element.naepSalesCustomerProcess.recruitmentSalesHistory)) {
              report.firstSalesOn = formatDate(element.naepSalesCustomerProcess.recruitmentSalesHistory[0].created_at, 'yyyy/MM/dd', "en-US");
              let firstSalesOn = new Date(element.naepSalesCustomerProcess.recruitmentSalesHistory[0].created_at);
              let dateJoin = new Date(element.naepSalesCustomerProcess.start_time);
              report.totalDays = firstSalesOn.getDate() - dateJoin.getDate();

              report.product = '"' + element.naepSalesCustomerProcess.recruitmentSalesHistory[0].product.product_name + '"'
            }

            report.dateJoin = formatDate(element.naepSalesCustomerProcess.start_time, 'yyyy/MM/dd', "en-US");
          }

          //Recruiter
          if (!CheckNullOrUndefinedOrEmpty(element.recruiterCustomer)) {
            report.recruiterId = '="' + element.recruiterCustomer.advisor_id_number + '"';
            report.recruiterName  = '"' + element.recruiterCustomer.firt_name + '"';
            // if (!CheckNullOrUndefinedOrEmpty(element.recruiterCustomer.preferred_name)){
            //   report.recruiterName  = '"' + element.recruiterCustomer.preferred_name + '"';
            // }
            // else if (!CheckNullOrUndefinedOrEmpty(element.recruiterCustomer.firt_name && element.recruiterCustomer.last_name)){
            //   report.recruiterName  = '"' + element.recruiterCustomer.firt_name + " " + element.recruiterCustomer.last_name + '"';
            // }
            // else if (CheckNullOrUndefinedOrEmpty(element.recruiterCustomer.firt_name)) {
            //     report.recruiterName  = '"' + element.recruiterCustomer.last_name + '"'
            // }
            // else if (CheckNullOrUndefinedOrEmpty(element.recruiterCustomer.last_name)){
            //     report.recruiterName  = '"' + element.recruiterCustomer.firt_name + '"';
            // }
            // else {
            //     report.recruiterName  = " ";
            // }
          } else {
            report.recruiterId = '';
            report.recruiterName = '';
          }

          //Team Manager
          if (!CheckNullOrUndefinedOrEmpty(element.customer.teamLeaderCustomer)) {
            report.teamManagerID = '="' + element.customer.teamLeaderCustomer.advisor_id_number + '"';
            report.teamManagerName  = '"' + element.customer.teamLeaderCustomer.firt_name + '"'
            // if (!CheckNullOrUndefinedOrEmpty(element.customer.teamLeaderCustomer.preferred_name)){
            //   report.teamManagerName  = '"' + element.customer.teamLeaderCustomer.preferred_name + '"';
            // }
            // else if (!CheckNullOrUndefinedOrEmpty(element.customer.teamLeaderCustomer.firt_name && element.customer.teamLeaderCustomer.last_name)){
            //   report.teamManagerName  = '"' + element.customer.teamLeaderCustomer.firt_name + " " + element.customer.teamLeaderCustomer.last_name + '"';
            // }
            // else if (CheckNullOrUndefinedOrEmpty(element.customer.teamLeaderCustomer.firt_name)) {
            //     report.teamManagerName  = '"' + element.customer.teamLeaderCustomer.last_name + '"'
            // }
            // else if (CheckNullOrUndefinedOrEmpty(element.customer.teamLeaderCustomer.last_name)){
            //     report.teamManagerName  = '"' + element.customer.teamLeaderCustomer.firt_name + '"'
            // }
            // else {
            //     report.teamManagerName  = " ";
            // }
          }else {
            report.teamManagerName = '';
            report.teamManagerID = '';
          }

          //Branch
          if (!CheckNullOrUndefinedOrEmpty(element.customer.manager_of_Customer)) {
            report.branchId = '="' + element.customer.manager_of_Customer.advisor_id_number + '"';
            report.branchName  = '"' + element.customer.manager_of_Customer.firt_name + '"'

            // report.teamManagerName  = '"' + element.customer.teamLeaderCustomer.firt_name + '"'
            // if (!CheckNullOrUndefinedOrEmpty(element.customer.manager_of_Customer.preferred_name)){
            //   report.branchName  = '"' + element.customer.manager_of_Customer.preferred_name + '"';
            // }
            // else if (!CheckNullOrUndefinedOrEmpty(element.customer.manager_of_Customer.firt_name && element.customer.manager_of_Customer.last_name)){
            //   report.branchName  = '"' + element.customer.manager_of_Customer.firt_name + " " + element.customer.manager_of_Customer.last_name + '"';
            // }
            // else if (CheckNullOrUndefinedOrEmpty(element.customer.manager_of_Customer.firt_name)) {
            //     report.branchName  = '"' + element.customer.manager_of_Customer.last_name + '"';
            // }
            // else if (CheckNullOrUndefinedOrEmpty(element.customer.manager_of_Customer.last_name)){
            //     report.branchName  = '"' + element.customer.manager_of_Customer.firt_name + '"';
            // }
            // else {
            //     report.branchName  = " ";
            // }
          }
          else {
            report.branchId = '';
            report.branchName = '';
          }

          fileCSV.push(report)
        });

      }
      return {fileCSV, sumTotal, sumQuantity};
    }

    renderTypeMultiSelectTeamLeader(data) {
      let arrTeamLeader = []
      // arrTeamLeader.push(valueAll)
      if(!CheckNullOrUndefinedOrEmpty(data)){
        data.forEach(element => {
          let value = new Value()
          let typeMultiSelect = new TypeMultiSelectTeamLeader()
          // if(!isNullOrUndefined(element.customer_id)){
          //   value.id = element.customer_id.id
          //   if(!isNullOrUndefined(element.customer_id.preferred_name)){
          //     typeMultiSelect.label = element.customer_id.preferred_name
          //     value.name =  element.customer_id.preferred_name
          //   }else{
          //     typeMultiSelect.label = element.customer_id.firt_name
          //     value.name =  element.customer_id.firt_name
          //   }
          // }
          if(!CheckNullOrUndefinedOrEmpty(element.customer_id)){
            value.id = element.customer_id.id
            if(!CheckNullOrUndefinedOrEmpty(element.customer_id.firt_name) && !CheckNullOrUndefinedOrEmpty(element.customer_id.last_name)) {
              typeMultiSelect.label = element.customer_id.firt_name + ' ' + element.customer_id.last_name;
              value.name = element.customer_id.firt_name + ' ' + element.customer_id.last_name;
            }
            else {
              typeMultiSelect.label = element.customer_id.firt_name
              value.name = element.customer_id.firt_name
            }
          }

          typeMultiSelect.value = value
          arrTeamLeader.push(typeMultiSelect)
        })
      }
      return arrTeamLeader
    }

    renderTypeMultiSelectBranch(data) {
      let arrTeamLeader = [];
      if(!CheckNullOrUndefinedOrEmpty(data) && data.length > 0){
        data.forEach(element => {
          let value = new Value()
          let typeMultiSelect = new TypeMultiSelectBranch()
          if(!CheckNullOrUndefinedOrEmpty(element.customer_id)){
            value.id = element.customer_id.id
            if(!CheckNullOrUndefinedOrEmpty(element.customer_id.firt_name) && !CheckNullOrUndefinedOrEmpty(element.customer_id.last_name)) {
              typeMultiSelect.label = element.customer_id.firt_name + ' ' + element.customer_id.last_name;
              value.name = element.customer_id.firt_name + ' ' + element.customer_id.last_name;
            }
            else {
              typeMultiSelect.label = element.customer_id.firt_name
              value.name = element.customer_id.firt_name
            }
          }
          typeMultiSelect.value = value
          arrTeamLeader.push(typeMultiSelect)
        })
      }
      return arrTeamLeader
    }

    renderTypeMultiSelectProduct(data) {
      let arrTeamLeader = []
      let valueAll = {
        label: "All",
        value: {
          id: [],
          name: "All"
        }
      }
      // arrTeamLeader.push(valueAll)
      if(!CheckNullOrUndefinedOrEmpty(data) && data.length > 0){
        data.forEach(element => {
          let value = new Value()
          let typeMultiSelect = new TypeMultiSelectProduct()
          typeMultiSelect.label = element.product_name
          value.name =  element.product_name
          value.id = element.id
          typeMultiSelect.value = value
          arrTeamLeader.push(typeMultiSelect)
        })
      }
      return arrTeamLeader
    }

    //-------------New Reports------------------
    // Stock Report
    getDateReportStock(start , end ): Observable<any>{
      let param = new HttpParams();
      if(!CheckNullOrUndefinedOrEmpty(start)){
        param = param.append('start', start);
      }
      if(!CheckNullOrUndefinedOrEmpty(end)){
        param = param.append('end', end);
      }
      if(this.api.isEnable()){
        return this.http.get<any>(reportStock, { headers: this.api.headers, params: param }).pipe(
          map(data=>{
              return data
          }), catchError(value => throwError(value))
        )
      }
    }

    renderDataStockReport(data){
      let fileCSV = [];
      if(!CheckNullOrUndefinedOrEmpty(data)){
        data.forEach(element => {
          if(!CheckNullOrUndefinedOrEmpty(element.order_items)){
            element.order_items.forEach(e => {
              let reportStock = new ReportStock();
              reportStock.orderId = element.order_id_tmm;
              reportStock.orderLineId = e.id;
              reportStock.date = '="' +  formatDate(element.created_at, 'yyyy/MM/dd', 'en-US') + '"';
              reportStock.sku = (!CheckNullOrUndefinedOrEmpty(e.sku)) ? ('="' + e.sku + '"') : '';
              reportStock.quantity = Number(e.quantity)
              fileCSV.push(reportStock);

            });

          }
        });
        return fileCSV;
      }
    }

    // Daily Collection Report
    getDataDailyCollectionReport(start , end ): Observable<any>{
      let param = new HttpParams();
      if(!CheckNullOrUndefinedOrEmpty(start)){
        param = param.append('start', start);
      }
      if(!CheckNullOrUndefinedOrEmpty(end)){
        param = param.append('end', end);
      }
      if(this.api.isEnable()){
        return this.http.get<any>(reportDailyCollection, { headers: this.api.headers, params: param }).pipe(
          map(data=>{

              return data
          }), catchError(value => throwError(value))
        )
      }
    }

    renderDailyCollectionReport(data){
      let fileCSV = [];
      let totalAmount : number = 0;
      let totalPayAtOffice : number = 0;
      let totalMPGS : number = 0;
      let totalTT : number = 0;
      let totalIpp : number = 0;
      let totalIpay88 : number = 0;
      if(!CheckNullOrUndefinedOrEmpty(data)){
        data.forEach(element => {
          if(!CheckNullOrUndefinedOrEmpty(element.paymentItems)){
            element.paymentItems.forEach(e => {
              let dailyReport = new DailyCollectionReport();
              dailyReport.firstName = '"' + element.customerFirstName + '"';
              dailyReport.lastName = '"' + element.customerLastName + '"';
              dailyReport.orderId = '="' + element.orderIdTmm + '"';
              dailyReport.date = '="' + formatDate(element.startDay , 'yyyy/MM/dd' , 'en-US') + '"' ;
              dailyReport.total = e.payment_amount;
              dailyReport.bank = (!CheckNullOrUndefinedOrEmpty(e.bankCode)) ? '="' +  e.bankCode + '"' : "";
              dailyReport.noOfInst = element.duration;
              dailyReport.approvalNo = (!CheckNullOrUndefinedOrEmpty(e.epp_approval_code))? '="' + e.epp_approval_code + '"' : "";
              totalAmount += Number(e.payment_amount)
              if(e.payment_gateway === 'MPGS'){
                dailyReport.mpgs = e.payment_amount;
                totalMPGS += Number(e.payment_amount);
              }else if(e.payment_gateway === 'OFFICE' || e.payment_gateway === 'CASH'){
                dailyReport.payAtOffice = e.payment_amount;
                totalPayAtOffice += Number(e.payment_amount);
              }else if(e.payment_gateway === 'TT'){
                dailyReport.ttOnline = e.payment_amount;
                totalTT += Number(e.payment_amount);
              }else if(e.payment_gateway === 'OFFLINE_EPP'){
                dailyReport.ipp = e.payment_amount;
                totalIpp += Number(e.payment_amount);
              } else if(e.payment_gateway === 'IPAY88' || e.payment_gateway === 'IPAY88_MY'){
                dailyReport.ipay88 = e.payment_amount;
                totalIpay88 += Number(e.payment_amount);
              }
              fileCSV.push(dailyReport);
            });
          }
        });
      }
      return {fileCSV, totalAmount , totalPayAtOffice , totalMPGS , totalTT , totalIpp , totalIpay88}
    }
}

export class TeamLeader{
  name: string;
  id: number;
}


export class TypeMultiSelectTeamLeader{
  label: string
  value : Value
}

export class Value {
  id: number
  name: string
}

export class TypeMultiSelectBranch{
  label: string
  value : Value
}

export class TypeMultiSelectProduct{
  label: string
  value : Value
}
