import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AllModules } from '@ag-grid-enterprise/all-modules';
import '@ag-grid-community/all-modules/dist/styles/ag-grid.css';
import '@ag-grid-community/all-modules/dist/styles/ag-theme-alpine.css';
import { GridSizeChangedEvent } from 'ag-grid-community';
import { fuseAnimations } from '@fuse/animations';
import { TranslationService } from 'app/core/service/translation.service';
import { element } from 'protractor';

@Component({
  selector: 'app-translation',
  templateUrl: './translation.component.html',
  styleUrls: ['./translation.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations : fuseAnimations
})
export class TranslationComponent implements OnInit {

  defaultColDef;
  product_id: string;
  categoryId: string;
  type: string;
  title: string;
  description: string;
  translation = [];
  loadingTemplate;
  modules = AllModules

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private translationService: TranslationService
  ) {
    this.defaultColDef = {
      resizable: true,
      sortable :false ,
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
  columnDefs = [
    { headerName: "Language", field: "language", width: 120 },
    { headerName: "Title", field: "title", width: 120 },
    { headerName: "Description", field: "description" },
  ];
  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(param => {
      this.type = param.type;
      if (this.type === 'product') {
        this.product_id = param.id;
        this.translationService.getListTranslationByProductId(this.product_id).subscribe(data => {
          let rowData: any[] = [];
          data.forEach(element => {
            if (element.language !== "English") {
              rowData.push(element);
            }
          })
          this.translation = rowData;
          if (this.translation.length == 0) {
            this.loadingTemplate = `<span class="ag-overlay-loading-center">No data</span>`;
          }
        });
      } else {
        this.categoryId = param.id;
        this.translationService.getListTranslationByCategoryId(this.categoryId).subscribe(data => {
          let rowData: any[] = [];
          data.forEach(element => {
            if (element.language !== "English") {
              rowData.push(element);
            }
          })
          this.translation = rowData;
          if (this.translation.length == 0) {
            this.loadingTemplate = `<span class="ag-overlay-loading-center">No data</span>`;
          }
        });
      }
    });

  }

  onGridReady(params)
  {
    params.api.sizeColumnsToFit();
  }
  onGridSizeChanged(params: GridSizeChangedEvent)
  {
    params.api.sizeColumnsToFit();
  }

  gotoCreateTranslation(){
    if (this.type === 'product') {
      this.router.navigate(['direct-sales/products/translation/create'], { queryParams: { id: this.product_id, type: this.type} });
    }
    else {
      this.router.navigate(['direct-sales/products/translation/create'], { queryParams: { id: this.categoryId, type: this.type} });
    }
  }

  onViewTranslation(event){
    if (this.type === 'product') {
      this.router.navigate(['direct-sales/products/translation/detail'], {queryParams: {translationId: event.data.id, productId: this.product_id, type: this.type}});
    }
    else {
      this.router.navigate(['direct-sales/products/translation/detail'], {queryParams: {translationId: event.data.id, categoryId: this.categoryId, type: this.type}});
    }
  }
}