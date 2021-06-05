import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { OrdersService } from 'app/core/service/orders.service';
import { ActivatedRoute } from '@angular/router';
import { PaymentService } from 'app/core/service/payment.service';
import { GridOptions, GridSizeChangedEvent } from 'ag-grid-community';
import { isNullOrUndefined } from 'util';
import { Location,formatCurrency } from '@angular/common';
import HelperFn from 'app/main/direct-sales/orders/helper/helper-fn';

import { AllModules } from '@ag-grid-enterprise/all-modules';
import '@ag-grid-community/all-modules/dist/styles/ag-grid.css';
import '@ag-grid-community/all-modules/dist/styles/ag-theme-alpine.css';

@Component({
  selector: 'app-completed-payments',
  templateUrl: './completed-payments.component.html',
  styleUrls: ['./completed-payments.component.scss'], 
  encapsulation: ViewEncapsulation.None
})
export class CompletedPaymentsComponent implements OnInit {

  helperFn = new HelperFn(); 

  order: any; 
  order_id: any;
  orderAt: Date; 
  namePage = "Completed Payment"; 
  installment_id: any;

  orderWithRecurringPayment: any



  advisorId: any; 
  advisorName: any; 

  customerInfo: any;
  customerName: any; 
  customerEmail: any; 
  customerPhoneNumber: any; 
  customerAddr: any; 
  customerAddr_detail: any;



  //succefful recurring payments
  recurringRank: number;
  payment_amount: number; 
  payment_currency: string; 
  display_amount: string; 
  payment_date: string; 
  payment_status: string; 


  //installment
  frequency: any; 
  number_of_payments: any; 
  first_payment_date: any; 
  installment_status: any; 
  paymentNumbersTillNow: any; 
  paymentNumberRatio: any;
  installmentAmount: any; 
  displayInstallmentAmount: any; 
  displayInstallmentRatio: any;


  //
  columnApi;
  gridApi: any;
  gridOptions: any;

  modules = AllModules

  constructor(private _location: Location,
    private _orderService: OrdersService,
    private _route: ActivatedRoute,
    private _paymentService: PaymentService) { 
      
      this.gridOptions = <GridOptions> {
        context: {
          componentParent: this
        }
      };
    }

    columnDefs = [
      { headerName: "Installment", field: "recurringRank", sortable: true, filter: true, width: 100, resizable: false },
      { headerName: "Amount", field: "displayAmount", sortable: true, filter: true, width: 130, resizable: false },
      { headerName: "Payment Date", field: "updatedAt", sortable: true, filter: true, width: 130, resizable: false },
      { headerName: "Status", field: "paymentStatus", sortable: true, filter: true, width: 100, resizable: false },
    ];

  ngOnInit(): void {

    
    this._route.queryParams.subscribe(params => {
      this.order = params.id;
      this.order_id = this.order.replace("#", '');
      this.installment_id = params.installment_id;
      // console.log(this.order_id)
    });

    this.getOrder(this.order_id);
    this.getInstallment(this.installment_id); 
  }


  getOrder(orderId): Promise<any> {
    return new Promise(resolve => {
      setTimeout(() => {
        this._orderService.getOrderbyOrderId(orderId).subscribe(respone => {
          this.orderWithRecurringPayment = this._orderService.renderOrderWithRecurringPayments(respone);
          this.order = this.orderWithRecurringPayment.id;

          this.orderAt = this.orderWithRecurringPayment.createdAt; 

          this.customerInfo = this.orderWithRecurringPayment.customerInformation; 
          this.customerName = this.customerInfo.lastName? this.customerInfo.firstName + ' ' + this.customerInfo.lastName : this.customerInfo.firstName;
          this.customerEmail = this.customerInfo.email;
          this.customerPhoneNumber = this.customerInfo.phoneDialCode+ '-'+ this.customerInfo.phoneNumber; 
          this.customerAddr = this.orderWithRecurringPayment.customerAddr; 
          if(this.customerAddr){
            this.customerAddr_detail = (this.customerAddr.address_line3)?this.customerAddr.address_line3+', '+this.customerAddr.address_line2+ ', '+this.customerAddr.address_line1+ ', '+this.customerAddr.state_code+', '+this.customerAddr.country_code+ ', '+this.customerAddr.postal_code:
            this.customerAddr.address_line2+ ', '+this.customerAddr.address_line1+ ', '+this.customerAddr.state_code+', '+this.customerAddr.country_code+ ', '+this.customerAddr.postal_code;
          }
          this.advisorId = this.orderWithRecurringPayment.advisorCustomer.advisorIdNumber; 

          if (isNullOrUndefined(this.orderWithRecurringPayment.advisorCustomer.preferredName)) {
          this.advisorName = this.orderWithRecurringPayment.advisorCustomer.firstName;
          } else {
            this.advisorName = this.orderWithRecurringPayment.advisorCustomer.preferredName;
          }

        });
      }, 500);
    });
  }



  getInstallment(id){
    this._orderService.getInstallmentByID(id).subscribe(response=>{
      if(response){
        this.frequency = response.frequency; 
        this.number_of_payments = response.number_of_payments; 
        this.first_payment_date = response.subscription_request['firstPaymentDate'];
        
        this.installment_status = response.installment_status; 
        this.paymentNumberRatio = String(this.paymentNumbersTillNow)+'/'+String(this.number_of_payments); 
        this.installmentAmount = response.installment_amount; 
        this.payment_currency = response.payment_currency; 
        this.displayInstallmentAmount = formatCurrency(this.installmentAmount, "en-US", this.payment_currency + ' ', "code", "0.2-2"); 
        this.paymentNumbersTillNow= (response.successful_number_of_payments)?response.successful_number_of_payments: 0
        this.displayInstallmentRatio = String(this.paymentNumbersTillNow)+'/'+String(this.number_of_payments); 
      
      }
    }); 
  }


  back() {
    this._location.back();
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
    params.api.sizeColumnsToFit();
  }

  onGridSizeChanged(params: GridSizeChangedEvent) {
    params.api.sizeColumnsToFit();
  }


}
