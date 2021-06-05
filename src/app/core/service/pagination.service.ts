import { Injectable } from '@angular/core';
import { IGetRowsParams, GridOptions } from 'ag-grid-community';
import { NewsService } from './news.service';
import { OrdersService } from './orders.service';
import { InventoryService } from './inventory.service';
import { NAEPService } from './naep.service';
import { PaymentService } from './payment.service';
import { WarrantiedService } from './warrantied.service';
import { CustomerInformationService } from './customer-information.service';
import { SalesMonitorService } from './sales-monitor.service';

@Injectable({
  providedIn: 'root'
})
export class PaginationService {
  rowData: any[];
  gridOptions:GridOptions;
  gridOptionsOrder:GridOptions;
  constructor(
    private newsService: NewsService,
    private _orderService: OrdersService,
    private inventoryService : InventoryService,
    private _naepService : NAEPService,
    private _paymentService: PaymentService,
    private _warrantiedService: WarrantiedService,
    private _customerService: CustomerInformationService,
    private salesMonitorService: SalesMonitorService
    ) {
    this.gridOptions = {
      rowSelection: 'single',
      cacheBlockSize: 10,
      rowHeight : 100,
      maxBlocksInCache: 2,
      enableServerSideFilter: true,
      enableFilter:true,
      enableServerSideSorting: true,
      rowModelType: 'infinite',
      pagination: true,
      paginationAutoPageSize: false,
      paginationPageSize: 10,
      sortingOrder: ["asc", "desc", null],
      rowStyle: {}
    };

    this.gridOptionsOrder = {
      rowSelection: 'single',
      cacheBlockSize: 15,
      rowHeight : 100,
      maxBlocksInCache: 2,
      enableServerSideFilter: true,
      enableFilter:true,
      enableServerSideSorting: true,
      rowModelType: 'infinite',
      pagination: true,
      paginationAutoPageSize: false,
      paginationPageSize: 15,
      sortingOrder: ["asc", "desc", null],
      rowStyle: {}

    };
   }
   getRowDatanewsRelease(page , limit,params) {
     return this.newsService.newsReleaseView(page, limit,params);
  }

  getRowDataListNews(url, limit ,params: IGetRowsParams) {
    return this.newsService.getNewsList(url, limit);
  }

  getCustomerNewsNotificationList(uuid, url,params: IGetRowsParams) {
    return this.newsService.customerNewsNotification(uuid, url, 10);
  }

  getOrderList(status, page, params: IGetRowsParams, colIdSort = '', order = '') {
    return this._orderService.getAllOrders(status, page, 15, params, colIdSort, order);
  }

  getInventory(url,params: IGetRowsParams) {
    return this.inventoryService.getInventoryStockCard(url, 10);
  }

  getAllNAEP(page ,limit , params: IGetRowsParams ){
    return this._naepService.getAllNAEP(page , limit, params);
  }

  getAllNAEPPending(page ,limit , params: IGetRowsParams ){
    return this._naepService.getAllNAEPPending(page , limit , params);
  }

  getAllNAEPApproveAndReject(page ,limit , params: IGetRowsParams){
    return this._naepService.getAllNAEPApprovedAndRejected(page , limit , params);
  }

  PostRowData(url,params: IGetRowsParams,data) {
    this.rowData = [];
    // let data2 = this.apiService.postService(url ,data);
    // return data2;
  }

  getWarrantyList(status, page ,params: IGetRowsParams) {
    return this._warrantiedService.getAllWarrantied(status, page , 10, params);
  }

  getCustomerList(limit, page ,params: IGetRowsParams) {
    return this._customerService.getAllCustomers( limit, page ,params);
  }

  sortValues(key, order = 'asc') {
    return function innerSort(a, b) {
      if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
        return 0;
      }

      const varA = (typeof a[key] === 'string')
        ? a[key].toUpperCase() : a[key];
      const varB = (typeof b[key] === 'string')
        ? b[key].toUpperCase() : b[key];

      let comparison = 0;
      if (varA > varB) {
        comparison = 1;
      } else if (varA < varB) {
        comparison = -1;
      }
      return (
        (order === 'desc') ? (comparison * -1) : comparison
      );
    };
  }

  //get all recurring payments

  getAllRecurringPaymentsList(status, url, params: IGetRowsParams) {
    return this._paymentService.getAllRecurringPaymentsList(status, url, 10);
  }

  getListSalesMonitor(page, limit, params: IGetRowsParams) {
    return this.salesMonitorService.getListSalesMonitor(page, limit, params);
  }
}
