import { Injectable } from '@angular/core';

import { getTranslationProduct,  
  createTranslationProduct, 
  updateTranslationProduct,
  updateTranslationCategory,
  getTranslationByTranslationId,
  deleteTranslationProduct,
  getTranslationCategory,
  getTranslationCategoryByTranslationId,
  createTranslationCategory,
  deleteTranslationCategory
} from "./backend-api";
import { ApiService } from './api.service';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { TranslationProduct, TranslationCategory } from '../models/translation.model';
import { isNullOrUndefined } from 'util';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {

  constructor(private api: ApiService) {}

  // get list translation of product by id
  getListTranslationByProductId(id): Observable<any> {
    let url = getTranslationProduct.replace(":PRODUCTID", id)
    return this.api.get(url).pipe(
      map((value) =>
      {
          if (value.code === 200)
          {
              let result = [];
              result = this.renderListTranslationProduct(value.data);
              return result;
          }
      }), catchError(err => throwError(err))
    );
  }

  renderListTranslationProduct(data) {
    let transList: TranslationProduct[] = [];
    if (!isNullOrUndefined(data) && data.length > 0) {
      data.forEach(element => {
        let translation = new TranslationProduct();
        translation.id = element.id;
        translation.productId = element.product_id;
        translation.description = element.translated_description;
        if (element.language.language_code === 'zh') {
          translation.language = 'Chinese';
        }
        else if (element.language.language_code === 'en') {
          translation.language = 'English';
        }
        else {
          translation.language = 'Malay';
        }
        translation.title = element.translated_title;
        transList.push(translation);
      });
    }
    return transList;
  }

  // get translation english of product by id
  // _getTranslationEnglishByProductId(id): Observable<any> {
  //   let url = getTranslationProduct.replace(":PRODUCTID", id)
  //   return this.api.get(url).pipe(
  //     map((value) =>
  //     {
  //         if (value.code === 200)
  //         {
  //           let data;
  //           value.data.forEach(element => {
  //             if (element.language.language_code) {
  //               data = element;
  //             }
  //           })
  //           let translation = new TranslationProduct();
  //           translation.id = data.id;
  //           translation.productId = data.product_id;
  //           translation.description = data.translated_description;
  //           translation.language = 'English';
  //           translation.title = data.translated_title;
  //           return translation;
  //         }
  //     }), catchError(err => throwError(err))
  //   );
  // }

  // get list translation category by id
  getListTranslationByCategoryId(id): Observable<any> {
    let url = getTranslationCategory.replace(":CATEGORYID", id)
    return this.api.get(url).pipe(
      map((value) =>
      {
          if (value.code === 200)
          {
              let result = [];
              result = this.renderListTranslationCategory(value.data);
              return result;
          }
      }), catchError(err => throwError(err))
    );
  }

  renderListTranslationCategory(data) {
    let transList: TranslationCategory[] = [];
    if (!isNullOrUndefined(data) && data.length > 0) {
      data.forEach(element => {
        let translation = new TranslationCategory();
        translation.id = element.id;
        translation.categoryId = element.category_id;
        translation.description = element.translated_description;
        if (element.language.language_code === 'zh') {
          translation.language = 'Chinese';
        }
        else if (element.language.language_code === 'en') {
          translation.language = 'English';
        }
        else {
          translation.language = 'Malay';
        }
        translation.title = element.translated_title;
        transList.push(translation);
      });
    }
    return transList;
  }

  // get translation by product id
  _getTranslationProductByTranslationId(id): Observable<any> {
    let url = getTranslationByTranslationId.replace(":TRANSLATION_ID", id);
    return this.api.get(url).pipe(
      map((value) =>
      {
          if (value.code === 200)
          {
              let translation = new TranslationProduct();
              translation.id = value.data.id;
              translation.productId = value.data.product_id;
              translation.description = value.data.translated_description;
              if (value.data.language.language_code === 'zh') {
                translation.language = 'Chinese';
              }
              else if (value.data.language.language_code === 'en') {
                translation.language = 'English';
              }
              else {
                translation.language = 'Malay';
              }
              translation.title = value.data.translated_title;
              return translation;
          }
      }), catchError(err => throwError(err))
    );
  }

  // get translation category by id translation
  _getTranslationCategoryByTranslationId(id): Observable<any> {
    let url = getTranslationCategoryByTranslationId.replace(":TRANSLATION_ID", id);
    return this.api.get(url).pipe(
      map((value) =>
      {
          if (value.code === 200)
          {
              let translation = new TranslationCategory();
              translation.id = value.data.id;
              translation.categoryId = value.data.category_id;
              translation.description = value.data.translated_description;
              if (value.data.language.language_code === 'zh') {
                translation.language = 'Chinese';
              }
              else if (value.data.language.language_code === 'en') {
                translation.language = 'English';
              }
              else {
                translation.language = 'Malay';
              }
              translation.title = value.data.translated_title;
              return translation;
          }
      }), catchError(err => throwError(err))
    );
  }

  // create new translation
  _creatTranslationProduct(translationObj) {
    return this.api.post(createTranslationProduct, translationObj);
  }

  _creatTranslationCategory(translationObj) {
    return this.api.post(createTranslationCategory, translationObj);
  }

  // update translation
  _updateTranslationProduct(id, translationObj) {
    let url = updateTranslationProduct.replace(":TRANSLATION_ID", id)
    return this.api.put(url, translationObj);
  }

  _updateTranslationCategory(id, translationObj) {
    let url = updateTranslationCategory.replace(":TRANSLATION_ID", id);
    return this.api.put(url, translationObj);
  }

  // delete translation
  _deleteTranslationProduct(id) {
    let url = deleteTranslationProduct.replace(":TRANSLATION_ID", id);
    return this.api.delete(url);
  }

  _deleteTranslationCategory(id) {
    let url = deleteTranslationCategory.replace(":TRANSLATION_ID", id);
    return this.api.delete(url);
  }
}
