import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatProgressButtonOptions } from 'mat-progress-buttons';
import { schema } from 'app/core/models/import-data.model';
import readXlsxFile from 'read-excel-file';
import { ImportDataService } from 'app/core/service/import-data.service';
import { MatDialog } from '@angular/material/dialog';
import { CommonDialogComponent } from 'app/main/_shared/common-dialog/common-dialog.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AllModules } from '@ag-grid-enterprise/all-modules';
import { GridSizeChangedEvent } from 'ag-grid-community';

@Component({
    selector: 'app-import-data',
    templateUrl: './import-data.component.html',
    styleUrls: ['./import-data.component.scss']
})
export class ImportDataComponent implements OnInit {

    @ViewChild('inputFile') inputFile: ElementRef;
    arrData: any;
    id : number;
    inputId: string;
    importForm : FormGroup;
    fileName: string;

    hasErrorRecord: boolean;
    loadingTemplate;
    defaultColDef;
    errorRecords: any[];
    modules = AllModules;
    gridApi;
    gridOptions = {
        rowHeight : 50,
        rowStyle : { 'padding': '10px 0px'},
        sortable: false,
        width: 40
    };
    columnDefs = [
        { headerName: "Message Error", field: "messageError", },
        { headerName: "Rank", field: "rank" },
        { headerName: "EntityID", field: "entityId" },
        { headerName: "BranchMgrAdvisorID", field: "branchMgrAdvisorID" },
        { headerName: "MgrAdvisorID", field: "mgrAdvisorID", },
        { headerName: "AdvisorID", field: "advisorID", },
        { headerName: "AdvisorName", field: "advisorName", },
        { headerName: "NIC", field: "nic" },
        { headerName: "DOB", field: "dob" },
        { headerName: "NationalityCode", field: "nationalityCode", },
        { headerName: "Address1", field: "address1", },
        { headerName: "Address2", field: "address2", },
        { headerName: "Address3", field: "address3", },
        { headerName: "PostCode", field: "postCode", },
        { headerName: "StateCode", field: "stateCode", },
        { headerName: "CountryCode", field: "countryCode", },
        { headerName: "PhoneDialCode", field: "phoneDialCode", },
        { headerName: "MobilePhoneNew", field: "mobilePhoneNew", },
        { headerName: "emailNew", field: "emailNew", },
        { headerName: "Gender", field: "gender", },
        { headerName: "Designation", field: "designation", },
        { headerName: "RecruiterAdvisorID", field: "recruiterAdvisorID", },
        { headerName: "NickName", field: "nickName", },
        { headerName: "BankCode", field: "bankCode", },
        { headerName: "BankAccNo", field: "bankAccNo", },
        { headerName: "BankHolder", field: "bankHolder", },
        { headerName: "BankHolderIC", field: "bankHolderIC", },
    ];

    barButtonOptions: MatProgressButtonOptions = {
        active: false,
        text: 'Import data',
        raised: true,
        stroked: false,
        mode: 'indeterminate',
        value: 0,
        disabled: false,
        fullWidth: false,
        customClass: 'import-data-button'
    }

    submitIdButtonOptions: MatProgressButtonOptions = {
        active: false,
        text: 'Submit',
        raised: true,
        stroked: false,
        mode: 'indeterminate',
        value: 0,
        disabled: false,
        fullWidth: false,
        customClass: 'btn-submit'
    }

    submitPaymentGiftIdButtonOptions: MatProgressButtonOptions = {
        active: false,
        text: 'Submit',
        raised: true,
        stroked: false,
        mode: 'indeterminate',
        value: 0,
        disabled: false,
        fullWidth: false,
        customClass: 'btn-submit'
    }

    submitSerialNumberButtonOptions: MatProgressButtonOptions = {
        active: false,
        text: 'Submit',
        raised: true,
        stroked: false,
        mode: 'indeterminate',
        value: 0,
        disabled: false,
        fullWidth: false,
        customClass: 'btn-submit'
    }

    submitCustomerIdButtonOptions: MatProgressButtonOptions = {
        active: false,
        text: 'Submit',
        raised: true,
        stroked: false,
        mode: 'indeterminate',
        value: 0,
        disabled: false,
        fullWidth: false,
        customClass: 'btn-submit'
    }

    constructor (
        private formBuilder: FormBuilder,
        public dialog: MatDialog,
        private _importDataService: ImportDataService,
    ) {
        this.arrData = [];
        this.fileName = "";
        this.hasErrorRecord = false;
        this.errorRecords = [];
        this.defaultColDef = {
            resizable: true,
            sortable :true , filter: 'agTextColumnFilter',
            suppressMenu: true,
            floatingFilterComponentParams: {suppressFilterButton:true}
        };
        this.loadingTemplate = `<span class="ag-overlay-loading-center">Loading...</span>`;
    }

