import { isNullOrUndefined } from 'util';
import { Injectable } from '@angular/core';


@Injectable(
  {
    providedIn: "root",
  }
)
export class ConvertService {

  constructor() { }

    downloadFile(data, filename='data', totalQuantity ,  totalPrice, typeReportValue) {
   //  console.log(data)
      let csvData;
      if(!isNullOrUndefined(typeReportValue)){
        if (typeReportValue === 'total_sales') {
          csvData = this.ConvertToCSV(data, ['shippingLocation','orderID','customerFirstName', 'customerLastName', 'customerID', 'phoneNumber', 'email', 'advisorName', 'advisorID',
          'teamManagerName', 'teamManagerID', 'branchName', 'product', 'quantity', 'totalAmount', 'orderStatus', 'salesType',
          'startDay', 'lastUpdate', 'toVerifyComment'], ['Area','Order ID','First Name', 'Last Name', 'ID', 'Phone Number', 'Email', 'Advisor Name', 'Advisor ID',
          'Team Manager Name', 'Team Manager ID', 'Branch Name', 'Product', 'Quantity', 'Total Amount', 'Order Status', 'Sales Types',
          'Start Day   ', 'Last Update   ', ' "To verify" comment'] ,totalQuantity, totalPrice);

        } else if (typeReportValue === 'naep_recruitment'){
          csvData = this.ConvertToCSVForNAEP(data, ['advisorName','advisorID', 'dateJoin', 'recruiterName', 'recruiterId',
          'teamManagerName', 'teamManagerID', 'branchName', 'branchId', 'email', 'mobilePhone', 'addressLine1', 'addressLine2',
          'addressLine3', 'bankCode', 'bankAccountNumber', 'bankHolder'], ['Advisor','Advisor ID', 'Date join', 'Recruiter', 'Recruiter ID',
          'Team manager name', 'Team manager ID', 'Branch name', 'Branch manager ID', 'Email', 'Mobile phone', 'Address 1', 'Address 2',
          'Address 3', 'Bank code', 'Bank account number', 'Bank holder']);

        } else if (typeReportValue === 'first_sales'){
          csvData = this.ConvertToCSVForNAEP(data,
            ['advisorName','advisorID', 'dateJoin', 'product', 'firstSalesOn', 'totalDays', 'recruiterName', 'recruiterId',
          'teamManagerName', 'teamManagerID', 'branchName','branchId', 'email', 'mobilePhone', 'addressLine1', 'addressLine2',
          'addressLine3', 'bankCode', 'bankAccountNumber', 'bankHolder'],
          ['Advisor','Advisor ID', 'Date join', 'Product', 'First sales on', 'Days left', 'Recruiter name', 'Recruiter ID',
          'Team manager name', 'Team manager ID', 'Branch name', 'Branch manager ID', 'Email', 'Mobile phone', 'Address 1', 'Address 2',
          'Address 3', 'Bank code', 'Bank account number', 'Bank holder']
          );

        } else if (typeReportValue === 'naep_success'){
          csvData = this.ConvertToCSVForNAEP(data, ['advisorName','advisorID', 'dateJoin', 'recruiterName', 'recruiterId',
          'teamManagerName', 'teamManagerID', 'branchName','branchId', 'email', 'mobilePhone', 'addressLine1', 'addressLine2',
          'addressLine3', 'bankCode', 'bankAccountNumber', 'bankHolder'], ['Advisor','Advisor ID', 'Date join', 'Recruiter name', 'Recruiter ID',
          'Team manager name', 'Team manager ID', 'Branch name', 'Branch manager ID', 'Email', 'Mobile phone', 'Address 1', 'Address 2',
          'Address 3', 'Bank code', 'Bank account number', 'Bank holder']);

        }else if(typeReportValue === 'stock_sold'){
          csvData = this.ConvertToCSVForStockReport(data, ['orderLineId','orderId','date','sku', 'quantity'],
          ['Item S/N','Order ID','Order confirmation date', 'SKU', 'Quantity'], totalQuantity);

        } else if (typeReportValue === 'product_packing') {
          csvData = this.ConvertToCSVForNAEP(data, ['sku', 'productName', 'variant', 'quantity'],
          ['SKU', 'Product Name', 'Variant', 'Quantity'])

        } else if (typeReportValue === 'order_packing') {
          csvData = this.ConvertToCSVForNAEP(data, ['area', 'nameInIC', 'preferredName', 'email', 'orderId', 'productName', 'sku', 'variant',
          'quantity', 'shippingMethod'], ['Area', 'Name in IC', 'Preferred Name', 'Email', 'Order ID', 'Product Name',
          'SKU', 'Variant', 'Quantity', 'Shipping Method'])
        } else if (typeReportValue === 'customer_update_history') {
          csvData = this.ConvertToCSVUpdateHistory(data, ['date', 'old_name', 'new_name', 'old_phone', 'new_phone' , 'old_email', 'new_email', 'admin' ],
          ['Date&Time', 'Old Name in IC', 'New Name in IC', 'Old phone number', 'New phone number' , 'Old email' , 'New Email', 'Change by admin'])
        }
      }

        let blob = new Blob(['\ufeff' + csvData], { type: 'text/csv;charset=utf-8;' });
        let dwldLink = document.createElement("a");
        let url = URL.createObjectURL(blob);
        let isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
        if (isSafariBrowser) {  //if Safari open in new window to save file with random filename.
            dwldLink.setAttribute("target", "_blank");
        }
        dwldLink.setAttribute("href", url);
        dwldLink.setAttribute("download", filename + ".csv");
        dwldLink.style.visibility = "hidden";
        document.body.appendChild(dwldLink);
        dwldLink.click();
        document.body.removeChild(dwldLink);
    }

