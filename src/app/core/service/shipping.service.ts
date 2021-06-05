import { Injectable } from "@angular/core";
import { getShippingAgentsFormDataApi, createShipmentApi, deleteShippingAgentApi ,
      createQxpressTrackingApi , getTrackingDataApi, changeShippingApi, MxpressShipping, TrackingMxpressApi,
      getPublicHolidayApi, getQuickTimeSlotQXpressApi, getSpTimeAfterByDateApi, saveShippingSpecialApi,
      createQXpressApi, cancelQXpressApi, shippingLocationAdminAPI, changeShippingLocationApi
    } from './backend-api';
import { ApiService } from "./api.service";
import { CreateShipmentDto } from '../dto/create-shipment.dto';
import { Observable } from 'rxjs';
import { HttpParams, HttpClient } from '@angular/common/http';
import { isNullOrUndefined } from 'util';
import { map } from 'rxjs/operators';
import { CheckNullOrUndefinedOrEmpty } from "../utils/common-function";

@Injectable({
  providedIn: "root",
})
export class ShippingService {
  constructor(private api: ApiService , private http: HttpClient) { }

  getShippingAgentsFormData() {
    return this.api.get(getShippingAgentsFormDataApi);
  }

  createShippingLabels(createShipmentDto: CreateShipmentDto) {
    return this.api.post(createShipmentApi, createShipmentDto);
  }

  deleteShippingAgent(orderID) {
    const url = deleteShippingAgentApi.replace(':orderId', orderID)
    return this.api.get(url);
  }

  createTrackingForQxpress(formData){
    return this.api.post(createQxpressTrackingApi , formData);
  }

  getTrackingDataForQxpress(trackingId): Observable<any>{
      let param = new HttpParams();
      if(!CheckNullOrUndefinedOrEmpty(trackingId)){
        param = param.append('trackingId', trackingId);
      }
      if(this.api.isEnable()){
        return this.http.get<any>(getTrackingDataApi , { headers: this.api.headers, params: param }).pipe(
          map(data=>{
            if(data.code === 200){
              return data.data.ResultObject.tracking_history[0].status
            }
          })
        )
      }
    }

  changeShippingMethod(shippingMethod) {
    return this.api.post(changeShippingApi, shippingMethod);
  }

  changeShippingLocationMethod(shippingLocationMethod) {
    return this.api.post(changeShippingLocationApi, shippingLocationMethod);
  }

  shippingLocation

  createMpxressShipping(formShipping){
    return this.api.post(MxpressShipping, formShipping);
  }

  getTrackingMxpress(tracking_id){
    let param = new HttpParams();
    if(!CheckNullOrUndefinedOrEmpty(tracking_id)){
      param = param.append('tracking_id', tracking_id);
    }
    if(this.api.isEnable()){
      return this.http.get<any>(TrackingMxpressApi , { headers: this.api.headers, params: param }).pipe(
        map(data=>{
          if(data.code === 200){
            return data.data
          }
        })
      )
    }
  }

  getPublicHoliday(country, year) {
    let param = new HttpParams();

    if (!CheckNullOrUndefinedOrEmpty(country)) {
        param = param.append('country', country);
    }
    if (!CheckNullOrUndefinedOrEmpty(country)) {
        param = param.append('year', year);
    }

    return this.http.get<any>(getPublicHolidayApi, {headers: this.api.headers, params: param}).pipe(
        map( data => {
            if (data.code === 200 && !CheckNullOrUndefinedOrEmpty(data.data)) {
                return data.data;
            }
        })
    )
  }

  getSpTimeAfterByDate(date_search) {
    let param = new HttpParams();

    if (!CheckNullOrUndefinedOrEmpty(date_search)) {
        param = param.append('date_search', date_search);
    }

    return this.http.get<any>(getSpTimeAfterByDateApi, {headers: this.api.headers, params: param}).pipe(
        map( data => {
            if (data.code === 200 && !CheckNullOrUndefinedOrEmpty(data.data)) {
                return data.data;
            }
        })
    )
  }

  getQuickTimeSlotQXpress(date_search) {
    let param = new HttpParams();

    if (!CheckNullOrUndefinedOrEmpty(date_search)) {
        param = param.append('date_search', date_search);
    }

    return this.http.get<any>(getQuickTimeSlotQXpressApi, {headers: this.api.headers, params: param}).pipe(
        map( data => {
            if (data.code === 200 && !CheckNullOrUndefinedOrEmpty(data.data)) {
                return data.data;
            }
        })
    )
  }

  saveShippingSpecial(formShipping) {
    return this.api.post(saveShippingSpecialApi, formShipping);
  }

  createQXpress(formCreate) {
    return this.api.post(createQXpressApi, formCreate);
  }

  cancelQXpress(id) {
      let param = new HttpParams();

      if (!CheckNullOrUndefinedOrEmpty(id)) {
          param = param.append('id', id);
      }

      return this.http.patch<any>(cancelQXpressApi, {}, {headers: this.api.headers, params: param}).pipe(
          map( data => {
              return data;
          })
      )
  }

  getShippingLocationAdmin() {
    return this.api.get(shippingLocationAdminAPI).pipe(
        map(respone => {
            if (respone.code == 200) {
                return respone.data;
            }
        })
    );
}

}