    ngOnInit(): void {
        this.importForm = this.formBuilder.group({
            id: ['', Validators.pattern("^[0-9]*$")],
            payment_gift_id: ['', Validators.pattern("^[0-9]*$")],
            serial_number: ['', Validators.pattern("^[0-9]*$")],
            customer_id: ['', Validators.pattern("^[0-9]*$")],
        })
    }

    onGridReady(params){
        this.gridApi = params.api;
    }

    onGridSizeChanged(params: GridSizeChangedEvent) {

    }

    importData(inputFile: HTMLElement) {
        this.hasErrorRecord = false;
        this.errorRecords = [];
        
        inputFile.click();
    }

    onFileChange(event: any) {
        if (event.target.files.length === 1) {
            this.fileName = event.target.files[0].name;
            this.barButtonOptions.active = true;
            this.barButtonOptions.text = 'In process...';
            let file = event.target.files[0];
            this.arrData = {
                data: []
            };
            readXlsxFile(file, { schema, dateFormat: 'dd/MM/yyyy' }).then(({ rows, errors }) => {
                this.arrData.data = rows;
                this.arrData.data.forEach((element, index) => {
                    this.arrData.data[index].customerField.day_of_birth = (new Date(element.customerField.day_of_birth)).toISOString();
                })
                if (errors.length > 0) {
                    let strError = errors.join("\n");
                    const dialogNotifi = this.dialog.open(CommonDialogComponent, {
                        width: "600px",
                        data: {
                            message: strError,
                            title: "NOTIFICATION",
                            colorButton: true
                        },
                    });
                    dialogNotifi.afterClosed().subscribe(() => {
                        return;
                    });
                }

                this._importDataService.importData(this.arrData).subscribe((response) => {
                    this.barButtonOptions.active = false;
                    this.barButtonOptions.text = "Import data";
                    if (!response && !response.code) {
                        let message = "Something went wrong! Please try again later!";
                        const dialogNotifi = this.dialog.open(CommonDialogComponent, {
                            width: "600px",
                            data: {
                                message: message,
                                title: "NOTIFICATION",
                                colorButton: true
                            },
                        });
                        dialogNotifi.afterClosed().subscribe(() => {
                            return;
                        });
                    }
                    if (response.code && response.code === 200) {
                        const dialogNotifi = this.dialog.open(CommonDialogComponent, {
                            width: "600px",
                            data: {
                                message: rows.length > 1 ? `Import success ${rows.length} records` : `Import success ${rows.length} record`,
                                title: "NOTIFICATION",
                                colorButton: false
                            },
                        });
                        dialogNotifi.afterClosed().subscribe(() => {
                            return;
                        });
                    } else if (response.code === 201) {
                        this.hasErrorRecord = true;
                        this.errorRecords = response.recordErrors ? response.recordErrors : [];
                        let message = "";
                        message += response.numRecordErrors > 1 ? `Import fail ${response.numRecordErrors} records, ` :
                                                                    `Import fail ${response.numRecordErrors} record, `;
                        message += (rows.length - response.numRecordErrors > 1) ? `success ${rows.length - response.numRecordErrors} records` :
                                                        `success ${rows.length - response.numRecordErrors} record`;
                        const dialogNotifi = this.dialog.open(CommonDialogComponent, { 
                            width: "600px",
                            data: {
                                message: message,
                                title: "NOTIFICATION",
                                colorButton: true
                            },
                        });
                        dialogNotifi.afterClosed().subscribe(() => {
                            return;
                        });
                    }
                });
            });
        }
    }

    get f() { return this.importForm.controls };

    importId(){
        if (this.f.id.errors?.pattern) return;

        this.submitIdButtonOptions.active = true;
        this.submitIdButtonOptions.text = 'In process...';

        this.inputId = this.importForm.value.id;
        this._importDataService.importDataId(this.inputId).subscribe(data => {
            this.submitIdButtonOptions.active = false;
            this.submitIdButtonOptions.text = 'Submit';
            if(data && data.code === 200) {
                const dialogNotifi = this.dialog.open(CommonDialogComponent, {
                    width: "500px",
                    data: {
                        message: "Import successfully.",
                        title: "NOTIFICATION",
                        colorButton: false
                    },
                });

                dialogNotifi.afterClosed().subscribe(() => {
                    return;
                });
            } else if (data && data.code !== 200) {
                const dialogNotifi = this.dialog.open(CommonDialogComponent, {
                    width: "500px",
                    data: {
                        message: data.message,
                        title: "NOTIFICATION",
                        colorButton: true
                    },
                });

                dialogNotifi.afterClosed().subscribe(() => {
                    return;
                });
            } else {
                let message = "Something went wrong! Please try again later!";
                const dialogNotifi = this.dialog.open(CommonDialogComponent, {
                    width: "600px",
                    data: {
                        message: message,
                        title: "NOTIFICATION",
                        colorButton: true
                    },
                });
                dialogNotifi.afterClosed().subscribe(() => {
                    return;
                });
            }
        })
    }