    downloadFileCSVDailyReport(data, filename='data', TTonline , mpgsCc , ipp , payAtOffice, totalAmount , ipay88, entityId){
      let csvData;
      if(entityId == 2){
        csvData = this.ConvertToCSVForDailyCollection(data,
          ['orderId','firstName', 'lastName' ,'date' ,'bank','approvalNo', 'ttOnline', 'ipay88',
          'ipp', 'noOfInst', 'payAtOffice', 'total'],
          ['S/C (Order Id)', 'First Name', 'Last Name' ,'Order Confirmation Date','Bank',
          'Approval No', 'TT Online' , 'IPAY88', 'IPP', 'No. of Inst.' ,'Pay At Office', 'Total amount'
        ], TTonline , ipay88 , ipp , payAtOffice, totalAmount);

      }else{
        csvData = this.ConvertToCSVForDailyCollection(data,
          ['orderId','firstName', 'lastName' ,'date' ,'bank','approvalNo', 'ttOnline', 'mpgs',
          'ipp', 'noOfInst', 'payAtOffice', 'total'],
          ['S/C (Order Id)', 'First Name', 'Last Name' ,'Order Confirmation Date','Bank',
          'Approval No', 'TT Online' , 'MPGS CC', 'IPP', 'No. of Inst.' ,'Pay At Office', 'Total amount'
        ], TTonline , mpgsCc , ipp , payAtOffice, totalAmount);
      }

      let blob = new Blob(['\ufeff' + csvData], { type: 'text/csv;charset=utf-8;' });
      let dwldLink = document.createElement("a");
      let url = URL.createObjectURL(blob);
      let isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
      if (isSafariBrowser) {  //if Safari open in new window to save file with random filename.
          dwldLink.setAttribute("target", "_blank");
      }
      dwldLink.setAttribute("href", url);
      dwldLink.setAttribute("download", filename + ".csv");
      dwldLink.style.visibility = "hidden";
      document.body.appendChild(dwldLink);
      dwldLink.click();
      document.body.removeChild(dwldLink);
    }

    ConvertToCSVForDailyCollection(objArray, headerList , option, TTonline , mpgsCc , ipp , payAtOffice, totalAmount){
      let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
      let str = '';
      let row = 'No,';
      let total = 'SUB-TOTAL'
      for (let index in option) {
          row += option[index] + ',';
      }
      row = row.slice(0, -1);
      str += row + '\r\n';
      for (let i = 0; i < array.length; i++) {
          let line = (i+1)+'';
          for (let index in headerList) {
             let head = headerList[index];

              line += ',' + array[i][head];
          }
          str += line + '\r\n';
      }
      let line1 =',' +',' + ',' +',' + ',' + total + ',' + ',' + TTonline + ',' + mpgsCc + ',' + ipp + ',' + ',' + payAtOffice+ ',' + totalAmount ;
      str += line1 + '\r\n';
      return str;
    }

