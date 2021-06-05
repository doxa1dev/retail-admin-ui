import { data } from 'jquery';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { isNullOrUndefined } from 'util';
import { Router } from '@angular/router';
import { GridSizeChangedEvent, GridApi, IGetRowsParams} from 'ag-grid-community';
import { NAEPService } from 'app/core/service/naep.service'
import { PaginationService } from 'app/core/service/pagination.service';
import { AllModules } from '@ag-grid-enterprise/all-modules';
import '@ag-grid-community/all-modules/dist/styles/ag-grid.css';
import '@ag-grid-community/all-modules/dist/styles/ag-theme-alpine.css';
import { CheckNullOrUndefinedOrEmpty } from 'app/core/utils/common-function';

@Component({
  selector: 'app-naep',
  templateUrl: './naep.component.html',
  styleUrls: ['./naep.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NAEPComponent implements OnInit {
  selectedIndex: number
  defaultColDef;
  gridOptions;
  gridApi: GridApi;
  loadingTemplate;
  page: number = 1;
  totalElements: number;
  naep = [];
  pendingRecruitment = [];
  approvedAndRejectedRecruitment = [];
  modules = AllModules
  constructor(
    private router: Router,
    private _naepService : NAEPService,
    private paginationService: PaginationService
  ) {
    this.defaultColDef = {
      resizable: true,
      filter: 'agTextColumnFilter', sortable :true,
      suppressMenu: true,
      floatingFilterComponentParams: {suppressFilterButton:true}
    };
    this.gridOptions = this.paginationService.gridOptions;
    this.loadingTemplate =
      `<span class="ag-overlay-loading-center">Loading...</span>`;
  }

  columnNAEP = [
    { headerName: "Advisor Name", field: "advisorName", width: 150 },
    { headerName: "Advisor ID", field: "advisorID", width: 120, },
    { headerName: "Email", field: "email", width: 170, },
    { headerName: "Order ID", field: "orderId", width: 170, },
    { headerName: "Start of NAEP", field: "start", width: 130, filterParams: { filterOptions: ['inRange']} },
    { headerName: "End of NAEP", field: "end", width: 130 },
    { headerName: "Sales status", field: "salesStatus", width: 150, filterParams: { filterOptions: ['inRange']} },
    { headerName: "NAEP status", field: "naepStatus", width: 150},
    { headerName: "Actual End Day", field: "completed_at", width: 140 },
    { headerName: "Package type", field: "package_name", width: 200 },
    { headerName: "Quick complete", field: "quick_completed", width: 160 , filterParams: { filterOptions: ['inRange']}},
  ];

  // cellRenderer: isRendererNAEPStatus,

  columnPendingRecruitment= [
    { headerName: "Advisor Name", field: "advisorName", width: 150 },
    { headerName: "Email", field: "email", width: 200 },
    { headerName: "Recruiter Name", field: "recruiterName", width: 150 },
    { headerName: "Recruiter ID", field: "recruiterID", width: 150 },
    // { headerName: "Recruitment status", field: "recruitmentStatus", width: 300, filterParams: { filterOptions: ['inRange']} },
    { headerName: "Recruitment status", field: "status2", width: 300, cellRenderer: isRendererNAEPPendingStatus , filterParams: { filterOptions: ['inRange']}},
  ];

  // columnApprovedAndRejectedRecruitment= [
  //   { headerName: "Advisor Name", field: "advisorName", width: 180 },
  //   { headerName: "Email", field: "email", width: 200, filterParams: { filterOptions: ['inRange']} },
  //   { headerName: "Recruiter Name", field: "recruiterName", width: 200 },
  //   { headerName: "Recruiter ID", field: "recruiterID", width: 150 },
  //   { headerName: "Recruitment status", field: "recruitmentStatus", width: 230, cellRenderer: StatusRenderer , filterParams: { filterOptions: ['inRange']}},
  //   { headerName: "Comments", field: "comments", width: 250 , filterParams: { filterOptions: ['inRange']}},
  // ];

  ngOnInit(): void {
    this.gridOptions.rowHeight = 50;
    this.gridOptions.rowStyle = { 'padding': '10px 0px'}
    let tabSelect = history.state.selectTab;
    if (!CheckNullOrUndefinedOrEmpty(tabSelect)) {
      this.selectedIndex = tabSelect;
    } else {
      this.selectedIndex = 0;
    }
  }


  onGridReady(params)
  {
    params.api.sizeColumnsToFit();
  }
  onGridSizeChanged(params: GridSizeChangedEvent)
  {
    params.api.sizeColumnsToFit();
  }

  onGridNAEP(params)
  {
    params.api.sizeColumnsToFit();
    this.getMethodNAEP(params.api, this.naep );
    this.gridApi = params.api;
  }

  onGridNAEPPending(params)
  {
    params.api.sizeColumnsToFit();
    this.getMethodNAEPPending(params.api, this.pendingRecruitment );
    this.gridApi = params.api
  }

  // onGridNAEPApprovedAndReject(params)
  // {
  //   params.api.sizeColumnsToFit();
  //   this.getMethodNAEPApprovedAndRejected(params.api, this.approvedAndRejectedRecruitment );
  //   this.gridApi = params.api
  // }

  onView(event , page){
    this.router.navigate(['direct-sales/sales-team/naep/detail'], { queryParams: { uuid: event.data.uuid , page: page} })
  }


  getMethodNAEP(api:GridApi, method) {

    let datasource = {
      getRows: (params: IGetRowsParams) => {
        if (params.sortModel.length == 1 && method.length > 0) {
          method.sort(this.paginationService.sortValues(params.sortModel[0].colId, params.sortModel[0].sort))
          setTimeout(() => {
            params.successCallback(method, this.totalElements)
          }, 2000)
          // this.gridOptions.defaultColDef.sort = params.sortModel[0].sort
        } else {
          this.page = params.startRow/10 + 1

          this.paginationService.getAllNAEP(this.page,10, params).subscribe(data => {
            method = data.content
            this.totalElements = data.totalElements
            setTimeout(function(){
              params.successCallback(data.content, data.totalElements)
            },500)
          },err=>[]);
        }
      }
    };
    api.setDatasource(datasource);
  }


  getMethodNAEPPending(api:GridApi, method) {

    let datasource = {
      getRows: (params: IGetRowsParams) => {
        if (params.sortModel.length == 1 && method.length > 0) {
          method.sort(this.paginationService.sortValues(params.sortModel[0].colId, params.sortModel[0].sort))
          setTimeout(() => {
            params.successCallback(method, this.totalElements)
          }, 2000)
          this.gridOptions.defaultColDef.sort = params.sortModel[0].sort
        } else {
          this.page = params.startRow/10 + 1

          this.paginationService.getAllNAEPPending(this.page,10 , params).subscribe(data => {
            // console.log(data)
            method = data.content
            this.totalElements = data.totalElements
            setTimeout(function(){
              params.successCallback(data.content, data.totalElements)
            },500)
          },err=>[]);
        }
      }
    };
    api.setDatasource(datasource);
  }

}

function isRendererNAEPStatus(params)
{
  let naep: string;
  const data = params.value;
  if (data.includes("COMPLETED")){
    naep = `<div style="color:#7DA863 ;">${data}</div>`
  }
  // else if(data === 'FAILED'){
  //   naep = `<div style="color:#DE3535;">Failed</div>`
  // }
  else if(data.includes('IN PROCESS')){
    naep = `<div style="color:#0A73EB;">In process</div>`
  }
  return naep;
}

function isRendererNAEPPendingStatus(params) {
  let naepPending: string;
  const data = params.value;
  if (data === "COMPLETED"){
    naepPending = `<div">Customer became advisor</div>`
  }else if(data === 'SUBMIT'){
    naepPending = `<div">Advisor submitted customer</div>`
  }else if(data === 'APPLY'){
    naepPending = `<div">Customer submitted application</div>`
  }
  return naepPending;
}


