import { areAllEquivalent } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { HostGiftService } from 'app/core/service/host-gift.service';
import { ProductService } from 'app/core/service/product.service';
import { CommonDialogComponent } from 'app/main/_shared/common-dialog/common-dialog.component';
import { ConfirmDialogComponent } from 'app/main/_shared/confirm-dialog/confirm-dialog.component';
import { MatProgressButtonOptions } from 'mat-progress-buttons';

@Component({
    selector: 'app-setting-host-gift',
    templateUrl: './setting-host-gift.component.html',
    styleUrls: ['./setting-host-gift.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class SettingHostGiftComponent implements OnInit {
    histories: any[];
    hostGifts: any[];
    hostGiftComponents: any[];
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
        private hostGiftService: HostGiftService
    ) {
        this.settingForm = this.fb.group({
            isActive: [false, Validators.required],
            hostGifts: this.fb.array([])
        })
        this.histories = [];
        this.hostGifts = [];
        this.hostGiftComponents = [];
        this.showError = false;
        this.isUpdate = false;
    }

    ngOnInit(): void {
        this.productService.getAllPaymentPromotionGifts().subscribe(data => {
            data = data.map(x => x = { label: x.label, value: Number(x.value) });
            this.hostGifts = data;
            data.forEach(gift => {
                this.hostGiftComponents.push({ label: gift.label, value: { label: gift.label, value: gift.value } });
            });

            this.getDetailHostGift();
        })

        this.settingFormOnChange();
    }

    settingFormOnChange() {
        this.settingForm.valueChanges.subscribe(() => {
            this.barButtonOptions.disabled = !(this.settingForm.dirty || this.settingForm.touched) || this.settingForm.invalid;
        })
    }

    getDetailHostGift() {
        let hostGiftsArray = this.settingForm.get('hostGifts') as FormArray;
        while (hostGiftsArray.length) {
            hostGiftsArray.removeAt(0);
        }

        this.hostGiftService.getDetail().subscribe(
            (response) => {
                if (response && response.code === 200 && response.data.length > 0) {
                    this.isUpdate = true;
                    this.settingForm.patchValue({
                        isActive: response.isActive
                    })
                    response.data.forEach((item, idx) => {
                        hostGiftsArray.push(
                            this.fb.group({
                                id: [null],
                                hostGift: [null, Validators.required],
                                hostGiftComponent: [[], Validators.required],
                                isActive: [false, Validators.required]
                            })
                        )
                        hostGiftsArray.at(idx).patchValue({
                            id: item.id,
                            hostGift: item.hostGift,
                            hostGiftComponent: item.hostGiftComponent,
                            isActive: item.isActive,
                        })
                    });
                    this.histories = response.histories;
                    this.barButtonOptions.disabled = true;
                } else if (response.code === 200 && response.data && response.data.length === 0) {
                    this.isUpdate = false;
                    this.settingForm.patchValue({
                        isActive: false
                    })
                    hostGiftsArray.push(
                        this.fb.group({
                            hostGift: [null, Validators.required],
                            hostGiftComponent: [[], Validators.required],
                            isActive: [false, Validators.required]
                        })
                    )
                    this.histories = response.histories;
                    this.barButtonOptions.disabled = true;
                } else if (response.code !== 200 && response) {
                    const dialogNotifi = this.dialog.open(CommonDialogComponent, {
                        width: "600px",
                        data: {
                            message: response.message ? response.message : "Get detail failed.",
                            title: "NOTIFICATION",
                            colorButton: true
                        },
                    });

                    dialogNotifi.afterClosed().subscribe(() => {
                        hostGiftsArray.push(
                            this.fb.group({
                                hostGift: [null, Validators.required],
                                hostGiftComponent: [[], Validators.required],
                                isActive: [false, Validators.required]
                            })
                        )
                        this.barButtonOptions.disabled = true;
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
                        hostGiftsArray.push(
                            this.fb.group({
                                hostGift: [null, Validators.required],
                                hostGiftComponent: [[], Validators.required],
                                isActive: [false, Validators.required]
                            })
                        )
                        this.barButtonOptions.disabled = true;
                        return;
                    });
                }
            },
            (error) => {
                const dialogNotifi = this.dialog.open(CommonDialogComponent, {
                    width: "600px",
                    data: {
                        message: error.statusText || error.message,
                        title: "NOTIFICATION",
                        colorButton: true
                    },
                });

                dialogNotifi.afterClosed().subscribe(() => {
                    hostGiftsArray.push(
                        this.fb.group({
                            hostGift: [null, Validators.required],
                            hostGiftComponent: [[], Validators.required],
                            isActive: [false, Validators.required]
                        })
                    )
                    this.barButtonOptions.disabled = true;
                    return;
                });
            }
        )
    }

    addHostGift() {
        const hostGiftsArray = this.settingForm.get('hostGifts') as FormArray;
        hostGiftsArray.insert(
            0,
            this.fb.group({
                hostGift: [null, Validators.required],
                hostGiftComponent: [[], Validators.required],
                isActive: [false, Validators.required]
            })
        )
    }

    deleteGift(index: number) {
        let hostGiftsArray = this.settingForm.get('hostGifts') as FormArray;
        hostGiftsArray.removeAt(index);
        if (hostGiftsArray.length === 0) {
            hostGiftsArray.push(
                this.fb.group({
                    hostGift: [null, Validators.required],
                    hostGiftComponent: [[], Validators.required],
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

        const { isActive, hostGifts } = this.settingForm.value;
        let body = { isActive: true, data: [] };
        hostGifts.forEach(gift => {
            if (gift.id) { // update
                body.data.push({
                    id: gift.id,
                    hotGift: gift.hostGift.value,
                    hotGiftComponent: gift.hostGiftComponent.map(x => x.value),
                    isAtive: true
                })
            } else { // create new
                body.data.push({
                    hotGift: gift.hostGift.value,
                    hotGiftComponent: gift.hostGiftComponent.map(x => x.value),
                    isAtive: true
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
                    this.hostGiftService.createNew(body).subscribe(
                        (response: any) => {
                            this.barButtonOptions.active = false;
                            this.barButtonOptions.text = "SAVE";

                            if (response && response.code === 200) {
                                const dialogNotifi = this.dialog.open(CommonDialogComponent, {
                                    width: "600px",
                                    data: {
                                        message: "Create new successfully.",
                                        title: "NOTIFICATION",
                                        colorButton: false
                                    },
                                });
                                dialogNotifi.afterClosed().subscribe(() => {
                                    this.showError = false;
                                    this.getDetailHostGift();
                                    return;
                                });
                            } else if (response && response.code !== 200) {
                                const dialogNotifi = this.dialog.open(CommonDialogComponent, {
                                    width: "600px",
                                    data: {
                                        message: response.message ? response.message : "Create new failed.",
                                        title: "NOTIFICATION",
                                        colorButton: true
                                    },
                                });
                                dialogNotifi.afterClosed().subscribe(() => {
                                    this.showError = false;
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
                                    this.showError = false;
                                    return;
                                });
                            }
                        },
                        (error) => {
                            this.barButtonOptions.active = false;
                            this.barButtonOptions.text = "SAVE";

                            const dialogNotifi = this.dialog.open(CommonDialogComponent, {
                                width: "600px",
                                data: {
                                    message: error.statusText || error.message,
                                    title: "NOTIFICATION",
                                    colorButton: true
                                },
                            });
                            dialogNotifi.afterClosed().subscribe(() => {
                                this.showError = false;
                                return;
                            });
                        }
                    )
                } else {
                    this.hostGiftService.update(body).subscribe(
                        (response: any) => {
                            this.barButtonOptions.active = false;
                            this.barButtonOptions.text = "SAVE";

                            if (response && response.code === 200) {
                                const dialogNotifi = this.dialog.open(CommonDialogComponent, {
                                    width: "600px",
                                    data: {
                                        message: "Update successfully.",
                                        title: "NOTIFICATION",
                                        colorButton: false
                                    },
                                });
                                dialogNotifi.afterClosed().subscribe(() => {
                                    this.showError = false;
                                    this.getDetailHostGift();
                                    return;
                                });
                            } else if (response && response.code !== 200) {
                                const dialogNotifi = this.dialog.open(CommonDialogComponent, {
                                    width: "600px",
                                    data: {
                                        message: response.message ? response.message : "Update failed.",
                                        title: "NOTIFICATION",
                                        colorButton: true
                                    },
                                });
                                dialogNotifi.afterClosed().subscribe(() => {
                                    this.showError = false;
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
                                    this.showError = false;
                                    return;
                                });
                            }
                        },
                        (error) => {
                            this.barButtonOptions.active = false;
                            this.barButtonOptions.text = "SAVE";

                            const dialogNotifi = this.dialog.open(CommonDialogComponent, {
                                width: "600px",
                                data: {
                                    message: error.statusText || error.message,
                                    title: "NOTIFICATION",
                                    colorButton: true
                                },
                            });
                            dialogNotifi.afterClosed().subscribe(() => {
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
}