    ConvertToCSVUpdateHistory(objArray, headerList , option){
      let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
      let str = '';
      let row = 'No,';
      let total = 'SUB-TOTAL'
      for (let index in option) {
          row += option[index] + ',';
      }
      row = row.slice(0, -1);
      str += row + '\r\n';
      for (let i = 0; i < array.length; i++) {
          let line = (i+1)+'';
          for (let index in headerList) {
             let head = headerList[index];

              line += ',' + array[i][head];
          }
          str += line + '\r\n';
      }
      // let line1 =',' +',' + ',' +',' + ',' + total + ',' + ',' ;
      // str += line1 + '\r\n';
      return str;
    }

    ConvertToCSVForStockReport(objArray, headerList , option, totalQuantity){
      let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
      let str = '';
      let row = 'No,';
      let total = 'SUB-TOTAL'
      for (let index in option) {
          row += option[index] + ',';
      }
      row = row.slice(0, -1);
      str += row + '\r\n';
      for (let i = 0; i < array.length; i++) {
          let line = (i+1)+'';
          for (let index in headerList) {
             let head = headerList[index];

              line += ',' + array[i][head];
          }
          str += line + '\r\n';
      }
      let line1 =','+','+',' +',' + total + ',' + totalQuantity ;
      str += line1 + '\r\n';
      return str;
    }

    ConvertToCSV(objArray, headerList , option, totalQuantity , totalPrice) {
         let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
         let str = '';
         let row = 'No,';
         let total = 'Total'
         for (let index in option) {
             row += option[index] + ',';
         }
         row = row.slice(0, -1);
         str += row + '\r\n';
         for (let i = 0; i < array.length; i++) {
             let line = (i+1)+'';
             for (let index in headerList) {
                let head = headerList[index];

                 line += ',' + array[i][head];
             }
             str += line + '\r\n';
         }
         let line1 =',' +',' + ',' + ',' + ',' + ',' + ','+ ','+ ',' + ',' + ','+ ',' + ',' + total +',' + totalQuantity + ',' + totalPrice;
         str += line1 + '\r\n';
         return str;
     }

     ConvertToCSVForNAEP(objArray, headerList , option) {
      let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
      let str = '';
      let row = 'No,';
      let total = 'Total'
      for (let index in option) {
          row += option[index] + ',';
      }
      row = row.slice(0, -1);
      str += row + '\r\n';
      for (let i = 0; i < array.length; i++) {
          let line = (i+1)+'';
          for (let index in headerList) {
             let head = headerList[index];

              line += ',' + array[i][head];
          }
          str += line + '\r\n';
      }
      // let line1 =',' + ',' + ',' + ',' + ',' + ','+ ','+ ',' + ',' + total +',' + totalQuantity + ',' + totalPrice;
      // str += line1 + '\r\n';
      return str;
  }
}

export class Report {
  orderID: string;
  shippingLocation: string;
  customerName: string;
  customerPreferredName: string;
  customerFirstName: string;
  customerLastName: string;
  phoneNumber: string;
  email: string;
  customerID: string;
  advisorName: string;
  advisorID: string;
  teamManagerName: string;
  teamManagerID: string;
  branchName: string;
  branchId : string;
  product: string;
  quantity: string;
  orderStatus: string;
  totalAmount: string;
  startDay: string;
  lastUpdate: string;
  toVerifyComment: string;
  // lastLine: string;
  dateJoin: string;
  recruiterName: string;
  recruiterId: string;
  mobilePhone: string;
  addressLine1: string;
  addressLine2: string;
  addressLine3: string;
  bankCode: string;
  bankAccountNumber: number;
  bankHolder: string;
  bankHolderIC: string;

  firstSalesOn: string;
  totalDays: number;
  lastSales: string;
  salesType: string;
}

export class ReportStock{
  date: string;
  sku: string;
  quantity: number;
  orderId: string;
  orderLineId: string;
}

export class ReportUpdateHistory{
  date: string;
  old_name: string;
  new_name: string;
  preferred_name: string;
  old_email: string;
  new_email: string;
  old_phone: string;
  new_phone: string;
  admin: string;
}

export class DailyCollectionReport{
  orderId: string;
  firstName: string;
  lastName: string;
  date: string;
  bank: string;
  approvalNo: string = '';
  ttOnline: string ='';
  mpgs: string = '';
  ipp: string = '';
  noOfInst: string = '';
  payAtOffice: string = '';
  total: string = '';
  ipay88: string = '';
}
