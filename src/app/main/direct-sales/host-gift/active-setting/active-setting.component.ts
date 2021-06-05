import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActiveSettingItem, STATUS } from 'app/core/models/host-gift.model';
import { HostGiftService } from 'app/core/service/host-gift.service';
import { CommonDialogComponent } from 'app/main/_shared/common-dialog/common-dialog.component';
import { MatProgressButtonOptions } from 'mat-progress-buttons';
import * as moment from 'moment';
import { v4 as uuidv4 } from 'uuid';

@Component({
    selector: 'app-active-setting',
    templateUrl: './active-setting.component.html',
    styleUrls: ['./active-setting.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class ActiveSettingComponent implements OnInit {
    histories: any[];
    hostGiftItems: any[];
    settingForm: FormGroup;
    showError: boolean;
    isUpdate: boolean;
    maxDate: Date;
    activeSettingItems: ActiveSettingItem[] = [];

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
        public dialog: MatDialog,
        private hostGiftService: HostGiftService
    ) {
        this.histories = [];

        this.hostGiftItems = [];

        this.showError = false;

        this.isUpdate = false;

        this.settingForm = this.fb.group({
            activeSettingItems: this.fb.array([])
        });

        this.maxDate = new Date();
        this.maxDate.setFullYear(this.maxDate.getFullYear() + 100);

        this.activeSettingItems = [];
    }

    ngOnInit(): void {
        this.barButtonOptions.disabled = true;

        this.hostGiftService.getHostGiftItem().subscribe(
            (response) => {
                if (Array.isArray(response)) {
                    this.hostGiftItems = response;
                    this.getDetailActiveSetting();
                } else {
                    this.notifiDialog(response.message || "System went error! Please try again later.", true)
                        .afterClosed().subscribe(() => { return });
                }
            },
            (error) => {
                this.notifiDialog(error.message || "System went error! Please try again later.", true)
                    .afterClosed().subscribe(() => { return });
            }
        )

        this.settingFormOnChange();
    }

    public get activeSettingItemsArray(): FormArray {
        return this.settingForm.get('activeSettingItems') as FormArray;
    }

    getDetailActiveSetting() {
        while (this.activeSettingItemsArray.length) {
            this.activeSettingItemsArray.removeAt(0);
        }

        this.hostGiftService.getDetailActiveSetting().subscribe(
            (response: any) => {
                if (response.activeSettingItems && response.histories && response.activeSettings) {
                    this.activeSettingItems = response.activeSettingItems;
                    this.histories = response.histories;
                    if (response.activeSettingItems.length > 0) {
                        this.isUpdate = true;
                        response.activeSettings.forEach(element => {
                            let itemAdd = this.fb.group({ 
                                id: [[]],
                                public_id: [''],
                                active_at: ['', Validators.required],
                                expired_at: ['', Validators.required],
                                status: [''],
                                hostGifts: [[], Validators.required],
                                minActiveDate: [new Date()],
                                maxActiveDate: [this.maxDate],
                                minExpireDate: [new Date()],
                                maxExpireDate: [this.maxDate]
                            });

                            const status: STATUS = element.status;
                            let hostGifts = [];
                            element.arrHostGift.forEach(item => {
                                const hostGift = this.hostGiftItems.find(x => x.value.value === item.value).value;
                                hostGifts.push(hostGift);
                            });

                            itemAdd.patchValue({
                                id: element.arrId,
                                public_id: element.public_id,
                                active_at: element.active_at,
                                expired_at: element.expired_at,
                                status: status,
                                hostGifts: hostGifts,
                                minActiveDate: new Date(),
                                maxActiveDate: this.maxDate,
                                minExpireDate: new Date(),
                                maxExpireDate: this.maxDate
                            })

                            if (status === STATUS.ONGOING) {
                                let currentDate = new Date();
                                currentDate.setHours(0, 0, 0, 0);
                                itemAdd.controls.active_at.disable();
                                itemAdd.controls.minExpireDate.setValue(currentDate);
                            }

                            if (status === STATUS.UPCOMING) {
                                itemAdd.controls.minExpireDate.setValue(element.active_at);
                            }

                            if (status === STATUS.COMPLETED) {
                                itemAdd.disable();
                            }

                            this.activeSettingItemsArray.push(itemAdd);
                        });
                        
                        for (let index = this.activeSettingItemsArray.length - 2; index >= 0; index--) {
                            const expireDate = new Date(this.activeSettingItemsArray.at(index + 1).value.expired_at);
                            expireDate.setDate(expireDate.getDate() + 1);
                            this.activeSettingItemsArray.at(index).get('minActiveDate').setValue(expireDate);
                        }
                        for (let index = 0; index <= this.activeSettingItemsArray.length - 2; index++) {
                            const activeDate = new Date(this.activeSettingItemsArray.at(index).value.active_at);
                            activeDate.setDate(activeDate.getDate() - 1);
                            this.activeSettingItemsArray.at(index + 1).get('maxExpireDate').setValue(activeDate);
                        }
                        for (let index = 0; index <= this.activeSettingItemsArray.length - 1; index++) {
                            const expireDate = new Date(this.activeSettingItemsArray.at(index).value.expired_at);
                            this.activeSettingItemsArray.at(index).get('maxActiveDate').setValue(expireDate);
                        }
                    } else {
                        this.isUpdate = false;
                        let itemInit = this.fb.group({
                            public_id: [''],
                            active_at: ['', Validators.required],
                            expired_at: ['', Validators.required],
                            hostGifts: [[], Validators.required],
                            status: [''],
                            minActiveDate: [new Date()],
                            maxActiveDate: [this.maxDate],
                            minExpireDate: [new Date()],
                            maxExpireDate: [this.maxDate]
                        });
                        this.activeSettingItemsArray.push(itemInit);
                    }
                } else {
                    this.notifiDialog(response.message || "System went error! Please try again later.", true)
                        .afterClosed().subscribe(() => {
                            let itemInit = this.fb.group({
                                public_id: [''],
                                active_at: ['', Validators.required],
                                expired_at: ['', Validators.required],
                                hostGifts: [[], Validators.required],
                                status: [''],
                                minActiveDate: [new Date()],
                                maxActiveDate: [this.maxDate],
                                minExpireDate: [new Date()],
                                maxExpireDate: [this.maxDate]
                            });
                            this.activeSettingItemsArray.push(itemInit);
                        });
                }
            },
            (error) => {
                this.notifiDialog(error.message || "System went error! Please try again later.", true)
                    .afterClosed().subscribe(() => {
                        let itemInit = this.fb.group({
                            public_id: [''],
                            active_at: ['', Validators.required],
                            expired_at: ['', Validators.required],
                            hostGifts: [[], Validators.required],
                            status: [''],
                            minActiveDate: [new Date()],
                            maxActiveDate: [this.maxDate],
                            minExpireDate: [new Date()],
                            maxExpireDate: [this.maxDate]
                        });
                        this.activeSettingItemsArray.push(itemInit);
                    });
            }
        )
    }
    
    settingFormOnChange() {
        this.settingForm.valueChanges.subscribe(() => {
            this.barButtonOptions.disabled = !(this.settingForm.dirty || this.settingForm.touched) || this.settingForm.invalid;
        })
    }

    setDateRange(currentIndex: number) {
        if (currentIndex < 0) return;
        const expireDate = new Date(this.activeSettingItemsArray.at(currentIndex).value.expired_at);
        this.activeSettingItemsArray.at(currentIndex).get('maxActiveDate').setValue(expireDate);
        
        if (currentIndex === 0) return;
        let minActiveDate = new Date(expireDate);
        minActiveDate.setDate(minActiveDate.getDate() + 1);
        this.activeSettingItemsArray.at(currentIndex - 1).get('minActiveDate').setValue(minActiveDate);
    }

    setMinDateExpire(currentIndex: number) {
        const activeDate = new Date(this.activeSettingItemsArray.at(currentIndex).value.active_at);
        this.activeSettingItemsArray.at(currentIndex).get('minExpireDate').setValue(activeDate);
        if (this.activeSettingItemsArray.at(currentIndex).value.expired_at && 
            this.activeSettingItemsArray.at(currentIndex).value.expired_at.getTime() < activeDate.getTime()) {
                this.activeSettingItemsArray.at(currentIndex).get('expired_at').setValue(activeDate);
        }

        if (
            this.activeSettingItemsArray.length === 1
            || (currentIndex === this.activeSettingItemsArray.length - 1)
            || (this.activeSettingItemsArray.at(currentIndex + 1).value.status === STATUS.COMPLETED)
        ) {
            return;
        } else {
            let maxExpireDate = new Date(activeDate);
            maxExpireDate.setDate(maxExpireDate.getDate() - 1);
            this.activeSettingItemsArray.at(currentIndex + 1).get('maxExpireDate').setValue(maxExpireDate);
        }
    }

    addActivePeriod() {
        if (this.settingForm.invalid) {
            this.showError = true;
            return;
        };

        const itemAdd = this.fb.group({
            public_id: [''],
            active_at: ['', Validators.required],
            expired_at: ['', Validators.required],
            hostGifts: [[], Validators.required],
            status: [''],
            minActiveDate: [new Date()],
            maxActiveDate: [this.maxDate],
            minExpireDate: [new Date()],
            maxExpireDate: [this.maxDate]
            })

        if (this.activeSettingItemsArray.length > 0) {
            const expireDate = new Date(this.activeSettingItemsArray.at(0).value.expired_at);
            expireDate.setDate(expireDate.getDate() + 1);
            itemAdd.controls.minActiveDate.setValue(expireDate);
            itemAdd.controls.minExpireDate.setValue(expireDate);
        }
        
        this.activeSettingItemsArray.insert(0, itemAdd);

        this.showError = false;
    }

    deleteItem(index: number) {
        if (this.activeSettingItemsArray.at(index).value.status === STATUS.COMPLETED) {
            this.activeSettingItemsArray.removeAt(index);
        } else if (index === 0 && this.activeSettingItemsArray.length > 1) {
            this.activeSettingItemsArray.at(index + 1).get('maxExpireDate').setValue(this.maxDate);
            this.activeSettingItemsArray.removeAt(index);
        } else if (index === this.activeSettingItemsArray.length - 1 && this.activeSettingItemsArray.length > 1) {
            this.activeSettingItemsArray.at(index - 1).get('minActiveDate').setValue(new Date());
            this.activeSettingItemsArray.removeAt(index);
        } else if (this.activeSettingItemsArray.length > 2) {
            const expireDate = new Date(this.activeSettingItemsArray.at(index).value.expired_at);
            this.activeSettingItemsArray.at(index + 1).get('maxExpireDate').setValue(expireDate);

            let minActiveDate = new Date(this.activeSettingItemsArray.at(index + 1).value.expired_at);
            minActiveDate.setDate(minActiveDate.getDate() + 1);
            this.activeSettingItemsArray.at(index - 1).get('minActiveDate').setValue(minActiveDate);
            
            this.activeSettingItemsArray.removeAt(index);
        }

        this.barButtonOptions.disabled = false;

        if (this.activeSettingItemsArray.length === 0) {
            let itemInit = this.fb.group({
                public_id: [''],
                active_at: ['', Validators.required],
                expired_at: ['', Validators.required],
                hostGifts: [[], Validators.required],
                status: [''],
                minActiveDate: [new Date()],
                maxActiveDate: [this.maxDate],
                minExpireDate: [new Date()],
                maxExpireDate: [this.maxDate]
            });
            this.activeSettingItemsArray.push(itemInit);
            this.barButtonOptions.disabled = true;
        }
    }

    save() {
        this.showError = true;

        if (this.settingForm.invalid) return;

        const { activeSettingItems } = this.settingForm.getRawValue();
        
        let formBody = [];
        activeSettingItems.forEach(item => {
            if (item.id) { // update
                formBody.push({
                    arrId: item.id,
                    public_id: item.public_id,
                    host_gift_items: item.hostGifts,
                    active_at: moment(item.active_at).local().format("YYYY-MM-DD"),
                    expired_at: moment(item.expired_at).local().format("YYYY-MM-DD"),
                    status: this.checkStatus(item.active_at, item.expired_at)
                })
            } else { // create new
                formBody.push({
                    public_id: uuidv4(),
                    host_gift_items: item.hostGifts,
                    active_at: moment(item.active_at).local().format("YYYY-MM-DD"),
                    expired_at: moment(item.expired_at).local().format("YYYY-MM-DD"),
                    status: this.checkStatus(item.active_at, item.expired_at)
                })
            }
        })

        let body = { data: [] };

        formBody.forEach(item => {
            if (item.arrId && (item.arrId.length === item.host_gift_items.length)) {
                item.host_gift_items.forEach((giftItem, index) => {
                    body.data.push({
                        id: item.arrId[index],
                        public_id: item.public_id,
                        host_gift_item_id: giftItem.value,
                        active_at: item.active_at,
                        expired_at: item.expired_at,
                        status: item.status
                    })
                });
            } else if (item.arrId && (item.arrId.length !== item.host_gift_items.length)) {
                item.host_gift_items.forEach((giftItem, index) => {
                    if (index < item.arrId.length) {
                        body.data.push({
                            id: item.arrId[index],
                            public_id: item.public_id,
                            host_gift_item_id: giftItem.value,
                            active_at: item.active_at,
                            expired_at: item.expired_at,
                            status: item.status
                        })
                    } else {
                        body.data.push({
                            public_id: item.public_id,
                            host_gift_item_id: giftItem.value,
                            active_at: item.active_at,
                            expired_at: item.expired_at,
                            status: item.status
                        })
                    }
                });
            } else {
                item.host_gift_items.forEach(giftItem => {
                    body.data.push({
                        public_id: item.public_id,
                        host_gift_item_id: giftItem.value,
                        active_at: item.active_at,
                        expired_at: item.expired_at,
                        status: item.status
                    })
                });
            }
        })

        if (this.isUpdate) {
            this.barButtonOptions.active = true;
            this.barButtonOptions.text = "In process...";
            this.hostGiftService.updateSettingActiveHostGift(body).subscribe(
                (response) => {
                    this.barButtonOptions.active = false;
                    this.barButtonOptions.text = "SAVE";
                    if (response.code === 200) {
                        this.notifiDialog("Update successfully.", false)
                            .afterClosed().subscribe(() => { this.showError = false; this.ngOnInit() });
                    } else {
                        this.notifiDialog(response.message || "Update failed.", true)
                            .afterClosed().subscribe(() => { return });
                    }
                },
                (error) => {
                    this.barButtonOptions.active = false;
                    this.barButtonOptions.text = "SAVE";
                    this.notifiDialog(error.message || "System went error! Please try again later.", true)
                        .afterClosed().subscribe(() => { return });
                }
            )
        } else {
            this.barButtonOptions.active = true;
            this.barButtonOptions.text = "In process...";
            this.hostGiftService.createSettingActiveHostGift(body).subscribe(
                (response) => {
                    this.barButtonOptions.active = false;
                    this.barButtonOptions.text = "SAVE";
                    if (response.code === 200) {
                        this.notifiDialog("Create successfully.", false)
                            .afterClosed().subscribe(() => { this.showError = false; this.ngOnInit() });
                    } else {
                        this.notifiDialog(response.message || "Create failed.", true)
                            .afterClosed().subscribe(() => { return });
                    }
                },
                (error) => {
                    this.barButtonOptions.active = false;
                    this.barButtonOptions.text = "SAVE";
                    this.notifiDialog(error.message || "System went error! Please try again later.", true)
                        .afterClosed().subscribe(() => { return });
                }
            )
        }
    }

    checkStatus(activeDate: Date, expiredDate: Date): string {
        let currentDate = new Date();
        activeDate.setHours(0, 0, 0, 0);
        expiredDate.setHours(0, 0, 0, 0);
        currentDate.setHours(0, 0, 0, 0);
        const timeActive = activeDate.getTime();
        const timeExpired = expiredDate.getTime();
        const timeCurrent = currentDate.getTime();

        return timeCurrent < timeActive ? STATUS.UPCOMING
                : timeCurrent > timeExpired ? STATUS.COMPLETED
                : STATUS.ONGOING;
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

    formatStatus = (status) => {
        if (status) {
            let temp = <string>status;
            const lowerCase = temp.toLocaleLowerCase();
            return lowerCase.replace(lowerCase.charAt(0), lowerCase.charAt(0).toLocaleUpperCase());
        }
    }
}
