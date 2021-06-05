import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { Observable } from "rxjs";
import { NewsData } from "../chart/line-chart/line-chart.component";

import { Router } from "@angular/router";
import { CategoryService } from "app/core/service/category.service";
import {
  GridSizeChangedEvent,
  GridApi,
  IGetRowsParams,
  ColDef,
} from "ag-grid-community";
import { fuseAnimations } from "@fuse/animations";
import { formatDate } from "@angular/common";
import { NewsService, News } from "app/core/service/news.service";
import { environment } from "environments/environment";
import { PaginationService } from "app/core/service/pagination.service";
import { isNullOrUndefined } from "util";
import { AllModules } from "@ag-grid-enterprise/all-modules";
import "@ag-grid-community/all-modules/dist/styles/ag-grid.css";
import "@ag-grid-community/all-modules/dist/styles/ag-theme-alpine.css";

@Component({
  selector: "app-news-insight",
  templateUrl: "./news-insight.component.html",
  styleUrls: ["./news-insight.component.scss"],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class NewsInsightComponent implements OnInit {
  dataNews: NewsData[];
  dataNewsToPlot: NewsData[];
  gridApi: GridApi;
  defaultColDef;
  defaultColDefTop;
  totalElements: number;
  modules = AllModules;

  maxdate = new Date();
  weekdate: Date = new Date();
  date: string;
  startDateFormat: string;
  endDateFormat: string;
  endDate: Date = new Date();

  rowData = [];
  newTop: News[];
  page = 1;
  pageLimit = environment.pagingLimit;
  gridOptions;
  gridOptionsTopView = {
    rowHeight: 40,
    pagination: false,
  };
  columnDefs: ColDef[] = [
    {
      headerName: "News title",
      field: "description",
      width: 170,
      sortable: false,
      filter: "agTextColumnFilter",
      resizable: false,
      cellRenderer: (params) => {
        // console.log(params.data)
        if (!isNullOrUndefined(params.data)) {
          let title = params.data.title;
          let description = params.data.description;
          return `<p style = "font-weight: bold; white-space: nowrap; font-size: var(--ag-grid-text);">${title}</p>
                <span style = "">${description}</span>`;
        }
      },
    },
    {
      headerName: "Views",
      field: "totalNewsViewed",
      width: 50,
      sortable: false,
      resizable: false,
      filterParams: { filterOptions: ["inRange"] },
    },
    {
      headerName: "Release date",
      field: "createdAt",
      sortable: false,
      width: 70,
      resizable: true,
      filterParams: { filterOptions: ["inRange"] },
    },
  ];
  columnDefsTopNew = [
    {
      headerName: "News",
      field: "title",
      width: 120,
      filter: false,
      resizable: false,
    },
    {
      headerName: "Views",
      field: "totalNewsViewed",
      width: 70,
      filter: false,
      resizable: false,
    },
  ];
  constructor(
    private router: Router,
    private newsService: NewsService,
    private paginationService: PaginationService
  ) {
    this.gridOptions = this.paginationService.gridOptions;
    this.defaultColDef = {
      resizable: true,
      filter: "agTextColumnFilter",
      suppressMenu: true,
      floatingFilterComponentParams: { suppressFilterButton: true },
    };
  }

  ngOnInit(): void {
    this.gridOptions.rowHeight = 100;
    this.gridOptions.cacheBlockSize = 5;
    this.gridOptions.paginationPageSize = 5;
    this.weekdate.setDate(this.maxdate.getDate() - 6);
    this.endDate.setDate(this.maxdate.getDate() + 1);
    this.endDateFormat = formatDate(this.endDate, "yyyy-MM-dd", "en-US");
    this.startDateFormat = formatDate(this.weekdate, "yyyy-MM-dd", "en-US");
    this.newsService
      .getInsightNewsData(this.startDateFormat, this.endDateFormat)
      .subscribe((data) => {
        this.dataNewsToPlot = data;
      });
    this.GetListTopNew();

  }

  onGridReady(event) {
    this.getRfqList(event.api);
    this.gridApi = event.api;
  }

  getRfqList(api: GridApi) {
    let datasource = {
      getRows: (params: IGetRowsParams) => {
        if (params.sortModel.length == 1 && this.rowData.length > 0) {
          this.rowData.sort(
            this.paginationService.sortValues(
              params.sortModel[0].colId,
              params.sortModel[0].sort
            )
          );
          setTimeout(() => {
            params.successCallback(this.rowData, this.totalElements);
          }, 2000);
          this.gridOptions.defaultColDef.sort = params.sortModel[0].sort;
        } else {
          this.page = params.startRow/5 + 1;
          this.paginationService
            .getRowDatanewsRelease(this.page, 5, params)
            .subscribe(
              (data) => {
                this.rowData = data.content;
                this.totalElements = data.totalElements;
                setTimeout(function () {
                  params.successCallback(data.content, data.totalElements);
                }, 500);
              },
              (err) => []
            );
        }
      },
    };
    api.setDatasource(datasource);
  }

  /**
   * Get List Top News
   */
  GetListTopNew(): Promise<any> {
    return new Promise((resolve) => {
      this.newsService.newsTop(1, 5).subscribe((respone) => {
        this.newTop = respone;
      });
    });
  }

  onGridSizeChanged(params: GridSizeChangedEvent) {
    params.api.sizeColumnsToFit();
  }
  gotoProduct() {
    this.router.navigate(["/direct-sales/news/insight-detail"]);
  }
  onRowDoubleClick(event) {
    this.router.navigate(["direct-sales/news/insight-detail"], {
      queryParams: { id: event.data.uuid },
    });
  }

  onChange(event) {
    this.weekdate = new Date(this.weekdate.setDate(event.getDate() - 6));
    this.endDate.setDate(event.getDate() + 1);
    this.date = formatDate(this.weekdate, "EEEE,dd/MM/yyyy", "en-US");
    this.endDateFormat = formatDate(this.endDate, "yyyy-MM-dd", "en-US");
    this.startDateFormat = formatDate(this.weekdate, "yyyy-MM-dd", "en-US");
    this.newsService
      .getInsightNewsData(this.startDateFormat, this.endDateFormat)
      .subscribe((data) => {
        this.dataNewsToPlot = data;
      });
  }
}
