import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { HttpClient, HttpParams } from "@angular/common/http";
import { getPackingListByProductQuantityApi, getAllProductOrdersPackingApi, getOrdersPackingListApi } from './backend-api';
import { Observable, throwError } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import { CheckNullOrUndefinedOrEmpty } from '../utils/common-function';


@Injectable({
  providedIn: "root",
})
export class WarehouseService {
  constructor(
    private api: ApiService,
    private http: HttpClient) {}

  getPackingListProduct(start, end): Observable<any>{
    let param = new HttpParams();

    if(!CheckNullOrUndefinedOrEmpty(start)){
      param = param.append('start', start);
    }

    if(!CheckNullOrUndefinedOrEmpty(end)){
      param = param.append('end', end);
    }

    if(this.api.isEnable()){
      return this.http.get<any>(getPackingListByProductQuantityApi, { headers: this.api.headers, params: param }).pipe(
        map(data=>{
          if (data.code === 200 && !CheckNullOrUndefinedOrEmpty(data.data)) {
            return data.data;
          } else {
            return data;
          }
        }), catchError(value => throwError(value))
      )
    }
  }

  getAllProductOrdersPacking(start, end): Observable<any> {
    let listProduct = [];
    let param = new HttpParams();

    if(!CheckNullOrUndefinedOrEmpty(start)){
      param = param.append('start', start);
    }

    if(!CheckNullOrUndefinedOrEmpty(end)){
      param = param.append('end', end);
    }

    if(this.api.isEnable()){
      return this.http.get<any>(getAllProductOrdersPackingApi, { headers: this.api.headers, params: param }).pipe(
        map(data=>{
          if (data.code === 200 && !CheckNullOrUndefinedOrEmpty(data.data)) {
            data.data.forEach(element => {
              let product = new ProductPacking();

              product.label = element.productName;
              product.value = element.uuid;

              listProduct.push(product);
            });

            return listProduct;
          } else {
            return listProduct;
          }
        }), catchError(value => throwError(value))
      )
    }
  }

  getOrdersPackingList(product, start, end): Observable<any> {
    let param = new HttpParams();
    if(!CheckNullOrUndefinedOrEmpty(product)){
      param = param.append('product', product);
    }
    if(!CheckNullOrUndefinedOrEmpty(start)){
      param = param.append('start', start);
    }
    if(!CheckNullOrUndefinedOrEmpty(end)){
      param = param.append('end', end);
    }

    if(this.api.isEnable()){
      return this.http.get<any>(getOrdersPackingListApi, { headers: this.api.headers, params: param }).pipe(
        map(data=>{
          if (data.code === 200 && !CheckNullOrUndefinedOrEmpty(data.data)) {
            return data.data;
          } else {
            return data;
          }
        }), catchError(value => throwError(value))
      )
    }
  }
}

export class ProductPacking {
  label: string;
  value : string;
}
