import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { HttpClient, HttpParams } from "@angular/common/http";
import { listSalesMonitorApi, getSalesMonitorDetailApi, updateSalesMonitorDetailApi } from './backend-api';
import { Observable, throwError } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import { CheckNullOrUndefinedOrEmpty } from '../utils/common-function';
import { formatCurrency, formatDate } from "@angular/common";
import { capitalize } from "lodash";


@Injectable({
  providedIn: "root",
})
export class SalesMonitorService {
  constructor(private api: ApiService, private http: HttpClient) { }

  getListSalesMonitor(page, limit, params): Observable<any> {

    let param = new HttpParams();
    if(!CheckNullOrUndefinedOrEmpty(page)){
      param = param.append('page', page);
    }
    if(!CheckNullOrUndefinedOrEmpty(limit)){
      param = param.append('limit', limit);
    }

    if(!CheckNullOrUndefinedOrEmpty(params.filterModel)) {
      if(!CheckNullOrUndefinedOrEmpty(params.filterModel.order)){
        param = param.append('order_tmm', params.filterModel.order.filter.trim());
      }
      if(!CheckNullOrUndefinedOrEmpty(params.filterModel.advisorID)){
        param = param.append('advisor_id', params.filterModel.advisorID.filter.trim());
      }
      if(!CheckNullOrUndefinedOrEmpty(params.filterModel.teamManagerID)){
        param = param.append('teammanager_id', params.filterModel.teamManagerID.filter.trim());
      }
      if(!CheckNullOrUndefinedOrEmpty(params.filterModel.branchManagerID)){
        param = param.append('branch_id', params.filterModel.branchManagerID.filter.trim());
      }
      if(!CheckNullOrUndefinedOrEmpty(params.filterModel.recruiterID)){
        param = param.append('recruiter_id', params.filterModel.recruiterID.filter.trim());
      }
      if(!CheckNullOrUndefinedOrEmpty(params.filterModel.period)){
        param = param.append('period', params.filterModel.period.filter.trim());
      }
      if(!CheckNullOrUndefinedOrEmpty(params.filterModel.status)){
        param = param.append('status', params.filterModel.status);
      }
      if(!CheckNullOrUndefinedOrEmpty(params.filterModel.toVerify)){
        param = param.append('verify_start', formatDate(params.filterModel.toVerify.dateFrom, 'yyyy-MM-dd', 'en-US'));
      }
      if(!CheckNullOrUndefinedOrEmpty(params.filterModel.toVerify)){
        param = param.append('verify_end', formatDate(params.filterModel.toVerify.dateTo, 'yyyy-MM-dd', 'en-US'));
      }
      if(!CheckNullOrUndefinedOrEmpty(params.filterModel.toShip)){
        param = param.append('ship_start',  formatDate(params.filterModel.toShip.dateFrom, 'yyyy-MM-dd', 'en-US'));
      }
      if(!CheckNullOrUndefinedOrEmpty(params.filterModel.toShip)){
        param = param.append('Ship_end', formatDate(params.filterModel.toShip.dateTo, 'yyyy-MM-dd', 'en-US'));
      }
      if(!CheckNullOrUndefinedOrEmpty(params.filterModel.toReceive)){
        param = param.append('receive_start', formatDate(params.filterModel.toReceive.dateFrom, 'yyyy-MM-dd', 'en-US'));
      }
      if(!CheckNullOrUndefinedOrEmpty(params.filterModel.toReceive)){
        param = param.append('recrive_end', formatDate(params.filterModel.toReceive.dateTo, 'yyyy-MM-dd', 'en-US'));
      }
      if(!CheckNullOrUndefinedOrEmpty(params.filterModel.completed)){
        param = param.append('completed_start', formatDate(params.filterModel.completed.dateFrom, 'yyyy-MM-dd', 'en-US'));
      }
      if(!CheckNullOrUndefinedOrEmpty(params.filterModel.completed)){
        param = param.append('completed_end', formatDate(params.filterModel.completed.dateTo, 'yyyy-MM-dd', 'en-US'));
      }
      if(!CheckNullOrUndefinedOrEmpty(params.filterModel.currentStatus)){
        param = param.append('order_status', params.filterModel.currentStatus);
      }
      if(!CheckNullOrUndefinedOrEmpty(params.filterModel.recruitment)){
        param = param.append('recruitment', params.filterModel.recruitment);
      }
      if(!CheckNullOrUndefinedOrEmpty(params.filterModel.location)){
        param = param.append('location', params.filterModel.location.filter.trim());
      }
    }

    if (this.api.isEnable()) {
      return this.http.get<any>(listSalesMonitorApi, {headers: this.api.headers, params: param}).pipe(
        map(data => {
          if (data.code === 200 && !CheckNullOrUndefinedOrEmpty(data.data)) {
            let result = [];

            data.data.forEach((element, index) => {
              let salesMonitor = new SalesMonitor();

              salesMonitor.no = index + 1;
              salesMonitor.order = element.order?.order_id_tmm;
              salesMonitor.noOfAdvProduct = element.number_adv_product;
              salesMonitor.advisorID = element.advisor?.advisor_id_number;
              salesMonitor.teamManagerID = element.teamLeader?.advisor_id_number;
              salesMonitor.branchManagerID = element.branchManager?.advisor_id_number;
              salesMonitor.recruiterID = element.recruiter?.advisor_id_number;
              salesMonitor.period = element.periodSale?.period;
              salesMonitor.periodId = element.periodSale?.id;
              salesMonitor.status = element.periodSale?.consolidation == 'CONSOLIDATING' ? 'Tentative' : 'Consolidated';
              salesMonitor.toVerify = !CheckNullOrUndefinedOrEmpty(element.order?.payment_verified_at) ? formatDate(element.order?.payment_verified_at, 'dd-MM-yyyy', 'en-US') : '';
              salesMonitor.toShip = !CheckNullOrUndefinedOrEmpty(element.order?.shipped_at) ? formatDate(element.order?.shipped_at, 'dd-MM-yyyy', 'en-US') : '';
              salesMonitor.toReceive = !CheckNullOrUndefinedOrEmpty(element.order?.complete_delivery_date) ? formatDate(element.order?.complete_delivery_date, 'dd-MM-yyyy', 'en-US') : '';
              salesMonitor.completed = !CheckNullOrUndefinedOrEmpty(element.order?.completed_at) ? formatDate(element.order?.completed_at, 'dd-MM-yyyy', 'en-US') : '';
              salesMonitor.currentStatus = capitalize(element.order?.status.replace('_', ' '));
              salesMonitor.recruitment = !CheckNullOrUndefinedOrEmpty(element.order?.recruitmentSalesHistory) ? 'Yes' : 'No';
              let currency = element.order?.order_items[0]?.currency_code;
              salesMonitor.totalAmount = formatCurrency(element.order?.total_amount, "en-US", currency + ' ', "code", "0.2-2");
              salesMonitor.location = element.order?.shipping?.shippinglocation?.name;

              result.push(salesMonitor);
            });

            return {result: result, sum: data.count}
          } else {
            return {result: [], sum: data.count}
          }
        }), catchError(value => throwError(value))
      )
    }
  }

