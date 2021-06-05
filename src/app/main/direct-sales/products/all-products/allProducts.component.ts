import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {FormBuilder,FormGroup,Validators} from '@angular/forms';

import { FuseConfigService} from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { ProductService} from 'app/core/service/product.service';
import { Router } from '@angular/router';
import { GridSizeChangedEvent, Color } from 'ag-grid-community';
import { CurrencyPipe } from '@angular/common'
import { AllModules } from '@ag-grid-enterprise/all-modules';
import '@ag-grid-community/all-modules/dist/styles/ag-grid.css';
import '@ag-grid-community/all-modules/dist/styles/ag-theme-alpine.css';
@Component({
  selector: 'allProducts',
  templateUrl: './allProducts.component.html',
  styleUrls: ['./allProducts.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations : fuseAnimations
})
export class AllProductsComponent implements OnInit {
  defaultColDef;
  products = [];
  loadingTemplate
  modules = AllModules
  constructor(
    private productservice : ProductService,
    private router: Router,
    private currencyPipe : CurrencyPipe
  ){
    this.defaultColDef = {
      resizable: true,
      sortable :true , filter: 'agTextColumnFilter',
      suppressMenu: true,
      floatingFilterComponentParams: {suppressFilterButton:true}
    };
    this.loadingTemplate =
      `<span class="ag-overlay-loading-center">Loading...</span>`;
  }
  gridOptions = {
    rowHeight : 50,
    rowStyle : { 'padding': '10px 0px'},
  };

  ngOnInit(): void {
    this.productservice.GetAllProductByEntityId().subscribe(data=>{
      this.products = data;
      if(this.products.length == 0 ){
        this.loadingTemplate =
      `<span class="ag-overlay-loading-center">No data</span>`;
      }

    });

  }
  columnDefs = [
    { headerName: "Products", field: "productName", width: 300 },
    { headerName: "SKU", field: "sku", width: 100 },
    { headerName: "Category", field: "category", width: 300 },
    { headerName: "Price", field: "listedPrice", cellStyle: { textAlign: "right" } , width: 150 , sortable :false,filterParams: { filterOptions: ['inRange']}  },
    { headerName: "Active", field: "isActive", cellRenderer: isActiveRenderer, width: 120, cellStyle: { textAlign: "center" }, sortable :false ,filterParams: { filterOptions: ['inRange']} },
    { headerName: "Special Delivery", field: "sd_price", width: 200, filterParams: { filterOptions: ['inRange']} },
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
    this.router.navigate(['direct-sales/products/product-detail'], { queryParams: { id: event.data.publicId} })
  };

  gotoProduct(){
    this.router.navigate(['/direct-sales/products/add-product']);
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

//Function Change Money
// function CurrencyCellRenderer(params: any) {
//   var inrFormat = new Intl.NumberFormat('en-US', {
//     style: 'currency',
//     currency: 'SGD',
//     minimumFractionDigits: 2
//   });
//   return inrFormat.format(params.value);
// }
