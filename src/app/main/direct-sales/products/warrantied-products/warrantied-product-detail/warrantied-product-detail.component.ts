import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';
import { GridApi } from 'ag-grid-community';
import { ActivatedRoute } from '@angular/router';
import { WarrantiedService, Warrantied } from 'app/core/service/warrantied.service';
import { AllModules } from '@ag-grid-enterprise/all-modules';
import '@ag-grid-community/all-modules/dist/styles/ag-grid.css';
import '@ag-grid-community/all-modules/dist/styles/ag-theme-alpine.css';

@Component({
  selector: 'app-warrantied-product-detail',
  templateUrl: './warrantied-product-detail.component.html',
  styleUrls: ['./warrantied-product-detail.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class WarrantiedProductDetailComponent implements OnInit {

  warrantyHistoryArray = []
  defaultColDef
  gridOptions
  gridApi: GridApi
  /** id */
  warrantiedId: string;
  warrantiedDetail = new Warrantied()
  comment: any;
  page : string
  modules = AllModules

  constructor( private location: Location,
    private router : ActivatedRoute,
    private warrantiedService: WarrantiedService) { }

  columnWarrantyHistory = [
    { headerName: "Date", field: "createdAt", width: 100, resizable: false },
    { headerName: "Recorded by", field: "createdById", width: 150, resizable: false },
    { headerName: "Comments", field: "comment", resizable: false }
  ]

  ngOnInit(): void {
    this.router.queryParams.subscribe(params=>{
      this.warrantiedId = params.id;
      this.page = params.page;
    })

    this.warrantiedService.getWarrantiedProductById(this.warrantiedId).subscribe(data => {
      this.warrantiedDetail = data
      this.warrantyHistoryArray = data.warrantyHistory
    })
  }

  onGridToPay(params) {
    params.api.sizeColumnsToFit();
    this.gridApi = params.api
  }

  back(){
    this.location.back();
  }

  sendComment() {
    if (this.comment && this.comment.trim().length > 0) {
      this.warrantiedService.sendComment(this.warrantiedDetail.id, this.comment).subscribe( data => {

        if (data.code === 200) {
          this.warrantiedService.getWarrantiedProductById(this.warrantiedId).subscribe(data => {
            this.warrantyHistoryArray = data.warrantyHistory
          })
          this.comment = ''
        }
      })
    }
  }

}
