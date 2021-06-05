import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import {
    checkEoSleScApi,
    checkEoSleScDetGiftApi,
    checkEoSleScDetSerialNumberApi,
    checkMemmemberApi
} from './backend-api';
import * as Moment from 'moment';
import { Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { DataTransfer, DataTransferMemmember } from '../models/data-transfer-check.model';
import * as jwt_decode from "jwt-decode";
@Injectable({
    providedIn: 'root'
})
export class DataTransferCheckService {
    entityId: number;
    constructor(private api: ApiService, private http: HttpClient) {
        let decoded = jwt_decode(localStorage.getItem("token"));
        this.entityId = Number(decoded.entity_id);
    }

    checkEoSleSc(params): Observable<any> {
        const { start, end, status } = params;
        let param = new HttpParams();
        if (start) {
            param = param.append('start', Moment(start).local().format('YYYY-MM-DD'));
        }
        if (end) {
            param = param.append('end', Moment(end).local().format('YYYY-MM-DD'));
        }
        if (status) {
            param = param.append('status', status.value);
        }

        if (this.api.isEnable) {
            return this.http.get(checkEoSleScApi, { headers: this.api.headers, params: param }).pipe(
                map((response: any) => {
                    if (response.code === 200) {
                        const data = response.data;
                        let result = []
                        if (data && data.length > 0) {
                            data.forEach(element => {
                                let dataTransfer = new DataTransfer();
                                dataTransfer.orderId = element.order_id_tmm || "";
                                dataTransfer.createdTime = element.created_at ? Moment(element.created_at).local().format('DD/MM/YYYY') : "";
                                dataTransfer.paymentVerifiedTime = element.payment_verified_at ? Moment(element.payment_verified_at).local().format('DD/MM/YYYY') : "";
                                result.push(dataTransfer);
                            });
                        }
                        return {
                            code: 200,
                            data: result
                        }
                    } else {
                        return response;
                    }
                }),
                catchError(error => { return throwError(error) })
            )
        }
    }

    checkEoSleScDetGift(params): Observable<any> {
        const { start, end, status } = params;
        let param = new HttpParams();
        if (start) {
            param = param.append('start', Moment(start).local().format('YYYY-MM-DD'));
        }
        if (end) {
            param = param.append('end', Moment(end).local().format('YYYY-MM-DD'));
        }
        if (status) {
            param = param.append('status', status.value);
        }

        if (this.api.isEnable) {
            return this.http.get(checkEoSleScDetGiftApi, { headers: this.api.headers, params: param }).pipe(
                map((response: any) => {
                    if (response.code === 200) {
                        const data = response.data;
                        let result = []
                        if (data && data.length > 0) {
                            data.forEach(element => {
                                let dataTransfer = new DataTransfer();
                                dataTransfer.orderId = element.order_id_tmm || "";
                                dataTransfer.createdTime = element.created_at ? Moment(element.created_at).local().format('DD/MM/YYYY') : "";
                                dataTransfer.paymentVerifiedTime = element.payment_verified_at ? Moment(element.payment_verified_at).local().format('DD/MM/YYYY') : "";
                                result.push(dataTransfer);
                            });
                        }
                        return {
                            code: 200,
                            data: result
                        }
                    } else {
                        return response;
                    }
                }),
                catchError(error => { return throwError(error) })
            )
        }
    }

    checkEoSleScDetSerialNumber(params): Observable<any> {
        const { start, end, status } = params;
        let param = new HttpParams();
        if (start) {
            param = param.append('start', Moment(start).local().format('YYYY-MM-DD'));
        }
        if (end) {
            param = param.append('end', Moment(end).local().format('YYYY-MM-DD'));
        }
        if (status) {
            param = param.append('status', status.value);
        }

        if (this.api.isEnable) {
            return this.http.get(checkEoSleScDetSerialNumberApi, { headers: this.api.headers, params: param }).pipe(
                map((response: any) => {
                    if (response.code === 200) {
                        const data = response.data;
                        let result = []
                        if (data && data.length > 0) {
                            data.forEach(element => {
                                let dataTransfer = new DataTransfer();
                                dataTransfer.orderId = element.order_id_tmm || "";
                                dataTransfer.createdTime = element.created_at ? Moment(element.created_at).local().format('DD/MM/YYYY') : "";
                                dataTransfer.paymentVerifiedTime = element.payment_verified_at ? Moment(element.payment_verified_at).local().format('DD/MM/YYYY') : "";
                                result.push(dataTransfer);
                            });
                        }
                        return {
                            code: 200,
                            data: result
                        }
                    } else {
                        return response;
                    }
                }),
                catchError(error => { return throwError(error) })
            )
        }
    }

    checkMemmember(params): Observable<any> {
        const { start, end } = params;
        let param = new HttpParams();
        if (start) {
            param = param.append('start', Moment(start).local().format('YYYY-MM-DD'));
        }
        if (end) {
            param = param.append('end', Moment(end).local().format('YYYY-MM-DD'));
        }

        if (this.api.isEnable) {
            return this.http.get(checkMemmemberApi, { headers: this.api.headers, params: param }).pipe(
                map((response: any) => {
                    if (response.code === 200) {
                        const data = response.data;
                        let result = []
                        if (data && data.length > 0) {
                            data.forEach(element => {
                                let dataTransfer = new DataTransferMemmember();
                                dataTransfer.advisorId = element.advisor_id_number ? Number(element.advisor_id_number) : 0;
                                dataTransfer.email = element.email || "";
                                dataTransfer.createdTime = element.created_at ? Moment(element.created_at).local().format('DD/MM/YYYY') : "";
                                result.push(dataTransfer);
                            });
                        }
                        
                        if (this.entityId === 1) {
                            result = result.filter(x => x.advisorId > 2000);
                        } else if (this.entityId === 2) {
                            result = result.filter(x => x.advisorId > 26000);
                        }

                        return {
                            code: 200,
                            data: result
                        }
                    } else {
                        return response;    
                    }
                }),
                catchError(error => { return throwError(error) })
            )
        }
    }
}
