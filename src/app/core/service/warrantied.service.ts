import { Injectable } from "@angular/core";
import { HttpErrorResponse, HttpParams, HttpClient } from "@angular/common/http";
import { map, catchError, combineAll } from "rxjs/operators";
import { warrantiedApi, warrantiedDetailApi, warrantiedHistoryApi, createSerialNumberApi, updateStatusWarranty , createWarranty,checkSerialNumberApi, updateSerialNumberApi} from "./backend-api";
import { Product } from "../models/product.model";
import { Observable, throwError } from "rxjs";
import { ApiService } from "./api.service";
import { orderTable } from "../models/order.model";
import { isNullOrUndefined } from "util";
import { formatDate, formatCurrency } from "@angular/common";
import * as moment from "moment";
import HelperFn from 'app/main/direct-sales/orders/helper/helper-fn';
import { CheckNullOrUndefinedOrEmpty } from "../utils/common-function";

@Injectable({
  providedIn: "root",
})
export class WarrantiedService {

  helperFn = new HelperFn();

  constructor(private api: ApiService , private http: HttpClient) {}

  /**
   * get All Warrantied by Status
   */
  getAllWarrantied(status , page , limit , params): Observable<any> {
    let param = new HttpParams();
    if (!isNullOrUndefined(page)) {
      param = param.append('page', page);
    }
    if (!isNullOrUndefined(limit)) {
      param = param.append('limit', limit);
    }
    if (!isNullOrUndefined(status)) {
      param = param.append('status', status);
    }
    if (!isNullOrUndefined(params.filterModel)) {
      if (!isNullOrUndefined(params.filterModel.productName)) {
        param = param.append('product', params.filterModel.productName.filter.trim());
      }
      if (!isNullOrUndefined(params.filterModel.orderIdTmm)) {
        param = param.append('order', params.filterModel.orderIdTmm.filter.trim());
      }
      if (!isNullOrUndefined(params.filterModel.serialNumber)) {
        param = param.append('serial', params.filterModel.serialNumber.filter.trim());
      }
      if (!isNullOrUndefined(params.filterModel.warrantyStartDate)) {
        param = param.append('start', params.filterModel.warrantyStartDate.filter.trim());
      }
      if (!isNullOrUndefined(params.filterModel.warrantyExpired)) {
        param = param.append('expired', params.filterModel.warrantyExpired.filter.trim());
      }
      if (!isNullOrUndefined(params.filterModel.customerName)) {
        param = param.append('customer', params.filterModel.customerName.filter.trim());
      }
      if (!isNullOrUndefined(params.filterModel.advisorID)) {
        param = param.append('advisorId', params.filterModel.advisorID.filter.trim());
      }
      if (!isNullOrUndefined(params.filterModel.advisorName)) {
        param = param.append('advisorName', params.filterModel.advisorName.filter.trim());
      }
    }
    if(this.api.isEnable()){
      return this.http.get<any>(warrantiedApi, { headers: this.api.headers, params: param } ).pipe(
        map((data) => {
          // console.log(data)
          let listWarrantied = new Array<Warrantied>();
          if (data.code === 200) {
            data.data.forEach((data) => {
              let warrantiedData = new Warrantied();
              warrantiedData.productName = data.product.product_name;
              warrantiedData.orderIdTmm = data.order.order_id_tmm;
              warrantiedData.orderNumber = data.order_id;
              warrantiedData.serialNumber = data.serial_number;
              warrantiedData.warrantyPeriod = data.warranty_duration_in_days + " days"
              warrantiedData.warrantyStartDate = formatDate(data.warranty_start_date, "dd/MM/yyyy", "en-US");
              warrantiedData.warrantyExpired = formatDate(data.warranty_end_date, "dd/MM/yyyy", "en-US");
              warrantiedData.advisorID = (!isNullOrUndefined(data.advisor)) ? data.advisor.advisor_id_number : data.advisor_customer_id
              warrantiedData.id = data.id;
              warrantiedData.uuid = data.uuid

              if (isNullOrUndefined(data.customer)) {
                warrantiedData.customerName = " ";
              } else if (isNullOrUndefined(data.customer.firt_name)) {
                warrantiedData.customerName = data.customer.last_name
              } else if (isNullOrUndefined(data.customer.last_name)){
                warrantiedData.customerName = data.customer.firt_name
              } else {
                warrantiedData.customerName = data.customer.firt_name + " " + data.customer.last_name;
              }

              if (isNullOrUndefined(data.advisor)) {
                warrantiedData.advisorName = " ";
              } else if (!isNullOrUndefined(data.advisor.preferred_name)) {
                warrantiedData.advisorName = data.advisor.preferred_name;
              } else {
                warrantiedData.advisorName = data.advisor.firt_name + " " + data.advisor.last_name;
              }

              listWarrantied.push(warrantiedData);
            });
            return {listWarrantied , sum : data.sum};
          }
        }),
        catchError((data) => throwError(data))
      );
    }

  }

