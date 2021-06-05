import { AllModules, GridSizeChangedEvent } from '@ag-grid-enterprise/all-modules';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DataTransfer, DataTransferMemmember, STATUS } from 'app/core/models/data-transfer-check.model';
import { DataTransferCheckService } from 'app/core/service/data-transfer-check.service';
import { CommonDialogComponent } from 'app/main/_shared/common-dialog/common-dialog.component';
import { MatProgressButtonOptions } from 'mat-progress-buttons';

@Component({
    selector: 'app-data-transfer-check',
    templateUrl: './data-transfer-check.component.html',
    styleUrls: ['./data-transfer-check.component.scss']
})
export class DataTransferCheckComponent implements OnInit {
    check_eo_sle_sc_array: DataTransfer[];
    check_eo_sle_sc_det_gift_array: DataTransfer[];
    check_eo_sle_sc_det_serial_number_array: DataTransfer[];
    check_memmember_array: DataTransferMemmember[];
    columnDefs;
    columnDefsCheckMemmember;
    defaultColDef;
    loadingTemplate: string;
    emptyTemplate: string;
    gridOptions;
    modules = AllModules;
    form_eo_sle_sc: FormGroup;
    form_eo_sle_sc_det_gift: FormGroup;
    form_eo_sle_sc_det_serial_number: FormGroup;
    form_memmember: FormGroup;
    showError1: boolean; // show error eo_sle_sc
    showError2: boolean; // show error eo_sle_sc_det_gift
    showError3: boolean; // show error eo_sle_sc_det_serial_number
    showError4: boolean; // show error memmember
    gridApi1; // grid api table eo_sle_sc
    gridApi2; // grid api table eo_sle_sc_det_gift
    gridApi3; // grid api table eo_sle_sc_det_serial_number
    gridApi4; // grid api table memmember
    listStatus1: any[] = []; // list status for eo_sle_sc and eo_sle_sc_det_gift
    listStatus2: any[] = []; // list status for eo_sle_sc_det_serial_number

    check_eo_sle_sc_button: MatProgressButtonOptions = {
        active: false,
        text: 'Check',
        raised: true,
        stroked: false,
        mode: 'indeterminate',
        value: 0,
        disabled: false,
        fullWidth: false,
        customClass: 'btn-check'
    }

    check_memmember_button: MatProgressButtonOptions = {
        active: false,
        text: 'Check',
        raised: true,
        stroked: false,
        mode: 'indeterminate',
        value: 0,
        disabled: false,
        fullWidth: false,
        customClass: 'btn-check'
    }

    check_eo_sle_sc_det_gift_button: MatProgressButtonOptions = {
        active: false,
        text: 'Check',
        raised: true,
        stroked: false,
        mode: 'indeterminate',
        value: 0,
        disabled: false,
        fullWidth: false,
        customClass: 'btn-check'
    }

    check_eo_sle_sc_det_serial_number_button: MatProgressButtonOptions = {
        active: false,
        text: 'Check',
        raised: true,
        stroked: false,
        mode: 'indeterminate',
        value: 0,
        disabled: false,
        fullWidth: false,
        customClass: 'btn-check'
    }

    constructor(
        private formBuilder: FormBuilder,
        private dataTransferCheckService: DataTransferCheckService,
        public dialog: MatDialog,
    ) {
        this.gridOptions = {
            rowHeight: 50,
            rowStyle: { 'padding': '10px 0px' },
        };

        this.defaultColDef = {
            resizable: true,
            sortable: false,
            suppressMenu: true,
            floatingFilterComponentParams: { suppressFilterButton: true },
        };

        this.columnDefs = [
            { headerName: "Order Id", field: "orderId", filter: 'agTextColumnFilter', cellRenderer: renderOrderId },
            { headerName: "Created Time", field: "createdTime", filter: 'agTextColumnFilter' },
            { headerName: "Payment Verified Time", field: "paymentVerifiedTime", filter: 'agTextColumnFilter' },
        ];

        this.columnDefsCheckMemmember = [
            { headerName: "Advisor Id", field: "advisorId", filter: 'agTextColumnFilter' },
            { headerName: "Email", field: "email", filter: 'agTextColumnFilter' },
            { headerName: "Created Time", field: "createdTime", filter: 'agTextColumnFilter' },
        ]

        this.loadingTemplate = `<span class="ag-overlay-loading-center">Loading...</span>`;

        this.emptyTemplate = `<span class="ag-overlay-loading-center">Empty</span>`;

        this.check_eo_sle_sc_array = [];

        this.check_eo_sle_sc_det_gift_array = [];

        this.check_eo_sle_sc_det_serial_number_array = [];

        this.check_memmember_array = [];

        this.listStatus1 = [
            { label: 'To Ship', value: STATUS.TO_SHIP },
            { label: 'To Receive', value: STATUS.TO_RECEIVE },
            { label: 'To Host', value: STATUS.TO_HOST },
            { label: 'To Unbox', value: STATUS.TO_UNBOX },
            { label: 'Completed', value: STATUS.COMPLETED }
        ]

        this.listStatus2 = [
            { label: 'To Receive', value: STATUS.TO_RECEIVE },
            { label: 'To Host', value: STATUS.TO_HOST },
            { label: 'To Unbox', value: STATUS.TO_UNBOX },
            { label: 'Completed', value: STATUS.COMPLETED }    
        ]

        this.form_eo_sle_sc = this.formBuilder.group({
            start: ['', [Validators.required]],
            end: ['', [Validators.required]],
            status: [this.listStatus1[0], [Validators.required]]
        });

        this.form_eo_sle_sc_det_gift = this.formBuilder.group({
            start: ['', [Validators.required]],
            end: ['', [Validators.required]],
            status: [this.listStatus1[0], [Validators.required]]
        });

        this.form_eo_sle_sc_det_serial_number = this.formBuilder.group({
            start: ['', [Validators.required]],
            end: ['', [Validators.required]],
            status: [this.listStatus2[0], [Validators.required]]
        });

        this.form_memmember = this.formBuilder.group({
            start: ['', [Validators.required]],
            end: ['', [Validators.required]]
        });

        this.showError1 = false;

        this.showError2 = false;

        this.showError3 = false;

        this.showError4 = false;
    }

