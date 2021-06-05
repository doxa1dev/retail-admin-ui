import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable, throwError, from } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { isNullOrUndefined } from 'util';
import { environment } from 'environments/environment'
import { formatDate  } from '@angular/common';
import { NewsData } from 'app/main/direct-sales/news/chart/line-chart/line-chart.component';
import { NewsDataViews } from 'app/main/direct-sales/news/chart/bar-chart/bar-chart.component';
import { NewDatas } from 'app/main/direct-sales/news/chart/single-bar-chart/single-bar-chart.component'

import {  newsListApi, newsByUuidApi, updateNewsImageApi, newsAttachApi,
          GetInsightNewsApi ,newsReleaseViewAPi,
          newsTopAPi, customerNewsNotificationApi ,
          GetWeeklyResultNewsApi, GetDailyResultNewsApi , GetDailyResultReachesNewsApi, GetCustomerViewNewsApi, bannersListApi, 
          updateNewsBannerApi, getAllBannersApi
      } from './backend-api';
import { CustomerInfo } from 'app/main/direct-sales/orders/page-action/to-pay-action/common-pay/delivery-address/delivery-address.component';
import { cursorTo } from 'readline';
import {  CheckNullOrUndefinedOrEmpty } from '../utils/common-function';
import { TypeMultiSelectProduct, Value } from './reports.service';
import * as jwt_decode from 'jwt-decode';

@Injectable({
    providedIn: "root",
})
export class NewsService {

    constructor(
        private api: ApiService,
        private http: HttpClient
        ) {}

    storageUrl = environment.storageUrl;
    decoded

    /**
    * get All News
    */
    getNewsList(page, limit){
        let param = new HttpParams();
        if (!isNullOrUndefined(page)) {
            param = param.append('page', page);
            param = param.append('limit', limit);
            if (this.api.isEnable()) {
                return this.http.get<any>(newsListApi, { headers: this.api.headers, params: param }).pipe(
                    map((value) => {
                        if (value.code == 200) {
                            let result = [];
                            result = this.renderListNews(value.data)
                            let data = {
                                totalElements: value.total,
                                content: result
                            }
                            return data;
                        }
                    }), catchError(value => throwError(value))
                );
            }
            // return this.api.get(newsListApi).pipe(
            //     map((value) => {
            //         if (value.code === 200) {
            //             var result = [];
            //             result = this.renderListNews(value.data)
            //             return result;
            //         }
            //     }), catchError(value => throwError(value))
            // );
        }
    }

      getBanners(): Observable<any>{
        let param = new HttpParams();
        if (this.api.isEnable()) { 
            return this.http.get<any>(getAllBannersApi,  { headers: this.api.headers, params: param }).pipe( 
                map(data=>{
                    let result = [];
                    if (!CheckNullOrUndefinedOrEmpty(data)) {
                        result = data
                    }
                    else {
                        result = []
                    }
                    return result;
                }), catchError(value => throwError(value))
            )
        }
      } 
    
    renderBannersList(data) {
    let bannersList = []
    if(!CheckNullOrUndefinedOrEmpty(data)){
        data.forEach(element => {
        let banner = new Banner()
        banner.id =  element.id
        banner.url = element.url
        banner.entity_id = element.entity_id
        bannersList.push(banner)
        })
    }
    return bannersList
    }

    /**
     * get News By UuId
     * @param uuid
     */
    getNewsByUuId(uuid): Observable<any> {
        let param = new HttpParams();
        if (!isNullOrUndefined(uuid)) {
            param = param.append('uuid', uuid);
        }
        if (this.api.isEnable()) {
            return this.http.get<any>(newsByUuidApi, { headers: this.api.headers, params: param }).pipe(
                map((value) => {
                    if (value.code === 200) {
                        let result = this.renderNews(value.data)
                        return result;
                    }
                }), catchError(value => throwError(value))
            );
        }
    }


