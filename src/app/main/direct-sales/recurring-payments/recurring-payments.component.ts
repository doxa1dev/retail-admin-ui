import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { HttpClient } from '@angular/common/http';
import { OrdersService } from 'app/core/service/orders.service';
import { orderTable } from 'app/core/models/order.model';
import { isNullOrUndefined } from 'util';
import { Router } from '@angular/router';
import { GridSizeChangedEvent, GridApi, IGetRowsParams, GridOptions, IDatasource } from 'ag-grid-community';
import { PaginationService } from 'app/core/service/pagination.service';
import { OrderRecurringPaymentTable } from '../../../core/models/order-recurring-payment.model';
import { PaymentService } from '../../../core/service/payment.service';

import { AllModules } from '@ag-grid-enterprise/all-modules';
import '@ag-grid-community/all-modules/dist/styles/ag-grid.css';
import '@ag-grid-community/all-modules/dist/styles/ag-theme-alpine.css';

@Component({
  selector: 'app-recurring-payments',
  templateUrl: './recurring-payments.component.html',
  styleUrls: ['./recurring-payments.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class RecurringPaymentsComponent implements OnInit {

  gridOptions;
  gridApi: GridApi;
  page = 1;
  totalElements: number;

  modules = AllModules

  constructor(   private http: HttpClient,
                private _orderService: OrdersService,
                private router: Router,
                private paginationService: PaginationService,
                private paymentService: PaymentService) {

      this.gridOptions = this.paginationService.gridOptions;
      this.defaultColDef = {
        resizable: true,
        suppressMenu: true,
        floatingFilterComponentParams: {suppressFilterButton:true}
      };

   }

   columnDefs = [
    { headerName: 'Order', field: 'id_tmm', sortable: true, width: 100, filter: true },
    { headerName: 'Updated at', field: 'updatedAt', width: 100 },
    { headerName: 'Installment', field: 'installment_process', width: 100 },
    { headerName: 'Customer', field: 'customer', sortable : false , filter: 'agTextColumnFilter', width: 100 },
    { headerName: 'Advisor', field: 'advisor', width: 100, sortable : false , filter: 'agTextColumnFilter' },
    { headerName: 'Start Date', field: 'startDate',  width: 100 },
    { headerName: 'Total', field: 'displayTotal',  width: 100 },
    { headerName: 'Status', field: 'status',  width: 100 },
    { headerName: 'Installment ID', field: 'installment_id', hide: true },

  ];


  defaultColDef;
  recurringPaymentsInProcess = 0; recurringPaymentsInProcessArray: Array<OrderRecurringPaymentTable> = [];
  completedRecurringPayments = 0; completedRecurringPaymentsArray: Array<OrderRecurringPaymentTable> = [];
  terminatedRecurringPayments =0; terminatedRecurringPaymentsArray: Array<OrderRecurringPaymentTable> = [];
  listRecurringPayments: Array<OrderRecurringPaymentTable> = [];
  selectedIndex: number;
  rowData = [];




  ngOnInit(): void {

    this.gridOptions.rowHeight = 33.1;
    let tabSelect = history.state.selectTab;
    if (!isNullOrUndefined(tabSelect)) {
      this.selectedIndex = tabSelect;
    } else {
      this.selectedIndex = 0;
    }

    this.paymentService.getRecurringPaymentCountData().subscribe(data => {
      if (data.code == 200){
        this.recurringPaymentsInProcess = data.data.in_process;
        this.completedRecurringPayments = data.data.completed;
        this.terminatedRecurringPayments = data.data.terminated;
      }
    });


  }


  onGridPaymentInProcess(params)
{
  params.api.sizeColumnsToFit();
  this.getMethod(params.api, 'IN_PROCESS', this.recurringPaymentsInProcessArray);
  this.gridApi = params.api;
}

onGridCompletedPayments(params)
{
  params.api.sizeColumnsToFit();
  this.getMethod(params.api, 'COMPLETED', this.completedRecurringPaymentsArray);
  this.gridApi = params.api;
}


onGridTerminatedPayments(params)
{
  params.api.sizeColumnsToFit();
  this.getMethod(params.api, 'TERMINATED', this.terminatedRecurringPaymentsArray);
  this.gridApi = params.api;
}


onGridReady(params)
{
  // this.getRfqList(params.api)
  this.gridApi = params.api;
  // params.api.sizeColumnsToFit();
}
onGridSizeChanged(params: GridSizeChangedEvent) {
  params.api.sizeColumnsToFit();
}
ngAfterViewInit(): void {
  document.getElementsByClassName('mat-tab-header-pagination-before')[0].remove();
  document.getElementsByClassName('mat-tab-header-pagination-after')[0].remove();
}
onRowClickedChangePaymentInProcess(event) {
  this.router.navigate(['direct-sales/recurring-payments/payment-in-process'], { queryParams: { id: event.data.order_id, installment_id: event.data.installment_id } });
}
onRowClickedChangeCompletedPayments(event) {
  this.router.navigate(['direct-sales/recurring-payments/completed-payments'], { queryParams: { id: event.data.order_id, installment_id: event.data.installment_id} });
}

onRowClickedChangeTerminatedPayments(event) {
  this.router.navigate(['direct-sales/recurring-payments/terminated-payments'], { queryParams: { id: event.data.order_id, installment_id: event.data.installment_id} });
}



getMethod(api: GridApi, status, method) {

  let datasource = {
    getRows: (params: IGetRowsParams) => {

      this.page = params.startRow / 10 + 1;

      this.paginationService.getAllRecurringPaymentsList(status , this.page, params).subscribe(data => {
        method = data.listRecurringPayments;
        this.totalElements = data.sum;
        setTimeout(function(){
          params.successCallback(data.listRecurringPayments, data.sum);
        }, 500);
      }, err => []);
    }
  };
  api.setDatasource(datasource);
}











}
