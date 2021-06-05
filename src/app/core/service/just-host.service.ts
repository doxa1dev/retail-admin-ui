import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { ApiService } from './api.service';
import { catchError, map } from 'rxjs/operators';
import { TimeLine } from './category.service';
import {
    justHostComponentSettingApi,
    justHostRequestAllApi,
    justHostRequestDetailApi,
    justHostRequestRejectApi,
    justHostRequestApproveApi,
    justHostGuestTrackerAllApi
} from './backend-api';
import { GuestInformation, GuestTracker, Request, RequestDetail } from 'app/core/models/just-host.model';
import * as Moment from 'moment';
import { environment } from 'environments/environment';

@Injectable({
    providedIn: 'root'
})
export class JustHostService {

    storageUrl: string = environment.storageUrl;

    constructor(
        private api: ApiService,
        private http: HttpClient
    ) { }

    getComponentSettingDetail(): Observable<any> {
        return this.api.get(justHostComponentSettingApi).pipe(
            map(response => {
                let componentSettingItemsArray = [];
                let histories = [];
                if (response && response.code === 200) {
                    if (response.data) {
                        const justHostItems = response.data.just_host_items || [];
                        const historyItems = response.data.history || [];
                        justHostItems.forEach(element => {
                            let justHost = {
                                label: element.product ? (element.product.product_name || "") : "",
                                value: element.product ? (element.product.id ? Number(element.product.id) : 0) : 0,
                            }
                            let justHostComponent = [];
                            const justHostComponentItems = element.just_host_item_component || [];
                            justHostComponentItems.forEach(item => {
                                let justHostComponentItem = {
                                    label: item.product ? (item.product.product_name || "") : "",
                                    value: item.product ? (item.product.id ? Number(item.product.id) : 0) : 0,
                                }
                                justHostComponent.push(justHostComponentItem);
                            })
                            const isActive = element.is_active || false;
                            componentSettingItemsArray.push({
                                id: element.id || "",
                                justHost,
                                justHostComponent,
                                isActive
                            })
                        });
                        historyItems.forEach(item => {
                            let timeLine = new TimeLine();
                            timeLine.action = "Updated by " + item.appUser.first_name + " " + item.appUser.last_name;
                            timeLine.createdAt = item.created_at || (new Date()).toISOString();
                            histories.push(timeLine);
                        });

                        let activeArr = componentSettingItemsArray.filter(x => x.isActive === true); // list active host gift
                        activeArr.sort((a, b) => Number(b.id) - Number(a.id)); // sort decrease by id

                        let inactiveArr = componentSettingItemsArray.filter(x => x.isActive === false); // list inactive host gift
                        inactiveArr.sort((a, b) => Number(b.id) - Number(a.id)); // sort decrease by id

                        componentSettingItemsArray = activeArr.concat(inactiveArr); // concat array => result
                    }

                    return {
                        componentSettingItemsArray,
                        histories
                    }
                } else {
                    return response;
                }
            }),
            catchError(error => { return throwError(error) })
        )
    }

    createNew(body: any): Observable<any> {
        return this.api.post(justHostComponentSettingApi, body).pipe(
            map(response => {
                return response;
            }),
            catchError(error => { return throwError(error) })
        )
    }

    update(body: any): Observable<any> {
        return this.api.put(justHostComponentSettingApi, body).pipe(
            map(response => {
                return response;
            }),
            catchError(error => { return throwError(error) })
        )
    }

