import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { GridSizeChangedEvent, GridApi, IGetRowsParams } from 'ag-grid-community';
import { CategoryService } from 'app/core/service/category.service';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { environment } from 'environments/environment'
import { isNullOrUndefined } from 'util';
import { NewsService } from 'app/core/service/news.service';
import { PaginationService } from 'app/core/service/pagination.service';
import { AllModules } from '@ag-grid-enterprise/all-modules';
import '@ag-grid-community/all-modules/dist/styles/ag-grid.css';
import '@ag-grid-community/all-modules/dist/styles/ag-theme-alpine.css';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations : fuseAnimations
})
export class NewsComponent implements OnInit {

  defaultColDef;
  rowData = [];
  gridOptions;
  modules = AllModules
  page = 1;
  pageLimit = environment.pagingLimit
  totalElements: number

  columnDefs = [
    { headerName: "News title", field: "title", width: 200, resizable: true, filter:"agTextColumnFilter" },
    { headerName: "News content", field: "description", width: 300, resizable: false, },
    { headerName: "Image",  contentAlignment: "center",  field: "storageKeyIsCover",
        cellRenderer: params => {
          if(!isNullOrUndefined(params.data)){
            let data = params.data.storageKeyIsCover
            return `<img src ="${data}" style = " object-fit: contain; height :100px; width: 150px; margin-top: -10px; ">`;
          }
        } ,  width: 200, resizable: false, cellStyle: { 'text-align': 'center' } },
    { headerName: "Date", field: "createdAt", width: 200, resizable: false,
   }
  ];

  /**  Link Image is cover */
  newsImageCoverFile = environment.storageUrl
  /** gridApi: GridApi*/
  gridApi;

  constructor(
    private router: Router,
    private newsService: NewsService,
    private paginationService: PaginationService,
  ){
    this.gridOptions = this.paginationService.gridOptions
    this.defaultColDef = {
      suppressMenu: true,
      floatingFilterComponentParams: {suppressFilterButton:true}
    };
  }

  ngOnInit(): void {
    this.gridOptions.rowHeight = 100;
    this.gridOptions.cacheBlockSize=5;

  }
    /**
   * get list category
   * @returns Product array
   */
  // GetListCategory(): Promise<any> {
  //   return new Promise(resolve => {
  //     this.newsService.getNewsList().subscribe(
  //       respone => {
  //         this.products = respone
  //   });
  //  });
  // }

  /**
   * on Grid Ready
   * @param params
   */
  onGridReady(event){
    this.getRfqList(event.api)
    this.gridApi = event.api
  }

  /**
   * getRfqList
   * @param params
   */
  getRfqList(api:GridApi) {
    // this.isShow=true
    // let url:string=UrlProvider.urlsList.getRfqList +"?entityId="+this.apiService.doxaEntityId+ "&"
    var datasource = {

      getRows: (params: IGetRowsParams) => {
        if(params.sortModel.length==1 && this.rowData.length>0){
          this.rowData.sort(this.paginationService.sortValues(params.sortModel[0].colId, params.sortModel[0].sort))
          setTimeout(()=>{
            params.successCallback(this.rowData,this.totalElements)
          },2000)
          // this.isShow=false
          this.gridOptions.defaultColDef.sort=params.sortModel[0].sort
        }else{

        this.page = params.startRow/5 + 1

        this.paginationService.getRowDataListNews(this.page,5, params).subscribe(data => {
          this.rowData = data.content
          this.totalElements = data.totalElements
          // this.isShow=false
          setTimeout(function(){
            params.successCallback(data.content, data.totalElements)
          },500)
      },err=>[
        // this.isShow=false
      ]
      );
    }
      }
    };
    api.setDatasource(datasource);
  }

  /**
   * on Grid Size Changed
   * @param params
   */
  onGridSizeChanged(params: GridSizeChangedEvent){
    params.api.sizeColumnsToFit();
  }

  /**
   * goto add news
   */
  gotoProduct(){
    this.router.navigate(['/direct-sales/news/add-new']);
  }

  /**
   * on View News
   * @param event
   */
  onViewProduct(event){
    this.router.navigate(['direct-sales/news/news-detail'], { queryParams: { id: event.data.uuid } })
  };

}
