import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { isNullOrUndefined } from 'util';
import { Router } from '@angular/router';
import { GridSizeChangedEvent, GridApi, IGetRowsParams } from 'ag-grid-community';
import { WarrantiedService, Warrantied } from 'app/core/service/warrantied.service'
import { AllModules } from '@ag-grid-enterprise/all-modules';
import '@ag-grid-community/all-modules/dist/styles/ag-grid.css';
import '@ag-grid-community/all-modules/dist/styles/ag-theme-alpine.css';
import { PaginationService } from 'app/core/service/pagination.service';
@Component({
  selector: 'app-warrantied-products',
  templateUrl: './warrantied-products.component.html',
  styleUrls: ['./warrantied-products.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class WarrantiedProductsComponent implements OnInit {

  selectedIndex: number
  defaultColDef
  gridOptions
  gridApi: GridApi
  loadingTemplateInWarranty;
  loadingTemplateInShipping;
  loadingTemplateWarrantyExpired
  //In WarrantyArray
  inWarrantyArray = []
  inShipping = []
  warrantyExpired = []
  modules = AllModules
  page = 1;
  totalElements: number;
  sortingOrder;
  constructor(private router: Router,
    private paginationService: PaginationService
    ) {
      this.gridOptions = this.paginationService.gridOptions
      this.defaultColDef = {
        resizable: true,
        sortable :true ,
        filter: 'agTextColumnFilter',
        suppressMenu: true,
        floatingFilterComponentParams: {suppressFilterButton:true}
      };
      this.loadingTemplateInWarranty =
        `<span class="ag-overlay-loading-center">Loading...</span>`;

      this.loadingTemplateInShipping =
        `<span class="ag-overlay-loading-center">Loading...</span>`;

      this.loadingTemplateWarrantyExpired =
        `<span class="ag-overlay-loading-center">Loading...</span>`;
     }

  columnWarranty = [
    { headerName: "Products", field: "productName" },
    { headerName: "Order Number", field: "orderIdTmm" },
    { headerName: "Serial Number", field: "serialNumber" },
    { headerName: "Warranty Period", field: "warrantyPeriod" , filterParams: { filterOptions: ['inRange'] } },
    { headerName: "Warranty started", field: "warrantyStartDate" },
    { headerName: "Warranty expired", field: "warrantyExpired" },
    { headerName: "Customer Name", field: "customerName" },
    { headerName: "Advisor ID", field: "advisorID" },
    { headerName: "Advisor Name", field: "advisorName" }
  ];

  columnShipping = [
    { headerName: "Products", field: "productName" },
    { headerName: "Order Number", field: "orderIdTmm" },
    { headerName: "Serial Number", field: "serialNumber" },
    { headerName: "Warranty Period", field: "warrantyPeriod" },
    { headerName: "Customer Name", field: "customerName" },
    { headerName: "Advisor ID", field: "advisorID" },
    { headerName: "Advisor Name", field: "advisorName" }
  ];

  ngOnInit(): void {
    this.gridOptions.rowHeight = 50;
    this.gridOptions.rowStyle = { 'padding': '10px 0px'}
    var tabSelect = history.state.selectTab
    if (!isNullOrUndefined(tabSelect)) {
      this.selectedIndex = tabSelect
    } else {
      this.selectedIndex = 0
    }
  }

  onGridInShipping(params) {
    params.api.sizeColumnsToFit();
    this.gridApi = params.api;
    this.getMethod(params.api, 'IN SHIPPING', this.inShipping);
    if(this.inShipping.length == 0){
      this.loadingTemplateInShipping =
      `<span class="ag-overlay-loading-center">No data</span>`
    }
  }

  onGridInWarranty(params) {
    // params.api.sizeColumnsToFit();
    this.gridApi = params.api;
    this.getMethod(params.api, 'IN WARRANTY', this.inWarrantyArray);
    if(this.inWarrantyArray.length == 0){
      this.loadingTemplateInWarranty =
      `<span class="ag-overlay-loading-center">No data</span>`
    }
  }

  onGridWarrantyExpired(params) {
    // params.api.sizeColumnsToFit();
    this.gridApi = params.api;
    this.getMethod(params.api, 'WARRANTY EXPIRED', this.warrantyExpired);
  }


  onViewWarranty(event) {
    this.router.navigate(['direct-sales/products/warrantied-products/detail'], { queryParams: { id: event.data.uuid} })
  }

  onViewShipping(event) {
    this.router.navigate(['direct-sales/products/warrantied-products/detail'], { queryParams: { id: event.data.uuid } })
  }

  onViewWarrantyExpired(event) {
    this.router.navigate(['direct-sales/products/warrantied-products/detail'], { queryParams: { id: event.data.uuid , page: 'expired' } })
  }

  getMethod(api: GridApi, status, method) {

    var datasource = {
      getRows: (params: IGetRowsParams) => {
        if (params.sortModel.length == 1 && method.length > 0) {
          method.sort(this.paginationService.sortValues(params.sortModel[0].colId, params.sortModel[0].sort))
          setTimeout(() => {
            params.successCallback(method, this.totalElements)
          }, 2000)
          // this.gridOptions.defaultColDef.sort = params.sortModel[0].sort

        } else {

          this.page = params.startRow / 10 + 1

          this.paginationService.getWarrantyList(status, this.page, params).subscribe(data => {
            method = data.listWarrantied
            this.totalElements = data.sum
            setTimeout(function () {
              params.successCallback(data.listWarrantied, data.sum)
            }, 500)
          }, err => []);
        }
      }
    };
    api.setDatasource(datasource);
  }

}