    getRequestAll(page, limit, params): Observable<any> {
        let param = new HttpParams();
        if (page) {
            param = param.append('page', page);
        }
        if (limit) {
            param = param.append('limit', limit);
        }
        if (Object.keys(params.filterModel).length > 0) {
            if (params.filterModel.requestId) {
                param = param.append('requestId', params.filterModel.requestId.filter.trim());
            }
            if (params.filterModel.requestDate) {
                param = param.append('requestDate', params.filterModel.requestDate.dateFrom.split(' ')[0]);
            }
            if (params.filterModel.demoDate) {
                param = param.append('demoDate', params.filterModel.demoDate.dateFrom.split(' ')[0]);
            }
            if (params.filterModel.status) {
                param = param.append('status', params.filterModel.status.filter.trim());
            }
            if (params.filterModel.advisorName) {
                param = param.append('advisorName', params.filterModel.advisorName.filter.trim());
            }
            if (params.filterModel.advisorId) {
                param = param.append('advisorId', params.filterModel.advisorId.filter.trim());
            }
            if (params.filterModel.hostName) {
                param = param.append('hostName', params.filterModel.hostName.filter.trim());
            }
            if (params.filterModel.redemptionOrder) {
                param = param.append('redemptionOrder', params.filterModel.redemptionOrder.filter.trim());
            }
            if (params.filterModel.phoneNumber) {
                param = param.append('hostPhoneNumber', params.filterModel.phoneNumber.filter.trim());
            }
            if (params.filterModel.redemptionDate) {
                param = param.append('redemptionDate', params.filterModel.redemptionDate.dateFrom.split(' ')[0]);
            }
        }
        if (this.api.isEnable()) {
            return this.http.get(justHostRequestAllApi, { headers: this.api.headers, params: param }).pipe(
                map((response: any) => {
                    if (response && response.code === 200) {
                        let result = [];
                        const data = response.data;
                        data.forEach(element => {
                            let request = new Request();
                            request.id = element.id || "";
                            request.requestId = element.request_id || "";
                            request.requestDate = element.created_at || "";
                            request.demoDate = element.demo_date || "";
                            request.status = element.status || "";
                            const customer = element.customer || null;
                            if (customer) {
                                request.advisorName = customer.firt_name || "";
                                request.advisorName += request.advisorName ?
                                    (customer.last_name ? ` ${customer.last_name}` : "") :
                                    (customer.last_name ? `${customer.last_name}` : "");
                                request.advisorId = customer.advisor_id_number || "";
                            }
                            request.hostName = element.host_name || "";
                            request.phoneNumber = element.host_contact_number || "";
                            const redeemedOrder = element.redeemed_order || null;
                            request.redemptionOrder = redeemedOrder ? redeemedOrder.order_id_tmm || "" : "";
                            request.redemptionDate = redeemedOrder ? redeemedOrder.created_at || "" : "";
                            result.push(request);
                        });
                        return {
                            result,
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

    getRequestDetail(id: string): Observable<any> {
        let param = new HttpParams();
        if (id) {
            param = param.append('id', id);
        }

        if (this.api.isEnable()) {
            return this.http.get(justHostRequestDetailApi, { headers: this.api.headers, params: param }).pipe(
                map((response: any) => {
                    if (response && response.code === 200) {
                        const data = response.data;
                        let requestDetail = new RequestDetail();
                        let histories: TimeLine[] = [];
                        if (data) {
                            requestDetail.requestId = data.request_id || "";
                            const customer = data.customer || null;
                            if (customer) {
                                requestDetail.advisorName = customer.firt_name || "";
                                requestDetail.advisorName += requestDetail.advisorName ?
                                    (customer.last_name ? ` ${customer.last_name}` : "") :
                                    (customer.last_name ? `${customer.last_name}` : "");
                                requestDetail.advisorId = customer.advisor_id_number || "";
                            }
                            requestDetail.hostName = data.host_name || "";
                            requestDetail.hostPhoneNumber = data.host_contact_number || "";
                            requestDetail.demoDate = data.demo_date ? Moment(new Date(data.demo_date)).local().format('DD/MM/YYYY') : "";
                            requestDetail.demoLocation = data.address_line1 || "";
                            requestDetail.demoLocation += `, ${data.address_line2 || ""}`;
                            requestDetail.demoLocation += `, ${data.address_line3 || ""}`;
                            requestDetail.demoLocation += `, ${data.postal_code || ""}`;
                            requestDetail.requestImage = data.demo_photo ? `${this.storageUrl}${data.demo_photo}` : 'assets/DoxaImages/image-default.png';
                            requestDetail.guestInfoArray = [];
                            data.guest.forEach(element => {
                                let guest = new GuestInformation();
                                guest.guestName = element.guest_name || "";
                                guest.phoneNumber = element.guest_contact_number || "";
                                requestDetail.guestInfoArray.push(guest);
                            });
                            requestDetail.comment = data.comment || "";
                            requestDetail.status = data.status || "";
                            data.history.forEach(element => {
                                let timeLine = new TimeLine();
                                timeLine.action = "Updated by " + element.appUser.first_name + " " + element.appUser.last_name;
                                timeLine.createdAt = element.created_at || (new Date()).toISOString();
                                histories.push(timeLine);
                            });
                        }
                        return {
                            requestDetail,
                            histories
                        }
                    } else {
                        return response;
                    }
                }),
                catchError((error) => { return throwError(error) })
            )
        }
    }

    approveRequest(body: any): Observable<any> {
        return this.api.put(justHostRequestApproveApi, body).pipe(
            map((response) => {
                return response;
            }),
            catchError((error) => { return throwError(error) })
        )
    }

    rejectRequest(body: any): Observable<any> {
        return this.api.put(justHostRequestRejectApi, body).pipe(
            map((response) => {
                return response;
            }),
            catchError((error) => { return throwError(error) })
        )
    }

    getGuestTrackerAll(page, limit, params): Observable<any> {
        let param = new HttpParams();
        if (page) {
            param = param.append('page', page);
        }
        if (limit) {
            param = param.append('limit', limit);
        }
        if (Object.keys(params.filterModel).length > 0) {
            if (params.filterModel.name) {
                param = param.append('name', params.filterModel.name.filter.trim());
            }
            if (params.filterModel.phoneNumber) {
                param = param.append('phoneNumber', params.filterModel.phoneNumber.filter.trim());
            }
            if (params.filterModel.requestId) {
                param = param.append('requestId', params.filterModel.requestId.filter.trim());
            }
            if (params.filterModel.requestDate) {
                param = param.append('requestDate', params.filterModel.requestDate.dateFrom.split(' ')[0]);
            }
            if (params.filterModel.demoDate) {
                param = param.append('demoDate', params.filterModel.demoDate.dateFrom.split(' ')[0]);
            }
            if (params.filterModel.advisorName) {
                param = param.append('advisorName', params.filterModel.advisorName.filter.trim());
            }
            if (params.filterModel.advisorId) {
                param = param.append('advisorId', params.filterModel.advisorId.filter.trim());
            }
            if (params.filterModel.hostName) {
                param = param.append('hostName', params.filterModel.hostName.filter.trim());
            }
        }
        if (this.api.isEnable()) {
            return this.http.get(justHostGuestTrackerAllApi, { headers: this.api.headers, params: param }).pipe(
                map((response: any) => {
                    if (response && response.code === 200) {
                        let result = [];
                        const data = response.data;
                        data.forEach(element => {
                            let guest = new GuestTracker();
                            guest.name = element.guest_name || "";
                            guest.phoneNumber = element.guest_contact_number || "";
                            guest.requestDate = element.created_at || "";
                            const event = element.event;
                            if (event) {
                                guest.requestId = event.request_id || "";
                                guest.demoDate = event.demo_date || "";
                                const customer = event.customer || null;
                                if (customer) {
                                    guest.advisorName = customer.firt_name || "";
                                    guest.advisorName += guest.advisorName ?
                                        (customer.last_name ? ` ${customer.last_name}` : "") :
                                        (customer.last_name ? `${customer.last_name}` : "");
                                    guest.advisorId = customer.advisor_id_number || "";
                                }
                                guest.hostName = event.host_name;
                            }
                            result.push(guest);
                        });
                        return {
                            result,
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
}
