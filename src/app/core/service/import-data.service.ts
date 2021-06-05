import { Injectable } from '@angular/core';
import { ApiService } from "./api.service";
import { importDataApi, importDataIdApi, importSerialNumberApi, importPaymentGiftIdApi, importCustomerIdApi } from 'app/core/service/backend-api';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CheckNullOrUndefinedOrEmpty } from '../utils/common-function';
import { catchError, map } from 'rxjs/operators';
import { DataImport } from '../models/import-data.model';
import { formatDate } from '@angular/common';
import { Observable, throwError } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ImportDataService {

    constructor(
        private api: ApiService,
        private http: HttpClient
    ) { }
    
    /**
     * @param  {any} bodyData
     */
    importData(bodyData: any) {
        return this.api.post(importDataApi, bodyData).pipe(
            map(response => {
                let result = [];
                if (response && response.data) {
                    const data = response.data;
                    data.forEach(element => {
                        let errorRecord = new DataImport();
                        errorRecord.address1 = element.data.addressV2.address_line1 ? element.data.addressV2.address_line1 : "";
                        errorRecord.address2 = element.data.addressV2.address_line2 ? element.data.addressV2.address_line2 : "";
                        errorRecord.address3 = element.data.addressV2.address_line3 ? element.data.addressV2.address_line3 : "";
                        errorRecord.countryCode = element.data.addressV2.country_code ? element.data.addressV2.country_code : "";
                        errorRecord.postCode = element.data.addressV2.postal_code ? element.data.addressV2.postal_code : "";
                        errorRecord.stateCode = element.data.addressV2.state_code ? element.data.addressV2.state_code : "";
                        errorRecord.rank = element.data.rank ? element.data.rank : "";
                        errorRecord.advisorID = element.data.customerField.advisor_id_number ? element.data.customerField.advisor_id_number : "";
                        errorRecord.entityId = element.data.customerField.entity_id ? element.data.customerField.entity_id : "";
                        errorRecord.branchMgrAdvisorID = element.data.customerField.branch_manager_customer_id ? element.data.customerField.branch_manager_customer_id : "";
                        errorRecord.mgrAdvisorID = element.data.customerField.team_leader_customer_id ? element.data.customerField.team_leader_customer_id : "";
                        errorRecord.advName = element.data.customerField.firt_name ? element.data.customerField.firt_name : "";
                        errorRecord.nic = element.data.customerField.national_id ? element.data.customerField.national_id : "";
                        errorRecord.dob = element.data.customerField.day_of_birth ? 
                                            formatDate(element.data.customerField.day_of_birth, "dd/MM/yyyy", "en-US")
                                            : "";
                        errorRecord.nationalityCode = element.data.customerField.nationality_code ? element.data.customerField.nationality_code : "";
                        errorRecord.phoneDialCode = element.data.customerField.phone_dial_code ? element.data.customerField.phone_dial_code : "";
                        errorRecord.mobilePhone = element.data.customerField.phone_number ? element.data.customerField.phone_number : "";
                        errorRecord.emailNew = element.data.customerField.email ? element.data.customerField.email : "";
                        errorRecord.gender = element.data.customerField.gender ? element.data.customerField.gender : "";
                        errorRecord.designation = element.data.customerField.designation ? element.data.customerField.designation : "";
                        errorRecord.recruiterAdvisorID = element.data.customerField.recruiter_id ? element.data.customerField.recruiter_id : "";
                        errorRecord.nickName = element.data.customerField.preferred_name ? element.data.customerField.preferred_name : "";
                        errorRecord.bankCode = element.data.customerField.bank_code ? element.data.customerField.bank_code : "";
                        errorRecord.bankAccNo = element.data.customerField.bank_account ? element.data.customerField.bank_account : "";
                        errorRecord.bankHolder = element.data.customerField.bank_holder ? element.data.customerField.bank_holder : "";
                        errorRecord.bankHolderIC = element.data.customerField.bank_holder_ic ? element.data.customerField.bank_holder_ic : "";
                        errorRecord.messageError = element.message ? element.message : "";
                        result.push(errorRecord);
                    })
                }
                return {
                    code : response ? response.code : null,
                    recordErrors: result,
                    numRecordErrors: result.length
                }
            })
        )
    }
    
    /**
     * @param  {string} id
     */
    importDataId(id: string) {
        if (!CheckNullOrUndefinedOrEmpty(id)) {
            let param = new HttpParams();
            param = param.append('order_id_tmm', id);
            if (this.api.isEnable()) {
                return this.http.put(importDataIdApi, ' ', { headers: this.api.headers, params: param })
                    .pipe(map((data: any) => {
                        return data;
                    }))
            }
        }
    }
    
    /**
     * @param  {string} id
     */
    importSerialNumber(id: string) {
        if (id) {
            let param = new HttpParams();
            param = param.append('order_id_tmm', id);
            if (this.api.isEnable()) {
                return this.http.put(importSerialNumberApi, '', { headers: this.api.headers, params: param });
            }
        }
    }

    /**
     * @param  {string} id
     */
    importPaymentGiftId(id: string) {
        if (id) {
            let param = new HttpParams();
            param = param.append('order_id_tmm', id);
            if (this.api.isEnable()) {
                return this.http.put(importPaymentGiftIdApi, '', { headers: this.api.headers, params: param });
            }
        }
    }

    importCustomerId(id: string): Observable<any> {
        if (id) {
            let param = new HttpParams();
            param = param.append('customer_id', id);
            if (this.api.isEnable()) {
                return this.http.get(importCustomerIdApi, { headers: this.api.headers, params: param }).pipe(
                    map(response => {
                        return response;
                    }),
                    catchError(error => {return throwError(error)})
                )
                
            }
        }
    }
}
