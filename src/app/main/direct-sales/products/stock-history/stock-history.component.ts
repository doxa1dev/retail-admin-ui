import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NewDatas } from '../../news/chart/single-bar-chart/single-bar-chart.component';
import { Router } from '@angular/router';
import { GridSizeChangedEvent, Color, GridApi, IGetRowsParams } from 'ag-grid-community';
import { InventoryService } from 'app/core/service/inventory.service';
import { Location } from '@angular/common'
import { PaginationService } from 'app/core/service/pagination.service';
import { AllModules } from '@ag-grid-enterprise/all-modules';
import '@ag-grid-community/all-modules/dist/styles/ag-grid.css';
import '@ag-grid-community/all-modules/dist/styles/ag-theme-alpine.css';
@Component({
  selector: 'app-stock-history',
  templateUrl: './stock-history.component.html',
  styleUrls: ['./stock-history.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class StockHistoryComponent implements OnInit {

  loadingTemplate;
  defaultColDef;
  stockCards = [];
  ProductName: string;
  gridOptions
  gridApi: GridApi
  page = 1
  totalElements: number;
  modules = AllModules

  constructor(
    private inventoryService : InventoryService,
    private router: Router,
    private location: Location,
    private paginationService: PaginationService
  ){
    this.gridOptions = this.paginationService.gridOptions
    this.defaultColDef = {
      resizable: true
    };
    this.loadingTemplate =
      `<span class="ag-overlay-loading-center">Loading...</span>`;
  }

  ngOnInit(): void {
    this.gridOptions.rowHeight = 50
    this.gridOptions.rowStyle = {'padding': '10px 0px'}
  }

  columnDefs = [
    { headerName: "Stock Card Number", field: "cardNumber" , width: 170},
    { headerName: "IN/OUT", field: "inOut", cellRenderer: isActiveRenderer, resizable: false, width:90  },
    { headerName: "Comment", field: "comment",width: 275  },
    { headerName: "IN/OUT date", field: "inOutDate" , width: 140   },
    { headerName: "Created by", field: "createBy" , width: 195 },
    { headerName: "Created date", field: "createdDate", width: 140 }

  ];

  onGridReady(params){
    params.api.sizeColumnsToFit();
    this.gridApi = params.api
    this.getData(params.api);
  }

  onGridSizeChanged(params: GridSizeChangedEvent)
  {
    params.api.sizeColumnsToFit();
  }

  onViewProduct(event)
  {
    this.router.navigate(['direct-sales/products/stock-history/detail'], { queryParams: { id: event.data.uuid} })
  };

  gotoCreate(){
    this.router.navigate(['direct-sales/products/inventory/create-stock']);
  }

  back(){
    this.location.back();
  }

  getData(api:GridApi) {

    var datasource = {
      getRows: (params: IGetRowsParams) => {
        if( params.sortModel.length == 1 && this.stockCards.length > 0){
          this.stockCards.sort(this.paginationService.sortValues(params.sortModel[0].colId, params.sortModel[0].sort))
          setTimeout(()=>{
            params.successCallback(this.stockCards,this.totalElements)
          },500)
          this.gridOptions.defaultColDef.sort=params.sortModel[0].sort
        }else{

        this.page = params.startRow/10 + 1

        this.paginationService.getInventory(this.page, params).subscribe(data => {
          this.stockCards = data.content
          this.totalElements = data.total
          setTimeout(function(){
            params.successCallback(data.content, data.total)
          },500)
        },err=>[]);}
      }
    };
    api.setDatasource(datasource);
  }

}


function isActiveRenderer(params)
{
  let imgSource: string;
  const data = params.value;
  if (data === "IN"){
    imgSource = `<div style="color:#7DA863 ; ">IN</div>`
  }else if(data === "OUT"){
    imgSource = `<div style="color:#DE3535;">OUT</div>`
  }
  return imgSource;
}
