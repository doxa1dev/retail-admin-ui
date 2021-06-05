import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { isNullOrUndefined } from 'util';
import { CategoryService } from 'app/core/service/category.service';
import { Category } from 'app/core/models/category.model';
import { Location } from '@angular/common';
import { environment } from 'environments/environment'
import { MatDialog } from '@angular/material/dialog';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { CommonDialogComponent } from 'app/main/_shared/common-dialog/common-dialog.component';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { GridSizeChangedEvent } from 'ag-grid-community';
import { InventoryService} from 'app/core/service/inventory.service';
import { AllModules } from '@ag-grid-enterprise/all-modules';
import '@ag-grid-community/all-modules/dist/styles/ag-grid.css';
import '@ag-grid-community/all-modules/dist/styles/ag-theme-alpine.css';
@Component({
  selector: 'app-stock-card-detail',
  templateUrl: './stock-card-detail.component.html',
  styleUrls: ['./stock-card-detail.component.scss']
})
export class StockCardDetailComponent implements OnInit {

    /** Category form */
    formCategory: FormGroup;
    /** id */
    categoryId: string;
    /** mode Edit */
    modeEdit: boolean;
    /** category */
    category: Category;
    /** image Url */
    imageUrl: string;
    /** check Validate File */
    checkValidateFile: boolean = false;
    /** Photo key */
    photoKey: string;
    /** storage url  */
    storageUrl = environment.storageUrl
    /** Array category history */
    arrCategoryHistory = [];

    stockCardItem = [];
    /** url image */
    url: any;
    /** change update */
    modeChange: boolean;

    /** time */
    time : Date = new Date();
    stockCardNumber: string;
    /** created */
    adminName: string = 'SangNe';
    createdDate: Date = new Date();

    /** Documents */
    documents = []

    /** Type */
    type = "IN" ;
    inOutDate: Date = new Date()

    /** Comment */
    fullbox: number = 456;
    defectivePackaging: number = 15;
    comment : string;
    columnApi;
    gridApi: any;
    gridOptions: any;
    rowDataLength: number = 0;
    rowData = []
    modules = AllModules

    columnDefs = [
      { headerName: "No", field: "no", sortable: true ,width: 100 , filter: true, resizable: false},
      { headerName: "Product", field: "product" ,sortable: true, filter: true, width: 100 ,resizable: false},
      { headerName: "Quantity", field: "quantity" , sortable: true, filter: 'agTextColumnFilter',width: 100,resizable: false, cellStyle: { 'text-align': 'right' } },
      // { headerName: "Advisor", field: "advisor" ,sortable: true, filter: true ,width: 100  ,resizable: false},
      { headerName: "Stock Balance", field: "stockBalance" ,sortable: true, filter: true, cellStyle: { 'text-align': 'right' }, width: 100,resizable: true}
    ];

    defaultColDef;
    constructor(
      private formBuilder: FormBuilder,
      private router : ActivatedRoute,
      private categoryService: CategoryService,
      private location: Location,
      private navigate: Router,
      public dialog: MatDialog,
      private inventoryService : InventoryService
    ) {
      this.category = new Category()
    }

    ngOnInit(): void {

      this.router.queryParams.subscribe(params=>{
        this.categoryId = params.id
      })

      this.inventoryService.getStockCarddetail(this.categoryId).subscribe(data=>{
        this.time = data.time;
        this.stockCardNumber = data.stockCardNumber;
        this.documents = this.getNameDocument(data.document);
        this.type = data.type;
        this.inOutDate = data.in_out_date;
        this.comment = data.comment;
        this.adminName = data.create_by;
        this.createdDate = data.time;
        this.stockCardItem = data.stockCardItem;
      });

      this.formCategory = this.formBuilder.group({
        categoryTitle: ['', Validators.required],
        categoryDescription: ['', Validators.required],
        categoryImage: [''],
        categoryIsActive: ['']
      })
    }

    /**
     * on Select File
     * @param event
     */


    onGridReady(params) {
      this.gridApi = params.api;
      this.columnApi = params.columnApi;
      params.api.sizeColumnsToFit();
    }

    onGridSizeChanged(params: GridSizeChangedEvent) {
      params.api.sizeColumnsToFit();
    }

    back(){
      this.location.back();
    }

    getNameDocument(data){
      var arr = []
      if (!isNullOrUndefined(data) && data.length > 0) {
        data.forEach(element => {
          var subElement = element.doc.substring(element.doc.lastIndexOf('/') + 1, element.doc.length)
          var name = subElement.substring(29, subElement.length)
          arr.push({name: name, value: this.storageUrl + element.doc })
        });
      }
      // console.log(arr)
      return arr
    }

    /**
     * Change data
     */
    changeUpdate(){
      this.modeChange = true
    }
  openUrl(url : string){
    // console.log(url);
    if (url != "" && url != undefined)
    {
      window.open(url, "_blank");
    }
  }
}
