import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { FuseConfigService } from "@fuse/services/config.service";
import { fuseAnimations } from "@fuse/animations";
import { HttpClient } from '@angular/common/http';
import { OrdersService } from 'app/core/service/orders.service';
import { orderTable } from 'app/core/models/order.model';
import { isNullOrUndefined } from 'util';
import { Router } from '@angular/router';
import { GridSizeChangedEvent, GridApi, IGetRowsParams, GridOptions, IDatasource } from 'ag-grid-community';
import { PaginationService } from 'app/core/service/pagination.service';
import { AllModules } from '@ag-grid-enterprise/all-modules';
import '@ag-grid-community/all-modules/dist/styles/ag-grid.css';
import '@ag-grid-community/all-modules/dist/styles/ag-theme-alpine.css';
import { isUndefined } from 'lodash';
import { CheckNullOrUndefinedOrEmpty } from 'app/core/utils/common-function';
import { MatDialog } from "@angular/material/dialog";
import { CommonDialogComponent } from "app/main/_shared/common-dialog/common-dialog.component";
import { MatTabChangeEvent } from "@angular/material/tabs";

@Component({
  selector: "orders",
  templateUrl: "./orders.component.html",
  styleUrls: ["./orders.component.scss"],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class OrdersComponent implements OnInit {

  gridOptions;
  gridApi: GridApi
  page: number = 0;
  currentPage: number = 0;
  totalElements: number
  modules = AllModules
  sortingOrder;
  loadingTemplate;
  emptyTemplate;
  errorMgs: boolean = false;

  inputSearch: string;
  dataSearch: string;
  orderSearch: string;

  check: boolean;

  constructor(
    private http: HttpClient,
    private _orderService: OrdersService,
    private router: Router,
    private paginationService: PaginationService,
    public dialog: MatDialog,
  ) {
    this.gridOptions = this.paginationService.gridOptionsOrder
    this.defaultColDef = {
      resizable: true,
      sortable: false,
      suppressMenu: true,
      floatingFilterComponentParams: { suppressFilterButton: true }
    };
    this.loadingTemplate = `<span class="ag-overlay-loading-center">Loading...</span>`;
    this.emptyTemplate = `<span class="ag-overlay-loading-center">Empty</span>`;
    this.check = false;
  }

  columnDefs = [
    { headerName: "Order", field: "orderIdTmm", width: 100, filter: 'agTextColumnFilter' },
    { headerName: "Availability", field: "availability", cellStyle: { 'text-align': 'center' }, cellRenderer: isLockRenderer, width: 60, filter: 'agTextColumnFilter', filterParams: { filterOptions: ['inRange'] } },
    { headerName: "Updated at", field: "updatedAt", width: 100, filter: 'agTextColumnFilter' },
    { headerName: "Customer", field: "customer", filter: 'agTextColumnFilter', width: 100 },
    { headerName: "Advisor", field: "advisor", width: 100, filter: 'agTextColumnFilter' },
    { headerName: "Area", field: "shippingLocation", width: 120, cellRenderer: renderShippingLocation, },
    {
      headerName: "Total", field: "total", cellStyle: { 'text-align': 'right' }, filter: true,
      filterParams: { filterOptions: ['inRange'] }, width: 100
    }
  ];

  columnDefsShipping = [
    { headerName: "Order", field: "orderIdTmm", width: 100, filter: 'agTextColumnFilter' },
    { headerName: "Availability", field: "availability", cellStyle: { 'text-align': 'center' }, cellRenderer: isLockRenderer, width: 80, filter: 'agTextColumnFilter', filterParams: { filterOptions: ['inRange'] } },
    { headerName: "Updated at", field: "updatedAt", width: 100, filter: 'agTextColumnFilter' },
    { headerName: "Customer", field: "customer", filter: 'agTextColumnFilter', width: 100 },
    { headerName: "Advisor", field: "advisor", width: 120, filter: 'agTextColumnFilter' },
    // { headerName: "Shipping Method", field: "shippingLocation",cellRenderer: renderShippingLocation, width: 100},
    { headerName: "Shipping Method", field: "shippingMethod", width: 100, filter: 'agTextColumnFilter' },
    { headerName: "Shipping Date", field: "shippingDate", width: 100, filter: 'agTextColumnFilter' },
    { headerName: "Area", field: "shippingLocation", width: 120, cellRenderer: renderShippingLocation, },
    { headerName: "Quantity", field: "quantity", width: 80, filterParams: { filterOptions: ['inRange'] }, cellStyle: { 'text-align': 'right' } },
    {
      headerName: "Total", field: "total", cellStyle: { 'text-align': 'right' }, filter: true,
      filterParams: { filterOptions: ['inRange'] }, width: 100
    }
  ];

  defaultColDef;

  toPay = 0; toPayArray: Array<orderTable> = [];
  toVerify = 0; toVerifyArray: Array<orderTable> = [];
  toShip = 0; toShipArray: Array<orderTable> = [];
  toReceive = 0; toReceiveArray: Array<orderTable> = [];
  toHost = 0; toHostArray: Array<orderTable> = [];
  toUnbox = 0; toUnboxArray: Array<orderTable> = [];
  completed = 0; completedArray: Array<orderTable> = [];
  cancelled = 0; cancelledArray: Array<orderTable> = [];
  listOrders: Array<orderTable> = [];
  selectedIndex: number;
  pageHistory: number
  rowData = [];

  ngOnInit(): void {
    this.gridOptions.rowHeight = 40;
    this.gridOptions.rowStyle = { 'padding': '10px 0px' }
    let tabSelect = history.state.selectTab;
    this.pageHistory = history.state.page;
    if (!CheckNullOrUndefinedOrEmpty(tabSelect)) {
      this.selectedIndex = tabSelect;
    } else {
      this.selectedIndex = 0;
    }

    this.getCountOrder()
  }


  test() {
    // console.log(this.gridOptions)
  }

  onGridToPay(params) {
    this.getCountOrder()
    params.api.sizeColumnsToFit();
    this.gridApi = params.api
    this.getMethod(params.api, 'TO_PAY', this.toShipArray, this.paginationService.gridOptionsOrder.api, this.inputSearch);
  }

  onGridToShipping(params) {
    // this.gridOptions = this.paginationService.gridOptions
    this.getCountOrder()
    params.api.sizeColumnsToFit();
    this.gridApi = params.api
    this.getMethod(params.api, 'TO_SHIP', this.toShipArray, this.paginationService.gridOptionsOrder.api, this.inputSearch);
  }

  onGridToVerify(params) {
    this.gridOptions = this.paginationService.gridOptionsOrder
    this.getCountOrder()
    params.api.sizeColumnsToFit();
    this.gridApi = params.api
    this.getMethod(params.api, 'TO_VERIFY', this.toVerifyArray, this.paginationService.gridOptionsOrder.api, this.inputSearch);

  }

  onGridToReceive(params) {
    this.getCountOrder()
    params.api.sizeColumnsToFit();
    this.gridApi = params.api
    this.getMethod(params.api, 'TO_RECEIVE', this.toReceiveArray, this.paginationService.gridOptionsOrder.api, this.inputSearch);

  }

  onGridToUnBox(params) {
    this.getCountOrder()
    params.api.sizeColumnsToFit();
    this.gridApi = params.api
    this.getMethod(params.api, 'TO_UNBOX', this.toUnboxArray, this.paginationService.gridOptionsOrder.api, this.inputSearch);

  }

  onGridToHost(params) {
    this.getCountOrder()
    params.api.sizeColumnsToFit();
    this.gridApi = params.api
    this.getMethod(params.api, 'TO_HOST', this.toHostArray, this.paginationService.gridOptionsOrder.api, this.inputSearch);

  }

  onGridCompleted(params) {
    this.getCountOrder()
    params.api.sizeColumnsToFit();
    this.gridApi = params.api
    this.getMethod(params.api, 'COMPLETED', this.completedArray, this.paginationService.gridOptionsOrder.api, this.inputSearch);

  }

  onGridCancelled(params) {
    this.getCountOrder()
    params.api.sizeColumnsToFit();
    this.gridApi = params.api
    this.getMethod(params.api, 'CANCELLED', this.cancelledArray, this.paginationService.gridOptionsOrder.api, this.inputSearch);

  }

  onGridReady(params) {
    // this.gridOptions = this.paginationService.gridOptions
    this.gridApi = params.api
  }

  onGridSizeChanged(params: GridSizeChangedEvent) {
    params.api.sizeColumnsToFit();
  }

  onRowClickedChangeToPay(event) {
    this.router.navigate(['direct-sales/orders/to-pay'], { queryParams: { id: event.data.id, page: this.currentPage + 1 } });
  };
  onRowClickedChangeToVerify(event) {
    this.router.navigate(['direct-sales/orders/to-verify'], { queryParams: { id: event.data.id, page: this.currentPage + 1 } });
  };
  onRowClickedChangeToShip(event) {
    this.router.navigate(['direct-sales/orders/to-ship'], { queryParams: { id: event.data.id, page: this.currentPage + 1 } });
  };
  onRowClickedChangeToReceive(event) {
    this.router.navigate(['direct-sales/orders/to-receive'], { queryParams: { id: event.data.id, page: this.currentPage + 1 } });
  };
  onRowClickedChangeToUnbox(event) {
    this.router.navigate(['direct-sales/orders/to-unbox'], { queryParams: { id: event.data.id, page: this.currentPage + 1 } });
  };
  onRowClickedChangeToHost(event) {
    this.router.navigate(['direct-sales/orders/to-host'], { queryParams: { id: event.data.id, page: this.currentPage + 1 } });
  };
  onRowClickedChangeCompleted(event) {
    this.router.navigate(['direct-sales/orders/completed'], { queryParams: { id: event.data.id, page: this.currentPage + 1 } });
  };
  onRowClickedChangeToCancelled(event) {
    this.router.navigate(['direct-sales/orders/cancelled'], { queryParams: { id: event.data.id, page: this.currentPage + 1 } });
  }

  checkSortModel: boolean = false;
  arrSort;
  api: GridApi;
  filterAll: boolean = false;

  getMethod(api: GridApi, status, method, option?, orderId?) {
    this.api = api;
    let datasource = {
      getRows: (params: IGetRowsParams) => {
        if (!CheckNullOrUndefinedOrEmpty(orderId) && orderId != '') {
          this.filterAll = true;
          params.filterModel.orderIdTmm = { filterType: "text", type: "contains", filter: orderId }
          orderId = '';
        }

        if (
          (params.sortModel.length == 1 && method.length > 0 && (option !== null && this.currentPage === option.paginationProxy.currentPage)
            || (!CheckNullOrUndefinedOrEmpty(this.arrSort)
              && params.sortModel.length > 0 && (this.arrSort[0].colId !== params.sortModel[0].colId
                || this.arrSort[0].sort !== params.sortModel[0].sort)))
          || (this.arrSort === undefined && params.sortModel.length == 1 && method.length > 0)
        ) {
          this.checkSortModel = false;
          this.arrSort = params.sortModel;
          if (this.currentPage !== undefined && this.currentPage > 0 && option !== null) {
            option.paginationProxy.currentPage = this.currentPage;
          }

          if (params.sortModel[0].colId === 'total') {
            if (params.sortModel[0].sort === 'asc') {
              method.sort((a, b) => parseFloat(this.converCurrency(a.total)) - parseFloat(this.converCurrency(b.total)));
            } else {
              method.sort((a, b) => parseFloat(this.converCurrency(b.total)) - parseFloat(this.converCurrency(a.total)));
            }
          } else if (params.sortModel[0].colId === 'orderIdTmm') {
            this.paginationService.getOrderList(status, this.currentPage + 1, params, 'order_id_tmm', params.sortModel[0].sort).subscribe(data => {
              method = data.listOrders;
              this.totalElements = data.sum;
            }, err => []);
          } else if (params.sortModel[0].colId === 'updatedAt') {
            this.paginationService.getOrderList(status, this.currentPage + 1, params, 'updated_at', params.sortModel[0].sort).subscribe(data => {
              method = data.listOrders;
              this.totalElements = data.sum;
            }, err => []);
          } else {
            method.sort(this.paginationService.sortValues(params.sortModel[0].colId, params.sortModel[0].sort))
          }
          setTimeout(() => {
            api.hideOverlay();
            if (method.length === 0) {
              api.showNoRowsOverlay();
            }
            params.successCallback(method, this.totalElements);
          }, 500)
        } else {
          api.hideOverlay();
          api.showLoadingOverlay();
          if (this.pageHistory !== null && !isUndefined(this.pageHistory)) {
            this.currentPage = Number(this.pageHistory);
            this.pageHistory = undefined;
            if (option !== null) {
              option.paginationProxy.currentPage = this.currentPage - 1;
            }
          } else if (!this.checkSortModel
            && (this.arrSort !== null && this.arrSort !== undefined && this.arrSort[0].sort === 'desc')
            && params.sortModel.length == 0
          ) {
            this.checkSortModel = true;
            if (this.currentPage !== null && this.currentPage !== undefined && this.currentPage != 0) {
              this.page = Number(this.currentPage);
            }
            if (option !== null) {
              option.paginationProxy.currentPage = this.page;
            }
          } else {
            this.page = api.paginationGetCurrentPage();
          }
          this.currentPage = !CheckNullOrUndefinedOrEmpty(option) ? option.paginationProxy.currentPage : 1;

          if (params.sortModel.length == 1 && method.length > 0) {
            if (params.sortModel[0].colId === 'total') {
              this.paginationService.getOrderList(status, this.currentPage + 1, params).subscribe(data => {
                method = data.listOrders;
                this.totalElements = data.sum;
                if (params.sortModel[0].sort === 'asc') {
                  method.sort((a, b) => parseFloat(this.converCurrency(a.total)) - parseFloat(this.converCurrency(b.total)));
                  setTimeout(function () {
                    api.hideOverlay();
                    if (method.length === 0) {
                      api.showNoRowsOverlay();
                    }
                    params.successCallback(data.listOrders, data.sum)
                  }, 500)
                } else {
                  method.sort((a, b) => parseFloat(this.converCurrency(b.total)) - parseFloat(this.converCurrency(a.total)));
                  setTimeout(function () {
                    api.hideOverlay();
                    if (method.length === 0) {
                      api.showNoRowsOverlay();
                    }
                    params.successCallback(data.listOrders, data.sum);
                  }, 500)
                }
              }, (error) => console.log(error));
            } else if (params.sortModel[0].colId === 'orderIdTmm') {
              this.paginationService.getOrderList(status, this.currentPage + 1, params, 'order_id_tmm', params.sortModel[0].sort).subscribe(data => {
                method = data.listOrders;
                this.totalElements = data.sum;
                setTimeout(function () {
                  api.hideOverlay();
                  if (method.length === 0) {
                    api.showNoRowsOverlay();
                  }
                  params.successCallback(data.listOrders, data.sum);
                }, 500)
              }, err => []);
            } else if (params.sortModel[0].colId === 'updatedAt') {
              this.paginationService.getOrderList(status, this.currentPage + 1, params, 'updated_at', params.sortModel[0].sort).subscribe(data => {
                method = data.listOrders;
                this.totalElements = data.sum;
                setTimeout(function () {
                  api.hideOverlay();
                  if (method.length === 0) {
                    api.showNoRowsOverlay();
                  }
                  params.successCallback(data.listOrders, data.sum)
                }, 500)
              }, err => []);
            } else {
              this.paginationService.getOrderList(status, this.currentPage + 1, params).subscribe(data => {
                method = data.listOrders;
                this.totalElements = data.sum;
                method.sort(this.paginationService.sortValues(params.sortModel[0].colId, params.sortModel[0].sort))
                setTimeout(function () {
                  api.hideOverlay();
                  if (method.length === 0) {
                    api.showNoRowsOverlay();
                  }
                  params.successCallback(data.listOrders, data.sum)
                }, 500)
              }, (error) => console.log(error));
            }
          } else {
            this.paginationService.getOrderList(status, this.filterAll ? 1 : this.currentPage + 1, params).subscribe(data => {
              method = data.listOrders;
              this.totalElements = data.sum;
              setTimeout(function () {
                api.hideOverlay();
                if (method.length === 0) {
                  api.showNoRowsOverlay();
                }
                params.successCallback(data.listOrders, data.sum)
              }, 500)
            }, (error) => console.log(error));
          }
        }

        if (this.filterAll) {
          params.filterModel.orderIdTmm = { filterType: "text", type: "contains", filter: '' }
          this.filterAll = false;
          this.inputSearch = '';
        }

        this.errorMgs = false;
      }
    };
    api.setDatasource(datasource);
  }

  /*getMethod(api: GridApi, status, method, option? , orderId?) {
    this.api = api;
    let datasource = {
      getRows: (params: IGetRowsParams) => {

        if(!CheckNullOrUndefinedOrEmpty(orderId) && orderId != ''){
          this.filterAll = true;
          params.filterModel.orderIdTmm = {filterType: "text", type: "contains", filter: orderId}
          orderId = '';
        }

        if (
          (params.sortModel.length == 1 && method.length > 0 && (option !== null && this.currentPage === option.paginationProxy.currentPage)
          || (!CheckNullOrUndefinedOrEmpty(this.arrSort)
          && params.sortModel.length > 0 && (this.arrSort[0].colId !== params.sortModel[0].colId
          || this.arrSort[0].sort !== params.sortModel[0].sort)))
          || (this.arrSort === undefined && params.sortModel.length == 1 && method.length > 0)
          ) {
          this.checkSortModel = false;
          this.arrSort = params.sortModel;
          if(this.currentPage !== undefined && this.currentPage > 0 &&  option !== null){
            option.paginationProxy.currentPage = this.currentPage ;
          }
          if (params.sortModel[0].colId === 'total'){
            if(params.sortModel[0].sort === 'asc'){
              method.sort((a, b) => parseFloat(this.converCurrency(a.total)) - parseFloat(this.converCurrency(b.total)));
            } else {
              method.sort((a, b) => parseFloat(this.converCurrency(b.total)) - parseFloat(this.converCurrency(a.total)));
            }
          } else {
            method.sort(this.paginationService.sortValues(params.sortModel[0].colId, params.sortModel[0].sort))
          }
          setTimeout(() => {
            params.successCallback(method, this.totalElements);
          }, 500)
        } else {
          // console.log(option)
          if(this.pageHistory !== null && !isUndefined(this.pageHistory)){
            this.page = Number(this.pageHistory);
            this.pageHistory = undefined;
            if(!CheckNullOrUndefinedOrEmpty(option)){
              option.paginationProxy.currentPage = this.page - 1;
            }
          }else if(!this.checkSortModel
            && (this.arrSort !== null && this.arrSort !== undefined && this.arrSort[0].sort === 'desc')
            && params.sortModel.length == 0
            ){
            this.checkSortModel = true;
            this.page = (this.currentPage !== null && this.currentPage !== undefined && this.currentPage != 0) ? Number(this.currentPage) : this.page;
            if(!CheckNullOrUndefinedOrEmpty(option)){
              option.paginationProxy.currentPage = this.page ;
            }
          }
          else{
            this.page = params.startRow / 15 + 1;
          }

          this.currentPage = !CheckNullOrUndefinedOrEmpty(option) ? option.paginationProxy.currentPage : 1;
          this.paginationService.getOrderList(status, this.page, params).subscribe(data => {
            method = data.listOrders;
            if(params.sortModel.length == 1 && method.length > 0){
              if (params.sortModel[0].colId === 'total'){
                if(params.sortModel[0].sort === 'asc'){
                  method.sort((a, b) => parseFloat(this.converCurrency(a.total)) - parseFloat(this.converCurrency(b.total)));
                } else {
                  method.sort((a, b) => parseFloat(this.converCurrency(b.total)) - parseFloat(this.converCurrency(a.total)));
                }
              } else {
                method.sort(this.paginationService.sortValues(params.sortModel[0].colId, params.sortModel[0].sort))
              }
            }
            this.totalElements = data.sum
            setTimeout(function () {
              params.successCallback(data.listOrders, data.sum)
            }, 500)
          }, err => []);
        }
        if(this.filterAll){
          params.filterModel.orderIdTmm = {filterType: "text", type: "contains", filter: ''}
          this.filterAll = false;
          this.inputSearch = '';
        }

        this.errorMgs = false;
      }
    };
    api.setDatasource(datasource);
  }*/

  converCurrency(currency: string) {
    let money = currency.substring(currency.indexOf(' '), currency.length).trim()
    let data = money.split(',').join('')
    return data
  }

  getCountOrder() {
    this._orderService.getOrderCountData().subscribe(data => {
      if (data.code == 200) {
        this.toPay = data.data.to_pay
        this.toVerify = data.data.to_verify
        this.toShip = data.data.to_ship
        this.toReceive = data.data.to_receive
        this.toUnbox = data.data.to_unbox
        this.toHost = data.data.to_host
        this.completed = data.data.completed
        this.cancelled = data.data.cancel
      }
    })
  }

  searchOrderInAllData() {
    this.inputSearch = this.orderSearch;
    this._orderService.searchOrderInAllData(this.inputSearch).subscribe(data => {
      if (CheckNullOrUndefinedOrEmpty(data)) {
        this.errorMgs = true;
      } else {
        let tab = this.listStatus(data.status)
        if (tab != this.selectedIndex) {
          this.selectedIndex = tab
        } else {
          if (tab == 0) {
            this.getMethod(this.api, data.status, this.toPayArray, this.paginationService.gridOptions.api, this.inputSearch)
          } else if (tab == 1) {
            this.getMethod(this.api, data.status, this.toVerifyArray, this.paginationService.gridOptions.api, this.inputSearch)
          } else if (tab == 2) {
            this.getMethod(this.api, data.status, this.toShipArray, this.paginationService.gridOptions.api, this.inputSearch)
          } else if (tab == 3) {
            this.getMethod(this.api, data.status, this.toReceiveArray, this.paginationService.gridOptions.api, this.inputSearch)
          } else if (tab == 4) {
            this.getMethod(this.api, data.status, this.toUnboxArray, this.paginationService.gridOptions.api, this.inputSearch)
          } else if (tab == 5) {
            this.getMethod(this.api, data.status, this.toHostArray, this.paginationService.gridOptions.api, this.inputSearch)
          } else if (tab == 6) {
            this.getMethod(this.api, data.status, this.completedArray, this.paginationService.gridOptions.api, this.inputSearch)
          } else if (tab == 7) {
            this.getMethod(this.api, data.status, this.cancelledArray, this.paginationService.gridOptions.api, this.inputSearch)
          }
        }
      }
    })
  }


  listStatus(key) {
    let arrStatus = {
      TO_PAY: 0,
      TO_VERIFY: 1,
      TO_SHIP: 2,
      TO_RECEIVE: 3,
      TO_UNBOX: 4,
      TO_HOST: 5,
      COMPLETED: 6,
      CANCELLED: 7
    }

    if (key in arrStatus) {
      return arrStatus[key]
    } else {
      return null
    }
  }

  clearMgs() {
    this.errorMgs = false;
  }
}

function isLockRenderer(params) {
  let imgSource: string;
  const data = params.value;
  if (data === true) {
    imgSource = `<img src="assets/icons/doxa-icons/Lock-order.svg" />`
  } else {
    imgSource = `<img src="assets/icons/doxa-icons/ic_check_circle_24px.svg" vertical-align:'middle'/>`
  }
  return imgSource;
}


function renderShippingLocation(params) {
  let imgSource: string;
  const data = params.value;

  if (!CheckNullOrUndefinedOrEmpty(data)) {
    imgSource = `
      <div style='display: flex; width: 100%;'>
        <div style='width : 40%; height : 20px; background-color: ${data.color}; align-self: center; margin-right:10% ' ></div>
        <div style='width: 50%; float: right'>${data.name}</div>
      </div>
    `
  } else {
    imgSource = ``
  }
  return imgSource;
}