    /**
     * update News By UuId
     */
    updateNewsByUuId(id, formNewsUpdate): Observable<any> {
        let param = new HttpParams();
        if (!isNullOrUndefined(id)) {
            param = param.append('uuid', id);
            if (this.api.isEnable()) {
                return this.http.put<any>(newsListApi, formNewsUpdate, { headers: this.api.headers, params: param }).pipe(
                    map((value) => {
                        if (value.code === 200) {
                            // var result = this.renderNews(value.data)
                            return value;
                        }
                    }), catchError(value => throwError(value))
                )
            }
        }

    }

    /**
     * delete News By UuId
     * @param uuid
     */
    deleteNewsByUuId(uuid): Observable<any> {
        let param = new HttpParams();
        if (!isNullOrUndefined(uuid)) {
            param = param.append('uuid', uuid);
        }
        if (this.api.isEnable()) {
            return this.http.delete<any>(newsListApi, { headers: this.api.headers, params: param }).pipe(
                map((value) => {
                    if (value.code === 200) {
                        return value;
                    }
                }), catchError(value => throwError(value))
            );
        }
    }

    /**
    * get Insight News
    */
    getInsightNewsData(startDay, endDay): Observable<any>{
    let url = GetInsightNewsApi.replace(":startDay",startDay).replace(":endDay",endDay)
    let arrNews = [];
    for(let i=0 ; i<7; i= i+1) {
      let news = new NewsData() ;
      let day = new Date(startDay);
      let newtDay = day.setDate(day.getDate()+i)
      news.date = formatDate(newtDay, 'EEEE','en-US');
      news.totalViews = 0;
      news.totalReaches = 0;
      arrNews.push(news);
    }
    // console.log(arrNews);
    return this.api.get(url).pipe(
        map((value) =>{
            if (value.code === 200){
              // console.log(value)
                let result =[];
                result = this.renderNewsInsight(value, arrNews)
                return result;
            }
        }), catchError(value => throwError(value))
    );
  }

    /**
    * get Weekly New
    */
    getWeeklyResultNewsData(startDay, endDay, id): Observable<any>{
    let url = GetWeeklyResultNewsApi.replace(":startDay",startDay).replace(":endDay",endDay).replace(':id',id)
    let arrNews = [];
    for(let i=0 ; i<7; i= i+1) {
      let news = new NewsDataViews() ;
      let day = new Date(startDay);
      let newtDay = day.setDate(day.getDate()+i)
      news.date = formatDate(newtDay, 'dd/MM','en-US');
      news.totalViews = 0;
      arrNews.push(news);
    }
    return this.api.get(url).pipe(
        map((value) =>{
            if (value.code === 200){
                let result ={};
                result = this.renderWeeklyInsight(value, arrNews)
                return result;
            }
        }), catchError(value => throwError(value))
    );
  }

    getDailyNewsViewsByUuId(uuid): Observable<any> {
      let url = GetDailyResultNewsApi.replace(":id", uuid);
      let data = [];
      return this.api.get(url).pipe(
        map((value) => {
            let dailyTotalView = new NewDatas;
            dailyTotalView.date = "today";
            !isNullOrUndefined(value.daily_views) ? dailyTotalView.totaldata = Number(value.daily_views) : dailyTotalView.totalCustomer=0;
            !isNullOrUndefined(value.total_views) ? dailyTotalView.totalCustomer = Number(value.total_views) : dailyTotalView.totaldata=0;
            data.push(dailyTotalView)
            // console.log(data);
            return data
        }), catchError(value => throwError(value))
    );
  }

  getDailyNewsReachesByUuId(uuid): Observable<any> {
    let url = GetDailyResultReachesNewsApi.replace(":id", uuid);
    let data = [];
    return this.api.get(url).pipe(
      map((value) => {
          let dailyTotalReaches = new NewDatas;
          dailyTotalReaches.date = "today";
          !isNullOrUndefined(value.daily_reached) ? dailyTotalReaches.totaldata = Number(value.daily_reached) : dailyTotalReaches.totalCustomer=0;
          !isNullOrUndefined(value.total_reached) ? dailyTotalReaches.totalCustomer = Number(value.total_reached) : dailyTotalReaches.totaldata=0;
          data.push(dailyTotalReaches);
          // console.log(data);
          return data
      }), catchError(value => throwError(value))
  );
}

