import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable, throwError } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import {
    cartegoryListApi,
    cartegorybyIdApi,
    cartegoryUpdateApi,
    cartegoryDeleteApi,
    saveCategoryImage,
    cartegoryAdminApi,
    categoryHistoryApi,
    setDefaultCategoryApi
} from './backend-api';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Category } from '../models/category.model';
import { isNullOrUndefined } from 'util';

@Injectable({
    providedIn: "root",
  })
  export class CategoryService {
    constructor(
        private api: ApiService,
        private http: HttpClient,
        ) {}

    /**
    * get list Category
    */
    getCategoryList(): Observable<any>{
        return this.api.get(cartegoryAdminApi).pipe(
            map((value) =>
            {
                if (value.code === 200)
                {
                    // console.log(value.data);
                    let result = [];
                    result = this.renderListCategory(value.data)
                    return result;
                }
            }), catchError(value => throwError(value))
        );
    }

    getCategorybyId(id): Observable<any>{
        let url = cartegorybyIdApi.replace(':id', id)
        return this.api.get(url).pipe(
            map((value) =>
            {
                if (value.code === 200)
                {
                    let result = this.renderCategory(value.data)
                    return result;
                }
            }), catchError(value => throwError(value))
        );
    }

    createCategory(categoryCreate): Observable<any>{
        return this.api.post(cartegoryListApi, categoryCreate).pipe(
            map((value) =>
            {
                if (value.code === 200)
                {
                    // var result = this.renderCategory(value.data)
                    return value;
                }
            }),
            catchError(value => throwError(value))
        );
    }

    updateCategory(categoryUpdate): Observable<any>{
        return this.api.put(cartegoryUpdateApi, categoryUpdate).pipe(
            map((value) =>
            {
                if (value.code === 200)
                {
                    // var result = this.renderCategory(value.data)
                    return value;
                }
            }),
            catchError(value => throwError(value))
        );
    }

    deleteCategory(id): Observable<any>{
        let url = cartegoryDeleteApi.replace(':id',id)
        return this.api.put(url, id).pipe(
            map((value) =>
            {
                if (value.code === 200)
                {
                    // var result = this.renderCategory(value.data)
                    return value;
                }
            }),
            catchError(value => throwError(value))
        );
    }

    getCategoryHistory(id){
        let url = categoryHistoryApi.replace(":id", id)
        return this.api.get(url).pipe(
            map((value) =>
            {
                if (value.code === 200)
                {
                    let result = [];
                    result = this.renderCategoryHistory(value.data)
                    return result;
                }
            }), catchError(value => throwError(value))
        );
    }

    getUrlImage(fileName: string, fileType){
        const bodyObj = { name: fileName, type: fileType };
        return this.api.post(saveCategoryImage, bodyObj).pipe(retry(3), catchError(this.errorHandler));
    }

    uploadFiletoS3(url: string, contentType: string, file){
        const headers = new HttpHeaders({ 'Content-Type': contentType });
        return this.http.put<any>(url, file, { headers: headers, reportProgress: true }).pipe(retry(3), catchError(this.errorHandler));
    }

    private errorHandler(error: HttpErrorResponse){
        if (error.error instanceof ErrorEvent)
        {
            console.error('An error occured:', error.error.message);
        }
        else
        {
            console.error(
                `Back-end return code: ${error.status}\n` +
                `Body content: ${error.status}`
            );
        }

        return throwError(error.message || 'Server Error');
    }

    renderListCategory(data){
            let categores: Category[] = [];
            if (!isNullOrUndefined(data) && data.length > 0){
                data.forEach(element => {
                    let category = new Category();
                    category = this.renderCategory(element);
                    categores.push(category);
                }
              );
            }
        return categores
    }

    renderCategory(element){
        let category = new Category();
        category.id = element.id;
        category.entityId = element.entity_id;
        category.publicId = element.public_id;
        category.categoryUri = element.category_uri;
        category.isActive = element.is_active;
        category.categoryName = element.category_name;
        category.categoryDescription = element.category_description;
        category.categoryPhotoKey = element.category_photo_key;
        category.createdAt = element.created_at;
        category.updatedAt = element.updated_at;
        category.isDefaultCategory = element.is_default_category || false;
        return category;
    }

    renderCategoryHistory(element){
        let arrTimeLine = []
        if (!isNullOrUndefined(element) && element.length > 0){
                element.forEach(data => {
                    let timeLine = new TimeLine()
                    timeLine.action = "Updated by " + data.appUser.first_name + " " + data.appUser.last_name
                    timeLine.createdAt = data.created_at
                    arrTimeLine.push(timeLine)
            });
            return arrTimeLine
        }
    }

    setDefaultCategory(id: string):Observable<any> {
        let param = new HttpParams();

        if (id) {
            param = param.append("id", id);
        }

        if (this.api.isEnable()) {
            return this.http.put<any>(setDefaultCategoryApi, '', { headers: this.api.headers, params: param });
        }
    }
}

export class TimeLine {
    createdAt: string;
    action: string;
    old_data: string;
    new_data: string;
    status: string;
    email_new: string;
    phone_new: string;
    comment: string;
    isEditBank: boolean;

    constructor() {
        this.isEditBank = false;
    }
}
