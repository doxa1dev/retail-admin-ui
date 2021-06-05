import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { HostGiftService } from 'app/core/service/host-gift.service';
import { JustHostService } from 'app/core/service/just-host.service';
import { ProductService } from 'app/core/service/product.service';
import { CommonDialogComponent } from 'app/main/_shared/common-dialog/common-dialog.component';
import { ConfirmDialogComponent } from 'app/main/_shared/confirm-dialog/confirm-dialog.component';
import { MatProgressButtonOptions } from 'mat-progress-buttons';

@Component({
    selector: 'app-component-setting',
    templateUrl: './component-setting.component.html',
    styleUrls: ['./component-setting.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class ComponentSettingComponent implements OnInit {
    histories: any[];
    justHosts: any[];
    justHostComponents: any[];
    settingForm: FormGroup;
    showError: boolean;
    isUpdate: boolean;

    barButtonOptions: MatProgressButtonOptions = {
        active: false,
        text: 'SAVE',
        raised: true,
        stroked: false,
        mode: 'indeterminate',
        value: 0,
        disabled: false,
        fullWidth: false,
        customClass: 'button-save'
    }

    constructor(
        private fb: FormBuilder,
        private productService: ProductService,
        public dialog: MatDialog,
        private justHostService: JustHostService,
        private hostGiftService: HostGiftService
    ) {
        this.settingForm = this.fb.group({
            justHosts: this.fb.array([])
        })
        this.histories = [];
        this.justHosts = [];
        this.justHostComponents = [];
        this.showError = false;
        this.isUpdate = false;
    }

    ngOnInit(): void {
        this.productService.getAllPaymentPromotionGifts().subscribe(data => {
            data = data.map(x => x = { label: x.label, value: Number(x.value) });
            this.justHosts = data;
            data.forEach(gift => {
                this.justHostComponents.push({ label: gift.label, value: { label: gift.label, value: gift.value } });
            });

            this.getDetailJustHost();
        })

        this.settingFormOnChange();
    }

    settingFormOnChange() {
        this.settingForm.valueChanges.subscribe(() => {
            this.barButtonOptions.disabled = !(this.settingForm.dirty || this.settingForm.touched) || this.settingForm.invalid;
        })
    }

    public get componentSettingItemsArray(): FormArray {
        return this.settingForm.get('justHosts') as FormArray;
    }

    getDetailJustHost() {
        while (this.componentSettingItemsArray.length) {
            this.componentSettingItemsArray.removeAt(0);
        }

        this.justHostService.getComponentSettingDetail().subscribe(
            (response) => {
                if (response && response.componentSettingItemsArray && response.histories) {
                    this.isUpdate = true;
                    console.log(response.componentSettingItemsArray);
                    response.componentSettingItemsArray.forEach((item, idx) => {
                        this.componentSettingItemsArray.push(
                            this.fb.group({
                                id: [null],
                                justHost: [null, Validators.required],
                                justHostComponent: [[], Validators.required],
                                isActive: [false, Validators.required]
                            })
                        )
                        this.componentSettingItemsArray.at(idx).patchValue({
                            id: item.id,
                            justHost: item.justHost,
                            justHostComponent: item.justHostComponent,
                            isActive: item.isActive,
                        })
                    });
                    if (this.componentSettingItemsArray.length === 0) {
                        this.isUpdate = false;
                        this.componentSettingItemsArray.push(
                            this.fb.group({
                                justHost: [null, Validators.required],
                                justHostComponent: [[], Validators.required],
                                isActive: [false, Validators.required]
                            })
                        )
                    }
                    this.histories = response.histories;
                    this.barButtonOptions.disabled = true;
                } else if (response) {
                    this.notifiDialog(response.message || "Get detail failed.", true)
                        .afterClosed()
                        .subscribe(() => {
                            this.componentSettingItemsArray.push(
                                this.fb.group({
                                    justHost: [null, Validators.required],
                                    justHostComponent: [[], Validators.required],
                                    isActive: [false, Validators.required]
                                })
                            )
                            this.barButtonOptions.disabled = true;
                            return;
                        });
                } else {
                    let message = "Something went wrong! Please try again later!";
                    this.notifiDialog(message, true)
                        .afterClosed()
                        .subscribe(() => {
                            this.componentSettingItemsArray.push(
                                this.fb.group({
                                    justHost: [null, Validators.required],
                                    justHostComponent: [[], Validators.required],
                                    isActive: [false, Validators.required]
                                })
                            )
                            this.barButtonOptions.disabled = true;
                            return;
                        });
                }
            },
            (error) => {
                this.notifiDialog(error.statusText || error.message, true)
                    .afterClosed()
                    .subscribe(() => {
                        this.componentSettingItemsArray.push(
                            this.fb.group({
                                justHost: [null, Validators.required],
                                justHostComponent: [[], Validators.required],
                                isActive: [false, Validators.required]
                            })
                        )
                        this.barButtonOptions.disabled = true;
                        return;
                    });
            }
        )
    }

    addJustHost() {
        this.componentSettingItemsArray.insert(
            0,
            this.fb.group({
                justHost: [null, Validators.required],
                justHostComponent: [[], Validators.required],
                isActive: [false, Validators.required]
            })
        )
    }

    deleteJustHost(index: number) {
        this.componentSettingItemsArray.removeAt(index);
        if (this.componentSettingItemsArray.length === 0) {
            this.componentSettingItemsArray.push(
                this.fb.group({
                    justHost: [null, Validators.required],
                    justHostComponent: [[], Validators.required],
                    isActive: [false, Validators.required]
                })
            )
            this.showError = false;
            this.isUpdate = false;
        }
        this.barButtonOptions.disabled = false;
    }

    save() {
        this.showError = true;
        if (this.settingForm.invalid) return;

        const { justHosts } = this.settingForm.value;
        let body = { data: [] };
        justHosts.forEach(gift => {
            if (gift.id) { // update
                body.data.push({
                    id: gift.id,
                    hotGift: gift.justHost.value,
                    hotGiftComponent: gift.justHostComponent.map(x => x.value),
                    isAtive: gift.isActive
                })
            } else { // create new
                body.data.push({
                    hotGift: gift.justHost.value,
                    hotGiftComponent: gift.justHostComponent.map(x => x.value),
                    isAtive: gift.isActive
                })
            }
        })

        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            width: "500px",
            data: { message: this.isUpdate ? "Are you sure to update?" : "Are you sure to create new?", type: "APPROVED" },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result === true) {
                this.barButtonOptions.active = true;
                this.barButtonOptions.text = "In process...";

                if (!this.isUpdate) {
                    this.justHostService.createNew(body).subscribe(
                        (response: any) => {
                            this.barButtonOptions.active = false;
                            this.barButtonOptions.text = "SAVE";

                            if (response && response.code === 200) {
                                this.notifiDialog("Create new successfully.", false)
                                    .afterClosed()
                                    .subscribe(() => {
                                        this.showError = false;
                                        this.getDetailJustHost();
                                        return;
                                    });
                            } else if (response && response.code !== 200) {
                                this.notifiDialog(response.message ? response.message : "Create new failed.", true)
                                    .afterClosed()
                                    .subscribe(() => {
                                        this.showError = false;
                                        return;
                                    });
                            } else {
                                let message = "Something went wrong! Please try again later!";
                                this.notifiDialog(message, true)
                                    .afterClosed()
                                    .subscribe(() => {
                                        this.showError = false;
                                        return;
                                    });
                            }
                        },
                        (error) => {
                            this.barButtonOptions.active = false;
                            this.barButtonOptions.text = "SAVE";

                            this.notifiDialog(error.statusText || error.message, true)
                                .afterClosed()
                                .subscribe(() => {
                                    this.showError = false;
                                    return;
                                });
                        }
                    )
                } else {
                    this.justHostService.update(body).subscribe(
                        (response: any) => {
                            this.barButtonOptions.active = false;
                            this.barButtonOptions.text = "SAVE";

                            if (response && response.code === 200) {
                                this.notifiDialog("Update successfully.", false)
                                    .afterClosed()
                                    .subscribe(() => {
                                        this.showError = false;
                                        this.getDetailJustHost();
                                        return;
                                    });
                            } else if (response && response.code !== 200) {
                                this.notifiDialog(response.message || "Update failed.", true)
                                    .afterClosed()
                                    .subscribe(() => {
                                        this.showError = false;
                                        return;
                                    });
                            } else {
                                let message = "Something went wrong! Please try again later!";
                                this.notifiDialog(message, true)
                                    .afterClosed()
                                    .subscribe(() => {
                                        this.showError = false;
                                        return;
                                    });
                            }
                        },
                        (error) => {
                            this.barButtonOptions.active = false;
                            this.barButtonOptions.text = "SAVE";

                            this.notifiDialog(error.statusText || error.message, true)
                                .afterClosed()
                                .subscribe(() => {
                                    this.showError = false;
                                    return;
                                });
                        }
                    )
                }
            } else {
                return;
            }
        })
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
