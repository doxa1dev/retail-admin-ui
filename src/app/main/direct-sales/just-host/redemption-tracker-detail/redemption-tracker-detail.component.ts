import { AllModules, GridApi, GridSizeChangedEvent } from '@ag-grid-enterprise/all-modules';
import { Location } from "@angular/common";
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { RequestDetail, STATUS } from 'app/core/models/just-host.model';
import { TimeLine } from 'app/core/service/category.service';
import { JustHostService } from 'app/core/service/just-host.service';
import { CommonDialogComponent } from 'app/main/_shared/common-dialog/common-dialog.component';
import { ConfirmDialogComponent } from 'app/main/_shared/confirm-dialog/confirm-dialog.component';
import { DialogDropdownTextareaComponent } from 'app/main/_shared/dialog-dropdown-textarea/dialog-dropdown-textarea.component';
import { MatProgressButtonOptions } from 'mat-progress-buttons';

@Component({
    selector: 'app-guest-tracker-detail',
    templateUrl: './redemption-tracker-detail.component.html',
    styleUrls: ['./redemption-tracker-detail.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class RedemptionTrackerDetailComponent implements OnInit {
    defaultColDef;
    gridOptions;
    modules = AllModules;
    gridApi: GridApi;
    loadingTemplate: string;
    emptyTemplate: string;

    requestDetail: RequestDetail = new RequestDetail();
    requestId: string = "";
    histories: TimeLine[] = [];

    barButtonRejectOptions: MatProgressButtonOptions = {
        active: false,
        text: 'REJECT',
        raised: true,
        stroked: false,
        mode: 'indeterminate',
        value: 0,
        disabled: false,
        fullWidth: false,
        customClass: 'button-reject'
    }

    barButtonApproveOptions: MatProgressButtonOptions = {
        active: false,
        text: 'APPROVE',
        raised: true,
        stroked: false,
        mode: 'indeterminate',
        value: 0,
        disabled: false,
        fullWidth: false,
        customClass: 'button-approve'
    }

    columnDefs = [
        { headerName: "Guest Name", field: "guestName", sortable: true, minWidth: 200, resizable: true },
        { headerName: "Phone Number", field: "phoneNumber", sortable: true, minWidth: 200, resizable: true },
    ];

    comments = [
        { label: 'Comment 1', value: 'Comment 1' },
        { label: 'Comment 2', value: 'Comment 2' },
        { label: 'Comment 3', value: 'Comment 3' },
        { label: 'Comment 4', value: 'Comment 4' },
    ]

    constructor(
        private justHostService: JustHostService,
        public dialog: MatDialog,
        private route: ActivatedRoute,
        private location: Location,
    ) {
        this.gridOptions = {};
        this.defaultColDef = {
            resizable: true,
            sortable: false,
            suppressMenu: true,
            floatingFilterComponentParams: { suppressFilterButton: true }
        };
        this.loadingTemplate = `<span class="ag-overlay-loading-center">Loading...</span>`;
        this.emptyTemplate = `<span class="ag-overlay-loading-center">Empty</span>`;
    }

    async ngOnInit(): Promise<void> {
        await this.route.queryParams.subscribe(params => {
            this.requestId = params.id || "";
        });

        this.getDetail();
    }

    getDetail() {
        this.justHostService.getRequestDetail(this.requestId).subscribe(
            (response) => {
                if (response.requestDetail && response.histories) {
                    this.requestDetail = response.requestDetail;
                    this.histories = response.histories;

                    if (this.requestDetail.status === STATUS.REJECTED || this.requestDetail.status === STATUS.NOT_YES
                    || this.requestDetail.status === STATUS.REDEEMED || this.requestDetail.status === STATUS.EXPIRED) {
                        this.barButtonApproveOptions.disabled = true;
                        this.barButtonRejectOptions.disabled = true;
                    }
                } else {
                    this.notification(response.message || "Get detail failed. Please try again.", true);
                }
            },
            (error) => {
                this.notification(error.message, true);
            }
        )
    }

    onGridReady(params) {
        this.gridApi = params.api;
        params.api.sizeColumnsToFit();
    }

    onGridSizeChanged(params: GridSizeChangedEvent) {
        params.api.sizeColumnsToFit();
    }

    back() {
        this.location.back();
    }

    reject() {
        const dialogComment = this.dialog.open(DialogDropdownTextareaComponent, {
            width: "500px",
            data: {
                comments: this.comments,
            },
        });
        dialogComment.afterClosed().subscribe((result) => {
            if (result && result.state === true) {
                this.barButtonRejectOptions.active = true;
                this.barButtonRejectOptions.text = "In process...";
                let body = {
                    id: this.requestId,
                    comment: result.data.comment
                }
                this.justHostService.rejectRequest(body).subscribe(
                    (response) => {
                        this.barButtonRejectOptions.active = false;
                        this.barButtonRejectOptions.text = "REJECT";
                        if (response.code === 200) {
                            this.notification("Reject successfully.", false)
                                .afterClosed().subscribe(() => {
                                    this.getDetail();
                                })
                        } else {
                            this.notification(response.message || "Reject failed.", true);
                        }
                    },
                    (error) => {
                        this.barButtonRejectOptions.active = false;
                        this.barButtonRejectOptions.text = "REJECT";
                        this.notification(error.message || "Something went wrong! Please try again.", true);
                    }
                )
            }
        });
    }

    approve() {
        const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
            width: "500px",
            data: {
                message: "Are you sure to approve this request?", type: "APPROVED"
            },
        });
        confirmDialog.afterClosed().subscribe((result) => {
            if (result === true) {
                this.barButtonApproveOptions.active = true;
                this.barButtonApproveOptions.text = "In process...";
                let body = {
                    id: this.requestId,
                    comment: null
                }
                this.justHostService.approveRequest(body).subscribe(
                    (response) => {
                        this.barButtonApproveOptions.active = false;
                        this.barButtonApproveOptions.text = "APPROVE";
                        if (response.code === 200) {
                            this.notification("Approve successfully.", false)
                                .afterClosed().subscribe(() => {
                                    this.getDetail();
                                })
                        } else {
                            this.notification(response.message || "Approve failed.", true);
                        }
                    },
                    (error) => {
                        this.barButtonApproveOptions.active = false;
                        this.barButtonApproveOptions.text = "APPROVE";
                        this.notification(error.message || "Something went wrong! Please try again.", true);
                    }
                )
            }
        });
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

        return dialogNotifi;
    }
}
