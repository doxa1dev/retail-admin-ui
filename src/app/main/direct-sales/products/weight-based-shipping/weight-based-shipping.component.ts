import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators, ValidatorFn, AbstractControl, ValidationErrors } from "@angular/forms";
import { MatDialog } from '@angular/material/dialog';
import { WeightBasedShippingService } from 'app/core/service/weight-based-shipping.service';
import { CommonDialogComponent } from 'app/main/_shared/common-dialog/common-dialog.component';
import { ConfirmDialogComponent } from 'app/main/_shared/confirm-dialog/confirm-dialog.component';
import { ShippingCost, WeightShippingRule } from 'app/core/models/weight-based-shipping';
import { MatProgressButtonOptions } from 'mat-progress-buttons';

@Component({
    selector: 'app-weight-based-shipping',
    templateUrl: './weight-based-shipping.component.html',
    styleUrls: ['./weight-based-shipping.component.scss']
})
export class WeightBasedShippingComponent implements OnInit {

    formEastMalaysia: FormGroup;
    formWestMalaysia: FormGroup;

    patternNumber: any;
    patternCost: any;

    isUpdate: boolean;
    histories: any[];

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
        private costShippingService: WeightBasedShippingService,
        public dialog: MatDialog,
    ) {
        this.patternNumber = /^[0-9]+$/;
        this.patternCost = /^[0-9]+(\.[0-9]{1,2})?$/;
        this.isUpdate = false;
        this.histories = [];

        this.formWestMalaysia = fb.group({
            numberInterValWest: ['', [Validators.required, Validators.pattern(this.patternNumber)]],
            shipmentCostWest: fb.array([]),
            additionalCostWest: ['', [Validators.required, Validators.pattern(this.patternCost)]],
            freeShipmentCostWest: ['', [Validators.required, Validators.pattern(this.patternCost)]],
        });

        this.formEastMalaysia = fb.group({
            numberInterValEast: ['', [Validators.required, Validators.pattern(this.patternNumber)]],
            shipmentCostEast: fb.array([]),
            additionalCostEast: ['', [Validators.required, Validators.pattern(this.patternCost)]],
            freeShipmentCostEast: ['', [Validators.required, Validators.pattern(this.patternCost)]],
        });
    }

    ngOnInit(): void {
        try {
            this.costShippingService.getCostShipping().subscribe(res => {
                if (res && res.code === 200) {
                    this.isUpdate = true;
                    if (res.east) {
                        this.formEastMalaysia.patchValue({
                            numberInterValEast: res.east.numberOfInterval,
                            additionalCostEast: res.east.additionCostPerKg,
                            freeShipmentCostEast: res.east.freeIfExcess
                        })

                        const shipmentCostEastArray = this.formEastMalaysia.get('shipmentCostEast') as FormArray;

                        res.east.weightShippingRule.forEach((x, index) => {
                            if (index > 0) {
                                shipmentCostEastArray.at(index).get("from").setValue(x.from);
                                shipmentCostEastArray.at(index).get("to").setValue(x.to);
                                shipmentCostEastArray.at(index).get("cost").setValue(x.shippingCost);
                                shipmentCostEastArray.at(index).get("to").enable();
                                shipmentCostEastArray.at(index).get("cost").enable();
                            } else {
                                shipmentCostEastArray.at(index).get("from").setValue(x.from);
                                shipmentCostEastArray.at(index).get("to").setValue(x.to);
                                shipmentCostEastArray.at(index).get("cost").setValue(x.shippingCost);
                            }
                        })
                    }

                    if (res.west) {
                        this.formWestMalaysia.patchValue({
                            numberInterValWest: res.west.numberOfInterval,
                            additionalCostWest: res.west.additionCostPerKg,
                            freeShipmentCostWest: res.west.freeIfExcess
                        })

                        const shipmentCostWestArray = this.formWestMalaysia.get('shipmentCostWest') as FormArray;

                        res.west.weightShippingRule.forEach((x, index) => {
                            if (index > 0) {
                                shipmentCostWestArray.at(index).get("from").setValue(x.from);
                                shipmentCostWestArray.at(index).get("to").setValue(x.to);
                                shipmentCostWestArray.at(index).get("cost").setValue(x.shippingCost);
                                shipmentCostWestArray.at(index).get("to").enable();
                                shipmentCostWestArray.at(index).get("cost").enable();
                            } else {
                                shipmentCostWestArray.at(index).get("from").setValue(x.from);
                                shipmentCostWestArray.at(index).get("to").setValue(x.to);
                                shipmentCostWestArray.at(index).get("cost").setValue(x.shippingCost);
                            }
                        })
                    }

                    this.histories = res.histories.length > 0 ? res.histories : [];
                } else {
                    this.isUpdate = false;
                }
            })
        } catch (error) {
            const dialogNotifi = this.dialog.open(CommonDialogComponent, {
                width: "500px",
                data: {
                    message: error || "Something went wrong! Please try again.",
                    title: "NOTIFICATION",
                    colorButton: true
                },
            });

            dialogNotifi.afterClosed().subscribe(() => { return; })
        }

        this.barButtonOptions.disabled = true;

        this.onChangeFormEast();
        this.onChangeFormWest();
    }

    onChangeFormEast() {
        this.formEastMalaysia.valueChanges.subscribe(() => {
            this.barButtonOptions.disabled = this.formEastMalaysia.invalid || this.formWestMalaysia.invalid;
            !this.formWestMalaysia.dirty || !this.formWestMalaysia.touched
            !this.formEastMalaysia.dirty || !this.formEastMalaysia.touched;
        })
    }

    onChangeFormWest() {
        this.formWestMalaysia.valueChanges.subscribe(() => {
            this.barButtonOptions.disabled = this.formWestMalaysia.invalid || this.formEastMalaysia.invalid
            !this.formWestMalaysia.dirty || !this.formWestMalaysia.touched
            !this.formEastMalaysia.dirty || !this.formEastMalaysia.touched;
        })
    }

    onKeyNumber(e) {
        let charCode = e.which ? e.which : e.keyCode;
        let charStr = String.fromCharCode(charCode);
        if (!(/\d/.test(charStr))) {
            e.preventDefault();
            return false;
        } else return true;
    }

    onKeyCost(e) {
        let charCode = e.which ? e.which : e.keyCode;
        let charStr = String.fromCharCode(charCode);
        if (!(/\d|\./.test(charStr))) {
            e.preventDefault();
            return false;
        } else return true;
    }

    changeNumberOfIntervalWest(e) {
        const numberOfInterval = e ? Number(e) : 0;
        const shipmentCostWestArray = this.formWestMalaysia.get('shipmentCostWest') as FormArray;
        if ((numberOfInterval === shipmentCostWestArray.length) && numberOfInterval !== 0) return;
        shipmentCostWestArray.clear();
        if (!numberOfInterval) return;

        for (let i = 0; i < numberOfInterval; i++) {
            if (i > 0) {
                shipmentCostWestArray.push(this.fb.group({
                    from: [{ value: '', disabled: true }, [Validators.required, Validators.pattern(this.patternCost)]],
                    to: [{ value: '', disabled: true }, [Validators.required, Validators.pattern(this.patternCost)]],
                    cost: [{ value: '', disabled: true }, [Validators.required, Validators.pattern(this.patternCost)]]
                }, { validator: this.validToWeight('from', 'to') }));
            } else {
                shipmentCostWestArray.push(this.fb.group({
                    from: [{ value: '0', disabled: true }, [Validators.required, Validators.pattern(this.patternCost)]],
                    to: ['', [Validators.required, Validators.pattern(this.patternCost)]],
                    cost: ['', [Validators.required, Validators.pattern(this.patternCost)]]
                }, { validator: this.validToWeight('from', 'to') }));
            }
        }
    }

    changeNumberOfIntervalEast(e) {
        const numberOfInterval = e ? Number(e) : 0;
        const shipmentCostEastArray = this.formEastMalaysia.get('shipmentCostEast') as FormArray;
        if ((numberOfInterval === shipmentCostEastArray.length) && numberOfInterval !== 0) return;
        shipmentCostEastArray.clear();
        if (!numberOfInterval) {
            return;
        }

        for (let i = 0; i < numberOfInterval; i++) {
            if (i > 0) {
                shipmentCostEastArray.push(this.fb.group({
                    from: [{ value: '', disabled: true }, [Validators.required, Validators.pattern(this.patternCost)]],
                    to: [{ value: '', disabled: true }, [Validators.required, Validators.pattern(this.patternCost)]],
                    cost: [{ value: '', disabled: true }, [Validators.required, Validators.pattern(this.patternCost)]]
                }, { validator: this.validToWeight('from', 'to') }));
            } else {
                shipmentCostEastArray.push(this.fb.group({
                    from: [{ value: '0', disabled: true }, [Validators.required, Validators.pattern(this.patternCost)]],
                    to: ['', [Validators.required, Validators.pattern(this.patternCost)]],
                    cost: ['', [Validators.required, Validators.pattern(this.patternCost)]]
                }, { validator: this.validToWeight('from', 'to') }));
            }
        }
    }

    changeToWeightEast(e, i) {
        const value = Number(e);
        const shipmentCostEastArray = this.formEastMalaysia.get('shipmentCostEast') as FormArray;
        if (i === shipmentCostEastArray.length - 1) return;
        if (!shipmentCostEastArray.at(i).invalid) {
            shipmentCostEastArray.at(i + 1).patchValue({
                from: value,
            });
            shipmentCostEastArray.at(i + 1).get('to').enable();
            shipmentCostEastArray.at(i + 1).get('cost').enable();
            return;
        } else {
            shipmentCostEastArray.at(i + 1).patchValue({
                from: '',
            });
            shipmentCostEastArray.at(i + 1).get('to').disable();
            shipmentCostEastArray.at(i + 1).get('cost').disable();
        }
    }

    changeCostShipmentEast(e, i) {
        const shipmentCostEastArray = this.formEastMalaysia.get('shipmentCostEast') as FormArray;
        if (i === shipmentCostEastArray.length - 1) return;
        if (!shipmentCostEastArray.at(i).invalid) {
            shipmentCostEastArray.at(i + 1).patchValue({
                from: shipmentCostEastArray.at(i).get('to').value,
            });
            shipmentCostEastArray.at(i + 1).get('to').enable();
            shipmentCostEastArray.at(i + 1).get('cost').enable();
        } else {
            shipmentCostEastArray.at(i + 1).patchValue({
                from: '',
            });
            shipmentCostEastArray.at(i + 1).get('to').disable();
            shipmentCostEastArray.at(i + 1).get('cost').disable();
        }
    }

    changeToWeightWest(e, i) {
        const value = Number(e);
        const shipmentCostWestArray = this.formWestMalaysia.get('shipmentCostWest') as FormArray;
        if (i === shipmentCostWestArray.length - 1) return;
        if (!shipmentCostWestArray.at(i).invalid) {
            shipmentCostWestArray.at(i + 1).patchValue({
                from: value,
            });
            shipmentCostWestArray.at(i + 1).get('to').enable();
            shipmentCostWestArray.at(i + 1).get('cost').enable();
        } else {
            shipmentCostWestArray.at(i + 1).patchValue({
                from: '',
            });
            shipmentCostWestArray.at(i + 1).get('to').disable();
            shipmentCostWestArray.at(i + 1).get('cost').disable();
        }
    }

    changeCostShipmentWest(e, i) {
        const shipmentCostWestArray = this.formWestMalaysia.get('shipmentCostWest') as FormArray;
        if (i === shipmentCostWestArray.length - 1) return;
        if (!shipmentCostWestArray.at(i).invalid) {
            shipmentCostWestArray.at(i + 1).patchValue({
                from: shipmentCostWestArray.at(i).get('to').value,
            });
            shipmentCostWestArray.at(i + 1).get('to').enable();
            shipmentCostWestArray.at(i + 1).get('cost').enable();
        } else {
            shipmentCostWestArray.at(i + 1).patchValue({
                from: '',
            });
            shipmentCostWestArray.at(i + 1).get('to').disable();
            shipmentCostWestArray.at(i + 1).get('cost').disable();
        }
    }

    save() {
        let message = this.isUpdate ? "Are you sure to update shipping cost?" : "Are you sure to create new shipping cost?";
        const dialogConfirm = this.dialog.open(ConfirmDialogComponent, {
            width: "500px",
            data: {
                message: message,
                type: "APPROVED",
            },
        });

        dialogConfirm.afterClosed().subscribe((result) => {
            if (result === true) {
                this.barButtonOptions.active = true;
                this.barButtonOptions.text = "In process...";
                let formEast = this.formEastMalaysia;
                let east = new ShippingCost();
                east.numberOfInterval = Number(formEast.get('numberInterValEast').value);
                east.freeIfExcess = Number(formEast.get('freeShipmentCostEast').value);
                east.additionCostPerKg = Number(formEast.get('additionalCostEast').value);
                const shipmentCostEastArray = formEast.get('shipmentCostEast') as FormArray;
                shipmentCostEastArray.controls.forEach(element => {
                    element.get("from").enable;
                    let weightShippingRule = new WeightShippingRule();
                    weightShippingRule.from = Number(element.get("from").value);
                    weightShippingRule.to = Number(element.get("to").value);
                    weightShippingRule.shippingCost = Number(element.get("cost").value);
                    east.weightShippingRule.push(weightShippingRule);
                });

                let formWest = this.formWestMalaysia;
                let west = new ShippingCost();
                west.numberOfInterval = Number(formWest.get('numberInterValWest').value);
                west.freeIfExcess = Number(formWest.get('freeShipmentCostWest').value);
                west.additionCostPerKg = Number(formWest.get('additionalCostWest').value);
                const shipmentCostWestArray = formWest.get('shipmentCostWest') as FormArray;
                shipmentCostWestArray.controls.forEach(element => {
                    element.get("from").enable;
                    let weightShippingRule = new WeightShippingRule();
                    weightShippingRule.from = Number(element.get("from").value);
                    weightShippingRule.to = Number(element.get("to").value);
                    weightShippingRule.shippingCost = Number(element.get("cost").value);
                    west.weightShippingRule.push(weightShippingRule);
                });

                let body = { detail: { east, west } };
                try {
                    if (this.isUpdate) {
                        this.costShippingService.updateCostShipping(body).subscribe(res => {
                            this.barButtonOptions.active = false;
                            this.barButtonOptions.text = "SAVE";
                            if (res && res.code === 200) {
                                const dialogNotifi = this.dialog.open(CommonDialogComponent, {
                                    width: "500px",
                                    data: {
                                        message: res.message || "Update successfully.",
                                        title: "NOTIFICATION",
                                        colorButton: false
                                    },
                                });
                                dialogNotifi.afterClosed().subscribe(() => {
                                    this.ngOnInit();
                                })
                            } else if (res && res.code !== 200) {
                                const dialogNotifi = this.dialog.open(CommonDialogComponent, {
                                    width: "500px",
                                    data: {
                                        message: res.message || "Update failed.",
                                        title: "NOTIFICATION",
                                        colorButton: true
                                    },
                                });
                                dialogNotifi.afterClosed().subscribe(() => {
                                    return;
                                })
                            } else {
                                const dialogNotifi = this.dialog.open(CommonDialogComponent, {
                                    width: "500px",
                                    data: {
                                        message: "Something went wrong! Please try again.",
                                        title: "NOTIFICATION",
                                        colorButton: true
                                    },
                                });
                                dialogNotifi.afterClosed().subscribe(() => {
                                    return;
                                })
                            }
                        });
                    } else {
                        this.costShippingService.createCostShipping(body).subscribe(res => {
                            this.barButtonOptions.active = false;
                            this.barButtonOptions.text = "SAVE";
                            if (res && res.code === 200) {
                                const dialogNotifi = this.dialog.open(CommonDialogComponent, {
                                    width: "500px",
                                    data: {
                                        message: res.message || "Create successfully.",
                                        title: "NOTIFICATION",
                                        colorButton: false
                                    },
                                });
                                dialogNotifi.afterClosed().subscribe(() => {
                                    this.ngOnInit();
                                })
                            } else if (res && res.code !== 200) {
                                const dialogNotifi = this.dialog.open(CommonDialogComponent, {
                                    width: "500px",
                                    data: {
                                        message: res.message || "Create failed.",
                                        title: "NOTIFICATION",
                                        colorButton: true
                                    },
                                });
                                dialogNotifi.afterClosed().subscribe(() => {
                                    return;
                                })
                            } else {
                                const dialogNotifi = this.dialog.open(CommonDialogComponent, {
                                    width: "500px",
                                    data: {
                                        message: "Something went wrong! Please try again.",
                                        title: "NOTIFICATION",
                                        colorButton: true
                                    },
                                });
                                dialogNotifi.afterClosed().subscribe(() => {
                                    return;
                                })
                            }
                        });
                    }
                } catch (error) {
                    this.barButtonOptions.active = false;
                    this.barButtonOptions.text = "SAVE";
                    const dialogNotifi = this.dialog.open(CommonDialogComponent, {
                        width: "500px",
                        data: {
                            message: error || "Something went wrong! Please try again.",
                            title: "NOTIFICATION",
                            colorButton: true
                        },
                    });

                    dialogNotifi.afterClosed().subscribe(() => { return; })
                }
            }
            else {
                dialogConfirm.close();
            }
        });
    }

    getLastToWeightWest() {
        const shipmentCostArray = this.formWestMalaysia.get('shipmentCostWest') as FormArray;
        const idx = shipmentCostArray.length - 1;
        return idx >= 0 ? shipmentCostArray.at(idx).get('to').value : "";
    }

    getLastToWeightEast() {
        const shipmentCostArray = this.formEastMalaysia.get('shipmentCostEast') as FormArray;
        const idx = shipmentCostArray.length - 1;
        return idx >= 0 ? shipmentCostArray.at(idx).get('to').value : "";
    }

    validToWeight(firstControl, secondControl) {
        return (formGroup: FormGroup) => {
            const from = formGroup.controls[firstControl];
            const to = formGroup.controls[secondControl];
            const valueFrom = from.value ? Number(from.value) : 0;
            const valueTo = to.value ? Number(to.value) : 0;
            if (valueFrom >= valueTo) {
                to.setErrors({ validToWeight: true });
            } else if (!this.patternCost.test(valueTo)) {
                to.setErrors({ pattern: true });
            } else {
                to.setErrors(null);
            }
        }
    }

    addShipmentCostEast() {
        const shipmentCostArray = this.formEastMalaysia.get('shipmentCostEast') as FormArray;
        const idx = shipmentCostArray.length - 1;
        const fromWeight = Number(shipmentCostArray.at(idx).get('to').value);
        const shipmentCost = Number(shipmentCostArray.at(idx).get('cost').value);
        shipmentCostArray.push(this.fb.group({
            from: [{ value: fromWeight, disabled: true }, [Validators.required, Validators.pattern(this.patternCost)]],
            to: [(fromWeight + 1), [Validators.required, Validators.pattern(this.patternCost)]],
            cost: [(shipmentCost + 1), [Validators.required, Validators.pattern(this.patternCost)]]
            }, { validator: this.validToWeight('from', 'to') }));

        this.formEastMalaysia.get('numberInterValEast').setValue(shipmentCostArray.length);
    }

    removeShipmentCostEast() {
        const shipmentCostArray = this.formEastMalaysia.get('shipmentCostEast') as FormArray;
        const idx = shipmentCostArray.length - 1;
        shipmentCostArray.removeAt(idx);
        this.formEastMalaysia.get('numberInterValEast').setValue(shipmentCostArray.length);
    }

    addShipmentCostWest() {
        const shipmentCostArray = this.formWestMalaysia.get('shipmentCostWest') as FormArray;
        const idx = shipmentCostArray.length - 1;
        const fromWeight = shipmentCostArray.at(idx).get('to').value !== '' ? Number(shipmentCostArray.at(idx).get('to').value) : '';
        const shipmentCost = shipmentCostArray.at(idx).get('cost').value !== '' ? Number(shipmentCostArray.at(idx).get('cost').value) : '';

        if ((typeof fromWeight === 'number') && (typeof shipmentCost === 'number')) {
            shipmentCostArray.push(this.fb.group({
                from: [{ value: fromWeight, disabled: true }, [Validators.required, Validators.pattern(this.patternCost)]],
                to: [(fromWeight + 1), [Validators.required, Validators.pattern(this.patternCost)]],
                cost: [(shipmentCost + 1), [Validators.required, Validators.pattern(this.patternCost)]]
                }, { validator: this.validToWeight('from', 'to') }));
        } else {
            shipmentCostArray.push(this.fb.group({
                from: [{ value: '', disabled: true }, [Validators.required, Validators.pattern(this.patternCost)]],
                to: [{ value: '', disabled: true }, [Validators.required, Validators.pattern(this.patternCost)]],
                cost: [{ value: '', disabled: true }, [Validators.required, Validators.pattern(this.patternCost)]]
                }, { validator: this.validToWeight('from', 'to') }));
        }

        this.formWestMalaysia.get('numberInterValWest').setValue(shipmentCostArray.length);
    }

    removeShipmentCostWest() {
        const shipmentCostArray = this.formWestMalaysia.get('shipmentCostWest') as FormArray;
        const idx = shipmentCostArray.length - 1;
        shipmentCostArray.removeAt(idx);
        this.formWestMalaysia.get('numberInterValWest').setValue(shipmentCostArray.length);
    }
}
