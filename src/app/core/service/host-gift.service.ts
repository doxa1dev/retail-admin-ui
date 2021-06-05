import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { ApiService } from './api.service';
import { catchError, map } from 'rxjs/operators';
import { 
    hostGiftSettingApi, 
    redemptionMonitorApi, 
    hostGiftItemApi,
    getDetailActiveSettingApi,
    settingActiveHostGiftApi
} from 'app/core/service/backend-api';
import { TimeLine } from './category.service';
import { ActiveSetting, ActiveSettingItem, Redemption, STATUS } from '../models/host-gift.model';

@Injectable({
    providedIn: 'root'
})
export class HostGiftService {

    constructor(
        private api: ApiService,
        private http: HttpClient
    ) { }

    getDetail(): Observable<any> {
        return this.api.get(hostGiftSettingApi).pipe(
            map(response => {
                if (response && response.code === 200) {
                    if (response.data) {
                        const isActive = response.data.is_active || false;
                        const hostGiftItems = response.data.host_gift_items || [];
                        const historyItems = response.data.history || [];
                        let result = [];
                        let histories = [];
                        hostGiftItems.forEach(element => {
                            let hostGift = {
                                label: element.product ? (element.product.product_name || "") : "",
                                value: element.product ? (element.product.id ? Number(element.product.id) : 0) : 0,
                            }
                            let hostGiftComponent = [];
                            const hostGiftComponentItems = element.host_gift_item_component || [];
                            hostGiftComponentItems.forEach(item => {
                                let hostGiftComponentItem = {
                                    label: item.product ? (item.product.product_name || "") : "",
                                    value: item.product ? (item.product.id ? Number(item.product.id) : 0) : 0,
                                }
                                hostGiftComponent.push(hostGiftComponentItem)
                            })
                            const isActiveItem = element.is_active || false;
                            result.push({
                                id: element.id || "",
                                hostGift: hostGift,
                                hostGiftComponent: hostGiftComponent,
                                isActive: isActiveItem
                            })
                        });
                        historyItems.forEach(item => {
                            let timeLine = new TimeLine();
                            timeLine.action = "Updated by " + item.appUser.first_name + " " + item.appUser.last_name;
                            timeLine.createdAt = item.created_at || (new Date()).toISOString();
                            histories.push(timeLine);
                        });

                        let activeArr = result.filter(x => x.isActive === true); // list active host gift
                        activeArr.sort((a, b) => Number(b.id) - Number(a.id)); // sort decrease by id

                        let inactiveArr = result.filter(x => x.isActive === false); // list inactive host gift
                        inactiveArr.sort((a, b) => Number(b.id) - Number(a.id)); // sort decrease by id

                        result = activeArr.concat(inactiveArr); // concat array => result

                        return {
                            code: 200,
                            data: result,
                            isActive: isActive,
                            histories: histories,
                        }
                    } else {
                        return {
                            code: 200,
                            data: [],
                            isActive: false,
                            histories: [],
                        }
                    }
                } else {
                    return response;
                }
            }),
            catchError(error => { return throwError(error) })
        )
    }

    createNew(body: any): Observable<any> {
        return this.api.post(hostGiftSettingApi, body).pipe(
            map(response => {
                return response;
            }),
            catchError(error => { return throwError(error) })
        )
    }

    update(body: any): Observable<any> {
        return this.api.put(hostGiftSettingApi, body).pipe(
            map(response => {
                return response;
            }),
            catchError(error => { return throwError(error) })
        )
    }

    getRedemption(page, limit, params): Observable<any> {
        let param = new HttpParams();
        if (page) {
            param = param.append('page', page);
        }
        if (limit) {
            param = param.append('limit', limit);
        }
        if (Object.keys(params.filterModel).length > 0) {
            if (params.filterModel.orderId) {
                param = param.append('orderId', params.filterModel.orderId.filter.trim());
            }
            if (params.filterModel.recognitionDate) {
                param = param.append('recognitionDate', params.filterModel.recognitionDate.dateFrom.split(' ')[0]);
            }
            if (params.filterModel.expiryDate) {
                param = param.append('expiryDate', params.filterModel.expiryDate.dateFrom.split(' ')[0]);
            }
            if (params.filterModel.customerName) {
                param = param.append('customerName', params.filterModel.customerName.filter.trim());
            }
            if (params.filterModel.advisorName) {
                param = param.append('advisorName', params.filterModel.advisorName.filter.trim());
            }
            if (params.filterModel.advisorId) {
                param = param.append('advisorId', params.filterModel.advisorId.filter.trim());
            }
            if (params.filterModel.redemptionStatus) {
                param = param.append('redemtionStatus', params.filterModel.redemptionStatus.filter.trim());
            }
            if (params.filterModel.redemptionOrder) {
                param = param.append('redemtionOrderId', params.filterModel.redemptionOrder.filter.trim());
            }
            if (params.filterModel.redemptionDates) {
                param = param.append('redemtionDate', params.filterModel.redemptionDate.dateFrom.split(' ')[0]);
            }
        }
        if (this.api.isEnable()) {
            return this.http.get(redemptionMonitorApi, { headers: this.api.headers, params: param }).pipe(
                map((response: any) => {
                    if (response.code === 200) {
                        let result = [];
                        const data = response.data;
                        if (data && data.length > 0) {
                            data.forEach(element => {
                                let redemption = new Redemption();
                                const order = element.order ? element.order : null
                                redemption.orderId = order ? (order.order_id_tmm || ""): "";
                                redemption.recognitionDate = element.created_at || "";
                                redemption.expiryDate = element.expired_date || "";
                                const customer = element.order ? (element.order.customer || null) : null;
                                redemption.customerName = customer ? (customer.firt_name || "") : "";
                                const advisor = element.advisor;
                                redemption.advisorName = advisor ? (advisor.firt_name || "") : "";
                                redemption.advisorId = advisor ? (advisor.advisor_id_number || "") : "";
                                const redemptionOrder = element.order_redeem ? element.order_redeem : null;
                                redemption.redemptionOrder = redemptionOrder ? (redemptionOrder.order_id_tmm || "") : "";
                                redemption.redemptionDate = redemptionOrder ? (redemptionOrder.created_at || "") : "";
                                redemption.redemptionStatus = element.status ? element.status : "";
                                result.push(redemption);
                            });
                        }
                        return {
                            code: 200,
                            data: result,
                            total: response.total
                        }
                    } else {
                        return response;
                    }
                }),
                catchError((error) => { return throwError(error) })
            )
        }
    }

