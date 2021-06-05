import { Injectable } from "@angular/core";
import { HttpErrorResponse, HttpHeaders, HttpClient, HttpParams } from "@angular/common/http";
import { map, catchError, combineAll, retry } from "rxjs/operators";
import {
  getProductsByEntityId,
  getAllCategories,
  saveProductImage,
  getProductByPublicIdApi,
  updateProductByPublicIdApi,
  deleteProductApi,
  updateImageApi,
  deleteImageApi,
  updateAttachmentApi,
  getAllPaymentPromotionGifts,
  checkBeforeDeleteProductApi
} from "./backend-api";
// import { CurrencyPipe} from '@angular/common'
import { Observable, throwError } from "rxjs";
import { ApiService } from "./api.service";
import { isNullOrUndefined } from "util";
import { formatDate, formatCurrency, DatePipe } from "@angular/common";
import { Product } from '../models/product.model';
import { environment } from 'environments/environment';
import { url } from 'inspector';
import * as _ from 'lodash';
import { CheckNullOrUndefinedOrEmpty } from "../utils/common-function";
import { SkuProductFrontEnd } from "app/main/direct-sales/products/all-products/product/product.component";

@Injectable({
  providedIn: "root",
})
export class ProductService {
  constructor(private api: ApiService, private http: HttpClient) { }
  storageUrl = environment.storageUrl;
  GetAllProductByEntityId() {
    return this.api.get(getProductsByEntityId).pipe(map((data) => {

      if (data.code === 200) {
        let products: Product[] = [];
        data.data.forEach(eachProduct => {
          let product = new Product();
          let arrCategory = [];
          let arrSkuData = [];
          product.productName = eachProduct.product_name;
          if (!CheckNullOrUndefinedOrEmpty(eachProduct.category)) {
            eachProduct.category.forEach(element => {
              arrCategory.push(element.category_name);
            });
          }
          if(!CheckNullOrUndefinedOrEmpty(eachProduct.arrSku)){
            eachProduct.arrSku.forEach(e => {
              arrSkuData.push(e.sku);
            });
          }
          product.category = arrCategory.toString();
          product.publicId = eachProduct.public_id;
          product.listedPrice = CurrencyCellRenderer(eachProduct.currency_code, eachProduct.listed_price);
          product.isActive = eachProduct.is_active;
          product.sku = !CheckNullOrUndefinedOrEmpty(arrSkuData) ? arrSkuData.toString() : eachProduct.sku;
          product.sd_price = (eachProduct.sd_price === null) ? " " : eachProduct.currency_code  + " " + eachProduct.sd_price;
          products.push(product);
        });
        return products;
      }
    }));
  }

  GetProductDetailByPublicId(public_id: string) {
    let url = getProductByPublicIdApi.replace(':PUBLICID', public_id);
    return this.api.get(url).pipe(map((data) => {
      if (data.status === 200) {
        let product = new Product();
        product.id = data.data.id;
        product.productName = data.data.product_name;
        product.productDescription = data.data.product_description;
        product.currencyCode = data.data.currency_code;
        product.hasAdvisor = data.data.has_advisor;
        product.hasSpecialPayment = data.data.has_special_payment;
        product.sku = data.data.sku;
        product.tax = data.data.tax;
        product.shippingFee = data.data.shipping_fee;
        product.termsAndConditionsLink = data.data.terms_and_conditions_link;
        product.maxOrderNumber = data.data.max_order_number;
        product.weight = data.data.product_weight;
        product.promotionStartTime = data.data.promotion_start_time;
        product.promotionEndTime = data.data.promotion_end_time;
        product.promotionalPrice = data.data.promotional_price;
        product.listedPrice = data.data.listed_price;
        product.properties = data.data.properties;
        product.isActive = data.data.is_active;
        product.need_unbox = data.data.need_unbox;
        product.need_host = data.data.need_host;
        product.history = this.renderProductHistory(data.data.update_histories);
        product.images = [];
        product.warranty_duration_in_days = data.data.warranty_duration_in_days;
        product.plannedPrice = data.data.planned_promotional_price;
        product.allow_epp_payment = data.data.allow_epp_payment;
        product.allow_recurring_payment = data.data.allow_recurring_payment;
        product.has_commission = data.data.has_commission;
        product.deposit_amount = data.data.deposit_amount;
        product.maxTotalDiscount = data.data.max_total_discount;
        product.internal_discount_start_time = data.data.internal_discount_start_time;
        product.is_display = data.data.is_display;
        product.is_sd_only = data.data.is_sd_only;
        product.is_sd_before = data.data.is_sd_before;
        product.is_sd_after = data.data.is_sd_after;
        product.sd_price = data.data.sd_price;
        product.cart_combination = data.data.cart_combination
        if(!CheckNullOrUndefinedOrEmpty(data.data.arrSku)){
          data.data.arrSku.forEach(element => {
            let item = new SkuProductFrontEnd();
            item.sku = element.sku;
            item.variant = element.variant?.split('-').join(' - ');
            product.arrSku.push(item);
          });
        }
        if (!CheckNullOrUndefinedOrEmpty(data.data.active_for)) {
          product.activeFor = data.data.active_for
        } else {
          product.activeFor = null;
        }

        if (!CheckNullOrUndefinedOrEmpty(data.data.internal_discount_for)) {
          product.internalDiscountFor = data.data.internal_discount_for
        } else {
          product.internalDiscountFor = null;
        }

        if (!CheckNullOrUndefinedOrEmpty(data.data.internal_discount_price)) {
          product.internalDiscountPrice = data.data.internal_discount_price;
        } else {
          product.internalDiscountPrice = null;
        }

        if (!CheckNullOrUndefinedOrEmpty(data.data.naep_discount_price)) {
          product.naepDiscountPrice = data.data.naep_discount_price;
        } else {
          product.naepDiscountPrice = null;
        }

        data.data.attachments.forEach(image => {
          if (image.is_deleted === false) {
            product.images.push(this.storageUrl + image.storage_key);
          }
        });
        if (!CheckNullOrUndefinedOrEmpty(data.data.category) && data.data.category.length > 0) {
          data.data.category.forEach(element => {
            product.arrCategories.push(element.id);
          });
        }

        product.single_paymt_gifts = data.data.single_paymt_gifts;
        product.online_bank_transfer_gifts = data.data.online_bank_transfer_gifts;

        return product;
      }
    }));
  }