    /**
     * create News
     * @param formUpdate
     */
    createNews(formUpdate) {
        return this.api.post(newsListApi, formUpdate)
    }

    /**
     * upload Banner
     * @param formBanner
     */
     uploadBanner(formBanner) {
        return this.api.post(bannersListApi, formBanner)
    }


    updateNewsImage(formNewsImage){
        return this.api.post(newsAttachApi, formNewsImage);
    }

    /**
     * get Pre Signed Url
     */
    getPreSignedUrl(fileName: string, fileType: string) {
        const bodyObj = { name: fileName, type: fileType };
        return this.api.post(updateNewsImageApi, bodyObj).pipe(retry(3), catchError(this.errorHandler));
    }

    /**
     * get Pre Signed Url Banner
     */
     getPreSignedUrlBanner(fileName: string, fileType: string) {
        const bodyObj = { name: fileName, type: fileType };
        return this.api.post(updateNewsBannerApi, bodyObj).pipe(retry(3), catchError(this.errorHandler));
    }

    /**
     * upload File to S3
     * @param url
     * @param contentType
     * @param file
     */
    uploadFiletoS3(url: string, contentType: string, file) {
        const headers = new HttpHeaders({ 'Content-Type': contentType });
        return this.http.put<any>(url, file, { headers: headers, reportProgress: true }).pipe(retry(3), catchError(this.errorHandler));
    }

    updateNewsAttachMent(id, formAttach){
        let param = new HttpParams();
        if (!isNullOrUndefined(id)) {
            param = param.append('uuid', id);
            if (this.api.isEnable()) {
                return this.http.put<any>(newsAttachApi, formAttach, { headers: this.api.headers, params: param }).pipe(
                    map((value) => {
                        if (value.code == 200) {
                            return value;
                        }
                    }), catchError(value => throwError(value))
                );
            }
        }

    }

    /**
     * news Release View
     * @param page
     * @param limit
     */
    newsReleaseView(page, limit, params){
        let param = new HttpParams();
        if (!isNullOrUndefined(page)) {
            param = param.append('page', page);
            param = param.append('limit', limit);
            if(!isNullOrUndefined(params.filterModel)){
              if(!isNullOrUndefined(params.filterModel.description)){
                param = param.append('title', params.filterModel.description.filter);
              }
            }
            if (this.api.isEnable()) {
                return this.http.get<any>(newsReleaseViewAPi, { headers: this.api.headers, params: param }).pipe(
                    map((value) => {
                        if (value.code == 200) {
                            let result = this.renderListNews(value.data)
                            let data = {
                                totalElements: value.total,
                                content: result
                            }
                            return data;
                        }
                    }), catchError(value => throwError(value))
                );
            }
        }
    }

    /**
     * news Top
     * @param page
     * @param limit
     */
    newsTop(page, limit){
        let param = new HttpParams();
        if (!isNullOrUndefined(page)) {
            param = param.append('page', page);
            param = param.append('limit', limit);
            if (this.api.isEnable()) {
                return this.http.get<any>(newsTopAPi, { headers: this.api.headers, params: param }).pipe(
                    map((value) => {
                        if (value.code == 200) {
                            let result = this.renderListNews(value.data)
                            return result;
                        }
                    }), catchError(value => throwError(value))
                );
            }
        }
    }

    /**
     * customer News Notification
     * @param uuid
     * @param page
     * @param limit
     */
    customerNewsNotification(uuid, page, limit){
        let param = new HttpParams();
        if (!isNullOrUndefined(page)) {
            param = param.append('page', page);
            param = param.append('limit', limit);
            param = param.append('uuid', uuid);
            if (this.api.isEnable()) {
                return this.http.get<any>(GetCustomerViewNewsApi, { headers: this.api.headers, params: param }).pipe(
                    map((value) => {
                        if (value.code == 200) {
                            let result = this.renderCustomerNotification(value.data)
                            let data = {
                              totalElements: value.total,
                              content: result
                          }
                          return data
                        }
                    }), catchError(value => throwError(value))
                );
            }
        }
    }