  getSalesMonitorDetail(sale_monitor_id):Observable<any> {
    let param = new HttpParams();
    if (!CheckNullOrUndefinedOrEmpty(sale_monitor_id)) {
      param = param.append('sale_monitor_id', sale_monitor_id)
    }

    if (this.api.isEnable()) {
      return this.http.get<any>(getSalesMonitorDetailApi, {headers: this.api.headers, params: param}).pipe(
        map( data => {
          if (data.code == 200 && !CheckNullOrUndefinedOrEmpty(data.data)) {
            let salesMonitorDetail = new SalesMonitorDetail();

            salesMonitorDetail.periodSale = data.data.salesMonitor?.periodSale;
            salesMonitorDetail.history = data.data.salesMonitor?.history;
            salesMonitorDetail.periorConsodatingData = data.data.queryGetPeriorConsodatingData;

            return salesMonitorDetail;
          }
        })
      )
    }
  }

  updateSalesMonitorDetail(sale_monitor_id, period_sale_id) {
    let param = new HttpParams();
    if (!CheckNullOrUndefinedOrEmpty(sale_monitor_id)) {
      param = param.append('sale_monitor_id', sale_monitor_id)
    }
    if (!CheckNullOrUndefinedOrEmpty(period_sale_id)) {
      param = param.append('period_sale_id', period_sale_id)
    }

    if (this.api.isEnable()) {
      return this.http.put<any>(updateSalesMonitorDetailApi, '', {headers: this.api.headers, params: param});
    }
  }
}

export class SalesMonitor {
  no: number;
  order: string;
  noOfAdvProduct: string;
  advisorID: string;
  teamManagerID: string;
  branchManagerID: string;
  recruiterID: string;
  period: string;
  periodId: number;
  status: string;
  toVerify: string;
  toShip: string;
  toReceive: string;
  completed: string;
  currentStatus: string;
  recruitment: string;
  location: string;
  totalAmount: string;
}

export class SalesMonitorDetail {
  periodSale: any;
  history = [];
  periorConsodatingData = [];
}

export class SearchSaleMonitorDto {
  order_tmm : number;
  advisor_id : number;
  teammanager_id : number;
  branch_id : number;
  recruiter_id : number;
  period : string;
  status : string;
  verify_start : Date;
  verify_end : Date;
  ship_start : Date;
  Ship_end : Date ;
  receive_start : Date ;
  recrive_end : Date;
  completed_start : Date;
  completed_end : Date;
  order_status : string;
}

