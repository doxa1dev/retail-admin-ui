import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Location, formatDate } from '@angular/common';
import { Router } from '@angular/router';
import { CategoryService } from 'app/core/service/category.service';
import { GridSizeChangedEvent, GridApi, IGetRowsParams } from 'ag-grid-community';
import { NewsDataViews } from '../../chart/bar-chart/bar-chart.component';
import { NewDatas } from '../../chart/single-bar-chart/single-bar-chart.component';
import {  ActivatedRoute } from '@angular/router';
import { NewsService} from 'app/core/service/news.service';
import { environment} from 'environments/environment';
import { MatCarousel, MatCarouselComponent } from '@ngmodule/material-carousel';
import { PaginationService } from 'app/core/service/pagination.service';
import { AllModules } from '@ag-grid-enterprise/all-modules';
import '@ag-grid-community/all-modules/dist/styles/ag-grid.css';
import '@ag-grid-community/all-modules/dist/styles/ag-theme-alpine.css';
@Component({
  selector: 'app-insight-detaii',
  templateUrl: './insight-detaii.component.html',
  styleUrls: ['./insight-detaii.component.scss'],
  encapsulation: ViewEncapsulation.None

})
export class InsightDetaiiComponent implements OnInit {
  storageUrl = environment.storageUrl;
  pageLimit = environment.pagingLimit;
  defaultColDef;
  newsInsight = [];
  dataNewsToPlot : NewsDataViews[];
  dataNew: NewDatas[];
  weekdate: Date = new Date();
  maxdate: Date = new Date();
  endDate: Date = new Date();
  date: string;
  endDateFormat: string;
  startDateFormat: string;
  newID : string;
  title : string;
  imageUrl : string;
  description : string;
  color: string;
  dailyDataNewReaches: NewDatas[];
  dailyDataNewViews: NewDatas[];
  WeeklyDataNewsReaches: NewDatas[];
  WeeklyDataNewsViews: NewDatas[];
  slides1 = [];
  totalElements: number;
  gridOptions
  page = 1;
  gridApi: GridApi
  modules = AllModules
  // = {
  //   pagination: true,
  //   rowHeight: 50
  // };
  columnDefs = [
    { headerName: "Name", field: "customer_name", width: 100, resizable: true, },
    { headerName: "Email", field: "customer_email", width: 200, resizable: false, },
    { headerName: "Phone number", field: "customer_phone_number", width: 150, resizable: false, },
    { headerName: "View at", field: "viewedAt", width: 200, resizable: false, cellRenderer: formatShowDate },
  ];
  constructor(
    private _location : Location,
    private router: Router,
    private categoryService: CategoryService,
    private ActivatedRoute: ActivatedRoute,
    private _newsService: NewsService,
    private paginationService: PaginationService
  ) {
    this.gridOptions = this.paginationService.gridOptions
    this.defaultColDef = {
      resizable: true  ,
    };
  }

  ngOnInit(): void {
    //some property fix of news
    this.gridOptions.rowHeight = 50;
    this.gridOptions.cacheBlockSize=5;

    //service
    this.ActivatedRoute.queryParams.subscribe(params =>
    {
      this.newID = params.id;
    })

    this._newsService.getNewsByUuId(this.newID).subscribe(data=>{

      this.title = data.title;
      this.description = data.description;
      data.images.forEach(element => {
        this.slides1.push({image : element});
      });

    })

    this.weekdate.setDate(this.maxdate.getDate()-6)
    this.endDate.setDate(this.maxdate.getDate()+1)
    this.endDateFormat = formatDate(this.endDate,"yyyy-MM-dd","en-US");
    this.startDateFormat = formatDate(this.weekdate,"yyyy-MM-dd","en-US");
    console.log(this.startDateFormat + ' : ' + this.endDateFormat)
    this._newsService.getWeeklyResultNewsData(this.startDateFormat,this.endDateFormat,this.newID).subscribe(data=>{
      this.dataNewsToPlot = data.arrNew;
      this.WeeklyDataNewsReaches = data.weeklyTotalReaches;
      this.WeeklyDataNewsViews = data.weeklyTotalViews;
    });

    this._newsService.getDailyNewsViewsByUuId(this.newID).subscribe(data=>{
      this.dailyDataNewViews = data;
    });

    this._newsService.getDailyNewsReachesByUuId(this.newID).subscribe(data=>{
      this.dailyDataNewReaches = data;
    });

  }

  back(){
    this._location.back();
  }

  onGridReady(params){
    params.api.sizeColumnsToFit();
    this.getRfqList(params.api)
    this.gridApi = params.api
  }
  onGridSizeChanged(params: GridSizeChangedEvent)
  {
    params.api.sizeColumnsToFit();
  }
  gotoProduct(){
    // this.router.navigate(['/direct-sales/news/add-new']);
  }

  onChange(event){
    this.weekdate = new Date(this.weekdate.setDate(event.getDate()-6));
    this.endDate.setDate(event.getDate()+1);
    this.date = formatDate(this.weekdate,"dd/MM/yyyy","en-US")
    this.endDateFormat = formatDate(this.endDate,"yyyy-MM-dd","en-US");
    this.startDateFormat = formatDate(this.weekdate,"yyyy-MM-dd","en-US");
    this._newsService.getWeeklyResultNewsData(this.startDateFormat,this.endDateFormat,this.newID).subscribe(data =>{
      this.dataNewsToPlot = data.arrNew;
      this.WeeklyDataNewsReaches = data.weeklyTotalReaches;
      this.WeeklyDataNewsViews = data.weeklyTotalViews;
    })
  }

  getRfqList(api:GridApi) {

    var datasource = {

      getRows: (params: IGetRowsParams) => {
        if(params.sortModel.length==1 && this.newsInsight.length>0){
          this.newsInsight.sort(this.paginationService.sortValues(params.sortModel[0].colId, params.sortModel[0].sort))
          setTimeout(()=>{
            params.successCallback(this.newsInsight,this.totalElements)
          },2000)
          this.gridOptions.defaultColDef.sort=params.sortModel[0].sort
        }else{

        this.page = params.startRow/5 + 1

        this.paginationService.getCustomerNewsNotificationList(this.newID , this.page, params).subscribe(data => {
          this.newsInsight = data.content
          this.totalElements = data.totalElements
          setTimeout(function(){
            params.successCallback(data.content, data.totalElements)
          },500)
      },err=>[
      ]
      );
    }
      }
    };
    api.setDatasource(datasource);
  }

}
function formatShowDate(params){
  if (params.value != undefined) {
  const element = params.value;
  return formatDate(element, "dd/MM/yyyy HH:mm", "en-US")}
}
