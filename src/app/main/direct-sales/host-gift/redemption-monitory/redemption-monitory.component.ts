import { AllModules, GridApi, GridSizeChangedEvent, IGetRowsParams } from '@ag-grid-enterprise/all-modules';
import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { HostGiftService } from 'app/core/service/host-gift.service';
import { PaginationService } from 'app/core/service/pagination.service';
import { CommonDialogComponent } from 'app/main/_shared/common-dialog/common-dialog.component';

@Component({
    selector: 'app-redemption-monitory',
    templateUrl: './redemption-monitory.component.html',
    styleUrls: ['./redemption-monitory.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class RedemptionMonitoryComponent implements OnInit {
    redemptionArray: Array<any> = [];
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
        private hostGiftService: HostGiftService,
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
        { headerName: "Order", field: "orderId", minWidth: 100, filter: 'agTextColumnFilter', cellRenderer: renderOrderId },
        { headerName: "Recognition Date", field: "recognitionDate", minWidth: 170, filter: 'agDateColumnFilter', cellRenderer: renderRecognitionDate },
        { headerName: "Expiry Date", field: "expiryDate", minWidth: 170, filter: 'agDateColumnFilter', cellRenderer: renderExpiryDate },
        { headerName: "Customer name", field: "customerName", minWidth: 150, filter: 'agTextColumnFilter' },
        { headerName: "Advisor name", field: "advisorName", minWidth: 150, filter: 'agTextColumnFilter' },
        { headerName: "Advisor ID", field: "advisorId", minWidth: 100, filter: 'agTextColumnFilter' },
        { headerName: "Redemption Status", field: "redemptionStatus", minWidth: 150, filter: 'agTextColumnFilter', cellRenderer: renderStatus },
        { headerName: "Redemption Order", field: "redemptionOrder", minWidth: 150, filter: 'agTextColumnFilter', cellRenderer: renderRedemptionOrderId },
        { headerName: "Redemption Date", field: "redemptionDate", minWidth: 170, filter: 'agDateColumnFilter', cellRenderer: renderRedemptionDate }
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
                if (params.sortModel.length == 1 && this.redemptionArray.length > 0) {
                    if (params.sortModel[0].colId === 'recognitionDate' || params.sortModel[0].colId === 'expiryDate' || params.sortModel[0].colId === 'redemptionDate') {
                        this.redemptionArray.sort(sortDate(params.sortModel[0].colId, params.sortModel[0].sort));
                    } else {
                        this.redemptionArray.sort(this.paginationService.sortValues(params.sortModel[0].colId, params.sortModel[0].sort));
                    }
                    setTimeout(() => {
                        api.hideOverlay();
                        if (this.totalElements === 0) {
                            api.showNoRowsOverlay();
                        }
                        params.successCallback(this.redemptionArray, this.totalElements);
                    }, 500)
                    this.gridOptions.defaultColDef.sort = params.sortModel[0].sort;
                } else {
                    this.page = params.startRow / 10 + 1;

                    this.hostGiftService.getRedemption(this.page, 10, params).subscribe(response => {
                        if (response.code === 200) {
                            this.redemptionArray = response.data;
                            this.totalElements = response.total;
                            setTimeout(() => {
                                api.hideOverlay();
                                if (response.data.length === 0) {
                                    api.showNoRowsOverlay();
                                }
                                params.successCallback(response.data, response.total);
                            }, 500)
                        } else {
                            this.notification(response.message, true);
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

function renderRecognitionDate(params) {
    let dateFormat;
    if (params.data) {
        let dP = new DatePipe("en-US");
        let date = null;
        date = params.data.recognitionDate ? (params.data.recognitionDate).substring() : date;
        dateFormat = date ? (dP.transform(date, 'dd/MM/yyyy')) : null;
    }
    return dateFormat;
}

function renderExpiryDate(params) {
    let dateFormat;
    if (params.data) {
        let dP = new DatePipe("en-US");
        let date = null;
        date = params.data.expiryDate ? (params.data.expiryDate).substring() : date;
        dateFormat = date ? (dP.transform(date, 'dd/MM/yyyy')) : null;
    }
    return dateFormat;
}

function renderRedemptionDate(params) {
    let dateFormat;
    if (params.data) {
        let dP = new DatePipe("en-US");
        let date = null;
        date = params.data.redemptionDate ? (params.data.redemptionDate).substring() : date;
        dateFormat = date ? (dP.transform(date, 'dd/MM/yyyy')) : null;
    }
    return dateFormat;
}

function renderOrderId(params) {
    let orderIdFormat;
    if (params.data) {
        let orderId = null;
        orderId = params.data.orderId ? Number(params.data.orderId) : orderId;
        orderIdFormat = orderId ? `#${orderId}` : "";
    }
    return orderIdFormat;
}

function renderRedemptionOrderId(params) {
    let orderIdFormat;
    if (params.data) {
        let orderId = null;
        orderId = params.data.redemptionOrder ? Number(params.data.redemptionOrder) : orderId;
        orderIdFormat = orderId ? `#${orderId}` : "";
    }
    return orderIdFormat;
}

function renderStatus(params) {
    let statusRender;
    if (params.data) {
        const status = params.data.redemptionStatus || "";
        if (status) {
            switch (status) {
                case 'NOT_YES':
                    statusRender = `<div class='not-yet'>Not yet</div>`;
                    break;
                case 'REDEEMED':
                    statusRender = `<div class='redeemed'>Redeemed</div>`;
                    break;
                case 'EXPIRED':
                    statusRender = `<div class='expired'>Expired</div>`;
                    break;
                case 'NOT_APPLICABLE':
                    statusRender = `<div class='expired'>Expired</div>`;
                    break;
            }
        }
    }
    return statusRender;
}