import { GridApi, GridSizeChangedEvent, IGetRowsParams } from '@ag-grid-community/all-modules';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonDialogComponent } from 'app/main/_shared/common-dialog/common-dialog.component';
import { Router } from '@angular/router';
import { AllModules } from '@ag-grid-enterprise/all-modules';
import { PaginationService } from 'app/core/service/pagination.service';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { JustHostService } from 'app/core/service/just-host.service';

@Component({
    selector: 'app-guest-tracker',
    templateUrl: './guest-tracker.component.html',
    styleUrls: ['./guest-tracker.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class GuestTrackerComponent implements OnInit {
    guestArray: Array<any> = [];
    defaultColDef;
    gridOptions;
    modules = AllModules;
    gridApi: GridApi;
    page = 1;
    totalElements: number;
    loadingTemplate: string;
    emptyTemplate: string;
    infiniteInitialRowCount: number;

    constructor(
        private router: Router,
        private paginationService: PaginationService,
        private justHostService: JustHostService,
        public dialog: MatDialog,
    ) {
        this.gridOptions = this.paginationService.gridOptions;
        this.defaultColDef = {
            resizable: true,
            sortable: false,
            suppressMenu: true,
            floatingFilterComponentParams: { suppressFilterButton: true }
        };
        this.loadingTemplate = `<span class="ag-overlay-loading-center">Loading...</span>`;
        this.emptyTemplate = `<span class="ag-overlay-loading-center">Empty</span>`;
        this.totalElements = 0;
        this.infiniteInitialRowCount = 0;
    }

    columnDefs = [
        { headerName: "Name", field: "name", minWidth: 100, filter: 'agTextColumnFilter' },
        { headerName: "Phone Number", field: "phoneNumber", minWidth: 120, filter: 'agTextColumnFilter' },
        { headerName: "Request ID", field: "requestId", minWidth: 160, filter: 'agTextColumnFilter', cellRenderer: renderId },
        { headerName: "Request Date", field: "requestDate", minWidth: 170, filter: 'agDateColumnFilter', cellRenderer: renderRequestDate },
        { headerName: "Demo Date", field: "demoDate", minWidth: 170, filter: 'agDateColumnFilter', cellRenderer: renderDemoDate },
        { headerName: "Advisor Name", field: "advisorName", minWidth: 150, filter: 'agTextColumnFilter' },
        { headerName: "Advisor ID", field: "advisorId", minWidth: 100, filter: 'agTextColumnFilter' },
        { headerName: "Host Name", field: "hostName", minWidth: 100, filter: 'agTextColumnFilter' },
    ];

    ngOnInit(): void {
        this.gridOptions.rowHeight = 50;
        this.gridOptions.rowStyle = { 'padding': '10px 0px' }
    }

    onGridReady(params) {
        this.gridApi = params.api;
        this.getData(params.api);
    }

    onGridSizeChanged(params: GridSizeChangedEvent) {
        params.api.sizeColumnsToFit();
    }

    getData(api: GridApi) {
        let datasource = {
            getRows: (params: IGetRowsParams) => {
                api.hideOverlay();
                api.showLoadingOverlay();
                if (params.sortModel.length == 1 && this.guestArray.length > 0) {
                    if (params.sortModel[0].colId === 'requestDate' || params.sortModel[0].colId === 'demoDate') {
                        this.guestArray.sort(sortDate(params.sortModel[0].colId, params.sortModel[0].sort));
                    } else {
                        this.guestArray.sort(this.paginationService.sortValues(params.sortModel[0].colId, params.sortModel[0].sort));
                    }
                    api.hideOverlay();
                    if (this.totalElements === 0) {
                        api.showNoRowsOverlay();
                    }
                    setTimeout(() => {
                        params.successCallback(this.guestArray, this.totalElements);
                    }, 500)
                    this.gridOptions.defaultColDef.sort = params.sortModel[0].sort;
                } else {
                    this.page = params.startRow / 10 + 1;

                    this.justHostService.getGuestTrackerAll(this.page, 10, params).subscribe(response => {
                        if (response.result || response.total) {
                            this.guestArray = response.result;
                            this.totalElements = response.total;
                            api.hideOverlay();
                            if (response.result.length === 0) {
                                api.showNoRowsOverlay();
                            }
                            setTimeout(() => {
                                params.successCallback(response.result, response.total);
                            }, 500)
                        } else {
                            this.notification(response.message || "Get failed.", true);
                        }
                    }, (err) => this.notification(err.message, true));
                }
            }
        };
        api.setDatasource(datasource);
    }

    notification(message: string, isError: boolean = false) {
        const dialogNotifi = this.dialog.open(CommonDialogComponent, {
            width: "500px",
            data: {
                message: message,
                title: "NOTIFICATION",
                colorButton: isError,
            },
        });
        dialogNotifi.afterClosed().subscribe(() => {
            return;
        });
    }
}

function sortDate(key, order = 'asc') {
    return function innerSort(a, b) {
        if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
            return 0;
        }

        const varA = (new Date(a[key])).getTime();
        const varB = (new Date(b[key])).getTime();

        let comparison = 0;
        if (varA > varB) {
            comparison = 1;
        } else if (varA < varB) {
            comparison = -1;
        }
        return (
            (order === 'desc') ? (comparison * -1) : comparison
        );
    };
}

function renderRequestDate(params) {
    let dateFormat;
    if (params.data) {
        let dP = new DatePipe("en-US");
        let date = null;
        date = params.data.requestDate ? (params.data.requestDate).substring() : date;
        dateFormat = date ? (dP.transform(date, 'dd/MM/yyyy')) : null;
    }
    return dateFormat;
}

function renderDemoDate(params) {
    let dateFormat;
    if (params.data) {
        let dP = new DatePipe("en-US");
        let date = null;
        date = params.data.demoDate ? (params.data.demoDate).substring() : date;
        dateFormat = date ? (dP.transform(date, 'dd/MM/yyyy')) : null;
    }
    return dateFormat;
}

function renderId(params) {
    let orderIdFormat;
    if (params.data) {
        let orderId = null;
        orderId = params.data.requestId ? Number(params.data.requestId) : orderId;
        orderIdFormat = orderId ? `#${orderId}` : "";
    }
    return orderIdFormat;
}