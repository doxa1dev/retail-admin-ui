import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {FormBuilder,FormGroup,Validators} from '@angular/forms';

import { FuseConfigService} from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';

import { HttpClient } from '@angular/common/http';
// import { ActiveCellCustomComponent } from './active-cell/active-cell.component'; //Yes or No
import { Router } from '@angular/router';
import { GridSizeChangedEvent, Color } from 'ag-grid-community';
import { InventoryService} from 'app/core/service/inventory.service';
import { isNullOrUndefined } from 'util';
import { AllModules } from '@ag-grid-enterprise/all-modules';
import '@ag-grid-community/all-modules/dist/styles/ag-grid.css';
import '@ag-grid-community/all-modules/dist/styles/ag-theme-alpine.css';

@Component({
  selector: 'inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations : fuseAnimations
})
export class InventoryComponent implements OnInit {

  private noRowsTemplate;
  loadingTemplate;
  emptyTemplate;
  modules = AllModules
  selectedIndex: number
  defaultColDef;
  products = [];
  products_low = [];
  constructor(
    private inventoryService : InventoryService,
    private router: Router,
  ){
    this.defaultColDef = {
      resizable: true,
      sortable :true,
      filter: true,
      suppressMenu: true,
      floatingFilterComponentParams: {suppressFilterButton:true},
    };
    this.loadingTemplate =
      `<span class="ag-overlay-loading-center">Loading...</span>`;
    this.emptyTemplate = `<span class="ag-overlay-loading-center">No data</span>`;
  }
  gridOptions = {
    rowHeight : 50,
    rowStyle : { 'padding': '10px 0px'}
  };

  ngOnInit(): void {
    this.inventoryService.getInventoryProduct().subscribe(data=>{
      this.products = data;
    });

    this.inventoryService.getInventoryProductLowStock().subscribe(data =>
    {
      this.products_low = data;
    });

    var tabSelect = history.state.selectTab
    if (!isNullOrUndefined(tabSelect))
    {
      this.selectedIndex = tabSelect
    } else
    {
      this.selectedIndex = 0
    }
  }
  columnDefs = [
    {
      headerName: "Products", field: "productName", width: 350 , filter: 'agTextColumnFilter'},
    { headerName: "Current Stock", field: "currentStock",  width: 150,  cellStyle: { textAlign: "right" }, filter: 'agNumberColumnFilter' },
    { headerName: "Latest Stock Updated", field: "latestUpdated", cellStyle: { textAlign: "right" }, width: 170 },
    { headerName: "Min. Stock", field: "minStock", cellStyle: { textAlign: "right" }, width: 150, filter: 'agNumberColumnFilter' },
    { headerName: "Active", field: "isActive", cellRenderer: isActiveRenderer, width: 140, cellStyle: { textAlign: "center" }, sortable :false }
  ];
  onGridReady(params)
  {
    params.api.sizeColumnsToFit();
  }
  onGridSizeChanged(params: GridSizeChangedEvent)
  {
    params.api.sizeColumnsToFit();
  }

  onViewProduct(event)
  {
    // console.log(event.data)
    this.router.navigate(['direct-sales/products/inventory/detail'], { queryParams: { id: event.data.uuid} })
  };

  gotoCreate(){
    this.router.navigate(['direct-sales/products/inventory/create-stock']);
  }


}


function isActiveRenderer(params)
{
  let imgSource: string;
  const data = params.value;
  if (data === true){
    imgSource = `<img src="assets/icons/doxa-icons/ic_check_circle_24px.svg" vertical-align:'middle'/>`
  }else{
    imgSource = `<img src="assets/icons/doxa-icons/none.svg" />`
  }
  return imgSource;
}