    /**
     * renderCustomerNotification
     * @param data
     */
    renderCustomerNotification(data){
        let arrNotification = []
        if (!isNullOrUndefined(data) && data.length > 0) {
            data.forEach(element => {
                let newsNotification = new NewsNotification()
                newsNotification.id = element.id
                newsNotification.newsId = element.news_id
                newsNotification.reachedAt = element.reached_at
                newsNotification.viewedAt = element.viewed_at
                newsNotification.updatedAt = element.updated_at
                newsNotification.status = element.status
                newsNotification.customer = this.renderCustomer(element.customer);
                newsNotification.customer_name = newsNotification.customer.name;
                newsNotification.customer_email = newsNotification.customer.mail;
                newsNotification.customer_phone_number = newsNotification.customer.phone;
                arrNotification.push(newsNotification)
            })
        }
        return arrNotification
    }

    /**
     * render Customer
     * @param data
     */
    renderCustomer(data){
        if (!isNullOrUndefined(data)){
          let customerInfo = new CustomerInfo()
          customerInfo.id = data.id
          customerInfo.name = data.firt_name + data.last_name
          customerInfo.mail = data.email
          customerInfo.phone = "(+" + data.phone_dial_code + ") " + data.phone_number
          return customerInfo
        }
    }

    /**
     * render List News
     */
    renderListNews(data) {
        let arrNew = []
        if (!isNullOrUndefined(data) && data.length > 0) {
            data.forEach(element => {
                let news = new News()
                news = this.renderNews(element)
                arrNew.push(news)
            });
        }
        return arrNew
    }

    /**
     * render News
     * @param element
     */
    renderNews(element) {

        let news = new News()
        if (!isNullOrUndefined(element)) {
            news.id = element.id;
            news.entityId = element.entity_id;
            news.uuid = element.uuid;
            news.title = element.title;
            news.description = element.description;
            news.createdById = element.created_by_id;
            news.createdAt = formatDate(element.created_at, "dd/MM/yyyy HH:mm", "en-US");
            news.updatedAt = element.updated_at
            news.totalNewReached = element.total_news_reached;
            news.totalNewsViewed = element.total_news_viewed;
            news.newsAttachment = this.renderNewsAttachment(element.news_attachment)
            news.storageKeyIsCover = this.getIsCoverImage(element.news_attachment)
            news.images = this.renderNewsImageName(element.news_attachment)
            news.history = this.renderNewsHistory(element.news_history)
        }
        return news
    }

    /**
     * render News Attachment
     * @param data
     */
    renderNewsAttachment(data) {
        let arrNewAttach = []
        if (!isNullOrUndefined(data) && data.length > 0) {
            data.forEach(element => {
                let newsAttachment = new NewsAttachment()
                newsAttachment.id = element.id
                newsAttachment.newsId = element.news_id
                newsAttachment.uploadedById = element.uploaded_by_id
                newsAttachment.isCoverPhoto = element.is_cover_photo
                newsAttachment.createdAt = formatDate(element.created_at, "dd/MM/yyyy HH:mm", "en-US");
                newsAttachment.storageKey = element.storage_key
                newsAttachment.isDeleted = element.is_deleted
                arrNewAttach.push(newsAttachment)
            })
        }
        return arrNewAttach
    }

    /**
     * render News Image name
     * @param data
     */
    renderNewsImageName(data) {
        let arrNewAttach = []
        if (!isNullOrUndefined(data) && data.length > 0) {
            data.forEach(element => {
                arrNewAttach.push(this.storageUrl + element.storage_key)
            })
        }
        return arrNewAttach
    }

    /**
     * render News History
     * @param data
     */
    renderNewsHistory(data) {

        let arrNewsHistory = []
        if (!isNullOrUndefined(data) && data.length > 0) {
            data.forEach(element => {
                let newsHistory = new NewsHistory()
                newsHistory.id = element.id
                newsHistory.newsId = element.news_id
                newsHistory.createdAt = element.updated_at
                newsHistory.action = "Updated by " + element.app_user.first_name + " " + element.app_user.last_name
                arrNewsHistory.push(newsHistory)
            });
        }
        return arrNewsHistory
    }