  renderProductHistory(element) {
    let arrTimeLine = [];
    if (!CheckNullOrUndefinedOrEmpty(element) && element.length > 0) {
      element.forEach(data => {
        let timeLine = new TimeLine();
        timeLine.action = "Updated by " + data.appUser.first_name + " " + data.appUser.last_name;
        timeLine.createdAt = data.created_at;
        arrTimeLine.push(timeLine);
      });
      return arrTimeLine;
    }
  }

  /**
   * create product
   */
  createProduct(formCreateProduct) {
    return this.api.post(getProductsByEntityId, formCreateProduct);
  }


  updateProduct(product_publicID: string, formUpdateProduct) {
    let url = updateProductByPublicIdApi.replace(':PUBLICID', product_publicID);
    return this.api.put(url, formUpdateProduct);
  }

  //Get All Categories for Dropdown
  getAllCategories() {
    return this.api.get(getAllCategories).pipe(map((data) => {
      if (data.code === 200) {
        let listCategory = [];
        data.data.forEach(category => {
          listCategory.push({ label: category.category_name, value: category.id });
        });
        return listCategory;
      }
    }));
  }

  //Delete Product
  deleteProduct(product_publicID: string) {
    let url = deleteProductApi.replace(':PUBLICID', product_publicID);
    return this.api.delete(url);
  }

  getPreSignedUrl(fileName: string, fileType: string) {
    const bodyObj = { name: fileName, type: fileType };
    return this.api.post(saveProductImage, bodyObj).pipe(retry(3), catchError(this.errorHandler));

  }
  uploadActivityImage(url: string, contentType: string, file) {
    const headers = new HttpHeaders({ 'Content-Type': contentType });
    return this.http.put<any>(url, file, { headers: headers, reportProgress: true }).pipe(retry(3), catchError(this.errorHandler));
  }

  updateProductImage(formCreateImageProduct) {
    return this.api.post(updateImageApi, formCreateImageProduct);
  }

  deleteProductImage(attachmentId) {
    let url = deleteImageApi.replace(":id", attachmentId);
    return this.api.delete(url);
  }


  //Attachment
  updateAttachments(product_publicID: string, updateForm) {
    let url = updateAttachmentApi.replace(':PUBLICID', product_publicID);
    return this.api.put(url, updateForm);
  }

  getAllPaymentPromotionGifts() {
    return this.api.get(getAllPaymentPromotionGifts).pipe(map((data) => {
      if (data.code === 200) {
        let listPaymentPromotionGift = [];
        data.data.forEach(gift => {
          listPaymentPromotionGift.push({ label: gift.product_name, value: gift.id });
        });
        return listPaymentPromotionGift;
      }
    }));
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

  checkBeforeDeleteProduct(product_id : string) :  Observable<any>{
    if(this.api.isEnable())
    {
      let param = new HttpParams();
      param = param.append('product_id', product_id);
      return this.http.post(checkBeforeDeleteProductApi,'',{headers : this.api.headers, params : param}).pipe(map((data : any)=>{
        return data;
      }))
    }
  }
}
function CurrencyCellRenderer(currency, value) {
  let inrFormat = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2
  });
  return inrFormat.format(value);
}

/**
   * lodash
   * @param a
   * @param key
   */
function lodash(a, key) {
  let seen = new Set();
  return a.filter(item => {
    let k = key(item);
    return seen.has(k.trim()) ? false : seen.add(k.trim());
  });
}

export class TimeLine {
  createdAt: string;
  action: string;
}