    importPaymentGiftId() {
        if (this.f.payment_gift_id.errors?.pattern) return;
        
        this.submitPaymentGiftIdButtonOptions.active = true;
        this.submitPaymentGiftIdButtonOptions.text = 'In process...';

        this._importDataService.importPaymentGiftId(this.importForm.value.payment_gift_id).subscribe((response: any) => {
            this.submitPaymentGiftIdButtonOptions.active = false;
            this.submitPaymentGiftIdButtonOptions.text = 'Submit';
            if (response && response.code === 200) {
                const dialogNotifi = this.dialog.open(CommonDialogComponent, {
                    width: "600px",
                    data: {
                        message: "Import successfully.",
                        title: "NOTIFICATION",
                        colorButton: false
                    },
                });
                dialogNotifi.afterClosed().subscribe(() => {
                    return;
                });
            } else if (response && response.code !== 200) {
                const dialogNotifi = this.dialog.open(CommonDialogComponent, {
                    width: "600px",
                    data: {
                        message: response.message ? response.message : "",
                        title: "NOTIFICATION",
                        colorButton: true
                    },
                });
                dialogNotifi.afterClosed().subscribe(() => {
                    return;
                });
            } else {
                let message = "Something went wrong! Please try again later!";
                const dialogNotifi = this.dialog.open(CommonDialogComponent, {
                    width: "600px",
                    data: {
                        message: message,
                        title: "NOTIFICATION",
                        colorButton: true
                    },
                });
                dialogNotifi.afterClosed().subscribe(() => {
                    return;
                });
            }
        })
    }

    importSerialNumber() {
        if (this.f.serial_number.errors?.pattern) return;

        this.submitSerialNumberButtonOptions.active = true;
        this.submitSerialNumberButtonOptions.text = 'In process...';

        this._importDataService.importSerialNumber(this.importForm.value.serial_number).subscribe((response: any) => {
            this.submitSerialNumberButtonOptions.active = false;
            this.submitSerialNumberButtonOptions.text = 'Submit';
            if (response && response.code === 200) {
                const dialogNotifi = this.dialog.open(CommonDialogComponent, {
                    width: "600px",
                    data: {
                        message: "Import successfully.",
                        title: "NOTIFICATION",
                        colorButton: false
                    },
                });
                dialogNotifi.afterClosed().subscribe(() => {
                    return;
                });
            } else if (response && response.code !== 200) {
                const dialogNotifi = this.dialog.open(CommonDialogComponent, {
                    width: "600px",
                    data: {
                        message: response.message ? response.message : "",
                        title: "NOTIFICATION",
                        colorButton: true
                    },
                });
                dialogNotifi.afterClosed().subscribe(() => {
                    return;
                });
            } else {
                let message = "Something went wrong! Please try again later!";
                const dialogNotifi = this.dialog.open(CommonDialogComponent, {
                    width: "600px",
                    data: {
                        message: message,
                        title: "NOTIFICATION",
                        colorButton: true
                    },
                });
                dialogNotifi.afterClosed().subscribe(() => {
                    return;
                });
            }
        })
    }

    importCustomerId() {
        if (this.f.customer_id.errors?.pattern) return;

        this.submitCustomerIdButtonOptions.active = true;
        this.submitCustomerIdButtonOptions.text = 'In process...';

        this._importDataService.importCustomerId(this.importForm.value.customer_id).subscribe((response: any) => {
            this.submitCustomerIdButtonOptions.active = false;
            this.submitCustomerIdButtonOptions.text = 'Submit';
            if (response && response.code === 200) {
                const dialogNotifi = this.dialog.open(CommonDialogComponent, {
                    width: "600px",
                    data: {
                        message: "Import successfully.",
                        title: "NOTIFICATION",
                        colorButton: false
                    },
                });
                dialogNotifi.afterClosed().subscribe(() => {
                    return;
                });
            } else if (response && response.code !== 200) {
                const dialogNotifi = this.dialog.open(CommonDialogComponent, {
                    width: "600px",
                    data: {
                        message: response.message ? response.message : "Import failed.",
                        title: "NOTIFICATION",
                        colorButton: true
                    },
                });
                dialogNotifi.afterClosed().subscribe(() => {
                    return;
                });
            } else {
                let message = "Something went wrong! Please try again later!";
                const dialogNotifi = this.dialog.open(CommonDialogComponent, {
                    width: "600px",
                    data: {
                        message: message,
                        title: "NOTIFICATION",
                        colorButton: true
                    },
                });
                dialogNotifi.afterClosed().subscribe(() => {
                    return;
                });
            }
        }, (error) => {
            this.submitCustomerIdButtonOptions.active = false;
            this.submitCustomerIdButtonOptions.text = 'Submit';
            const dialogNotifi = this.dialog.open(CommonDialogComponent, {
                    width: "600px",
                    data: {
                        message: error.statusText,
                        title: "NOTIFICATION",
                        colorButton: true
                    },
                });
                dialogNotifi.afterClosed().subscribe(() => {
                    return;
                });
        })
    }
}