  getWarrantiedProductById(id): Observable<any> {
    let warrantiedData = new Warrantied()
    let url = warrantiedDetailApi.replace(":id", id)

    return this.api.get(url).pipe(
      map( (data) => {

        if (data.code === 200) {
          warrantiedData.id = data.data.id
          warrantiedData.productName = data.data.product.product_name
          warrantiedData.orderNumber = data.data.order_id
          warrantiedData.serialNumber = data.data.serial_number
          warrantiedData.orderIdTmm = data.data.order.order_id_tmm;

          if (!isNullOrUndefined(data.data.advisor)) {
            if (!isNullOrUndefined(data.data.advisor.advisor_id_number)){
              warrantiedData.advisorID = data.data.advisor.advisor_id_number
            }
            if(!isNullOrUndefined(data.data.advisor.preferred_name)){
              warrantiedData.advisorName = data.data.advisor.preferred_name;
            }else{
              warrantiedData.advisorName  = data.data.advisor.firt_name + " " + data.data.advisor.last_name;
            }
          } else {
            warrantiedData.advisorName = null;
          }

          if (isNullOrUndefined(data.data.customer)) {
            warrantiedData.customerName = " ";
          } else if (isNullOrUndefined(data.data.customer.firt_name)) {
            warrantiedData.customerName = data.data.customer.last_name
          } else if (isNullOrUndefined(data.data.customer.last_name)){
            warrantiedData.customerName = data.data.customer.firt_name
          } else {
            warrantiedData.customerName = data.data.customer.firt_name + " " + data.data.customer.last_name
          }

          warrantiedData.customerPhoneNumber = "(+" + data.data.customer.phone_dial_code + ") " + data.data.customer.phone_number
          warrantiedData.customerEmail = data.data.customer.email

          data.data.history.forEach(element => {

            let warrantiedList = new WarrantyHistory()
            warrantiedList.createdAt = formatDate(element.created_at, "dd/MM/yyyy", "en-US")
            warrantiedList.comment = element.comment
            warrantiedList.createdById = element.created_by_id
            warrantiedList.id = element.id
            warrantiedList.warrantiedProductId = element.warrantied_product_id
            warrantiedData.warrantyHistory.push(warrantiedList)
          });

          if (!isNullOrUndefined( data.data.customer.address)) {
            warrantiedData.customerAddress = this.helperFn.setDisplayAddressLine(data.data.customer.address.address_line1,
              data.data.customer.address.address_line2, data.data.customer.address.address_line3, data.data.customer.address.postal_code);

            warrantiedData.customerCountry = this.helperFn.setStateCountryLine(data.data.customer.address.state_code, data.data.customer.address.country_code);
          } else {
            warrantiedData.customerAddress = null;
            warrantiedData.customerCountry = null;
          }

          warrantiedData.warrantyPeriod = data.data.warranty_duration_in_days + " days"
          warrantiedData.warrantyStartDate = formatDate(data.data.warranty_start_date, "dd/MM/yyyy", "en-US")
          warrantiedData.warrantyExpired = formatDate(data.data.warranty_end_date, "dd/MM/yyyy", "en-US")

          }

        return warrantiedData;
      })
    )
  }

  /**
   * send Comment
   */
  sendComment(id, comment): Observable<any>{
    let url = warrantiedHistoryApi.replace(":id", id);
    let url2 = url.replace(":comment", comment)
    return this.api.post(url2, {})
  }

  createSerialNumber(CreateSerialForm):  Observable<any>
  {
    return this.api.post(createSerialNumberApi, CreateSerialForm);
  }

  updateSerialNumber(id, serial_number): Observable<any>{
    let param = new HttpParams();
    if(!CheckNullOrUndefinedOrEmpty(serial_number)){
      param = param.append('id', id);
      param = param.append('serial_number', serial_number);
      if(this.api.isEnable()){
        return this.http.put<any>(updateSerialNumberApi, '',{ headers: this.api.headers, params: param }).pipe(
          map(value=>{

            return value;
          }), catchError(value => throwError(value))
        )
      }
    }
  }



  updateStatusWarranty(customerId , orderId){
    let url = updateStatusWarranty.replace(':customerId',customerId).replace(':orderId',orderId)
    return this.api.put(url,'')
  }

  deleteWarranty(orderId):  Observable<any>{
    let param = new HttpParams();
    param = param.append('order_id', orderId);
    return this.http.delete(warrantiedApi,{ headers: this.api.headers, params: param}).pipe(map(data=>{
      return data;
    }))
  }

  checkSerialNumber(SerialArray : String[]) : Observable<any>
  {
    return this.api.post(checkSerialNumberApi,SerialArray);
  }
}
export class Warrantied {
  productName: string;
  orderIdTmm: number;
  serialNumber: string;
  orderNumber: string;
  warrantyPeriod: string;
  warrantyStartDate: string;
  warrantyExpired: string;
  customerName: string;
  customerPhoneNumber: string;
  customerAddress: string;
  customerCountry: string;
  customerEmail: string;
  advisorID: string;
  advisorName: string;
  id: string;
  uuid: string;
  warrantyHistory: WarrantyHistory[] = [];
}

export class WarrantyHistory {
  comment: string;
  createdAt: string;
  createdById: string;
  id: string;
  warrantiedProductId: string;
}
