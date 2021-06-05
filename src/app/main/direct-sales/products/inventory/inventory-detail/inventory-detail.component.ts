import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router , ActivatedRoute } from '@angular/router';
import { GridSizeChangedEvent, Color } from 'ag-grid-community';
import { InventoryService} from 'app/core/service/inventory.service';
import { Location } from '@angular/common'
import { MatDialog } from '@angular/material/dialog';
import { DialogInputComponent } from 'app/main/_shared/dialog-input/dialog-input.component';
import { AllModules } from '@ag-grid-enterprise/all-modules';
import '@ag-grid-community/all-modules/dist/styles/ag-grid.css';
import '@ag-grid-community/all-modules/dist/styles/ag-theme-alpine.css';
@Component({
  selector: 'app-inventory-detail',
  templateUrl: './inventory-detail.component.html',
  styleUrls: ['./inventory-detail.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class InventoryDetailComponent implements OnInit {

  loadingTemplate
  defaultColDef;
  modules = AllModules
  products = [];
  ProductName: string;
  minStock: number =10 ;
  uuid: string;
  loading : string = 'Loading...';
  // productName: string = 'Sang';
  constructor(
    private inventoryService : InventoryService, private activateRouter: ActivatedRoute,
    private router: Router, private location: Location,
    private dialog: MatDialog,
  ){
    this.defaultColDef = {
      resizable: true, sortable:true, filter:'agTextColumnFilter' ,
      suppressMenu: true,
      floatingFilterComponentParams: { suppressFilterButton: true },
    };
    this.loadingTemplate =
      `<span class="ag-overlay-loading-center">Loading...</span>`;
  }
  gridOptions = {
    rowHeight : 50,
    rowStyle : { 'padding': '10px 0px'}
  };

  ngOnInit(): void {
    this.activateRouter.queryParams.subscribe(params=>{
      this.uuid = params.id


    })
    this.inventoryService.getInventoryProductByUuid(this.uuid).subscribe(data=>{
      this.products = data.result;
      // this.ProductName = data.name;
      if(data.result.length == 0){
        this.loadingTemplate =
          `<span class="ag-overlay-loading-center">No data</span>`;
      }
    });

    this.inventoryService.getMinStock(this.uuid).subscribe(data=>{
      this.minStock = data.minStock
      this.ProductName = data.name
    })
  }
  columnDefs = [
    { headerName: "Stock Card Number", field: "cardNumber" , width: 210 },
    { headerName: "IN/OUT", field: "inOut", cellRenderer: isActiveRenderer, width: 105, filterParams: { filterOptions: ['inRange'] } },
    { headerName: "Quantity", field: "quantity",filter:'agNumberColumnFilter',cellStyle: { textAlign: "right" }, width: 120 },
    { headerName: "Stock balance", field: "stockBalance", cellStyle: { textAlign: "right" },filter:'agNumberColumnFilter',width: 165 },
    { headerName: "Comment", field: "comment", width: 145 },
    { headerName: "Documents", field: "document", width: 150 },
    { headerName: "IN/OUT date", field: "inOutDate" , filterParams: { filterOptions: ['inRange'] }, width: 160 },
    { headerName: "Created by", field: "createBy" },
    { headerName: "Created date", field: "createdDate", filterParams: { filterOptions: ['inRange'] } , width: 160 }

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
    this.router.navigate(['direct-sales/products/inventory/detail'], { queryParams: { id: event.data.publicId} })
  };

  gotoCreate(){
    this.router.navigate(['direct-sales/products/inventory/create-stock']);
  }

  back(){
    this.location.back();
  }

  updateMinStock(){
    const dialogRef = this.dialog.open(DialogInputComponent, {
      width: '500px',
      data: { message: 'Min. Stock' , orderId: this.uuid }
    });

    dialogRef.afterClosed().subscribe(result =>
    {
        // console.log(result)
        if (result.state === true)
        {

          let form = {minstock : result.data, productid : this.uuid}
          this.inventoryService.updateMinStock(form).subscribe(data=>{
            // console.log(data)
            if(data.code == 200){
              this.minStock = result.data;
            }
          })
        } else
        {
            dialogRef.close();
        }
    })
  }

}


function isActiveRenderer(params)
{
  let imgSource: string;
  const data = params.value;
  if (data === "IN"){
    imgSource = `<div style="color:#7DA863 ;">IN</div>`
  }else{
    imgSource = `<div style="color:#DE3535;">OUT</div>`
  }
  return imgSource;
}