    getHostGiftItem() {
        return this.api.get(hostGiftItemApi).pipe(
            map((response) => {
                if (response.code === 200) {
                    let result: any[] = [];
                    const data = response.data || [];
                    data.forEach(element => {
                        const hostGiftItemId = element.id ? Number(element.id) : 0;
                        const hostGiftItemName = element.product ? (element.product.product_name || "") : "";
                        let hostGiftItem = {
                            label: hostGiftItemName,
                            value: {
                                label: hostGiftItemName,
                                value: hostGiftItemId
                            }
                        }
                        result.push(hostGiftItem);
                    });
                    return result;
                } else {
                    return response;
                }
            }),
            catchError((error) => { return throwError(error) })
        )
    }

    getDetailActiveSetting() {
        return this.api.get(getDetailActiveSettingApi).pipe(
            map((response) => {
                if (response.code === 200) {
                    const data = response.data;
                    const history = data ? data.history : [];
                    const hostGiftActive = data ? data.hostGiftActive : [];
                    let histories: TimeLine[] = [];
                    let activeSettingItems: ActiveSettingItem[] = [];

                    history.forEach(element => {
                        let timeLine = new TimeLine();
                        timeLine.action = "Updated by " + element.appUser.first_name + " " + element.appUser.last_name;
                        timeLine.createdAt = element.created_at || (new Date()).toISOString();
                        histories.push(timeLine);
                    });

                    hostGiftActive.forEach(element => {
                        const id: number = element.id ? Number(element.id) : 0;
                        const publicId = element.public_id || "";
                        const activeAt: Date = element.active_at ? new Date(element.active_at) : null;
                        const expiredAt: Date = element.expired_at ? new Date(element.expired_at) : null;
                        const status: STATUS = element.status || STATUS.UPCOMING;
                        const hostGiftItemId: number = element.host_gift_item_id ? Number(element.host_gift_item_id) : 0;
                        const hostGift = {
                            label: "",
                            value: hostGiftItemId
                        };
                        const activeSettingItem = new ActiveSettingItem(activeAt, expiredAt, status, hostGift, id, publicId);
                        activeSettingItems.push(activeSettingItem);
                    });

                    activeSettingItems.sort((a: ActiveSettingItem, b: ActiveSettingItem) => b.active_at.getTime() - a.active_at.getTime());

                    let temp = activeSettingItems.reduce(function(results, org) { // group item by public id
                        (results[org.public_id] = results[org.public_id] || []).push(org);
                        return results;
                    }, {})

                    let activeSettings: ActiveSetting[] = [];

                    Object.keys(temp).forEach((publicId) => {
                        const items = temp[publicId];
                        let activeSetting = new ActiveSetting(
                            items[0].active_at, items[0].expired_at, items[0].status, [], [], publicId
                        );
                        items.forEach(element => {
                            activeSetting.arrId.push(element.id);
                            activeSetting.arrHostGift.push(element.hostGift);
                        });
                        activeSettings.push(activeSetting);
                    })
                    
                    return {
                        histories,
                        activeSettingItems,
                        activeSettings
                    }
                } else {
                    return response;
                }
            }),
            catchError((error) => { return throwError(error) })
        )
    }

    createSettingActiveHostGift(body) {
        return this.api.post(settingActiveHostGiftApi, body).pipe(
            map(response => { return response; }),
            catchError((error) => { return throwError(error) })
        )
    }

    updateSettingActiveHostGift(body) {
        return this.api.put(settingActiveHostGiftApi, body).pipe(
            map(response => { return response; }),
            catchError((error) => { return throwError(error) })
        )
    }
}