    ngOnInit(): void {

    }

    onGridReady1(params) { // onGridReader eo_sle_sc
        this.gridApi1 = params.api;
        params.api.sizeColumnsToFit();
    }

    onGridSizeChanged1(params: GridSizeChangedEvent) { // onGridSizeChanged eo_sle_sc
        params.api.sizeColumnsToFit();
    }

    onGridReady2(params) { // onGridReader eo_sle_sc_det_gift
        this.gridApi2 = params.api;
        params.api.sizeColumnsToFit();
    }

    onGridSizeChanged2(params: GridSizeChangedEvent) { // onGridSizeChanged eo_sle_sc_det_gift
        params.api.sizeColumnsToFit();
    }

    onGridReady3(params) { // onGridReader eo_sle_sc_det_serial_number
        this.gridApi3 = params.api;
        params.api.sizeColumnsToFit();
    }

    onGridSizeChanged3(params: GridSizeChangedEvent) { // onGridSizeChanged eo_sle_sc_det_serial_number
        params.api.sizeColumnsToFit();
    }

    onGridReady4(params) { // onGridReader memmember
        this.gridApi4 = params.api;
        params.api.sizeColumnsToFit();
    }

    onGridSizeChanged4(params: GridSizeChangedEvent) { // onGridSizeChanged memmember
        params.api.sizeColumnsToFit();
    }

    check_eo_sle_sc_func() {
        this.showError1 = true;

        if (this.form_eo_sle_sc.invalid) return;

        if ((new Date(this.form_eo_sle_sc.value.start).getTime() > (new Date(this.form_eo_sle_sc.value.end)).getTime())) {
            this.notifiDialog("Start date must be before End date.", true)
                .afterClosed().subscribe(() => { return; } )
            return;
        }

        this.check_eo_sle_sc_button.active = true;
        this.check_eo_sle_sc_button.text = "In process...";

        this.gridApi1.hideOverlay();
        this.gridApi1.showLoadingOverlay();

        this.dataTransferCheckService.checkEoSleSc(this.form_eo_sle_sc.value).subscribe(
            (response) => {
                this.gridApi1.hideOverlay();
                this.check_eo_sle_sc_button.active = false;
                this.check_eo_sle_sc_button.text = "Check";
                if (response.code === 200) {
                    this.check_eo_sle_sc_array = response.data;
                    if (response.data.length === 0) {
                        this.gridApi1.showNoRowsOverlay();
                    }
                } else {
                    this.notifiDialog(response.data || "System went error! Please try again later.", true)
                        .afterClosed().subscribe(() => { this.check_eo_sle_sc_array = []; });
                    this.gridApi1.showNoRowsOverlay();
                }
            },
            (error) => {
                this.check_eo_sle_sc_button.active = false;
                this.check_eo_sle_sc_button.text = "Check";
                this.notifiDialog(error.message || "System went error! Please try again later.", true)
                    .afterClosed().subscribe(() => { this.check_eo_sle_sc_array = []; });
                this.gridApi1.hideOverlay();
                this.gridApi1.showNoRowsOverlay();
            }
        )
    }