    renderNewsInsight(data , arrNew) {

      if (!isNullOrUndefined(data) && data.reached.length > 0) {
          data.reached.forEach(element => {
              let day = formatDate(element.date, 'EEEE','en-US');
              let index  =  arrNew.findIndex(e=>{return e.date == day})
              if(index != -1)
                arrNew[index].totalReaches = Number(element.count);
              });
      }

        if (!isNullOrUndefined(data) && data.views.length > 0) {
          data.views.forEach(element => {
            let day = formatDate(element.date, 'EEEE','en-US');
            let index  =  arrNew.findIndex(e=>{return e.date == day})
            if(index != -1)
              arrNew[index].totalViews = Number(element.count);
          });
        }

        return arrNew
    }

    renderWeeklyInsight(data , arrNew) {
      if (!isNullOrUndefined(data) && data.views.length > 0) {
          data.views.forEach(element => {
              let day = formatDate(element.date, 'dd/MM','en-US');
              let index  =  arrNew.findIndex(e=>{return e.date == day})
              if(index != -1)
                arrNew[index].totalViews = Number(element.count);
              });
      }
      let weeklyViews = 0;
      let weeklyTotalReaches = [];
      let totalCustomer = 0;
      let weeklyTotalViews = [];
      if(!isNullOrUndefined(data)){
        let weeklyTotalView = new NewDatas;
        !isNullOrUndefined(data.total_customer) ? weeklyTotalView.totalCustomer = Number(data.total_customer) : weeklyTotalView.totalCustomer=0;
        !isNullOrUndefined(data.weekly_views) ? weeklyTotalView.totaldata = Number(data.weekly_views) : weeklyTotalView.totaldata=0;
        weeklyTotalView.date = "today"
        weeklyTotalViews.push(weeklyTotalView)

        let weeklyTotalReach = new NewDatas;
        !isNullOrUndefined(data.total_customer) ? weeklyTotalReach.totalCustomer = Number(data.total_customer) : weeklyTotalReach.totalCustomer=0;
        !isNullOrUndefined(data.weekly_reacheds) ? weeklyTotalReach.totaldata = Number(data.weekly_reacheds) : weeklyTotalReach.totaldata=0;
        weeklyTotalReach.date = "today"
        weeklyTotalReaches.push(weeklyTotalReach)
      }
      return {arrNew , weeklyTotalViews , weeklyTotalReaches }
    }


    /**
     * get Is CoverImage
     * @param data
     */
    getIsCoverImage(data: Array<any>) {
        let newsImageCoverFile = environment.storageUrl
        if (!isNullOrUndefined(data) && data.length > 0) {
            data.forEach(element => {
                if (element.is_cover_photo) {
                    newsImageCoverFile = newsImageCoverFile + element.storage_key
                }
            });
        }
        return newsImageCoverFile
    }

    private errorHandler(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            console.error('An error occured:', error.error.message);
        }
        else {
            console.error(
                `Back-end return code: ${error.status}\n` +
                `Body content: ${error.status}`
            );
        }

        return throwError(error.message || 'Server Error');
    }
}

export class News {
    id: number;
    entityId: number;
    uuid: string;
    title: string;
    description: string;
    createdById: number;
    createdAt: string;
    updatedAt: string
    totalNewReached: number;
    totalNewsViewed: number;
    storageKeyIsCover: string;
    images: string[];
    history: Array<NewsHistory>;
    newsAttachment: Array<NewsAttachment>
}

export class NewsAttachment {
    id: number
    newsId: number;
    uploadedById: number
    isCoverPhoto: boolean
    createdAt: string
    storageKey: string
    isDeleted: boolean
}

export class NewsHistory {
    id: number
    newsId: number
    updatedById: number
    updatedAt: string
    action: string
    createdAt: string
}


export class NewsNotification{
    id: number
    newsId: number
    customerId: number
    status: string;
    reachedAt: string;
    viewedAt: string;
    deletedAt: string;
    updatedAt: string;
    customer: CustomerInfo;
    customer_name : string;
    customer_email : string;
    customer_phone_number : string;
}


export class Banner{
    id: number
    url;
    created_at: Date;
    entity_id: number;
}
