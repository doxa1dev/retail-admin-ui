import { Injectable } from '@angular/core';
import { createPeriod , getPeriodDetail, updatePeriod, consolidatePeriod, updateNextPeriod } from "./backend-api";
import { ApiService } from './api.service';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { CheckNullOrUndefined, CheckNullOrUndefinedOrEmpty } from '../utils/common-function';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PeriodConfigService {

  constructor(
    private api: ApiService , private http: HttpClient
    ) {}

    httpOption = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + localStorage.getItem("token"),
        'Content-Type': 'application/json'
      })
    }

  getListPeriod(): Observable<any> {
    return this.api.get(createPeriod).pipe(
      map((value) =>
      {
          if (value.code === 200)
          {
              let result = [];
              result = this.renderPeriodConfigTable(value.data)
              return result;
          }
      }), catchError(err => throwError(err))
    );
  }

  renderPeriodConfigTable(data){
    let listPeriodConfig = [];
    if(!CheckNullOrUndefinedOrEmpty(data)){
      data.forEach(element => {
        // console.log(element)
        let period = new PeriodConfigTable();
        period.id = element.id;
        period.period = element.period;
        period.startTime = element.start_time
        period.endTime = element.end_time;
        period.status = element.status;
        period.updated_at = element.updated_at;
        period.consolidation = element.consolidation;
        listPeriodConfig.push(period)
      });
    }
    return listPeriodConfig;
  }

  createPeriod(period , startTime, endTime){
    let param = new HttpParams();
    if(!CheckNullOrUndefined(period)){
      param = param.append('period', period);
    }
    if(!CheckNullOrUndefined(startTime)){
      param = param.append('start_time', startTime);
    }
    if (!CheckNullOrUndefinedOrEmpty(endTime)) {
      param = param.append('end_time', endTime)
    }
    if(this.api.isEnable()){
      return this.http.post<any>(createPeriod, "" ,{ headers: this.api.headers, params: param })
    }
  }

  updatePeriod(period , startTime, endTime, periodId) {
    let param = new HttpParams();
    if(!CheckNullOrUndefined(period)){
      param = param.append('period', period);
    }
    if(!CheckNullOrUndefined(startTime)){
      param = param.append('start_time', startTime);
    }
    if(!CheckNullOrUndefined(endTime)){
      param = param.append('end_time', endTime);
    }
    if(!CheckNullOrUndefined(periodId)){
      param = param.append('period_id', periodId);
    }
    if(this.api.isEnable()){
      return this.http.put<any>(updatePeriod, "" ,{ headers: this.api.headers, params: param })
    }
  }

  updateNextPeriod(period , startTime, endTime, periodId) {
    let param = new HttpParams();
    if(!CheckNullOrUndefined(period)){
      param = param.append('period', period);
    }
    if(!CheckNullOrUndefined(startTime)){
      param = param.append('start_time', startTime);
    }
    if(!CheckNullOrUndefined(endTime)){
      param = param.append('end_time', endTime);
    }
    if(!CheckNullOrUndefined(periodId)){
      param = param.append('period_id', periodId);
    }
    if(this.api.isEnable()){
      return this.http.put<any>(updateNextPeriod, "" ,{ headers: this.api.headers, params: param })
    }
  }

  consolidatePeriod(periodId) {
    let param = new HttpParams();
    if(!CheckNullOrUndefined(periodId)){
      param = param.append('period_id', periodId);
    }
    if(this.api.isEnable()){
      return this.http.put<any>(consolidatePeriod, "" ,{ headers: this.api.headers, params: param })
    }
  }

  getPeriodDetail(periodId){
    let param = new HttpParams();
    if(!CheckNullOrUndefined(periodId)){
      param = param.append('period_id', periodId);
    }
    if(this.api.isEnable()){
      return this.http.get<any>(getPeriodDetail, { headers: this.api.headers, params: param }).pipe(
        map(data=>{
          if(data.code === 200){
            // console.log(data.data)
            return data.data
          }
        })
      )
    }
  }

  renderHistory(element) {
    let arrTimeLine = [];
    if (!CheckNullOrUndefinedOrEmpty(element)) {
      element.forEach(data => {
        let timeLine = new TimeLinePeriod();
        if(data.action == "Period is created") {
          timeLine.action = "Created by " + data.appUser.email
        }
        else if (data.action == "Period is consolidated") {
          timeLine.action = "Consolidated by " + data.appUser.email
        }
        else timeLine.action = "Updated by " + data.appUser.email
        timeLine.createdAt = data.created_at;
        arrTimeLine.push(timeLine);
      });
      return arrTimeLine;
    }
  }
}

export class PeriodConfigTable{
    id: number;
    period: string;
    startTime: Date;
    endTime: Date;
    status: string;
    updated_at: Date;
    consolidation: string;
}

export class TimeLinePeriod {
  createdAt: string;
  action: string;
}