    check_eo_sle_sc_det_gift_func() {
        this.showError2 = true;

        if (this.form_eo_sle_sc_det_gift.invalid) return;

        if ((new Date(this.form_eo_sle_sc_det_gift.value.start).getTime() > (new Date(this.form_eo_sle_sc_det_gift.value.end)).getTime())) {
            this.notifiDialog("Start date must be before End date.", true)
                .afterClosed().subscribe(() => { return; } )
            return;
        }

        this.check_eo_sle_sc_det_gift_button.active = true;
        this.check_eo_sle_sc_det_gift_button.text = "In process...";

        this.gridApi2.hideOverlay();
        this.gridApi2.showLoadingOverlay();

        this.dataTransferCheckService.checkEoSleScDetGift(this.form_eo_sle_sc_det_gift.value).subscribe(
            (response) => {
                this.check_eo_sle_sc_det_gift_button.active = false;
                this.check_eo_sle_sc_det_gift_button.text = "Check";
                if (response.code === 200) {
                    this.check_eo_sle_sc_det_gift_array = response.data;
                    if (response.data.length === 0) {
                        this.gridApi2.showNoRowsOverlay();
                    }
                } else {
                    this.notifiDialog(response.data || "System went error! Please try again later.", true)
                    .afterClosed().subscribe(() => { this.check_eo_sle_sc_det_gift_array = []; });
                    this.gridApi2.showNoRowsOverlay();
                }
            },
            (error) => {
                this.check_eo_sle_sc_det_gift_button.active = false;
                this.check_eo_sle_sc_det_gift_button.text = "Check";
                this.notifiDialog(error.message || "System went error! Please try again later.", true)
                    .afterClosed().subscribe(() => { this.check_eo_sle_sc_det_gift_array = []; });
                this.gridApi2.hideOverlay();
                this.gridApi2.showNoRowsOverlay();
            }
        )
    }

    check_eo_sle_sc_det_serial_number_func() {
        this.showError3 = true;

        if (this.form_eo_sle_sc_det_serial_number.invalid) return;

        if ((new Date(this.form_eo_sle_sc_det_serial_number.value.start).getTime() > (new Date(this.form_eo_sle_sc_det_serial_number.value.end)).getTime())) {
            this.notifiDialog("Start date must be before End date.", true)
                .afterClosed().subscribe(() => { return; } )
            return;
        }

        this.check_eo_sle_sc_det_serial_number_button.active = true;
        this.check_eo_sle_sc_det_serial_number_button.text = "In process...";

        this.gridApi3.hideOverlay();
        this.gridApi3.showLoadingOverlay();

        this.dataTransferCheckService.checkEoSleScDetSerialNumber(this.form_eo_sle_sc_det_serial_number.value).subscribe(
            (response) => {
                this.check_eo_sle_sc_det_serial_number_button.active = false;
                this.check_eo_sle_sc_det_serial_number_button.text = "Check";
                if (response.code === 200) {
                    this.check_eo_sle_sc_det_serial_number_array = response.data;
                    if (response.data.length === 0) {
                        this.gridApi3.showNoRowsOverlay();
                    }
                } else {
                    this.notifiDialog(response.data || "System went error! Please try again later.", true)
                        .afterClosed().subscribe(() => { this.check_eo_sle_sc_det_serial_number_array = []; });
                    this.gridApi3.showNoRowsOverlay();
                }
            },
            (error) => {
                this.check_eo_sle_sc_det_serial_number_button.active = false;
                this.check_eo_sle_sc_det_serial_number_button.text = "Check";
                this.notifiDialog(error.message || "System went error! Please try again later.", true)
                    .afterClosed().subscribe(() => { this.check_eo_sle_sc_det_serial_number_array = []; });
                this.gridApi3.hideOverlay();
                this.gridApi3.showNoRowsOverlay();
            }
        )
    }

    check_memmember_func() {
        this.showError4 = true;

        if (this.form_memmember.invalid) return;

        if ((new Date(this.form_memmember.value.start).getTime() > (new Date(this.form_memmember.value.end)).getTime())) {
            this.notifiDialog("Start date must be before End date.", true)
                .afterClosed().subscribe(() => { return; } )
            return;
        }

        this.check_memmember_button.active = true;
        this.check_memmember_button.text = "In process...";

        this.gridApi4.hideOverlay();
        this.gridApi4.showLoadingOverlay();

        this.dataTransferCheckService.checkMemmember(this.form_memmember.value).subscribe(
            (response) => {
                this.check_memmember_button.active = false;
                this.check_memmember_button.text = "Check";
                if (response.code === 200) {
                    this.check_memmember_array = response.data;
                    if (response.data.length === 0) {
                        this.gridApi4.showNoRowsOverlay();
                    }
                } else {
                    this.notifiDialog(response.data || "System went error! Please try again later.", true)
                        .afterClosed().subscribe(() => { this.check_memmember_array = []; });
                    this.gridApi4.showNoRowsOverlay();
                }
            },
            (error) => {
                this.check_memmember_button.active = false;
                this.check_memmember_button.text = "Check";
                this.notifiDialog(error.message || "System went error! Please try again later.", true)
                    .afterClosed().subscribe(() => { this.check_memmember_array = []; });
                this.gridApi4.hideOverlay();
                this.gridApi4.showNoRowsOverlay();
            }
        )
    }

    notifiDialog(message: string, isError: boolean = false) {
        const dialogNotifi = this.dialog.open(CommonDialogComponent, {
            width: "600px",
            data: {
                message: message,
                title: "NOTIFICATION",
                colorButton: isError
            },
        });

        return dialogNotifi;
    }
}

const renderOrderId = (params) => {
    let result;
    if (params) {
        const orderId = params.value;
        result = orderId ? `#${orderId}` : result;
    }
    return result;
}