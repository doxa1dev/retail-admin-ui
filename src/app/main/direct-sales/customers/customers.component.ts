import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { PaginationService } from 'app/core/service/pagination.service';
import { AllModules, GridApi, IGetRowsParams } from '@ag-grid-enterprise/all-modules';
import { GridSizeChangedEvent } from 'ag-grid-community';
import { fuseAnimations } from "@fuse/animations";
import { CustomerInformationService } from 'app/core/service/customer-information.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class CustomersComponent implements OnInit {

  toCustomerArray: Array<String> = [];
  defaultColDef;
  gridOptions;
  modules = AllModules;
  gridApi: GridApi;
  page = 1;
  totalElements: number;

  constructor(private router: Router,
    private paginationService: PaginationService)
    {
    this.gridOptions = this.paginationService.gridOptions
    this.defaultColDef = {
      resizable: true,
      sortable: false,
      suppressMenu: true,
      floatingFilterComponentParams: {suppressFilterButton:true}
    };
  }

  columnDefs = [
    { headerName: "Name as in IC", field: "nameAsInIC" , width: 200, filter: 'agTextColumnFilter' },
    { headerName: "Nickname", field: "nickName", width: 200, filter: 'agTextColumnFilter' },
    { headerName: "Advisor ID", field: "advisorId", width: 200, filter: 'agTextColumnFilter' },
    { headerName: "Email", field: "email", width: 200, filter: 'agTextColumnFilter' },
    { headerName: "Phone Number", field: "phoneNumber", width: 200, filter: 'agTextColumnFilter' },
    { headerName: "Address", field: "address", width: 200, filterParams: { filterOptions: ['inRange'] }},
    { headerName: "Recruiter Name", field: "advisorName", width: 200, filter: 'agTextColumnFilter' },
    { headerName: "Recruiter ID", field: "recruiterId", width: 200, filter: 'agTextColumnFilter' },
    { headerName: "Has Account", field: "hasAccount", cellRenderer : hasAccountRenderer, width: 200,
    cellStyle: { textAlign: "center" }, filter: 'agTextColumnFilter', filterParams: { filterOptions: ['inRange'] } }
  ];

  ngOnInit(): void {
    this.gridOptions.rowHeight = 50.5;
    this.gridOptions.rowStyle = { 'padding': '10px 0px'}
  }

  onRowClickedChangeToCustomer(event) {
    this.router.navigate(['direct-sales/customers/details'], { queryParams: { id: event.data.publicId } });
  };

  onGridReady(params){
    params.api.sizeColumnsToFit();
    this.gridApi = params.api
    this.getData(params.api);
  }

  onGridSizeChanged(params: GridSizeChangedEvent)
  {
    params.api.sizeColumnsToFit();
  }

  getData(api:GridApi) {

    let datasource = {
      getRows: (params: IGetRowsParams) => {
        if( params.sortModel.length == 1 && this.toCustomerArray.length > 0){
          this.toCustomerArray.sort(this.paginationService.sortValues(params.sortModel[0].colId, params.sortModel[0].sort))
          setTimeout(()=>{
            params.successCallback(this.toCustomerArray,this.totalElements)
          },500)
          this.gridOptions.defaultColDef.sort=params.sortModel[0].sort
        }else{

        this.page = params.startRow/10 + 1

        this.paginationService.getCustomerList(10, this.page, params).subscribe(data => {
          this.toCustomerArray = data.listCustomer
          this.totalElements = data.sum
          setTimeout(function(){
            params.successCallback(data.listCustomer, data.sum)
          },500)
        },err=>[]);}
      }
    };
    api.setDatasource(datasource);
  }



}

function hasAccountRenderer(params)
{
  let imgSource: string;
  const data = params.value;
  if (data === true){
    imgSource = `<img src="assets/icons/doxa-icons/none.svg" />`
  }else{
    imgSource = `<img src="assets/icons/doxa-icons/ic_check_circle_24px.svg" vertical-align:'middle'/>`
  }
  return imgSource;
}

