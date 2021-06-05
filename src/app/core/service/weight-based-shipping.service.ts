import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { costShippingApi } from './backend-api';
import { TimeLine } from './category.service';

@Injectable({
    providedIn: 'root'
})
export class WeightBasedShippingService {

    constructor(private api: ApiService, private http: HttpClient) { }

    getCostShipping(): Observable<any> {
        if (this.api.isEnable()) {
            return this.api.get(costShippingApi).pipe(
                map((res: any) => {
                    if (res && res.code === 200) {
                        const shippingPrice = res.data.shipping_price;
                        const history = this.renderHistory(res.data.history);
                        if (shippingPrice) {
                            const east = shippingPrice.east;
                            const west = shippingPrice.west;
                            return {
                                code: 200,
                                east,
                                west,
                                histories: history
                            }
                        } else {
                            return {
                                code: 200,
                                east: null,
                                west: null,
                                histories: []
                            }
                        }
                    } else {
                        return res;
                    }
                }), catchError(error => throwError(error))
            )
        }
    }

    renderHistory(histories: any[]) {
        let list = [];
        if (histories.length > 0) {
            histories.forEach(x => {
                let timeLine = new TimeLine();
                timeLine.action = "Updated by " + x.appUser.first_name + " " + x.appUser.last_name;
                timeLine.createdAt = x.created_at || (new Date()).toISOString();
                list.push(timeLine);
            })
        }
        return list;
    }

    createCostShipping(body: any): Observable<any> {
        if (this.api.isEnable()) {
            return this.api.post(costShippingApi, body);
        }
    }

    updateCostShipping(body: any): Observable<any> {
        if (this.api.isEnable()) {
            return this.api.put(costShippingApi, body);
        }
    }
}   
