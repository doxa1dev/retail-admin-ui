import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { PaginationService } from 'app/core/service/pagination.service';
import { AllModules, GridApi, IGetRowsParams } from '@ag-grid-enterprise/all-modules';
import { Router } from '@angular/router';
import { CheckNullOrUndefinedOrEmpty } from 'app/core/utils/common-function';


@Component({
  selector: 'app-sale-monitor',
  templateUrl: './sale-monitor.component.html',
  styleUrls: ['./sale-monitor.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SaleMonitorComponent implements OnInit {

  salesArray: Array<String> = [];
  defaultColDef;
  gridOptions;
  gridApi: GridApi;
  page = 1;
  modules = AllModules;
  totalElements: number = 0;
  emptyTemplate: any;
  components: any;

  constructor(private paginationService: PaginationService,
    private router: Router) {

    this.gridOptions = this.paginationService.gridOptions;
    this.defaultColDef = {
      resizable: true,
      sortable: false,
      suppressMenu: true,
      floatingFilterComponentParams: {suppressFilterButton:true}
    };
    this.components = {
      statusFilter: this.getStatusFilter('status'),
      currentStatusFilter: this.getStatusFilter('currentStatus'),
      recruitmentFilter: this.getStatusFilter('recruitment')
    }
    this.emptyTemplate = `<span class="ag-overlay-loading-center">No data</span>`;
  }

  filterDate = {
    buttons: ['apply', 'clear'],
    suppressAndOrCondition: true,
    filterOptions: ['inRange'],
    defaultOption: 'inRange',
    inRangeInclusive: true
  }

  columnDefs = [
    { headerName: "No", field: "no" , width: 70, filter: 'agTextColumnFilter', filterParams: { filterOptions: ['inRange']}},
    { headerName: "Order", field: "order", width: 150, filter: 'agTextColumnFilter' },
    { headerName: "No of Adv product", field: "noOfAdvProduct", width: 150, filter: 'agTextColumnFilter', filterParams: { filterOptions: ['inRange']}},
    { headerName: "Advisor ID", field: "advisorID", width: 150, filter: 'agTextColumnFilter' },
    { headerName: "Team manager ID", field: "teamManagerID", width: 150, filter: 'agTextColumnFilter' },
    { headerName: "Branch manager ID", field: "branchManagerID", width: 170, filter: 'agTextColumnFilter' },
    { headerName: "Recruiter ID", field: "recruiterID", width: 150, filter: 'agTextColumnFilter' },
    { headerName: "Period", field: "period", width: 150, filter: 'agTextColumnFilter' },
    { headerName: "Status", field: "status", width: 150, filter: 'statusFilter', floatingFilterComponentParams: {suppressFilterButton:false}},
    { headerName: "To Verify", field: "toVerify", width: 150, filter: 'agDateColumnFilter', filterParams: this.filterDate, floatingFilterComponentParams: {suppressFilterButton:false}},
    { headerName: "To ship", field: "toShip", width: 150, filter: 'agDateColumnFilter', filterParams: this.filterDate, floatingFilterComponentParams: {suppressFilterButton:false}},
    { headerName: "To receive", field: "toReceive", width: 150, filter: 'agDateColumnFilter', filterParams: this.filterDate, floatingFilterComponentParams: {suppressFilterButton:false}},
    { headerName: "Completed", field: "completed", width: 150, filter: 'agDateColumnFilter', filterParams: this.filterDate, floatingFilterComponentParams: {suppressFilterButton:false}},
    { headerName: "Current Status", field: "currentStatus", width: 150, filter: 'currentStatusFilter', floatingFilterComponentParams: {suppressFilterButton:false}},
    { headerName: "Product Qualifier", field: "recruitment", width: 150, filter: 'recruitmentFilter', floatingFilterComponentParams: {suppressFilterButton:false}},
    { headerName: "Amount", field: "totalAmount", width: 150, filter: 'agTextColumnFilter', filterParams: { filterOptions: ['inRange']}},
    { headerName: "Location", field: "location", width: 150, filter: 'agTextColumnFilter'}
  ];

  ngOnInit(): void {
    this.gridOptions.rowHeight = 50.5;
    this.gridOptions.rowStyle = { 'padding': '10px 0px'}
  }

  onGridReady(params){
    this.gridApi = params.api
    this.getData(params.api);
  }

  getData(api:GridApi) {

    let datasource = {
      getRows: (params: IGetRowsParams) => {
        if( params.sortModel.length == 1 && this.salesArray.length > 0){
          this.salesArray.sort(this.paginationService.sortValues(params.sortModel[0].colId, params.sortModel[0].sort))
          setTimeout(()=>{
            params.successCallback(this.salesArray,this.totalElements)
          },500)
          this.gridOptions.defaultColDef.sort=params.sortModel[0].sort
        }else{

        this.page = params.startRow/10 + 1

        this.paginationService.getListSalesMonitor(this.page, 10, params).subscribe(data => {
          this.salesArray = data.result;
          this.totalElements = data.sum;

          if (this.totalElements == 0) {
            this.gridOptions.api.showNoRowsOverlay();
          } else {
            this.gridOptions.api.hideOverlay();
          }

          setTimeout(function(){
            params.successCallback(data.result, data.sum)
          },500)
        },err=>[]);}
      }
    };
    api.setDatasource(datasource);
  }

  getDetailSalesMonitor(event) {
    this.router.navigate(['direct-sales/hierarchy-ranking/sale-monitor/detail'], {queryParams: {id: event.data.periodId}});
  };

  getStatusFilter(type) {
    return class StatusFilter {
      filterText: any;
      valueGetter: any;
      params: any;
      gui: any;
      onFilterChanged: any;
      eFilterText: any;
      constructor() {}

      init(params) {
        this.valueGetter = params.valueGetter;
        this.filterText = null;
        this.params = params;
        this.setupGui();
      }

      setupGui() {
        this.gui = document.createElement('div');

        if (type === 'status') {
          this.gui.innerHTML =
          '<div style="padding: 4px;"> ' +
          '<p style="margin: 5px; text-align: center; font-size: 13px;">Select Filter</p>' +
          '<select id="status" style="padding: 3px; display: block; margin: auto; margin-top: 5px; margin-bottom: 5px;">' +
          '<option value="0">All</option> <option value="1">Consolidated</option> <option value="2">Tentitave</option>' +
          '</select>'
          '</div>';

        } else if (type === 'currentStatus') {
          this.gui.innerHTML =
            '<div style="padding: 4px;"> ' +
            '<p style="margin: 5px; text-align: center; font-size: 13px;">Select Filter</p>' +
            '<select id="status" style="padding: 3px; display: block; margin: auto; margin-top: 5px; margin-bottom: 5px;">' +
            '<option value="0">All</option> <option value="1">To Ship</option> <option value="2">To Receive</option> <option value="3">To Unbox</option>' +
            '<option value="4">To Host</option> <option value="5">To Completed</option> <option value="6">To Cancelled</option>' +
            '</select>'
            '</div>';

        } else if (type === 'recruitment') {
          this.gui.innerHTML =
            '<div style="padding: 4px;"> ' +
            '<p style="margin: 5px; text-align: center; font-size: 13px;">Select Filter</p>' +
            '<select id="status" style="padding: 3px; display: block; margin: auto; margin-top: 5px; margin-bottom: 5px;">' +
            '<option value="0">All</option> <option value="1">Yes</option> <option value="2">No</option>' +
            '</select>'
            '</div>';
        }

        const that = this;
        this.onFilterChanged = function () {
          that.extractFilterText();
          that.params.filterChangedCallback();
        };

        this.eFilterText = this.gui.querySelector('#status');
        this.eFilterText.addEventListener('change', this.onFilterChanged);
      }

      extractFilterText() {
        this.filterText = this.eFilterText.value;
      }

      getGui() {
        return this.gui;
      }

      isFilterActive() {
        return !CheckNullOrUndefinedOrEmpty(this.filterText)
      }

      getModel() {
        return this.isFilterActive() ? Number(this.eFilterText.value) : null;
      }

      setModel(model) {
        this.eFilterText.value = model;
        this.extractFilterText();
      }

      destroy() {
        this.eFilterText.removeEventListener('change', this.onFilterChanged);
      }

      getModelAsString() {
        return '';
      }
    };
  };
}


